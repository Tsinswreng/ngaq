import { UserDbSrc } from "@backend/db/sqlite/user/UserDbSrc"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/model/user/UserRows'

import * as UMod from '@shared/model/user/UserModel'
import type * as URow from '@shared/model/user/UserRows'

import type * as NMod from '@shared/model/word/NgaqModels'
import type * as NRow from '@shared/model/word/NgaqRows'

import Config from "@backend/Config"
import Tempus from "@shared/Tempus"
const configInst = Config.getInstance()
const config = configInst.config

import { Exception, Reason } from "@shared/error/Exception";
import * as Le from '@shared/linkedEvent'
import { mkEmitter } from "@shared/infra/EventEmitter"
import { $, As } from "@shared/Common"

import {env} from '@backend/ENV'
import Path from 'path'
import * as fse from 'fs-extra'
import * as fs from 'fs'
import { SqliteDb } from "@backend/sqlite/Sqlite"
import { NgaqDbSrc } from "@backend/db/sqlite/ngaq/NgaqDbSrc"
import { InitSql_ngaqDbSrc } from "@backend/db/sqlite/ngaq/Initer_ngaqDbSrc"
import { getRelativePath } from "@backend/util/File"
import { UserDb } from "./UserDb"
import { JoinedRow } from '@shared/model/word/JoinedRow'
import { JoinedWord } from '@shared/model/word/JoinedWord'
import { SqliteQryResult } from "@backend/sqlite/sqliteUtil"

const EV = Le.Event.new.bind(Le.Event)
//const EV = Le.SelfEmitEvent.new.bind(Le.SelfEmitEvent)
const RN = Reason.new.bind(Reason)
const cwd = process.cwd()
type Id_t = int|str

class Events extends Le.Events{
	/** [userId] */
	login = EV<[int|str]>('loginById')
	/** [userId] */
	signUp = EV<[int|str]>('signUp')
	/** [userId] */
	mkUserDb = EV<[Id_t]>('mkUserDb')
}

class ErrReason{
	no_such_user = RN('no_such_user')
	pswd_not_match = RN('pswd_not_match')
	/** [已有ʹ userId:int] */
	user_already_existed = RN<[int]>('user_already_existed')
	/** [已有ʹdbʹ路徑] */
	userDb_already_existed = RN<[str]>('userDb_already_existed')
	/** userId */
	connect_userDb_err = RN<[Id_t]>('connect_userDb_err')
	/** userId */
	validate_err = RN<[Id_t]>('validate_err')
	session_expired = RN<[Mod.Session]>('session_expired')
}




class UserDbManager{
	pool = new Map<Id_t, UserDb>()
}


