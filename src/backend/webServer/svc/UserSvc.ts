import { UserDbSrc } from "@backend/db/user/UserDbSrc"
import { salt } from "@shared/algo"
import argon2 from 'argon2'
import * as jwt from 'jsonwebtoken'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'

import Config from "@backend/Config"
import Tempus from "@shared/Tempus"
const configInst = Config.getInstance()

import { Exception, Reason } from "@shared/error/Exception";
import * as Le from '@shared/linkedEvent'
import { mkEmitter } from "@shared/infra/EventEmitter"
import { $ } from "@shared/Ut"

const EV = Le.Event.new.bind(Le.Event)
const RN = Reason.new.bind(Reason)

class Events extends Le.Events{
	/** [userId] */
	login = EV<[int|str]>('loginById')
	/** [userId] */
	signUp = EV<[int|str]>('signUp')
}

class ErrReason{
	no_such_user = RN('no_such_user')
	pswd_not_match = RN('pswd_not_match')
	/** [已有ʹ userId:int] */
	user_already_existed = RN<[int]>('user_already_existed')
}


export class UserSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserSvc.new>){
		const z = this
		z.dbSrc = args[0]
		return z
	}

	static new(dbSrc:UserDbSrc){
		const z = new this()
		z.__init__(dbSrc)
		return z
	}

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
	
	emit<T extends Le.Event<any[]>>(
		fn: (ev: typeof this.events) => T,
		...args: T extends Le.Event<infer U> ? U : never
	){
		const z = this
		const ev = fn(z.events)
		z.emitter.emit(ev, ...args)
	}

	/**
	 * 
	 * @param id 
	 * @param password 
	 * @returns session實例
	 */
	async LoginById(id:str|int, password:str){
		const z = this
		const Seek = await z.dbSrc.Fn_seekPasswordByUserId()
		const got = await Seek(id)
		const gotPswd = got?.data[0]
		if(gotPswd == null){
			throw Exception.for(z.errReasons.no_such_user)
		}
		// 自動處理鹽
		const b = await argon2.verify(
			gotPswd.text,
			password
			//salt(password, gotPswd.salt)
		)
		if(!b){
			throw Exception.for(z.errReasons.pswd_not_match)
		}
		const token = jwt.sign(
			gotPswd.fid+''
			, configInst.config.ngaq.jwtKey
			, { expiresIn: '1d' }
		)
		const session = Mod.Session.new({
			id:NaN
			,belong: ""
			,userId:gotPswd.fid
			,token:token
			,ct: Tempus.new()
			,mt: Tempus.new()
			,expirationTime: Tempus.new(
				Tempus.toUnixTime_mills(Tempus.new())+1000*60*60*24 // 1 day
			)
		})
		const AddSession = await z.dbSrc.Fn_add_session()
		await AddSession(session)
		z.emit(e=>e.login, id)
		return session
	}
	
	/**
	 * 
	 * @param uniqueName 
	 * @param password 
	 * @returns session實例
	 */
	async LoginByName(uniqueName:str, password:str){
		const z = this
		const Seek = await z.dbSrc.Fn_seekIdByUniqueName()
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
	async SignUp(uniqueName:str, password:str):Task<int>{
		const z = this
		const Seek = await z.dbSrc.Fn_seekIdByUniqueName()
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
		const AddUser = await z.dbSrc.Fn_add_user()
		const addAns = await AddUser(userInst)
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
		const AddPswd = await z.dbSrc.Fn_add_password()
		await AddPswd(passwordInst)
		z.emit(e=>e.signUp, neoId)
		return neoId
	}

}
