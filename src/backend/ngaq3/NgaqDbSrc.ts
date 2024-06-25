import * as SqliteUitl from '@backend/sqlite/sqliteUitl'
import { $ } from '@shared/Ut'
import {
	LearnRow,
	PropertyRow,
	RelationRow,
	WordRelationRow,
	WordRow
} from '@backend/ngaq3/DbRows/wordDbRows'

import * as Rows from '@backend/ngaq3/DbRows/wordDbRows'
import * as Objs from '@shared/entities/Word/Word3'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import { JoinedRow } from './DbRows/JoinedRow'
import { PubNonFuncKeys } from '@shared/Type'
import { JoinedWord } from '@shared/entities/Word/JoinedWord'


class SchemaItem extends SqliteUitl.SqliteMaster{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof SchemaItem.new>){
		const z = this
		z.name = args[0]
		z.type = args[1]
		if(z.type === SMT.table){
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

class Trigger{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Trigger.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Trigger}

	
}


class Tbl<T extends kvobj=kvobj>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tbl.new>){
		const z = this
		z.schemaItem = args[0]
		return z
	}

	static new(schemaItem:SchemaItem){
		const z = new this()
		z.__init__(schemaItem)
		return z
	}

	get This(){return Tbl}

	protected _schemaItem:SchemaItem
	get schemaItem(){return this._schemaItem}
	protected set schemaItem(v){this._schemaItem = v}
	
	get name(){return this.schemaItem.name}
	get type(){return this.schemaItem.type}
	get tbl_name(){return this.schemaItem.tbl_name}


	protected _db:SqliteDb
	get db(){return this._db}
	set db(v){this._db = v}


	
	
	// qry_addOne(row:T){
	// 	const z = this
	// 	const sqlObj = SqliteUitl.Sql.obj.new(row)
	// 	const sql = sqlObj.geneFullInsertSql(z.tbl_name)
	// 	const param = sqlObj.getParams()
	// 	const qry = SqliteUitl.Qry.new(sql, param)
	// 	return qry
	// }


	///** @deprecated */
	// qry_addMulti(row:T[]){
	// 	const z = this
	// 	const first = row[0]
	// 	if(first == void 0){
	// 		throw new Error(`row is empty`)
	// 	}
	// 	const sqlObj = SqliteUitl.Sql.obj.new(first, {ignoredKeys: ['id']})//TODO
	// 	return sqlObj
	// }


	///** @deprecated */
	// async addMulti(rows:T[]){
	// 	const z = this
	// 	const sqlObj = z.qry_addMulti(rows)
	// 	const sql = sqlObj.geneFullInsertSql(z.tbl_name)
	// 	const stmt = await z.db.prepare(sql)
	// 	for(let i = 0; i < rows.length; i++){
	// 		const row = rows[i]
	// 		const param = sqlObj.getParams(row)
	// 		const result = await stmt.run(param)
	// 	}
	// 	return true
	// }
}

class WordTbl extends Tbl<WordRow>{

}

class LearnTbl extends Tbl<WordRow>{

}

class PropertyTbl extends Tbl<WordRow>{

}




const SI = SchemaItem.new.bind(SchemaItem)
const TBL = (name:str, type?:SqliteUitl.SqliteMasterType.table)=>{
	const schemaItem = SchemaItem.new(
		name
		, type??SqliteUitl.SqliteMasterType.table
	)
	const tbl = Tbl.new(schemaItem)
	return tbl
}
const SMT = SqliteUitl.SqliteMasterType
class SchemaItems{
	tbl_word = TBL('word', SMT.table)
	tbl_learn=TBL('learn', SMT.table)
	tbl_property=TBL('property', SMT.table)
	tbl_relation=TBL('relation', SMT.table)
	tbl_wordRelation=TBL('wordRelation', SMT.table)
	
	idx_wordText = SI('idx_wordText', SMT.index, this.tbl_word.tbl_name)
	idx_wordCt = SI('idx_wordCt', SMT.index, this.tbl_word.tbl_name)
	idx_wordMt = SI('idx_wordMt', SMT.index, this.tbl_word.tbl_name)
	idx_learnWid = SI('idx_learnWid', SMT.index, this.tbl_learn.tbl_name)
	idx_learnCt = SI('idx_learnCt', SMT.index, this.tbl_learn.tbl_name)
	idx_propertyWid = SI('idx_propertyWid', SMT.index, this.tbl_property.tbl_name)

