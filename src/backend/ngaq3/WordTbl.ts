import type { SqliteDb } from "@backend/sqlite/Sqlite"
import type { I_optCheckExist } from "@backend/sqlite/sqliteUitl"

import * as SqliteUitl from '@backend/sqlite/sqliteUitl'



export class WordTbl{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordTbl.new>){
		const z = this
		z._db = args[0]
		z._tblName = args[1]
		return z
	}

	static new(db:SqliteDb, tblName:str){
		const z = new this()
		z.__init__(db, tblName)
		return z
	}

	get This(){return WordTbl}

	protected _db:SqliteDb
	get db(){return this._db}
	set db(v){this._db = v}

	protected _tblName:str
	get tblName(){return this._tblName}
	protected set tblName(v){this._tblName = v}
	
	
}
