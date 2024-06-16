import * as SqliteUitl from '@backend/sqlite/sqliteUitl'
import { $ } from '@shared/Ut'
import {
	LearnRow,
	PropertyRow,
	RelationRow,
	WordRelationRow,
	WordRow
} from '@backend/ngaq3/DbRows/wordDbRows'
import { SqliteDb } from '@backend/sqlite/Sqlite'

class SchemaItem extends SqliteUitl.SqliteMaster{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof SchemaItem.new>){
		const z = this
		z.name = args[0]
		z.type = args[1]
		if(z.type = SMT.table){
			z.tbl_name = z.name
		}else{
			z.tbl_name = $(args[2])
		}
		
		return z
	}

	static new(name:str, type:SqliteUitl.SqliteMasterType.table):SchemaItem
	static new(name:str, type:SqliteUitl.SqliteMasterType, tbl_name?:str):SchemaItem
	static new(name:str, type:SqliteUitl.SqliteMasterType, tbl_name?:str){
		const z = new this()
		z.__init__(name, type, tbl_name)
		return z
	}

	get This(){return SchemaItem}
}

const SI = SchemaItem.new.bind(SchemaItem)
const SMT = SqliteUitl.SqliteMasterType
class SchemaItems{
	tbl_word = SI('word', SMT.table)
	tbl_learn=SI('learn', SMT.table)
	tbl_property=SI('property', SMT.table)
	tbl_relation=SI('relation', SMT.table)
	tbl_wordRelation=SI('wordRelation', SMT.table)
	idx_wordText = SI('idx_wordText', SMT.index, this.tbl_word.tbl_name)
}

const schemaItems = new SchemaItems()

class InitSchemaSql{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof InitSchemaSql.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return InitSchemaSql}

	protected _items = schemaItems
	get items(){return this._items}
	protected set items(v){this._items = v}

	getAllSql(){
		const z = this
		const ans:str[] = [
			z.mkTbl_word()
			,z.mkTbl_property()
			,z.mkTbl_learn()
			,z.mkTbl_relation()
			,z.mkTbl_wordRelation()
			,z.mkIdx_wordText()
		]
		return ans
	}

	mkTbl_word(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const tbl = z.items.tbl_word.name
		const c = WordRow.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
)`
		return ans
	}

	mkTbl_learn(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = LearnRow.col
		const tbl = z.items.tbl_learn.name
		const ans = 
`CREATE TABLE ${ifNE} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.status} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES ${z.items.tbl_word.name}(${WordRow.col.id})
)`
		return ans
	}

	mkTbl_property(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = PropertyRow.col
		const tbl = z.items.tbl_property.name
		const ans = 
`CREATE TABLE ${ifNE} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.wid} INTEGER NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES "${z.items.tbl_word.name}"(${WordRow.col.id})
)`
		return ans
	}

	mkTbl_relation(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = RelationRow.col
		const tbl = z.items.tbl_relation.name
		const ans = 
`CREATE TABLE ${ifNE} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.name} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
)`
		return ans
	}

	mkTbl_wordRelation(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = WordRelationRow.col
		const tbl = z.items.tbl_wordRelation.name
		const ans = 
`CREATE TABLE ${ifNE} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.rid} INTEGER NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES "${z.items.tbl_word.name}"(${WordRow.col.id})
	,FOREIGN KEY(${c.rid}) REFERENCES "${z.items.tbl_relation.name}"(${RelationRow.col.id})
)`
		return ans
	}

	mkIdx_wordText(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = WordRow.col
		const tbl = z.items.tbl_word.name
		const idx = z.items.idx_wordText.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.text})`
		return ans
	}

}

export class NgaqDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof NgaqDbSrc.new>){
		const z = this
		z._db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	get This(){return NgaqDbSrc}

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}
	

	protected _schemaItems = schemaItems
	get schemaItems(){return this._schemaItems}
	protected set schemaItems(v){this._schemaItems = v}

	protected _initSql = InitSchemaSql.new()
	get initSql(){return this._initSql}
	protected set initSql(v){this._initSql = v}
	
	async init(){
		const z = this
		const sqls = z.initSql.getAllSql()
		for(const sql of sqls){
			await z.db.run(sql)
		}
		return true
	}

	selectAllWords(){
		
	}

	seekWordById(id:int){
		const z = this

	}



}



