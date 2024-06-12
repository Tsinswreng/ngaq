/* 
創庫與commit_history表
*/

import { HistoryDbSrc } from "@backend/rime/HistoryDbSrc";
import { HistoryTbl } from "@backend/rime/HistoryTbl";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import sqlite3 from "sqlite3";
class Opt{
	dbPath = './rime.sqlite'
//	tblName = 'commit_history'
}

const opt = new Opt()

class Mod{
	dbRaw = new sqlite3.Database(opt.dbPath)
	db = SqliteDb.new(this.dbRaw)
	dbSrc = HistoryDbSrc.new(this.db)
	//tbl = HistoryTbl.new(this.dbSrc, opt.tblName)
}

const mod = new Mod()


async function main(){

	const dbSrc = mod.dbSrc
	const tblObj = dbSrc.getTblByName(dbSrc.names.tbl_commit_history)
	await tblObj.createTbl({checkExist:false})
}


main().catch(error=>{
	if(error instanceof DbErr){
		console.error(error.sql)
	}
	throw error
})