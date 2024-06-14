import { HistoryDbSrc } from "@backend/rime/historyDb/HistoryDbSrc";
import { HistoryTbl } from "@backend/rime/historyDb/HistoryTbl";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import sqlite3 from "sqlite3";
import { historyOpt } from "./opt";
const opt = historyOpt

class Mod{
	dbRaw = new sqlite3.Database(opt.dbPath)
	db = SqliteDb.new(this.dbRaw)
	dbSrc = HistoryDbSrc.new(this.db)
	//tbl = HistoryTbl.new(this.dbSrc, opt.tblName)
}

export const stuff = new Mod()