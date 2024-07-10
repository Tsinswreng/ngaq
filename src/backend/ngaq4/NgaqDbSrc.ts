import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUitl from '@backend/sqlite/sqliteUitl'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import { JoinedRow } from '@shared/dbRow/JoinedRow'
import { JoinedWord } from '@shared/entities/Word/JoinedWord'
import * as Row from '@shared/dbRow/NgaqRows'
import * as Mod from '@shared/model/NgaqModels'


const ObjSql = SqliteUitl.Sql.obj

class Tbl<FactT extends Mod.BaseFactory<any, any>>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tbl.new>){
		const z = this
		z.name = args[0]
		//@ts-ignore
		z.factory = args[1]
		//z._col = z.factory.col
		//z._objSql = SqliteUitl.Sql.obj.new(new z.factory.Row())
		return z
	}

	static new<FactT>(name:str, factory:FactT){
		//@ts-ignore
		const z = new this<FactT>()
		z.__init__(name, factory)
		return z
	}

	//get This(){return Tbl}
	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}

	protected _factory:FactT
	get factory(){return this._factory}
	protected set factory(v){this._factory = v}
	
	//protected _col:FactT['col']
	get col():FactT['col']{
		return this.factory.col
	}

	get emptyRow(){
		return this.factory.emptyRow
	}
}
const TBL = Tbl.new.bind(Tbl)
class Tbls{
	textWord = TBL('textWord', Mod.TextWord)
	property = TBL('property', Mod.Property)
	learn = TBL('learn', Mod.Learn)
	relation = TBL('relation', Mod.Relation)
	wordRelation = TBL('wordRelation', Mod.WordRelation)
}
const tbls = new Tbls()


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

class Trigger extends SchemaItem{
	protected constructor(){super()}
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

class Index extends SchemaItem{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Index.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected _cols:str[]
	get cols(){return this._cols}
	set cols(v){this._cols = v}
	
	protected _tbl:Tbl<any>
	get tbl(){return this._tbl}
	set tbl(v){this._tbl = v}
	

	//get This(){return Index}
}
const SI = SchemaItem.new.bind(SchemaItem)
const SMT = SqliteUitl.SqliteMasterType

const IDX = <Fact>(
	name:str
	//@ts-ignore
	, tbl:Tbl<Fact>
	//@ts-ignore
	, fn: (e:Tbl<Fact>['col'])=>str[]
)=>{
	const ans = Index.new()
	ans.name = name
	ans.type = SMT.index
	ans.tbl = tbl
	ans.tbl_name = tbl.name
	ans.cols = fn(ans.tbl.col)
	//SI(name, SMT.index, tbl.name)
	return ans
}

class SchemaItems{
	//tbls=tbls
	idx_wordText = IDX('idx_wordText', tbls.textWord, c=>[c.text])
	idx_wordCt = IDX('idx_wordCt', tbls.textWord, c=>[c.ct])
	idx_wordMt = IDX('idx_wordMt', tbls.textWord, c=>[c.mt])
	idx_learnWid = IDX('idx_learnWid', tbls.learn, c=>[c.wid])
	idx_learnCt = IDX('idx_learnCt', tbls.learn, c=>[c.ct])
	//idx_learnMt = IDX('idx_learnMt', tbls.learn, c=>[c.mt])
	idx_propertyWid = IDX('idx_propertyWid', tbls.property, c=>[c.wid])

	trig_aftIns_learnAltWordMt = SI('aftIns_learnAltWordMt', SMT.trigger, tbls.learn.name)
	trig_aftIns_propertyAltWordMt = SI('aftIns_propertyAltWordMt', SMT.trigger, tbls.property.name)
	trig_aftUpd_propertyAltWordMt = SI('aftUpd_propertyAltWordMt', SMT.trigger, tbls.property.name)
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

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	

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

	getAllTrigSql(){
		const z = this
		const ans:str[] = [
			z.mkTrig_aftIns_learnAltWordMt()
			,z.mkTrig_aftIns_propertyAltWordMt()
			,z.mkTrig_aftUpd_propertyAltWordMt()
		]
		return ans
	}

	getAllIdxSql(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const keys = Object.keys(z.items)
		const ans = [] as str[]
		for(const k of keys){
			const cur = z.items[k]
			if(
				!(
					cur instanceof Index
					&& cur.type === SqliteUitl.SqliteMasterType.index
				)
			){
				continue
			}
			const sql = SqliteUitl.Sql.create.index(cur.tbl_name, cur.name, cur.cols, {checkExist: false})
			ans.push(sql)
		}
		return ans
	}

