import { Abs_DbSrc, CreateTableOpt } from "@backend/db/sqlite/_base/DbSrc"
import sqlite3, { RunResult } from "sqlite3"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import {DbRow} from './DictDbRow'
export {DbRow}


interface I_CreateTrigger{
	triggerName:str
}

export class DictDbSrc extends Abs_DbSrc{

	protected constructor(){
		super()
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

	protected async __Init__(...props:Parameters<typeof DictDbSrc.New>) {
		const z = this
		await super.__Init__(...props)
		return z
	}

	static override async New(...prop:Parameters<typeof Abs_DbSrc.New>){
		const z = new this()
		await z.__Init__(...prop)
		return z
	}

	static fromDb(db:sqlite3.Database){

	}

	get This(){return DictDbSrc}

	static createTableSql(tblName:str, opt?: CreateTableOpt){
		let ifNotExists = ''
		if(opt?.ifNotExists){
			ifNotExists = 'IF NOT EXISTS'
		}
		return `CREATE TABLE ${ifNotExists} "${tblName}" (
			id INTEGER PRIMARY KEY
			,text TEXT
			,code TEXT
			,UNIQUE(text, code)
		)`
	}

	static createTable(db:sqlite3.Database, tbl:str, opt?:CreateTableOpt){
		const sql = this.createTableSql(tbl, opt)
		return SqliteDb.run(db, sql)
	}

	createTable(tbl: string, opt?: CreateTableOpt){
		const z = this
		return z.This.createTable(z.dbRaw, tbl, opt)
	}

	static createTrigger(db:sqlite3.Database, tbl:str, triggerName='replace_duplicate'){
		const c = DbRow.col
		
		const sql = sqliteUtil.Sql.create.trigger_replaceDuplicate(
			tbl, triggerName, [c.text, c.code], {ifNotExists:true}
		)
		return SqliteDb.run(db, sql)
	}

	createTrigger(tbl:str, triggerName='replace_duplicate'){
		const z = this
		return z.This.createTrigger(z.dbRaw, tbl, triggerName)
	}

	static createIndexSql(tbl:str, indexName = `idx_${tbl}`){
		const c = DbRow.col
		const sql = sqliteUtil.Sql.create.index(tbl, indexName, [c.text, c.code], {ifNotExists:true})
		return sql
	}

	static createIndex(db:sqlite3.Database, tbl:str, indexName=`idx_${tbl}`){
		const sql = this.createIndexSql(tbl, indexName)
		return SqliteDb.run(db, sql)
	}

	createIndex(tbl:str, indexName=`idx_${tbl}`){
		const z = this
		return z.This.createIndex(z.dbRaw, tbl, indexName)
	}

}




