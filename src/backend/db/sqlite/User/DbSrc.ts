import {User} from '@backend/entities/User'
import Sqlite, {SqliteType} from '@backend/db/Sqlite'
import { VocaDbTable } from '@shared/SingleWord2'
import { $, $a } from '@shared/Ut'
import { RunResult } from 'sqlite3'
import { Db_User } from '@shared/interfaces/User'
import { SqliteDbSrc,CreateTableConfig } from '@shared/interfaces/SqliteDbSrc'
type Database = SqliteType.Database
export class UserDbSrc implements SqliteDbSrc{

	protected _db: SqliteType.Database
	get db(){return this._db}

	protected _dbName:string
	get dbName(){return this._dbName}
	
	protected _dbPath: string
	get dbPath(){return this._dbPath}
	
	protected _backupDbPath:string
	get backupDbPath(){return this._backupDbPath}
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

	createTable(table:string, config = CreateTableConfig.new()){
		const ifNotExists = config.ifNotExists
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