import { Abs_DbSrc, CreateTableOpt } from "@backend/db/sqlite/_base/DbSrc"
import sqlite3 from "sqlite3"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import { Abs_Table } from "@backend/db/sqlite/_base/Table"


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



export class DbRow{
	static readonly id='id'
	static readonly text = 'text'
	static readonly code = 'code'
	id?:int //自增主鍵、從數據庫取數據旹當非空
	text:str
	code:str
	protected constructor(){}
}

export class DictDbSrc extends Abs_DbSrc{

	protected constructor(){
		super()
	}
	protected __init__(...args: Parameters<typeof DictDbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return DictDbSrc}

	static createTableSql(tblName:str, opt: CreateTableOpt){
		let ifNotExists = ''
		if(opt.ifNotExists){
			ifNotExists = 'IF NOT EXISTS'
		}
		return `CREATE TABLE ${ifNotExists} "${tblName}" (
			id INT PRIMARY KEY
			,text TEXT
			,code TEXT
		)`
	}

	static createTable(db:sqlite3.Database, tbl:str, opt:CreateTableOpt){
		const sql = this.createTableSql(tbl, opt)
		return SqliteDb.run(db, sql)
	}

	createTable(tbl: string, opt: CreateTableOpt){
		const z = this
		return z.This.createTable(z.db, tbl, opt)
	}

	static createIndexSql(tbl:str, indexName = `idx_${tbl}`){
		const c = DbRow
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

	get This(){return DictTbl}
	// static new(tableName:str){
	// 	const z = new this()
	// 	z.__init__(tableName)
	// 	return z
	// }


	static insert_fn(db:sqlite3.Database, tableName:str, rows:DbRow[]){
		const z = this
		const [sql ,values] = z.genQry_insert(tableName, rows, {ignoredKeys: [DbRow.id]})
		
	}

	async parseDbRows(tsvParser:Tsv.TsvParser, opt:parseDbRowsOpt){
		const z = this
		const bufferLineNum = opt.bufferLineNum

		const lines = await tsvParser.readLines(bufferLineNum)
		const valid = [] as str[] //body中行芝被除˪註釋者
		for(const line of lines){
			if(tsvParser.metaEndLinePos != void 0
				&& line.index > tsvParser.metaEndLinePos
			){
				const u = line.processedText()
				if(u != void 0 && u.length > 0){
					valid.push(u)
				}
			}
		}

		const dbRows = [] as DbRow[]
		for(const v of valid){
			const [text, code] = v.split('\t')
			const row:DbRow = {
				text:text
				,code:code
			}
			dbRows.push(row)
		}
		const [sql ,values] = z.genQry_insert(z.tableName, dbRows, {ignoredKeys: [DbRow.id]})
		
		//
	}

}



