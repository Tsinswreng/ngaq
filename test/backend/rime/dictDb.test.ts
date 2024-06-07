import * as DictDbSrc_ from '@backend/rime/DictDbSrc' 
import * as DictTbl_ from '@backend/rime/DictDbTbl'
import { TsvParser } from '@backend/rime/tsv'
import * as Tsv from '@backend/rime/tsv'
import { DbErr, SqliteDb } from '@backend/sqlite/Sqlite'
import * as File from '@backend/util/File'
import now from 'performance-now'
import sqlite3 from 'sqlite3'
sqlite3.verbose()
const tblName = 'cangjie5'
const dbPath = process.cwd()+'/test/backend/sqlite.db'
const dictPath = process.cwd()+"/test/backend/rime/dict.dict.yaml"

describe('1', ()=>{
	// async function refresh(){
	// 	const sql = `DROP TABLE IF EXISTS ""`
	// }

	it('1',async()=>{
		try {
			const frl = File.FileReadLine.new(dictPath, {encoding:'utf-8'})
			const readN:Tsv.I_readN<Promise<string[]>> = {
				read(n:number){
					return frl.read(n)
				}
			}
			const tsvParser = Tsv.TsvParser.new(readN)
			const db = SqliteDb.new(new sqlite3.Database(dbPath))
			const dbSrc = await DictDbSrc_.DictDbSrc.new(db)
			await dbSrc.dropTable(tblName, {checkExist:false})
			await dbSrc.createTable(tblName, {checkExist:false})
			await dbSrc.createTrigger(tblName)
			await dbSrc.createIndex(tblName)
			//const tbl = DictTbl_.DictTbl.new({_dbSrc: dbSrc, _tableName:'cangjie5'})
			const tbl = DictTbl_.DictTbl.new(dbSrc, tblName)
			const ans = await tbl.insertByTsvParser(tsvParser, {bufferLineNum: 1000})
			console.log(ans)
			console.log('done')
		} catch (error) {
			if(error instanceof DbErr){
				console.error(error)
				console.error(error.sql)
			}
			throw error
		}

	})
})



describe('test insert duplicate', ()=>{
	// async function refresh(){
	// 	const sql = `DROP TABLE IF EXISTS ""`
	// }

	/**
	 * 先刪表再褈建表再插入
	 */
	async function insertAnew(){
		try {
			const frl = File.FileReadLine.new(dictPath, {encoding:'utf-8'})
			const readN:Tsv.I_readN<Promise<string[]>> = {
				read(n:number){
					return frl.read(n)
				}
			}
			const tsvParser = Tsv.TsvParser.new(readN)
			const db = SqliteDb.new(new sqlite3.Database(dbPath))
			const dbSrc = await DictDbSrc_.DictDbSrc.new(db)
			await dbSrc.dropTable(tblName, {checkExist:false})
			await dbSrc.createTable(tblName, {checkExist:false})
			await dbSrc.createTrigger(tblName)
			await dbSrc.createIndex(tblName)
			//const tbl = DictTbl_.DictTbl.new({_dbSrc: dbSrc, _tableName:'cangjie5'})
			const tbl = DictTbl_.DictTbl.new(dbSrc, tblName)
			const ans = await tbl.insertByTsvParser(tsvParser, {bufferLineNum: 1000})
		} catch (error) {
			if(error instanceof DbErr){
				console.error(error)
				console.error(error.sql)
			}
			throw error
		}
	}

	/**
	 * 不刪表、插入
	 */
	async function reInsert(){
		try {
			const frl = File.FileReadLine.new(dictPath, {encoding:'utf-8'})
			const readN:Tsv.I_readN<Promise<string[]>> = {
				read(n:number){
					return frl.read(n)
				}
			}
			const tsvParser = Tsv.TsvParser.new(readN)
			const db = SqliteDb.new(new sqlite3.Database(dbPath))
			const dbSrc = await DictDbSrc_.DictDbSrc.new(db)
			//await dbSrc.dropTable(tblName, {checkExist:false})
			// await dbSrc.createTable(tblName, {checkExist:false})
			// await dbSrc.createTrigger(tblName)
			// await dbSrc.createIndex(tblName)
			//const tbl = DictTbl_.DictTbl.new({_dbSrc: dbSrc, _tableName:'cangjie5'})
			const tbl = DictTbl_.DictTbl.new(dbSrc, tblName)
			const ans = await tbl.insertByTsvParser(tsvParser, {bufferLineNum: 1000})
		} catch (error) {
			if(error instanceof DbErr){
				console.error(error)
				console.error(error.sql)
			}
			throw error
		}
	}

	it('1',async()=>{
		const t0 =  now()
		await insertAnew()
		const t1 = now()
		await reInsert()
		const t2 = now()
		console.log(t1-t0,`console.log(t1-t0)`)
		console.log(t2-t1,`console.log(t2-t1)`)
	}, 10000)
})

