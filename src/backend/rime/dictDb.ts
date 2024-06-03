import { Abs_DbSrc, CreateTableOpt } from "@backend/db/sqlite/_base/DbSrc"
import sqlite3, { RunResult } from "sqlite3"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import { Abs_Table } from "@backend/db/sqlite/_base/Table"
import { Line } from "./tsv"

export class Dict{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof Dict.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//static unicodeSeparator = '-'

}


class Col{
	static readonly id='id'
	static readonly text = 'text'
	static readonly code = 'code'
}
export class DbRow{
	// static readonly id='id'
	// static readonly text = 'text'
	// static readonly code = 'code'

	static readonly col=Col
	id?:int //自增主鍵、從數據庫取數據旹當非空
	text:str
	code:str
	protected constructor(){}

	/**
	 * 
	 * @param lines 正文ʹ行、不含元數據
	 * @returns 
	 */
	static linesToDbRows(lines:Line[]){
		const valid = lines.map(e=>e.processedText())

		const dbRows = [] as DbRow[]
		for(const v of valid){
			const [text, code] = v.split('\t')
			const row:DbRow = {
				text:text
				,code:code
			}
			dbRows.push(row)
		}
		return dbRows
	}
}

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
			id INT PRIMARY KEY
			,text TEXT
			,code TEXT
		)`
	}

	static createTable(db:sqlite3.Database, tbl:str, opt?:CreateTableOpt){
		const sql = this.createTableSql(tbl, opt)
		return SqliteDb.run(db, sql)
	}

	createTable(tbl: string, opt?: CreateTableOpt){
		const z = this
		return z.This.createTable(z.db, tbl, opt)
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
		return z.This.createTrigger(z.db, tbl, triggerName)
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
		return z.This.createIndex(z.db, tbl, indexName)
	}

}





import * as Tsv from "./tsv"

export class parseDbRowsOpt{
	bufferLineNum = 65536

}

export class DictTbl extends Abs_Table{
	protected constructor(){
		super()
	}

	protected __init__(...args:Parameters<typeof DictTbl.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args:Parameters<typeof Abs_Table.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	get This(){return DictTbl}
	// static new(tableName:str){
	// 	const z = new this()
	// 	z.__init__(tableName)
	// 	return z
	// }


	static insert_fn(db:sqlite3.Database, tableName:str, rows:DbRow[]){
		const z = this
		const [sql ,values] = z.genQry_insert(tableName, rows, {ignoredKeys: [DbRow.col.id]})
		
	}

	async insertByTsvParser(tsvParser:Tsv.TsvParser, opt:parseDbRowsOpt){
		const z = this
		const bufferLineNum = opt.bufferLineNum
		const runResults = [] as RunResult[]
		for(let i = 0;;i++){
			if(tsvParser.status.end){
				break
			}
			const lines = await tsvParser.readLines(bufferLineNum)
			const bodyLines = lines.filter(e=>e.type.isBody)
			const dbRows = DbRow.linesToDbRows(bodyLines)
			const ua = await z.insertDbRows(dbRows)
			if(ua != void 0){
				runResults.push(ua)
			}
		}
		
		return runResults
	}

	static async insertDbRows(db:sqlite3.Database, tbl:str, rows:DbRow[]){
		const dbRows = rows
		if(dbRows.length === 0){
			return
		}

		const sqlObj = sqliteUtil.Sql.obj.new(dbRows[0])
		const insertSql = sqlObj.geneFullInsertSql(tbl)
		const stmt = await SqliteDb.prepare(db, insertSql)
		const fn = ()=>{
			for(const row of dbRows){
				const params = sqlObj.getParams(row)
				stmt.run(params)
			}
		}
		const [runResult] = await SqliteDb.transaction(db, fn)
		return runResult
	}

	insertDbRows(rows:DbRow[]){
		const z = this
		return z.This.insertDbRows(z.dbSrc.db, z.tableName, rows)
	}

}