	mkTbl_word(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const tbl = z.tbls.textWord
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
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
		const tbl = z.tbls.learn
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.belong} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES ${z.tbls.textWord.name}(${z.tbls.textWord.col.id})
)`
		return ans
	}

	mkTbl_property(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const tbl = z.tbls.property
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.wid} INTEGER NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES ${z.tbls.textWord.name}(${z.tbls.textWord.col.id})
)`
		return ans
	}

	mkTbl_relation(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const tbl = z.tbls.relation
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
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
		const tbl = z.tbls.wordRelation
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.rid} INTEGER NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES "${z.tbls.textWord.name}"(${z.tbls.textWord.col.id})
	,FOREIGN KEY(${c.rid}) REFERENCES "${z.tbls.textWord.name}"(${z.tbls.relation.col.id})
)`
		return ans
	}

	

	mkTrig_aftIns_learnAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const trig = z.items.trig_aftIns_learnAltWordMt
		const c = z.tbls.learn.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tbls.wordRelation.name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}

	mkTrig_aftIns_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftIns_propertyAltWordMt
		const c = z.tbls.textWord.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tbls.textWord.name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}

	mkTrig_aftUpd_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUitl.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftUpd_propertyAltWordMt
		const c = z.tbls.textWord.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER UPDATE ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tbls.textWord.name} SET ${c.mt} = NEW.${c.mt};
END;
`
		return ans
	}
}

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

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	

	/**
	 * WHERE ${c.belong} = ? AND ${c.text} = ?
	 * @returns 
	 */
	selectExistFromWord(colAlias='_'){
		const z = this
		const c = z.tbls.textWord.col
		const sql = 
`SELECT EXISTS(
	SELECT * FROM ${z.tbls.textWord.name} 
	WHERE ${c.belong} = ? AND ${c.text} = ?
) AS "${colAlias}"`

		return sql
	}

	selectTextWordById(){
		const z = this
		//const items = z.schemaItems
		//const c = Rows.WordRow.col
		const tbl = z.tbls.textWord
		const sql = 
`SELECT * FROM ${tbl.name} WHERE ${tbl.col.id} = ?`
		return sql
	}

	selectPropertysByWid(){
		const z = this
		//const items = z.schemaItems
		//const c = Rows.PropertyRow.col
		
		const sql = 
`SELECT * FROM ${z.tbls.property.name} WHERE ${z.tbls.property.col.wid} = ?`
		return sql
	}

	selectLearnsByWid(){
		const z = this
		const tbl = z.tbls.learn
		const sql = 
`SELECT * FROM ${tbl.name} WHERE ${tbl.col.wid} = ?`
		return sql
	}

	async fn_addPropertyRow(db:SqliteDb){
		const z = this
		const sqlObjPr = SqliteUitl.Sql.obj.new(new Row.Property())
		const stmtPr = await db.Prepare(
			sqlObjPr.geneFullInsertSql(z.tbls.property.name)
		)
		return async(e:Row.Property)=>{
			return await stmtPr.Run(sqlObjPr.getParams(e))
		}
	}

	async fn_addLearnRow(db:SqliteDb){
		const z = this
		const sqlObjPr = SqliteUitl.Sql.obj.new(new Row.Learn())
		const stmtPr = await db.Prepare(
			sqlObjPr.geneFullInsertSql(z.tbls.learn.name)
		)
		return async(e:Row.Learn)=>{
			return await stmtPr.Run(sqlObjPr.getParams(e))
		}
	}


	getAllWordId(colAlias='_'){
		const z = this
		const tbl = z.tbls.textWord
		const ans = 
`SELECT ${tbl.col.id} AS "${colAlias}" FROM ${tbl.name}`
		return ans
	}


}


export class NgaqDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof NgaqDbSrc.new>){
		const z = this
		z._db = args[0]
		//z.injectDb()
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

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	
	
	async Init(){
		const z = this
		const sqls = z.initSql.getAllMkTblSql()
		await z.db.BeginTrans()
		for(const sql of sqls){
			await z.db.Run(sql)
		}

		const sqlsIdx = z.initSql.getAllIdxSql()
		for(const sql of sqlsIdx){
			await z.db.Run(sql)
		}

		const sqlTrig = z.initSql.getAllTrigSql()
		for(const sql of sqlTrig){
			await z.db.Run(sql)
		}
		await z.db.Commit()
		return true
	}


	async Fn_addJoinedRows(){
		const z = this
		const si = z.schemaItems
		const tbls = z.tbls
		const db = z.db
		const SqlObj = SqliteUitl.Sql.obj
		
		//const wordSqlObj = SqliteUitl.Sql.obj.new(rowFirst.word, {ignoredKeys: [Rows.WordRow.col.id]})
		const wordSqlObj = SqliteUitl.Sql.obj.new(new Row.TextWord(), {ignoredKeys: [tbls.textWord.col.id]})
		const wordSql = wordSqlObj.geneFullInsertSql(tbls.textWord.name)
		const wordStmt = await db.Prepare(wordSql)
		
		const learnSqlObj = SqlObj.new((new Row.Learn()))
		const learnSql = learnSqlObj.geneFullInsertSql(tbls.learn.name)
		const learnStmt = await db.Prepare(learnSql)

		const propSqlObj = SqlObj.new((new Row.Property()))
		const propSql = propSqlObj.geneFullInsertSql(tbls.property.name)
		const propStmt = await db.Prepare(propSql)

		
		const fn = async(rows:JoinedRow[])=>{
			for(let i = 0; i < rows.length; i++){
				const jr = rows[i]
				const res = await wordStmt.Run(wordSqlObj.getParams(jr.word))
				const lastId = res.lastID
				for(let j = 0; j < jr.learns.length; j++){
					jr.learns[j].wid = lastId
					await learnStmt.Run(learnSqlObj.getParams(jr.learns[j]))
				}
				for(let j = 0; j < jr.propertys.length; j++){
					jr.propertys[j].wid = lastId
					const cur = jr.propertys[j]
					await propStmt.Run(propSqlObj.getParams(jr.propertys[j]))
				}
			}
		}
		return fn
	}