	trig_aftIns_learnAltWordMt = SI('aftIns_learnAltWordMt', SMT.trigger, this.tbl_learn.tbl_name)
	trig_aftIns_propertyAltWordMt = SI('aftIns_propertyAltWordMt', SMT.trigger, this.tbl_property.tbl_name)
	trig_aftUpd_propertyAltWordMt = SI('aftUpd_propertyAltWordMt', SMT.trigger, this.tbl_property.tbl_name)
}

const schemaItems = new SchemaItems()

class InitSql{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof InitSql.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return InitSql}

	protected _items = schemaItems
	get items(){return this._items}
	protected set items(v){this._items = v}

	getAllMkTblSql(){
		const z = this
		const ans:str[] = [
			z.mkTbl_word()
			,z.mkTbl_property()
			,z.mkTbl_learn()
			,z.mkTbl_relation()
			,z.mkTbl_wordRelation()
			//,z.mkIdx_wordText()
		]
		return ans
	}

	getAllIdxSql(){
		const z = this
		const ans:str[] = [
			z.mkIdx_wordText()
			,z.mkIdx_propertyWid()
			,z.mkIdx_learnWid()
			,z.mkIdx_learnCt()
			,z.mkIdx_learnMt()
			,z.mkIdx_wordCt()
			,z.mkIdx_wordMt()
		]
		return ans
	}

	getAllTrigSql(){
		const z = this
		const ans:str[] = [
			z.mkTrig_aftIns_learnAltWordMt()
			,z.mkTrig_aftIns_propertyAltWordMt()
			,z.mkTrig_aftUpd_propertyAltWordMt()
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
	,UNIQUE(${c.belong}, ${c.text})
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
	,${c.belong} TEXT NOT NULL
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
		const c = WordRow.col //
		const tbl = z.items.tbl_word.name //
		const idx = z.items.idx_wordText.name //
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.text})`
		return ans
	}

	mkIdx_propertyWid(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.PropertyRow.col //
		const item = z.items.idx_propertyWid //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.wid})`
		return ans
	}

	mkIdx_learnWid(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.LearnRow.col //
		const item = z.items.idx_learnWid //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.wid})`
		return ans
	}

	mkIdx_learnCt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.LearnRow.col //
		const item = z.items.idx_learnCt //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.ct})`
		return ans
	}

	mkIdx_learnMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.LearnRow.col //
		const item = z.items.idx_learnCt //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.mt})`
		return ans
	}

	mkIdx_wordCt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.WordRow.col //
		const item = z.items.idx_wordCt //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.ct})`
		return ans
	}

	mkIdx_wordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const c = Rows.WordRow.col //
		const item = z.items.idx_wordCt //
		const tbl = item.tbl_name
		const idx = item.name
		const ans = 
`CREATE INDEX ${ifNE} "${idx}" ON ${tbl}(${c.mt})`
		return ans
	}

	mkTrig_aftIns_learnAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftIns_learnAltWordMt
		const c = Rows.WordRow.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${item.tbl_word.tbl_name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}

	mkTrig_aftIns_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftIns_propertyAltWordMt
		const c = Rows.WordRow.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${item.tbl_word.tbl_name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}

	mkTrig_aftUpd_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftUpd_propertyAltWordMt
		const c = Rows.WordRow.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER UPDATE ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${item.tbl_word.tbl_name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}
}

const Qry = SqliteUitl.Qry

