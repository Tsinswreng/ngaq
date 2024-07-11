import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>

/**
 * 用""引起來
 * @param text 
 * @returns 
 */
const qt = (text:str)=>{
	return `"${text}"`
}

class Tbl<FactT extends Mod.BaseFactory<any, any>>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tbl.new>){
		const z = this
		z.name = args[0]
		//@ts-ignore
		z.factory = args[1]
		//z._col = z.factory.col
		//z._objSql = SqliteUitl.Sql.obj.new(new z.factory.Row())
		return z
	}

	static new<FactT>(name:str, factory:FactT){
		//@ts-ignore
		const z = new this<FactT>()
		z.__init__(name, factory)
		return z
	}

	//get This(){return Tbl}
	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}

	protected _factory:FactT
	get factory(){return this._factory}
	protected set factory(v){this._factory = v}
	
	//protected _col:FactT['col']
	get col():FactT['col']{
		return this.factory.col
	}

	get emptyRow(){
		return this.factory.emptyRow
	}
}
const TBL = Tbl.new.bind(Tbl)
class Tbls{
	user = TBL('user', Mod.User)
	password = TBL('password', Mod.Password)
	session = TBL('session', Mod.Session)
}
const tbls = new Tbls()


export class UserDbSrc{
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

	async Fn_seekPasswordByUserId(){
		const z = this
		const tbl = z.tbls.password
		const sql = `SELECT * FROM ${tbl.name} WHERE ${tbl.col.fid}=?`
		const stmt = await z.db.Prepare(sql)
		return async(userId:int|str)=>{
			const ans = await stmt.All<Row.Password>([userId])
			return QryAns.fromPair(ans)
		}
	}

	async Fn_seekIdByUniqueName(colAlias='_'){
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

	async Fn_seekPasswordByUniqueName(){
		const z = this
		const SeekIdByUniqueName = await z.Fn_seekIdByUniqueName()
		const SeekPasswordByUserId = await z.Fn_seekPasswordByUserId()
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


	async Fn_add_user(){
		const z = this
		const tbl = z.tbls.user
		const row = tbl.factory.emptyRow
		const objsql = ObjSql.new(row, {ignoredKeys: [tbl.col.id]})
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await z.db.Prepare(sql)
		const ans = async(inst:Mod.User)=>{
			const row = inst.toRow()
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}


	async Fn_add_session(){
		const z = this
		const tbl = z.tbls.session
		const row = tbl.factory.emptyRow
		const objsql = ObjSql.new(row, {ignoredKeys: [tbl.col.id]})
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await z.db.Prepare(sql)
		const ans = async(inst:Mod.Session)=>{
			const row = inst.toRow()
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}

	
}


