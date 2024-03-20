import { 
	CreateTableConfig
	,I_SqliteDbSrc
	,EventNames
	,SqliteDbEventEmitter
	,Abs_SqliteDbSrc
	,Abs_SqliteDbSrc_Static
}
from "@shared/interfaces/SqliteDbSrc";
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { DbRow_VocaTableMetadata } from "@backend/interfaces/VocaTableMetadata";

type Db = SqliteType.Database
class _VocaTableDbSrc extends Abs_SqliteDbSrc{

	// protected _dbName: string = 'child'
	// get dbName(){return this._dbName}

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_SqliteDbSrc.New>):Promise<VocaTableDbSrc>{
		const f = await Abs_SqliteDbSrc.New(params)
		const c = new this()
		Object.setPrototypeOf(f, _VocaTableDbSrc.prototype); // 设置原型链
		Object.assign(f,c)
		return f as VocaTableDbSrc
	}

	static createTable(db:Db, table:string, config:CreateTableConfig = {ifNotExists:false}){
		const ifNotExists = config.ifNotExists
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			const c = DbRow_VocaTableMetadata
			let ans = 
`
CREATE TABLE ${isExist} '${table}'(
	${c.id} INTEGER PRIMARY KEY,
	${c.tableName} TEXT,
	${c.createDate} TEXT,
	${c.weightAlgoJs} TEXT
)
`
			return ans
		}
		return Sqlite.all(db, getSql(table))
	}

	createTable(table: string, config: CreateTableConfig  = {ifNotExists:false}): Promise<unknown> {
		return _VocaTableDbSrc.createTable(this.db, table, config).then((d)=>{
			this.eventEmmiter.emit(this.eventNames.createTable)
		})
	}

}

export const VocaTableDbSrc = _VocaTableDbSrc
export type VocaTableDbSrc = _VocaTableDbSrc