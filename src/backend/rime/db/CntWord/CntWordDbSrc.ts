import { Tbls } from "./CntWordDbStuff"
import type { SqliteDb } from "@backend/sqlite/Sqlite"
import { I_DbSrc } from '@shared/dbFrame/I_DbSrc'

export class DbSrc implements I_DbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof DbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return DbSrc}
	static tbls = Tbls.tbls
	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	protected _tbls = DbSrc.tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	
}