class Qrys{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Qrys.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Qrys}

	protected _schemaItems = schemaItems
	get schemaItems(){return this._schemaItems}
	protected set schemaItems(v){this._schemaItems = v}
	

	/**
	 * WHERE ${c.belong} = ? AND ${c.text} = ?
	 * @returns 
	 */
	selectExistFromWord(colAlias='_'){
		const z = this
		const items = z.schemaItems
		const c = Rows.WordRow.col
		const sql = 
`SELECT EXISTS(
	SELECT * FROM ${items.tbl_word} 
	WHERE ${c.belong} = ? AND ${c.text} = ?
) AS "${colAlias}"`

		return sql
	}

	selectTextWordById(){
		const z = this
		const items = z.schemaItems
		const c = Rows.WordRow.col
		const sql = 
`SELECT * FROM ${items.tbl_word.tbl_name} WHERE ${c.id} = ?`
		return sql
	}

	selectPropertysByWid(){
		const z = this
		const items = z.schemaItems
		const c = Rows.PropertyRow.col
		const sql = 
`SELECT * FROM ${items.tbl_property.tbl_name} WHERE ${c.wid} = ?`
		return sql
	}

	selectLearnsByWid(){
		const z = this
		const items = z.schemaItems
		const c = Rows.LearnRow.col
		const sql = 
`SELECT * FROM ${items.tbl_learn.tbl_name} WHERE ${c.wid} = ?`
		return sql
	}

	async fn_addPropertyRow(db:SqliteDb){
		const z = this
		const sqlObjPr = SqliteUitl.Sql.obj.new(new Rows.PropertyRow())
		const stmtPr = await db.prepare(
			sqlObjPr.geneFullInsertSql(z.schemaItems.tbl_property.tbl_name)
		)
		return async(e:Rows.PropertyRow)=>{
			return await stmtPr.run(sqlObjPr.getParams(e))
		}
	}

	async fn_addLearnRow(db:SqliteDb){
		const z = this
		const sqlObjPr = SqliteUitl.Sql.obj.new(new Rows.LearnRow())
		const stmtPr = await db.prepare(
			sqlObjPr.geneFullInsertSql(z.schemaItems.tbl_learn.tbl_name)
		)
		return async(e:Rows.LearnRow)=>{
			return await stmtPr.run(sqlObjPr.getParams(e))
		}
	}

	// addTextWordRow(row:Rows.WordRow){ //
	// 	const z = this
	// 	const sqlObj = SqliteUitl.Sql.obj.new(
	// 		row//, {ignoredKeys: [Rows.WordRow.col.id]} //
	// 	)
	// 	const sql = sqlObj.geneFullInsertSql(z.schemaItems.tbl_word.name) //
	// 	const param = sqlObj.getParams()
	// 	const qry = SqliteUitl.Qry.new_deprecated(sql, param)
	// 	return qry
	// }

	// addLearnRow(rows = [new Rows.LearnRow()]){ //
	// 	const z = this
	// 	const sqlObj = SqliteUitl.Sql.obj.new(
	// 		new Rows.LearnRow()
	// 	)
	// 	const sql = sqlObj.geneFullInsertSql(z.schemaItems.tbl_learn.name) //
	// 	const param = sqlObj.getParams()
	// 	const qry = SqliteUitl.Qry.new_deprecated(sql, param)
	// 	return qry
	// }

	// addPropertyRow(rows = [new Rows.PropertyRow()]){ //
	// 	const z = this
	// 	const sqlObj = SqliteUitl.Sql.obj.new(
	// 		new Rows.PropertyRow()
	// 	)
	// 	const sql = sqlObj.geneFullInsertSql(z.schemaItems.tbl_property.name) //
	// 	const param = sqlObj.getParams()
	// 	const qry = SqliteUitl.Qry.new_deprecated(sql, param)
	// 	return qry
	// }


	getAllWordId(colAlias='_'){
		const z = this
		const item = z.schemaItems
		const c = Rows.WordRow.col
		const ans = 
`SELECT ${c.id} AS "${colAlias}" FROM ${item.tbl_word.tbl_name}`
		return ans
	}


}


export class NgaqDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof NgaqDbSrc.new>){
		const z = this
		z._db = args[0]
		z.injectDb()
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

	protected _initSql = InitSql.new()
	get initSql(){return this._initSql}
	protected set initSql(v){this._initSql = v}

	protected _qrys:Qrys = Qrys.new()
	get qrys(){return this._qrys}
	set qrys(v){this._qrys = v}
	
	
	async init(){
		const z = this
		const sqls = z.initSql.getAllMkTblSql()
		await z.db.beginTrans()
		for(const sql of sqls){
			await z.db.run(sql)
		}

		const sqlsIdx = z.initSql.getAllIdxSql()
		for(const sql of sqlsIdx){
			await z.db.run(sql)
		}

		const sqlTrig = z.initSql.getAllTrigSql()
		for(const sql of sqlTrig){
			await z.db.run(sql)
		}
		await z.db.commit()
		return true
	}

	protected injectDb(){
		const z = this
		const items = z.schemaItems
		const keys = Object.keys(items)
		for(const key of keys){
			const item = items[key]
			if(item?.type === SqliteUitl.SqliteMasterType.table){
				(item as Tbl).db = z.db
			}
		}
	}




