
import * as Tsv from "./tsv"
import { Abs_Table } from "@backend/db/sqlite/_base/Table"
import { DbRow } from "./DictDbRow"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import type sqlite3 from 'sqlite3'
import { DictDbSrc, DictDbSrcNewOpt } from "./DictDbSrc"

export class parseDbRowsOpt{
	bufferLineNum = 65536

}

export class DictTbl{
	protected constructor(){

	}

	protected __init__(...args:Parameters<typeof DictTbl.new>){
		const z = this
		z._dbSrc = args[0]
		z._tblName = args[1]
		return z
	}

	static new(dbSrc:DictDbSrc, tblName:str){
		const z = new this()
		z.__init__(dbSrc, tblName)
		return z
	}

	get This(){return DictTbl}
	// static new(tableName:str){
	// 	const z = new this()
	// 	z.__init__(tableName)
	// 	return z
	// }

	protected _dbSrc:DictDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}


	protected _tblName:str
	get tableName(){return this._tblName}
	protected set tableName(v){this._tblName = v}
	
	

	/**
	 * tsvParserʸ all linesˇ dbʰ insert
	 * @param tsvParser 
	 * @param opt 
	 * @returns 
	 */
	async insertByTsvParser(tsvParser:Tsv.TsvParser, opt:parseDbRowsOpt){
		const z = this
		const bufferLineNum = opt.bufferLineNum
		//const runResults = [] as RunResult[]
		await z.dbSrc.db.beginTrans()
		for(let i = 0;;i++){
			if(tsvParser.status.end){
				break
			}
			const lines = await tsvParser.readLines(bufferLineNum)
			const bodyLines = lines.filter(e=>e.type.isBody)
			const dbRows = DbRow.linesToDbRows(bodyLines)
			const fn = await z.insertDbRows_fn(dbRows)
			if(fn != void 0){
				const ua = await fn()
			}
		}
		return await z.dbSrc.db.commit()
	}

	static async insertDbRows_fn(db:sqlite3.Database, tbl:str, rows:DbRow[]){
		const dbRows = rows
		if(dbRows.length === 0){
			return
		}

		const sqlObj = sqliteUtil.Sql.obj.new(dbRows[0])
		const insertSql = sqlObj.geneFullInsertSql(tbl)
		const stmt = await SqliteDb.prepare(db, insertSql)
		//console.log(stmt.sql)//t
		const fn = async()=>{
			//const prms = [] as Promise<sqlite3.RunResult>[]
			for(const row of dbRows){
				const params = sqlObj.getParams(row)
				const pr = await stmt.run(params)
				//prms.push(pr)
			}
			//return Promise.all(prms)
		}
		// const [runResult] = await SqliteDb.transaction(db, fn)
		// return runResult
		return fn
	}

	insertDbRows_fn(rows:DbRow[]){
		const z = this
		return z.This.insertDbRows_fn(z.dbSrc.db.db, z.tableName, rows)
	}

}
