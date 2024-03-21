import { CreateTableConfig, Abs_DbSrc } from "@backend/db/sqlite/_base/DbSrc"
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { DbRow_VocaTableMetadata } from "@backend/interfaces/VocaTableMetadata";
import { extends_ } from "@shared/Ut";

type Db = SqliteType.Database
class _VocaTableDbSrc extends Abs_DbSrc{

	static metadataTableName = '_metadata'

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_DbSrc.New>){
		const f = await Abs_DbSrc.New(params)
		const c = new this()
		return extends_(c,f, _VocaTableDbSrc)
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
		const args = arguments
		this.eventEmmiter.emit(this.eventNames.createTable_before, args)
		return _VocaTableDbSrc.createTable(this.db, table, config).then((d)=>{
			this.eventEmmiter.emit(this.eventNames.createTable_after, args, d)
		})
	}

}

export const VocaTableDbSrc = _VocaTableDbSrc
export type VocaTableDbSrc = _VocaTableDbSrc