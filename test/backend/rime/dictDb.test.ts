import * as DictDbSrc_ from '@backend/rime/dictDbSrc' 
import * as DictTbl_ from '@backend/rime/DictDbTbl'
import { TsvParser } from '@backend/rime/tsv'
import * as Tsv from '@backend/rime/tsv'
import { DbErr } from '@backend/sqlite/Sqlite'
import * as File from '@backend/util/File'
import sqlite3 from 'sqlite3'
sqlite3.verbose()
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
			const dbSrc = await DictDbSrc_.DictDbSrc.New({_dbPath:dbPath})
			const tblName = 'cangjie5'
			await dbSrc.createTable(tblName, {ifNotExists:true})
			await dbSrc.createTrigger(tblName)
			await dbSrc.createIndex(tblName)
			const tbl = DictTbl_.DictTbl.new({_dbSrc: dbSrc, _tableName:'cangjie5'})
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

