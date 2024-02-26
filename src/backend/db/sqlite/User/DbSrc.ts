import {User} from '@backend/entities/User'
import Sqlite, {SqliteType} from '@backend/db/Sqlite'
import { VocaDbTable } from '@shared/SingleWord2'
import { $, $a } from '@shared/Ut'
import { RunResult } from 'sqlite3'
import { Db_User } from '@shared/interfaces/User'
type Database = SqliteType.Database
export class UserDbSrc{

	protected _db: SqliteType.Database
	get db(){return this._db}

	protected _dbName:string
	protected _dbPath: string
	
	protected _backupDbPath:string
	protected _mode:number = Sqlite.openMode.DEFAULT_CREATE

	protected constructor(
	){}

	static async New(props:{
		_dbName?:string,
		_dbPath:string,
		_backupDbPath?:string
		,_mode?:number
	}){
		//@ts-ignore
		const o = new this()
		Object.assign(o, props)
		if(o._dbPath != void 0){
			o._db = await Sqlite.newDatabase(o._dbPath, o._mode)
		}
		return o
	}

	static createTable(db:Database, table:string, ifNotExists=false){
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			const c = Db_User
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

	createTable(table:string, ifNotExists = false){
		return C.createTable(this._db, table, ifNotExists)
	}

	static genSql_insert(table:string, o:Db_User){
		const c = Db_User
		return Sqlite.sql.genSql_insert(table, o, [c.id])
	}
	genSql_insert = C.genSql_insert.bind(C)



}
const C = UserDbSrc
type C  = UserDbSrc