import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS


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
			return ans
		}
	}

}


