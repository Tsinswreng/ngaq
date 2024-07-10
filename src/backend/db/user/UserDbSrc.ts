import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import * as Mod from '@shared/model/user/UserModel'
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
}
const tbls = new Tbls()


class InitSql{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof InitSql.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return InitSql}

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	mkTbl_user(){
		const z = this
		const tbl = z.tbls.user
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id}
)`
	}
	
	
}



export class UserDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserDbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return UserDbSrc}
}


