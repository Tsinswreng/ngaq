import sqlite3 from "sqlite3";
import { NgaqDbSrc } from "./ngaqDbSrc/NgaqDbSrc";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import Tempus from "@shared/Tempus";
import { InitSql } from "./ngaqDbSrc/Initer_ngaqDbSrc";

const dbPath = './ngaq.sqlite'
const dbRaw = new sqlite3.Database(dbPath)
const db = SqliteDb.new(dbRaw)
const dbSrc = NgaqDbSrc.new(db)
async function init(){
	try {
		const initer = InitSql.new()
		await initer.MkSchema(dbSrc.db)
	} catch (err) {
		if(err instanceof DbErr){
			console.error(err.sql)
		}
		throw err
	}

}
init().catch(e=>console.error(e))

async function testSelect(){
	
`SELECT
    word.id
     , word.belong
     , word.text wt
     , word.ct
     , word.mt
    , property.text "p.t"
FROM word
LEFT JOIN property on word.id = property.wid
LEFT JOIN learn on word.id = learn.wid
WHERE word.id = 1`
	const sql = `SELECT EXISTS (SELECT * from word)`
	const ans = await dbSrc.db.All(sql)
	console.log(ans)
}
//testSelect()





