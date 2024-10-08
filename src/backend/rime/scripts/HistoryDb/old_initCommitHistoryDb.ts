/* 
創庫與commit_history表
*/

import { HistoryDbSrc } from "@backend/rime/old_historyDb/old_HistoryDbSrc";
import { HistoryTbl } from "@backend/rime/old_historyDb/old_HistoryTbl";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import sqlite3 from "sqlite3";
import { historyOpt } from "./old_opt";
import { stuff } from "./old_stuff";

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