/* 
創庫與commit_history表
*/

import { HistoryDbSrc } from "@backend/rime/historyDb/HistoryDbSrc";
import { HistoryTbl } from "@backend/rime/historyDb/HistoryTbl";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import sqlite3 from "sqlite3";
import { historyOpt } from "./opt";
import { stuff } from "./stuff";

const opt = historyOpt
const mod = stuff

async function main(){

	const dbSrc = mod.dbSrc
	const tblObj = dbSrc.getTblByName(dbSrc.names.tbl_commitHistory)
	await tblObj.createTbl({checkExist:false})
}


main().catch(error=>{
	if(error instanceof DbErr){
		console.error(error.sql)
	}
	throw error
})