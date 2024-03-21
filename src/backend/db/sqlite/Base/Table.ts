import { I_SqliteDbSrc } from "@shared/interfaces/SqliteDbSrc"
import { Db_User } from "@shared/interfaces/User"
import Sqlite, {SqliteType} from "@backend/db/Sqlite"
import { $a } from "@shared/Ut"
type RunResult = SqliteType.RunResult

abstract class _DbTable{
	protected constructor(){

	}

	static new(props:{
		_dbSrc: I_SqliteDbSrc
		_tableName:string
	}){
		//@ts-ignore
		const o = new this()
		Object.assign(o, props)
		return o
	}

	protected _dbSrc:I_SqliteDbSrc
	get dbSrc(){return this._dbSrc}

	protected _tableName:string
	get tableName(){return this._tableName}


	async addRecords(objs:Db_User[]):Promise<RunResult[]>{
		$a(objs, 'empty array')
		const [sql,] = this.dbSrc.genQry_insert(this.tableName, objs[0])
		const stmt = await Sqlite.prepare(this.dbSrc.db, sql)
		const ans = [] as RunResult[]
		for(let i = 0; i < objs.length; i++){
			const o = objs[i]
			const [, value] = this.dbSrc.genQry_insert(this.tableName, o)
			const r = await Sqlite.stmtRun(stmt, value)
			ans.push(r)
		}
		return ans
	}
}
