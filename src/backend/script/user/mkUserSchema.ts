import Config from "@backend/Config";
import { UserDbSrc } from "@backend/db/sqlite/user/UserDbSrc";
import { DbErr, SqliteDb } from "@backend/sqlite/Sqlite";
import { UserInitSql } from "@backend/db/sqlite/user/UserInitSql"

const configInst = Config.getInstance()

async function Main(){
	try {
		console.log('start')
		const dbPath = configInst.config.ngaq.server.dbPath
		const db = SqliteDb.fromPath(dbPath)
		//const dbSrc = UserDbSrc.new(db)
		const initer = UserInitSql.new()
		await initer.MkSchema(db)
		console.log('done')
	} catch (err) {
		if(err instanceof DbErr){
			console.error(err)
			console.error(err.sql)
		}
	}

}


Main().catch(e=>{
	console.error(e)
})