	/**
	 * 
	 * @param words 
	 * @returns return [existingWords, nonExistingWords]
	 */
	async ClassifyWordsByIsExist(words:JoinedWord[]){
		const z = this
		const sql = z.qrys.selectExistFromWord('_')
		const stmt = await z.db.Prepare(sql)
		const existingWords = [] as JoinedWord[]
		const nonExistingWords = [] as JoinedWord[]
		for(const w of words){
			const param = [w.textWord.belong, w.textWord.text]
			const [runRes, ua] = await stmt.All<{_:int}>(param)
			if(ua[0]?._ === 1){ //exist
				existingWords.push(w)
			}else{
				nonExistingWords.push(w)
			}
		}
		return [existingWords, nonExistingWords]
	}

	async GetAllJoinedRow(){
		const z = this
		const allIdSql = z.qrys.getAllWordId('_')
		const [,allId] = await z.db.All<{_:int}>(allIdSql)
		const SeekRowFn = await z.Fn_seekJoinedRowById()
		const ans = [] as JoinedRow[]
		for(const id of allId){
			const ua = await SeekRowFn(id._)
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
	 * //TODO
	 */
	async AddWordsDistinctProperty(words:JoinedWord[]){
		const z = this
		const [duplicateNeoWords, nonExistWords] = await z.ClassifyWordsByIsExist(words)
		const add = await z.Fn_addJoinedRows()
		const seekById = await z.Fn_seekJoinedRowById()
		const seekByText = await z.Fn_seekJoinedRowBy(z.tbls.textWord.col.text)
		/** 㕥存 未加過之prop */
		const diffPropertys = [] as Mod.Property[]
		for(const neo of duplicateNeoWords){ //遍歷 待加之褈複詞
			//const oldRow = await seekById(neo.textWord.id)
			const got = await seekByText(neo.textWord.text)
			const oldRow = got[0]
			if(oldRow == void 0){
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


	async Fn_seekJoinedRowById(){
		const z = this
		const sqlTw = z.qrys.selectTextWordById()
		const stmtTw = await z.db.Prepare(sqlTw)
		const sqlPr = z.qrys.selectPropertysByWid()
		const stmtPr = await z.db.Prepare(sqlPr)
		const sqlLe = z.qrys.selectLearnsByWid()
		const stmtLe = await z.db.Prepare(sqlLe)

		const fn = async(id:int|str)=>{
			const [,textWords] = await stmtTw.All<Row.TextWord>([id])
			if(textWords.length === 0){
				return null
			}
			if(textWords.length !== 1){
				throw new Error(`${JSON.stringify(textWords)}\ntextWords.length !== 1`)
			}

			const textWord = textWords[0]
			const [,propertys] = await stmtPr.All<Row.Property>([id])
			const [,learns] = await stmtLe.All<Row.Learn>([id])
			const jRow = JoinedRow.new({
				word: textWord
				,propertys: propertys
				,learns: learns
			})
			return jRow
		}
		return fn
	}

	/**
	 * WHERE ${col}=?
	 * @returns fn: (val: str) => Promise<JoinedRow[]>
	 */
	async Fn_seekJoinedRowBy(col:str){
		const z = this
		const tbls = z.tbls
		const tbl = tbls.textWord
		const seekById = await z.Fn_seekJoinedRowById()
		const sql = `SELECT ${tbl.col.id} FROM ${tbl.name} WHERE ${col}=?`
		const stmt = await z.db.Prepare(sql)
		const fn = async(val:str)=>{
			const [, gotWords] = await stmt.All<Row.TextWord>([val])
			const ans = [] as JoinedRow[]
			for(const word of gotWords){
				const id = word.id
				const ua = await seekById(id)
				if(ua != null){
					ans.push(ua)
				}
			}
			return ans
		}
		return fn
	}

	async Fn_addLearnRecords(){
		const z = this
		const tbl = z.tbls.learn
		const objSql = ObjSql.new(tbl.emptyRow)
		const sql = objSql.geneFullInsertSql(tbl.name)
		const stmt = await z.db.Prepare(sql)

		const Fn = async(rows:Row.Learn[])=>{
			const ans = [] as RunResult[]
			for(const row of rows){
				const params = objSql.getParams(row)
				const ua = await stmt.Run(params)
				ans.push(ua)
			}
			return ans
		}
		return Fn
	}

}
