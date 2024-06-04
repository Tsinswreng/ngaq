import * as Sq from '@backend/sqlite/Sqlite'
import now from 'performance-now'
import sqlite3 from 'sqlite3'

const path = 'D:/_code/voca/test/backend/sqlite.db'
const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
const db = Sq.SqliteDb.new(dbRaw)
const tableName = 'test'
const dropTableSql = `DROP TABLE IF EXISTS ${tableName}`
const createTableSql = 
`CREATE TABLE IF NOT EXISTS ${tableName} (
	id INT PRIMARY KEY,
	str TEXT,
	num INT
)`
const insertSql = `INSERT INTO ${tableName} (str, num) VALUES (?,?)`
async function refresh(){
	await db.run(dropTableSql)
	await db.run(createTableSql)
}

describe('1', ()=>{

	const path = 'D:/_code/voca/test/backend/sqlite.db'
	//const dbRaw = new sqlite3.Database(path, sqlite3.OPEN_CREATE)
	//Sq.SqliteDb.new()
	it('1', async ()=>{
		//const dbRaw = await Sq.SqliteDb.rawConnectByPathAsync(path) //, sqlite3.OPEN_CREATE
		//const dbRaw = new sqlite3.Database(path)
		const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
		const db = Sq.SqliteDb.new(dbRaw)
		//console.log(db)
		const ans = await db.all(`SELECT * FROM sqlite_master`)
		console.log(ans)
	})

	it('loop db select', async()=>{
		const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
		const db = Sq.SqliteDb.new(dbRaw)
		
		
		const ans = [] as any[]
		const sql = `SELECT * FROM english WHERE id=?`
		const start = now()
		for(let i = 0; i < 9999; i++){
			const u = await db.get(sql, [i])
			ans.push(u)
			//console.log(ans)
		} //15.687s?
		const end = now()
		console.log(ans.length)
		console.log(end - start) //838.8483999967575
	})

	it('loop statement select', async()=>{
		const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
		const db = Sq.SqliteDb.new(dbRaw)
		
		const ans = [] as any[]
		const sql = `SELECT * FROM english WHERE id=?`
		const start = now()
		const stmt = await db.prepare(sql)
		for(let i = 0; i < 9999; i++){
			const u = await stmt.get([i])
			ans.push(u)
		}
		const end = now()
		console.log(ans.length)
		console.log(end - start) // 549.4189999997616
	})

	it('transaction statement select promise all', async()=>{
		const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
		const db = Sq.SqliteDb.new(dbRaw)
		
		let ans = [] as any[]
		const sql = `SELECT * FROM english WHERE id=?`
		const start = now()
		const stmt = await db.prepare(sql)
		const fn = async()=>{
			const prms = [] as Promise<any>[]
			for(let i = 0; i < 9999; i++){
				// const u = await stmt.get([i])
				// ans.push(u)
				const u = stmt.get([i])
				prms.push(u)
			}
			return Promise.all(prms)
		}
		ans = await db.transaction(fn)
		const end = now()
		console.log(ans)
		console.log(ans.length)
		console.log(end - start) // 279.95119997859
		
	})

})

describe('insert', ()=>{
	const path = process.cwd()+'/test/backend/sqlite.db'
	const dbRaw = Sq.SqliteDb.rawConnectByPath(path)
	const db = Sq.SqliteDb.new(dbRaw)
	const tableName = 'test'
	const dropTableSql = `DROP TABLE IF EXISTS ${tableName}`
	const createTableSql = 
	`CREATE TABLE IF NOT EXISTS ${tableName} (
		id INT PRIMARY KEY,
		str TEXT,
		num INT
	)`
	const insertSql = `INSERT INTO ${tableName} (str, num) VALUES (?,?)`
	async function refresh(){
		await db.run(dropTableSql)
		await db.run(createTableSql)
	}
	
	it('stmt loop 99', async()=>{
		await refresh()
		const stmt = await db.prepare(insertSql)
		const start = now()
		for(let i = 0; i < 99; i++){
			await stmt.run([i,i])
		}
		const end = now()
		console.log(end - start) //941.8697000145912
	})

	it('transaction', async()=>{
		await refresh()
		const stmt = await db.prepare(insertSql)
		const start = now()
		const fn = async()=>{
			const fnAns = [] as any[]
			for(let i = 0; i < 99; i++){
				const u = await stmt.run([i,i])
				fnAns.push(u)
			}
			return fnAns
		}
		const ans = await db.transaction(fn)
		const end = now()
		console.log(ans)
		/* 
		[ 
			Statement { lastID: 99, changes: 1 }, 
			[
				Statement { lastID: 99, changes: 1 },
				Statement { lastID: 99, changes: 1 },
				......
			]
		]
		*/
		console.log(end - start) // 11.659200012683868
	})
})


describe('err in transaction', ()=>{
	it('err in transaction fn', async()=>{
		await refresh()
		const fn = async()=>{
			throw new Error()
		}
		try {
			db.transaction(fn)
		} catch (error) {
			console.error(error)
			expect(error instanceof Sq.DbErr).toBe(true)
		}
	})
})