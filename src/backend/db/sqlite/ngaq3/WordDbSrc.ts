import { SqliteDb } from "@backend/sqlite/Sqlite";
import * as SqliteUitl from "@backend/sqlite/sqliteUitl";
import { I_optCheckExist } from "@backend/sqlite/sqliteUitl";
import type { sqlite3 } from "sqlite3";



export class WordDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordDbSrc.new>){
		const z = this
		z._db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	protected _db:SqliteDb
	get db(){return this._db}
	set db(v){this._db = v}



	
}