export class UserSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserSvc.new>){
		const z = this
		z.dbSrc = args[0]
		z.initListeners()
		return z
	}

	static new(dbSrc:UserDbSrc){
		const z = new this()
		z.__init__(dbSrc)
		return z
	}

	static inst = UserSvc.new(env.serverDbSrc)

	//get This(){return UserSvc}

	protected _dbSrc:UserDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}

	protected _errReasons = new ErrReason()
	get errReasons(){return this._errReasons}
	protected set errReasons(v){this._errReasons = v}
	
	protected _emitter = mkEmitter()
	get emitter(){return this._emitter}
	protected set emitter(v){this._emitter = v}

	protected _events = new Events()
	get events(){return this._events}
	protected set events(v){this._events = v}

	protected _userDbManager = new UserDbManager()
	get userDbManager(){return this._userDbManager}
	protected set userDbManager(v){this._userDbManager = v}
	
	
	emit<T extends Le.Event<any[]>>(
		fn: (ev: typeof this.events) => T,
		...args: T extends Le.Event<infer U> ? U : never
	){
		const z = this
		const ev = fn(z.events)
		z.emitter.emit(ev, ...args)
	}

	on<T extends Le.Event<any[]>>(
		fn: (ev: typeof this.events) => T,
		callback: (...args: T extends Le.Event<infer U> ? U : never)=>void
	){
		const z = this
		const ev = fn(z.events)
		z.emitter.on(ev, callback)
	}


	initListeners(){
		const z = this
		// z.on(e=>e.signUp, (id)=>{
		// 	z.MkUserDb({
		// 		userId:id
		// 	}).catch(e=>{
		// 		z.emit(e=>e.error, e)
		// 	})
		// })

		z.on(e=>e.error, (err)=>{
			console.error(err)
		})
	}

	/**
	 * 
	 * @param id 用户id
	 * @param password 密码明文
	 * @returns session instance
	 */
	async LoginById(id:str|int, password:str){
		const z = this
		const Seek = await z.dbSrc.Fn_SeekPasswordByUserId() // 从数据访问层 获取 由用户id查询密码的函数
		const got = await Seek(id) // 查询用户密码(密文)
		const gotPswd = got?.data[0]
		if(gotPswd == null){ // 查询不到密码
			throw Exception.for(z.errReasons.no_such_user) // 抛出异常: 无此用户
		}
		// 验证传入的密码明文和密文是否匹配(内部逻辑为 再用相同加密算法和盐值加密一次，再比较两个加密结果是否一致)
		const b = await argon2.verify(
			gotPswd.text,
			password
			//salt(password, gotPswd.salt) // 自动处理盐
		)
		if(!b){ // 密码不匹配
			throw Exception.for(z.errReasons.pswd_not_match) // 抛出异常: 密码不匹配
		}
		
		// 生成令牌
		const token = jwt.sign(
			{userId: gotPswd.fid+''} // 用户id
			, configInst.config.ngaq.server.jwtKey // 密钥
			, { expiresIn: '1d' } // 过期时间: 1天
		)
		// 生成session实例
		const session = Mod.Session.new({
			id:NaN // 稍后赋值
			,belong: ""
			,userId:gotPswd.fid // 用户id
			,token:token // 令牌
			,ct: Tempus.new() // 创建时间
			,mt: Tempus.new() // 修改时间
			,expirationTime: Tempus.new( // 过期时间
				Tempus.toUnixTime_mills(Tempus.new())+1000*60*60*24 // 1 day
			)
		})
		const AddSession = await z.dbSrc.Fn_Add(e=>e.session) // 从数据访问层 获取 增加session的函数
		const dbAns = await AddSession(session) // 增加session
		session.id = dbAns.lastId // 填充session的id
		z.emit(e=>e.login, id) // 触发登录事件
		return session	// 返回session实例
	}

	/**
	 * 
	 * @param userId 
	 * @param token 
	 * @returns 
	 * @throws
	 */
	async ValidateUserIdEtToken(userId:Id_t, token:str){
		const z = this
		const Seek = await z.dbSrc.Fn_Seek_sessions_by_userId()
		const got = await Seek(userId)
		const lastSession = got.data[0]
		if(lastSession == void 0){
			throw Exception.for(z.errReasons.validate_err, userId)
		}
		//console.log(lastSession)//t -
		const session = Mod.Session.fromRow(lastSession)
		return session.isValid()
	}
	
	/**
	 * 
	 * @param uniqueName 
	 * @param password 
	 * @returns session實例
	 */
	async LoginByName(uniqueName:str, password:str){
		const z = this
		const Seek = await z.dbSrc.Fn_SeekIdByUniqueName()
		const got = await Seek(uniqueName)
		const id = got.data[0]?._
		if(id == void 0){
			throw Exception.for(z.errReasons.no_such_user)
		}
		const ans = z.LoginById(id, password)
		return ans
	}

	/**
	 * 
	 * @param uniqueName 
	 * @param password 
	 * @returns 新用戶id
	 */
	async SignUp(opt:{
		uniqueName:str, password:str
	}):Task<int>{
		const z = this
		const uniqueName = opt.uniqueName
		const password = opt.password
		const Seek = await z.dbSrc.Fn_SeekIdByUniqueName()
		const got = await Seek(uniqueName)
		const oldId = got.data[0]?._
		if(oldId != void 0){
			throw Exception.for(z.errReasons.user_already_existed, oldId)
		}
		const nunc = Tempus.new()
		const userInst = Mod.User.new({
			id:NaN
			,belong:""
			,ct: nunc
			,mt: nunc
			,uniqueName:uniqueName
		})
		const AddUser = await z.dbSrc.GetFn_AddInst(e=>e.user)
		const AddPswd = await z.dbSrc.GetFn_AddInst(e=>e.password)
		await z.dbSrc.db.BeginTrans()
		const addAns = await AddUser(userInst)
		// 新用戶ʹid
		const neoId = $(addAns.lastId, `addAns.lastId is nil`)
		const hash = await argon2.hash(password)
		const passwordInst = Mod.Password.new({
			id:NaN
			,belong: Row.PasswordBelong.argon2
			,ct: nunc
			,mt: nunc
			,fid: neoId
			,text: hash
			,salt: '' //已包含在hash中、懶得提取
		})
		
		await AddPswd(passwordInst)
		await z.MkUserDb({
			userId: neoId
		})
		await z.dbSrc.db.Commit()
		z.emit(e=>e.signUp, neoId)
		return neoId
	}

	mkUserDbPath(userId:int|str){
		const {baseDir, prefix, suffix} = config.ngaq.userDb
		const fileName = prefix+userId+suffix
		return Path.resolve(baseDir, fileName)
	}

	/**
	 * 
	 * @param opt 
	 * @returns dbSrc
	 * @throws {DbErr} 初始化架構失敗時可能拋出
	 */
	async MkUserDb(opt:{
		userId:int|str
		dbPath?:str
	}){
		const z = this
		const dbPath = opt?.dbPath??z.mkUserDbPath(opt.userId)
		const isExist = fs.existsSync(dbPath)
		if(isExist){
			throw Exception.for(z.errReasons.userDb_already_existed, dbPath)
		}
		fse.ensureFileSync(dbPath)
		const db = SqliteDb.fromPath(dbPath)
		const dbSrc = NgaqDbSrc.new(db)
		await InitSql_ngaqDbSrc.MkSchema(dbSrc.db)
		z.emit(e=>e.mkUserDb, opt.userId)

		
		const AddUserDb = await z.dbSrc.GetFn_AddInst(e=>e.userDb)
		const nunc = Tempus.new()
		const userDb = Mod.UserDb.new({
			id:NaN
			,belong: ""
			,ct: nunc
			,mt: nunc
			,name: ""
			,path: getRelativePath(config.ngaq.userDb.baseDir, dbPath)
		})

		const userDbAns = await AddUserDb(userDb)
		const AddUser__db = await z.dbSrc.GetFn_AddInst(e=>e.user__db)
		const user__dbInst = Mod.User__db.new({
			id: NaN
			,userId: Number(opt.userId)
			,dbId: $(userDbAns.lastId)
			,belong: ""
			,ct: nunc
			,mt: nunc
		})
		await AddUser__db(user__dbInst)
		return dbSrc
	}

	static async ConnectUserDbByPath(path:str){
		//const z = this
		const db = SqliteDb.fromPath(path)
		const dbSrc = NgaqDbSrc.new(db)
		return dbSrc
	}


	ConnectUserDbByPath(path:str){
		return UserSvc.ConnectUserDbByPath(path)
	}

	/**
	 * 不經緩存池
	 * @param userId 
	 * @returns 
	 */
	async ConnectUserDbByUserId(userId:int|str){
		const z = this
		const Seek = await z.dbSrc.Fn_Seek_userDb_by_userId()
		const got = await Seek(userId)

		//只取首元素
		const row = got[0]?.data[0]
		if(row === void 0){
			throw Exception.for(z.errReasons.connect_userDb_err, userId)
				
		}
		const fullPath = Path.resolve(
			config.ngaq.userDb.baseDir
			,row.path
		)
		const dbSrc = await z.ConnectUserDbByPath(fullPath)
		return dbSrc
	}

	/**
	 * 用緩存池
	 */
	async GetUserDbByUserId(userId:Id_t){
		const z = this
		const got = z.userDbManager.pool.get(userId)
		if(got != void 0){
			return got
		}
		const dbSrc = await z.ConnectUserDbByUserId(userId)
		const userDb = UserDb.new(dbSrc)
		z.userDbManager.pool.set(userId, userDb)
		return userDb
	}

	async GetAllWords(userId:Id_t){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const joinedRows = await userDb.dbSrc.GetAllJoinedRow()
		//const jwords = joinedRows.map(e=>JoinedWord.new(e))
		//const plainWords = jwords.map(e=>JoinedWord.toPlainWord(e))
		return joinedRows
	}

	/**
	 * 
	 * @param userId 
	 * @param learns 
	 * @returns 
	 */
	async AddLearns(userId:Id_t, learns:NRow.Learn[]){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Add = await userDb.dbSrc.Fn_AddValidLearnRows()
		await userDb.dbSrc.db.BeginTrans()
		const ans = [] as (SqliteQryResult<undef>|undef)[]
		for(const l of learns){
			const ua = await Add(l)
			ans.push(ua)
		}
		await userDb.dbSrc.db.Commit()
		return ans
	}

	async AddWordsFromTxt(userId:Id_t, words:JoinedRow[]){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Add = await userDb.dbSrc.Fn_AddWordsFromTxt()
		const jWords = words.map(e=>JoinedWord.fromRow(e))
		//console.log(jWords)//t -
		await userDb.dbSrc.db.BeginTrans()
		const ans = await Add(jWords)
		await userDb.dbSrc.db.Commit()
		return ans
	}

	/**
	 * 最近24小時學習數量
	 * @param userId 
	 * @returns 
	 */
	async Cnt_recentLearn(userId:Id_t){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Cnt = await userDb.dbSrc.Fn_Cnt_recentLearn()
		const ans = await Cnt()
		return ans.data[0]?._??0
	}

	async Rm_JoinedWord(userId:Id_t, wordId:Id_t){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Rm = await userDb.dbSrc.Fn_Del_joined_by_wordId()
		await userDb.dbSrc.db.BeginTrans()
		await Rm(wordId)
		await userDb.dbSrc.db.Commit()
	}

	async Upd_property(userId:Id_t, prop:NRow.Property){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Upd = await userDb.dbSrc.Fn_Upd_property()
		await userDb.dbSrc.db.BeginTrans()
		await Upd(prop)
		await userDb.dbSrc.db.Commit()
	}

	async Upd_wordText(userId:Id_t, wordId:Id_t, neoText:str){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const Upd = await userDb.dbSrc.Fn_Upd_WordText_by_id()
		//console.log(arguments)//t+
		await userDb.dbSrc.db.BeginTrans()
		await Upd(wordId, neoText)
		await userDb.dbSrc.db.Commit()
	}

	async Add_Prop(userId:Id_t, prop:NRow.Property){
		const z = this
		const userDb = await z.GetUserDbByUserId(userId)
		const AddRow = await userDb.dbSrc.GetFn_addRow(e=>e.property)
		await userDb.dbSrc.db.BeginTrans()
		await AddRow(prop)
		await userDb.dbSrc.db.Commit()
	}

	
}
