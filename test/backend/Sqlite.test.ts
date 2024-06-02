import * as Sq from '@backend/Sqlite'
import sqlite3 from 'sqlite3'

describe('1', ()=>{

	const path = 'D:/_code/voca/test/backend/voca.db'
	//const dbRaw = new sqlite3.Database(path, sqlite3.OPEN_CREATE)
	//Sq.SqliteDb.new()
	it('1', async ()=>{
		//const dbRaw = await Sq.SqliteDb.rawConnectByPathAsync(path) //, sqlite3.OPEN_CREATE
		//const dbRaw = new sqlite3.Database(path)
		const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
		//console.log(1)
		const db = Sq.SqliteDb.new(dbRaw)
		//console.log(db)
		const ans = await db.all(`SELECT * FROM sqlite_master`)
		console.log(ans)
	})
	
})