	// qry_addJoinedRow(row:JoinedRow){
	// 	const z = this
	// 	const qrys = [] as SqliteUitl.Qry[]
	// 	const learn = z.qry_addLearn()
	// }

	getTbl(tbl:PubNonFuncKeys<typeof SchemaItems.prototype>){
		
	}


	// async test_addJoinedRows_deprecated(rows:JoinedRow[]){
	// 	const z = this
	// 	const si = z.schemaItems

	// 	const addOther=async(row:JoinedRow)=>{
	// 		//await si.tbl_word.addMulti([row.word])
	// 		await si.tbl_learn.addMulti(row.learns)
	// 		await si.tbl_property.addMulti(row.propertys)
	// 	}
	// 	const addWord=async(row:JoinedRow)=>{
	// 		await si.tbl_word.addMulti([row.word])
	// 		await addOther(row)
	// 	}
	// 	z.db.beginTrans()
	// 	for(let i = 0; i < rows.length; i++){
	// 		const row = rows[i]
	// 		await addWord(row)
	// 	}
	// 	z.db.commit()
	// 	return true
	// }


	async fn_addJoinedRows(){
		const z = this
		const si = z.schemaItems
		const db = z.db
		// const rowFirst = rows[0]
		// if(rowFirst == void 0){
		// 	return true
		// }
		const SqlObj = SqliteUitl.Sql.obj
		
		//const wordSqlObj = SqliteUitl.Sql.obj.new(rowFirst.word, {ignoredKeys: [Rows.WordRow.col.id]})
		const wordSqlObj = SqliteUitl.Sql.obj.new(new Rows.WordRow(), {ignoredKeys: [Rows.WordRow.col.id]})
		const wordSql = wordSqlObj.geneFullInsertSql(si.tbl_word.tbl_name)
		const wordStmt = await db.prepare(wordSql)
		
		const learnSqlObj = SqlObj.new((new Rows.LearnRow()))
		const learnSql = learnSqlObj.geneFullInsertSql(si.tbl_learn.tbl_name)
		const learnStmt = await db.prepare(learnSql)

		const propSqlObj = SqlObj.new((new Rows.PropertyRow()))
		const propSql = propSqlObj.geneFullInsertSql(si.tbl_property.tbl_name)
		const propStmt = await db.prepare(propSql)

		
		const fn = async(rows:JoinedRow[])=>{
			for(let i = 0; i < rows.length; i++){
				const jr = rows[i]
				// if(jr.word.text === '勢い'){ //t
				// 	console.log(jr)
				// }
				const res = await wordStmt.run(wordSqlObj.getParams(jr.word))
				const lastId = res.lastID
				for(let j = 0; j < jr.learns.length; j++){
					jr.learns[j].wid = lastId
					await learnStmt.run(learnSqlObj.getParams(jr.learns[j]))
				}
				for(let j = 0; j < jr.propertys.length; j++){
					jr.propertys[j].wid = lastId
					const cur = jr.propertys[j]
					await propStmt.run(propSqlObj.getParams(jr.propertys[j]))
				}
			}
		}
		return fn
		// const sqls = [] as str[]
		// function pushSql(sqls:str[], tblName:str, rows:any[]){
		// 	const first = rows[0]
		// 	if(first == void 0){
		// 		return
		// 	}
		// 	const sqlObj = SqliteUitl.Sql.obj.new(first)
		// 	const sql = sqlObj.geneFullInsertSql(tblName)
		// 	sqls.push(sql)
		// }
		// pushSql(sqls, si.tbl_learn.tbl_name, rowFirst.learns)
		// pushSql(sqls, si.tbl_property.tbl_name, rowFirst.propertys)
		// const stmts = await Promise.all(sqls.map(e=>db.prepare(e)))
		// const stmts = [] as (Awaited<ReturnType<typeof db.prepare>>)[]
		// for(const sql of sqls){
		// 	const ua = await db.prepare(sql)
		// 	stmts.push(ua)
		// }


		// async function one(row:JoinedRow){
		// 	const sqlObj = SqliteUitl.Sql.obj.new(row, {ignoredKeys: [Rows.WordRow.col.id]})
		// 	const sql = sqlObj.geneFullInsertSql(si.tbl_word.tbl_name)
		// 	const params = sqlObj.getParams()
		// 	const stmt = z.db.prepare(sql)

		// 	row.word
		// }
	}

