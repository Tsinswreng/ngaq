import {User} from '@backend/entities/User'
import Sqlite, {SqliteType} from '@backend/db/Sqlite'
import { VocaDbTable } from '@shared/SingleWord2'
import { $, $a } from '@shared/Ut'
import { RunResult } from 'sqlite3'
import { UserDbRow } from '@shared/DbRow/User'
import { Abs_DbSrc, CreateTableOpt } from '../_base/DbSrc'
//import { I_SqliteDbSrc,CreateTableConfig, Abs_SqliteDbSrc } from '@shared/interfaces/SqliteDbSrc'

type Database = SqliteType.Database
export class UserDbSrc extends Abs_DbSrc{

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_DbSrc.New>):Promise<UserDbSrc>{
		const f = await Abs_DbSrc.New(...params)
		const c = new this()
		Object.setPrototypeOf(f, UserDbSrc.prototype); // 设置原型链
		Object.assign(f,c)
		return f as UserDbSrc
	}

	static createTable(db:Database, table:string, ifNotExists=false){
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			const c = UserDbRow
			let ans = 
`
CREATE TABLE ${isExist} '${table}'(
	${c.id} INTEGER PRIMARY KEY,
	${c.name} TEXT,
	${c.password} TEXT,
	${c.date} TEXT,
	${c.email} TEXT
)
`
			return ans
		}
		return Sqlite.all(db, getSql(table))
	}

	createTable(table:string, config = CreateTableOpt.new()){
		const ifNotExists = config.ifNotExists
		return C.createTable(this._db, table, ifNotExists)
	}

	static genSql_insert(table:string, o:UserDbRow){
		const c = UserDbRow
		return Sqlite.sql.genSql_insert(table, o, [c.id])
	}
	genSql_insert = C.genSql_insert.bind(C)



}
const C = UserDbSrc
type C  = UserDbSrc