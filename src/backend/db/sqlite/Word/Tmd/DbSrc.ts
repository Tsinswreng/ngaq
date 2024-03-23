import { CreateTableOpt as CreateTableOpt, Abs_DbSrc } from "@backend/db/sqlite/_base/DbSrc"
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { DbRow_WordTmd } from "@backend/interfaces/WordTmd";
import { inherit } from "@shared/Ut";
import { WordDbSrc } from "@backend/db/sqlite/Word/DbSrc";
type Db = SqliteType.Database
export class WordTmdDbSrc extends Abs_DbSrc{

	static readonly metadataTableName = '_metadata'

	static emmiter__handler = new Map<WordDbSrc, WordTmdDbSrc>()

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_DbSrc.New>){
		const f = await Abs_DbSrc.New(...params)
		const c = new this()
		const o = inherit(c,f)
		//Object.setPrototypeOf(f,c)
		return o as WordTmdDbSrc
	}

	initListener(){
		const self = this
		const emt = self.linkedEmitter
		const events = self.events
	/* 	emt.eventEmitter.on(enents.createTable_after.name, (...args)=>{
			self.createTable(_WordTableMetadataDbSrc.metadataTableName)
		}) */

		
		emt.on(events.createTable_after, (table:string, opt:CreateTableOpt)=>{
			//self.createTable(_WordTableMetadataDbSrc.metadataTableName)
			console.log(`${table} was created successfully`)
		})

		
		
	}

	static createTable(db:Db, table:string, config:CreateTableOpt = {ifNotExists:false}){
		const ifNotExists = config.ifNotExists
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			const c = DbRow_WordTmd
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

	createTable(table: string = WordTmdDbSrc.metadataTableName, opt: CreateTableOpt  = {ifNotExists:false}): Promise<unknown> {
		const args = arguments
		const got = [table, opt]
		this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_before, got)
		return WordTmdDbSrc.createTable(this.db, table, opt).then((d)=>{
			//this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_after, args, d)
		})
	}




}

// export const WordTmdDbSrc = _WordTmdDbSrc
// export type WordTmdDbSrc = _WordTmdDbSrc