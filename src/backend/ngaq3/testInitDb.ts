import sqlite3 from "sqlite3";
import { NgaqDbSrc } from "./NgaqDbSrc";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";

async function main(){
	try {
		const dbPath = './ngaq.sqlite'
		const dbRaw = new sqlite3.Database(dbPath)
		const db = SqliteDb.new(dbRaw)
		const dbSrc = NgaqDbSrc.new(db)
		await dbSrc.init()
	} catch (err) {
		if(err instanceof DbErr){
			console.error(err.sql)
		}
		throw err
	}

}

main().catch(e=>console.error(e))