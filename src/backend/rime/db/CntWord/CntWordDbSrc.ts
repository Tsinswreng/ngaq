import { Tbls } from "./CntWordDbStuff"
import type { SqliteDb } from "@backend/sqlite/Sqlite"
import { I_DbSrc } from '@shared/dbFrame/I_DbSrc'

export class CntWordDbSrc implements I_DbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof CntWordDbSrc.new>){
		const z = this
		z.db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	get This(){return CntWordDbSrc}
	static tbls = Tbls.tbls
	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	protected _tbls = CntWordDbSrc.tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	
}

