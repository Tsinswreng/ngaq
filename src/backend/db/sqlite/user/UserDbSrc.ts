import type { InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/model/user/UserRows'
import { Tbl } from '../dbFrame/Tbl'
import { Index } from '@shared/dbFrame/Index'
import { I_DbSrc } from '@shared/dbFrame/I_DbSrc'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>
type Id_t = int|str

/**
 * 用""引起來
 * @param text 
 * @returns 
 */
const qt = (text:str)=>{
	return `"${text}"`
}

type AddInstOpt = Parameters<typeof ObjSql.new>[1]
interface I_AddInstOpt extends NonNullable<AddInstOpt>{
	cb?:()=>{}
}



const TBL = Tbl.new.bind(Tbl)
class Tbls{
	user = TBL('user', Mod.User)
	password = TBL('password', Mod.Password)
	session = TBL('session', Mod.Session)
	profile = TBL('profile', Mod.Profile)
	userDb = TBL('userDb', Mod.UserDb)
	user__db = TBL('user__db', Mod.User__db)
	;[key:str]:Tbl<any>
}
const tbls = new Tbls()


class SchemaItem extends SqliteUtil.SqliteMaster{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof SchemaItem.new>){
		const z = this
		z.name = args[0]
		z.type = args[1]
		if(z.type === SMT.table){
			z.tbl_name = z.name
		}else{
			z.tbl_name = $(args[2])
		}
		return z
	}

	static new(name:str, type:SqliteUtil.SqliteMasterType.table):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str){
		const z = new this()
		z.__init__(name, type, tbl_name)
		return z
	}

	get This(){return SchemaItem}
}



const SI = SchemaItem.new.bind(SchemaItem)
const SMT = SqliteUtil.SqliteMasterType

const IDX = Index.IDX.bind(Index)
class SchemaItems{
	//tbls=tbls
	idx_sessionFid = IDX('idx_sessionFid', tbls.session, c=>[c.userId])
}

const schemaItems = new SchemaItems()


export class UserDbSrc implements I_DbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserDbSrc.new>){
		const z = this
		z.db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	static tbls = tbls

	//get This(){return UserDbSrc}
	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}


	async Fn_Add<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const Fn = await tbl.Fn_Add(z.db, opt)
		return Fn as ReturnType<T['Fn_Add']>
	}

	/* 
	已知 如果tbl是Tbl<User>類型的、那麼tbl.Fn_addInst返回函數 (inst:User)=>any
	下面的方法 如何推斷出傳入fn的tbl的泛型類型、使得返回正確類型的函數?
	如 GetFn_addInst(e=>e.user) 則返回(inst:User)=>any、
	傳入GetFn_addInst(e=>e.password) 則返回(inst:Password)=>any 已解決
	*/
	async GetFn_AddInst<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const ans = await tbl.Fn_AddInst(z.db, opt)
		return ans as ReturnType<T['Fn_AddInst']>
	}



	async Fn_SeekPasswordByUserId(){
		const z = this
		const tbl = z.tbls.password
		const sql = `SELECT * FROM ${tbl.name} WHERE ${tbl.col.fid}=?`
		const stmt = await z.db.Prepare(sql)
		return async(userId:int|str)=>{
			const ans = await stmt.All<Row.Password>([userId])
			return QryAns.fromPair(ans)
		}
	}

	async Fn_SeekIdByUniqueName(colAlias='_'){
		const z = this
		const tbl = z.tbls.user
		const sql = 
`SELECT ${tbl.col.id} AS ${qt(colAlias)} FROM ${tbl.name} WHERE ${tbl.col.uniqueName}=?`
		const stmt = await z.db.Prepare(sql)
		return async(uniqueName:str)=>{
			const ans = await stmt.All<{_:int}>([uniqueName])
			return QryAns.fromPair(ans)
		}
	}

	async Fn_SeekPasswordByUniqueName(){
		const z = this
		const SeekIdByUniqueName = await z.Fn_SeekIdByUniqueName()
		const SeekPasswordByUserId = await z.Fn_SeekPasswordByUserId()
		const ans = async(uniqueName:str)=>{
			const qry = await SeekIdByUniqueName(uniqueName)
			const id = qry.data[0]?._
			if(id == void 0){
				return null
			}
			const pswd = await SeekPasswordByUserId(id)
			return pswd
		}
		return ans
	}


	async Fn_Seek_userDbId_by_userId(){
		const z = this
		const tbl = z.tbls.user__db
		const sql = 
`SELECT ${tbl.col.dbId} AS _ FROM ${tbl.name} WHERE ${tbl.col.userId} = ?`
		const stmt = await z.db.Prepare(sql)
		const fn = async(userId:int|str)=>{
			const params = [userId]
			const got = await stmt.All<{_:int}>(params)
			const ans = QryAns.fromPair(got)
			return ans
		}
		return fn
	}

	async Fn_Seek_userDb_by_id(){
		const z = this
		const tbl = z.tbls.userDb
		const c = tbl.col
		const sql = 
`SELECT * FROM ${tbl.name} WHERE ${c.id} = ?`
		const stmt = await z.db.Prepare(sql)
		const fn = async(id:Id_t)=>{
			const params = [id]
			const got = await stmt.All<Row.UserDb>(params)
			const qryAns = QryAns.fromPair(got)
			return qryAns
		}
		return fn
	}

	async Fn_Seek_userDb_by_userId(){
		const z = this
		const Seek_userDbId_by_userId = await z.Fn_Seek_userDbId_by_userId()
		const Seek_userDb_by_id = await z.Fn_Seek_userDb_by_id()
		const fn = async(id:Id_t)=>{
			const userDbIdQry = await Seek_userDbId_by_userId(id)
			const userDbIds = userDbIdQry.data
			const ans = [] as SqliteUtil.SqliteQryResult<Row.UserDb[]>[]
			for(const idObj of userDbIds){
				const id = $(idObj)._
				const ua = await Seek_userDb_by_id(id)
				ans.push(ua)
			}
			return ans
		}
		return fn
	}

	async Fn_Seek_sessions_by_userId(){
		const z = this
		const tbl = z.tbls.session
		const c = tbl.col
		const sql = 
`SELECT * FROM ${tbl.name}
WHERE ${c.userId} = ?
ORDER BY ${c.ct} DESC
LIMIT ?
`
		const stmt = await z.db.Prepare(sql)
		const fn = async(userId:Id_t, limit=1)=>{
			const params = [userId, limit]
			const got = await stmt.All<Row.Session>(params)
			const qryAns = QryAns.fromPair(got)
			return qryAns
		}
		return fn
	}
}


