import { CreateTableConfig, Abs_DbSrc } from "@backend/db/sqlite/_base/DbSrc"
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { DbRow_VocaTableMetadata } from "@backend/interfaces/VocaTableMetadata";
import { inherit } from "@shared/Ut";
import { WordDbSrc } from "@backend/db/sqlite/Word/DbSrc";
type Db = SqliteType.Database
class _WordTableMetadataDbSrc extends Abs_DbSrc{

	static metadataTableName = '_metadata'

	static emmiter__handler = new Map<WordDbSrc, _WordTableMetadataDbSrc>()

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_DbSrc.New>){
		const f = await Abs_DbSrc.New(...params)
		const c = new this()
		return inherit(c,f)
	}

	initListener(){
		const self = this
		const emt = self.eventEmmiter_deprecated
		const names = self.eventNames_deprecated
		emt.on(names.createTable_after, self.createTable.bind(self))
		console.log('created') //t
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
		this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_before, args)
		return _WordTableMetadataDbSrc.createTable(this.db, table, config).then((d)=>{
			this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_after, args, d)
		})
	}




}

export const WordTableMetadataDbSrc = _WordTableMetadataDbSrc
export type WordTableMetadataDbSrc = _WordTableMetadataDbSrc