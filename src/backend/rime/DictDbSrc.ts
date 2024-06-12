import { Abs_DbSrc, CreateTableOpt } from "@backend/db/sqlite/_base/DbSrc"
import sqlite3, { RunResult } from "sqlite3"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import {DbRow} from './DictDbRow'
export {DbRow}


class TblNames{
	/**  */
	readonly dict = 'dict'
}

interface I_CreateTrigger{
	triggerName:str
}

export interface DictDbSrcNewOpt{

}

export class DictDbSrc{

	protected constructor(){
		//super()
	}
	// protected __init__(...args: Parameters<typeof DictDbSrc.new>){
	// 	const z = this
	// 	return z
	// }

	// static new(){
	// 	const z = new this()
	// 	z.__init__()
	// 	return z
	// }

	protected __init__(...args:Parameters<typeof DictDbSrc.new>) {
		const z = this
		z._db = args[0]
		return z
	}

	static new(db:SqliteDb, opt?:DictDbSrcNewOpt){
		const z = new this()
		z.__init__(db, opt)
		return z
	}

	get This(){return DictDbSrc}

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	get dbRaw(){return this._db.db}
	

	static createTableSql(tblName:str, opt?: sqliteUtil.I_optCheckExist){
		const c = DbRow.col
		let ifNotExists = ''
		if(!opt?.checkExist){
			ifNotExists = 'IF NOT EXISTS'
		}
		return `CREATE TABLE ${ifNotExists} "${tblName}" (
			id INTEGER PRIMARY KEY
			,${c.dict_name} TEXT NOT NULL
			,${c.text} TEXT
			,${c.code} TEXT
			,UNIQUE(${c.dict_name}, ${c.text}, ${c.code})
		)`
	}

	static createTable(db:sqlite3.Database, tbl:str, opt?: sqliteUtil.I_optCheckExist){
		const sql = this.createTableSql(tbl, opt)
		return SqliteDb.run(db, sql)
	}

	createTable(tbl: string, opt?: sqliteUtil.I_optCheckExist){
		const z = this
		return z.This.createTable(z.dbRaw, tbl, opt)
	}

	static createTrigger(db:sqlite3.Database, tbl:str, triggerName='ignore_duplicate_insert'){
		const c = DbRow.col
		
		const sql = sqliteUtil.Sql.create.trigger_ignore_duplicate_insert(
			tbl, triggerName, [c.dict_name, c.text, c.code], {checkExist:false}
		)
		return SqliteDb.run(db, sql)
	}

	createTrigger(tbl:str, triggerName='ignore_duplicate_insert'){
		const z = this
		return z.This.createTrigger(z.dbRaw, tbl, triggerName)
	}

	static geneSql_createText_CodeIdx(tbl:str, indexName:str){
		const c = DbRow.col
		const sql = sqliteUtil.Sql.create.index(tbl, indexName, [c.text, c.code], {checkExist:false})
		return sql
	}

	static geneSql_createDictNameIdx(tbl:str, indexName:str){
		const c = DbRow.col
		const sql = sqliteUtil.Sql.create.index(tbl, indexName, [c.dict_name], {checkExist:false})
		return sql
	}



	static async createIndex(db:sqlite3.Database, tbl:str){
		const idx_text_code = 'idx_text_code'
		const idx_dictName = 'idx_dict_name'
		const text_codeSql = this.geneSql_createText_CodeIdx(tbl, idx_text_code)
		await SqliteDb.run(db, text_codeSql)
		const dictNameSql = this.geneSql_createDictNameIdx(tbl, idx_dictName)
		await SqliteDb.run(db, dictNameSql)
		return true
	}

	createIndex(tbl:str, indexName=`idx_${tbl}`){
		const z = this
		return z.This.createIndex(z.dbRaw, tbl)
	}

	static dropTable(db:sqlite3.Database, tbl:str, opt:sqliteUtil.I_optCheckExist){
		let ifExists = ''
		if(opt.checkExist === false){
			ifExists = 'IF EXISTS'
		}
		const sql = `DROP TABLE ${ifExists} "${tbl}"`
		return SqliteDb.run(db, sql)
	}

	dropTable(tbl:str, opt:sqliteUtil.I_optCheckExist){
		const z = this
		return z.This.dropTable(z.dbRaw, tbl, opt)
	}

}




