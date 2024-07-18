import { CreateTableOpt as CreateTableOpt, Abs_DbSrc, New_Abs_DbSrc } from "@backend/db/sqlite/_base_deprecated/DbSrc"
import OldSqlite, { SqliteType } from "@backend/db/OldSqlite";
import { WordTmdDbRow } from "@backend/old_dbRow/WordTmd";
import { WordDbSrc } from "@backend/db/sqlite/OldWord/DbSrc";
import { WordTmdTable } from "./Table";
type Db = SqliteType.Database
export class WordTmdDbSrc extends Abs_DbSrc{

	static readonly metadataTableName = '_metadata'

	static emmiter__handler = new Map<WordDbSrc, WordTmdDbSrc>()

	protected constructor(){
		super()
	}

	static async New(...params:Parameters<typeof Abs_DbSrc.New>){
		// const f = await Abs_DbSrc.New(...params)
		// const c = new this()
		// const o = inherit(c,f)
		//Object.setPrototypeOf(f,c)
		const o = new this()
		await o.__Init__(...params)
		return o as WordTmdDbSrc
	}

	// static new(...props: Parameters<typeof WordTmdDbSrc.New>){
	// 	const o = new this()
	// 	return o.__Init__(...props).then((d)=>{return d})
	// }

	protected override async __Init__(...props: Parameters<typeof WordTmdDbSrc.New>){
		const o = this
		await super.__Init__(...props)
		o._TableClass = WordTmdTable
		o._tmdTable = WordTmdTable.new({
			_dbSrc:o
			,_tableName: WordTmdDbSrc.metadataTableName
		})
		return o
		//console.log(props[0].)
		//console.log(o._tmdTable.dbSrc.db)//t
	}

	protected _tmdTable:WordTmdTable
	get tmdTable(){return this._tmdTable}

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
			const c = WordTmdDbRow
			let ans = 
`
CREATE TABLE ${isExist} '${table}'(
	${c.id} INTEGER PRIMARY KEY,
	${c.tableName} TEXT,
	${c.type} TEXT,
	${c.createDate} TEXT,
	${c.modifiedDate} TEXT,
	${c.weightAlgoJs} TEXT
)
`
			return ans
		}
		return OldSqlite.all(db, getSql(table))
	}

	createTable(table: string = WordTmdDbSrc.metadataTableName, opt: CreateTableOpt  = {ifNotExists:false}): Promise<unknown> {
		const args = arguments
		const got = [table, opt]
		this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_before, got)
		return WordTmdDbSrc.createTable(this.dbRaw, table, opt).then((d)=>{
			//this.eventEmmiter_deprecated.emit(this.eventNames_deprecated.createTable_after, args, d)
		})
	}




}

// export const WordTmdDbSrc = _WordTmdDbSrc
// export type WordTmdDbSrc = _WordTmdDbSrc