	/**
	 * 
	 * @param words 
	 * @returns return [existingWords, nonExistingWords]
	 */
	async classifyWordsByIsExist(words:JoinedWord[]){
		const z = this
		const sql = z.qrys.selectExistFromWord('_')
		const stmt = await z.db.prepare(sql)
		const existingWords = [] as JoinedWord[]
		const nonExistingWords = [] as JoinedWord[]
		for(const w of words){
			const param = [w.textWord.belong, w.textWord.text]
			const [runRes, ua] = await stmt.all<{_:int}>(param)
			if(ua[0]?._ === 1){ //exist
				existingWords.push(w)
			}else{
				nonExistingWords.push(w)
			}
		}
		return [existingWords, nonExistingWords]
	}

	async getAllJoinedRow(){
		const z = this
		const allIdSql = z.qrys.getAllWordId('_')
		const [,allId] = await z.db.all<{_:int}>(allIdSql)
		const seekRowFn = await z.fn_seekJoinedRowById()
		const ans = [] as JoinedRow[]
		for(const id of allId){
			const ua = await seekRowFn(id._)
			if(ua != null){
				ans.push(ua)
			}
		}
		return ans
	}


	/**
	 * 加詞、能防褈添
	 * 用于 從txt詞表中取(無Learnˉ屬性 之 諸JoinedWordᵘ)後再添厥入庫
	 * @param words 
	 * @returns 
	 */
	async addWordsDistinctProperty(words:JoinedWord[]){
		const z = this
		const [duplicateNeoWords, nonExistWords] = await z.classifyWordsByIsExist(words)
		const add = await z.fn_addJoinedRows()
		const seekById = await z.fn_seekJoinedRowById()
		/** 㕥存 未加過之prop */
		const diffPropertys = [] as Objs.Property[]
		for(const neo of duplicateNeoWords){ //遍歷 待加之褈複詞
			const oldRow = await seekById(neo.textWord.id)
			if(oldRow == null){
				throw new Error(`oldRow == null\nthis should have been in db`) // duplicateNeoWords 當潙 既存于數據庫之詞
			}
			const oldJw = JoinedWord.new(oldRow)
			const ua = JoinedWord.diffProperty(oldJw, neo)
			diffPropertys.push(...ua)
		}
		
		const addPr = await z.qrys.fn_addPropertyRow(z.db)
		await add(nonExistWords.map(e=>e.toRow()))
		for(const e of diffPropertys){
			await addPr(e.toRow())
		}
		return true
	}

	async fn_seekJoinedRowById(){
		const z = this
		const sqlTw = z.qrys.selectTextWordById()
		const stmtTw = await z.db.prepare(sqlTw)
		const sqlPr = z.qrys.selectPropertysByWid()
		const stmtPr = await z.db.prepare(sqlPr)
		const sqlLe = z.qrys.selectLearnsByWid()
		const stmtLe = await z.db.prepare(sqlLe)

		// if(textW){}
		const fn = async(id:int|str)=>{
			const [,textWords] = await stmtTw.all<Rows.WordRow>([id])
			if(textWords.length === 0){
				return null
			}
			if(textWords.length !== 1){
				throw new Error(`${JSON.stringify(textWords)}\ntextWords.length !== 1`)
			}

			const textWord = textWords[0]
			const [,propertys] = await stmtPr.all<Rows.PropertyRow>([id])
			const [,learns] = await stmtLe.all<Rows.LearnRow>([id])
			const jRow = JoinedRow.new({
				word: textWord
				,propertys: propertys
				,learns: learns
			})
			return jRow
		}
		return fn
	}

}



/* 

我有一個單詞管理系統、有兩個表、一個是單詞表(word):
id(數字自增主鍵), text, createdTime, modifiedTime

還有一個屬性表

id(數字自增主鍵), belong, wid(外鍵,引用word表的id), text, createdTime, modifiedTime

一個單詞可以有多個屬性(property)。
如
單詞: {id:1, text:'watch'}
可以有:
{id:1, belong:'mean', wid:1, text: '觀看'}
,{id:2, belong:'mean', wid:1, text: '手錶'}

現在我 需要將一個單詞插入數據庫。但是property中wid必須引用word的id、但是word的id是插入進數據庫之後纔給分配的。
有沒有辦法改進? 或者重新設計數據庫架構
*/