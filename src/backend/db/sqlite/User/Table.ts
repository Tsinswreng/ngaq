import { User } from "@backend/entities/User"
import { Db_User } from "@shared/interfaces/User"
import { UserDbSrc } from "@backend/db/sqlite/User/DbSrc"
import Sqlite, {SqliteType} from '@backend/db/Sqlite'
import { VocaDbTable } from '@shared/SingleWord2'
import { $, $a } from '@shared/Ut'
import { RunResult } from 'sqlite3'
type Database = SqliteType.Database
export class UserTable{
	protected _dbSrc:UserDbSrc
	get dbSrc(){return this._dbSrc}

	protected _tableName:string
	get tableName(){return this._tableName}

	protected constructor(){}
	static new(props:{
		_manager: UserDbSrc
		_tableName:string
	}){
		const o = new this()
		Object.assign(o, props)
		return o
	}

	async addRecords(objs:Db_User[]):Promise<RunResult[]>{
		$a(objs, 'empty array')
		const [sql,] = this.dbSrc.genSql_insert(this.tableName, objs[0])
		const stmt = await Sqlite.prepare(this.dbSrc.db, sql)
		const ans = [] as RunResult[]
		for(let i = 0; i < objs.length; i++){
			const o = objs[i]
			const [, value] = this.dbSrc.genSql_insert(this.tableName, o)
			const r = await Sqlite.stmtRun(stmt, value)
			ans.push(r)
		}
		return ans
	}
}
const C = UserTable
type C  = UserTable