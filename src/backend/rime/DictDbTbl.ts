
import * as Tsv from "./dictTsv"
import { DbRow } from "./DictDbRow"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import * as sqliteUtil from '@backend/sqlite/sqliteUitl'
import type sqlite3 from 'sqlite3'
import { DictDbSrc, DictDbSrcNewOpt } from "./DictDbSrc"

import EventEmitter from "eventemitter3"
import * as Le from '@shared/linkedEvent'



const EV = Le.Event.new.bind(Le.Event)
class Events extends Le.Events{
	static new(){
		const z = new this()
		return z
	}

}

export class insertByTsvParserOpt{
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

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter())
	get emitter(){return this._emitter}
	protected set emitter(v){this._emitter = v}
	
	protected _events = Events.new()
	get events(){return this._events}
	protected set events(v){this._events = v}
	

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
	
	protected _dictName:str = ''
	get dictName(){return this._dictName}
	set dictName(v){this._dictName = v}
	

	/**
	 * tsvParserʸ all linesˇ dbʰ insert
	 * @param tsvParser 
	 * @param opt 
	 * @returns 
	 */
	async insertByTsvParser(tsvParser:Tsv.DictTsvParser, opt:insertByTsvParserOpt){
		const z = this
		const bufferLineNum = opt.bufferLineNum
		//const runResults = [] as RunResult[]
		await z.dbSrc.db.BeginTrans()
		for(let i = 0;;i++){
			if(tsvParser.status.end){
				break
			}
			const lines = await tsvParser.readLines(bufferLineNum)
			const bodyLines = lines.filter(e=>e.type.isBody)
			const dbRows = DbRow.linesToDbRows(bodyLines, z.dictName)
			const fn = await z.insertDbRows_fn(dbRows)
			if(fn != void 0){
				const ua = await fn()
			}
		}
		return await z.dbSrc.db.Commit()
	}

	static async insertDbRows_fn(db:sqlite3.Database, tbl:str, rows:DbRow[]){
		const dbRows = rows
		if(dbRows.length === 0){
			return
		}

		const sqlObj = sqliteUtil.Sql.obj.new(dbRows[0])
		const insertSql = sqlObj.geneFullInsertSql(tbl, {orIgnore:true})
		const stmt = await SqliteDb.Prepare(db, insertSql)
		//console.log(stmt.sql)//t
		const fn = async()=>{
			//const prms = [] as Promise<sqlite3.RunResult>[]
			for(const row of dbRows){
				const params = sqlObj.getParams(row)
				const pr = await stmt.Run(params)
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

	static sql_selectCodeByText(tbl:str){
		const c = DbRow.col
		let sql = `SELECT ${c.code} FROM ${tbl} WHERE ${c.text}=?`
		return sql
	}

	static selectCodeByText(db:sqlite3.Database, tbl:str, text:str){
		const z = this
		const sql = z.sql_selectCodeByText(tbl)
		return SqliteDb.All(db, sql, [text])
	}

	selectCodeByText(text:str){

	}

}
