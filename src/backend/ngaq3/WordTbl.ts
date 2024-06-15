import type { SqliteDb } from "@backend/sqlite/Sqlite"
import type { I_optCheckExist } from "@backend/sqlite/sqliteUitl"

import * as SqliteUitl from '@backend/sqlite/sqliteUitl'

import {
	WordRow
} from '@backend/ngaq3/DbRows/wordDbRows'
import { BaseTbl, BaseTblNames } from "./BaseTbl"


class WordTblNames extends BaseTblNames{
	idx_text='idx_text'
}

export class WordTbl extends BaseTbl{
	protected constructor(){super()}
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

	//protected _db:SqliteDb
	get db(){return this._db}
	set db(v){this._db = v}

	//protected _tblName:str
	get tblName(){return this._tblName}
	protected set tblName(v){this._tblName = v}

	protected override _names = new WordTblNames()
	get names(){return this._names}
	protected set names(v){this._names = v}
	
	static sql_mkTbl(tbl:str, opt?:I_optCheckExist){
		let ifNE = SqliteUitl.IF_NOT_EXISTS
		if(opt?.checkExist === true){
			ifNE = ''
		}
		const c = WordRow.col
		const ans = 
`CREATE TABLE ${ifNE} ${tbl}(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.createdTime} INTEGER NOT NULL
	,${c.modifiedTime} INTEGER NOT NULL
)`
		return ans
	}

	async init() {
		const z = this
		await z.mkIdx_text()
		return true
	}

	mkTbl(){
		const z = this
		const sql = z.This.sql_mkTbl(z.tblName, {checkExist:false})
		return z.db.run(sql)
	}

	static sql_mkIdx_text(tblName:str, idxName:str){
		const z = this
		const c = WordRow.col
		return SqliteUitl.Sql.create.index(tblName, idxName, [c.text], {checkExist:false})
	}

	mkIdx_text(){
		const z = this
		const tblName = z.tblName
		const idxName = z.names.idx_text
		const sql = z.This.sql_mkIdx_text(tblName, idxName)
		return z.db.run(sql)
	}
	
}
