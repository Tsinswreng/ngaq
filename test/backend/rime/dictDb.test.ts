import * as DictDb_ from '@backend/rime/dictDb' 
import { TsvParser } from '@backend/rime/tsv'
import * as Tsv from '@backend/rime/tsv'
import { DbErr } from '@backend/sqlite/Sqlite'
import * as File from '@backend/util/File'
import sqlite3 from 'sqlite3'
sqlite3.verbose()
const dbPath = process.cwd()+'/test/backend/sqlite.db'
const dictPath = process.cwd()+"/test/backend/rime/dict.dict.yaml"

describe('1', ()=>{


	it('1',async()=>{
		try {
			const frl = File.FileReadLine.new(dictPath, {encoding:'utf-8'})
			const readN:Tsv.I_readN<Promise<string[]>> = {
				read(n:number){
					return frl.read(n)
				}
			}
			const tsvParser = Tsv.TsvParser.new(readN)
			const dbSrc = await DictDb_.DictDbSrc.New({_dbPath:dbPath})
			const tblName = 'cangjie5'
			await dbSrc.createTable(tblName, {ifNotExists:true})
			await dbSrc.createTrigger(tblName)
			await dbSrc.createIndex(tblName)
			const tbl = DictDb_.DictTbl.new({_dbSrc: dbSrc, _tableName:'cangjie5'})
			await tbl.insertByTsvParser(tsvParser, {bufferLineNum: 100})
			console.log('done')
		} catch (error) {
			if(error instanceof DbErr){
				console.error(error)
				console.error(error.sql)
			}
			//throw error
		}

	})
})

