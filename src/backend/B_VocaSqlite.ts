import Bsqlt from 'better-sqlite3'
import VocaSqlite from './VocaSqlite'
import { $ } from '@shared/Ut'
const vocaSqlite = new VocaSqlite({_tableName:'japanese'})
const i64table = new VocaSqlite({_tableName: 'test_int64'})
const sql = `SELECT * FROM '${i64table.tableName}'`
const db = new Bsqlt(
	i64table.dbPath, 
	{
		verbose: console.log
		,fileMustExist: true
		,
	}
)

async function main(){
	const stmt = db.prepare(sql)
	stmt.safeIntegers()
	const info = stmt.all()
	//console.log(info)

}//main()


async function test_transaction(){
	
	const sqlTemplate = (table:string)=>{
		return `SELECT * FROM '${table}' WHERE id = ?`
	}

	const sql = sqlTemplate($(vocaSqlite.tableName))
	const db = new Bsqlt(
		vocaSqlite.dbPath,
		{
			verbose: console.log
			,fileMustExist: true
			,
		}
	)
	const stmt = db.prepare(sql)
	
	const tx = db.transaction(()=>{
		const result:any[] = []
		for(let i = 0; i < 10; i++){
			let unus =  stmt.all(i)
			result.push(unus)
		}
		return result
	})
	console.log(tx())
}
test_transaction()