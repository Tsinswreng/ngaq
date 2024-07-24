import type { I__, InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Common'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import { JoinedRow } from '@shared/model/word/JoinedRow'
import { JoinedWord } from '@shared/model/word/JoinedWord'
import * as Row from '@shared/model/word/NgaqRows'
import * as Mod from '@shared/model/word/NgaqModels'
import Tempus from '@shared/Tempus'


const ObjSql = SqliteUtil.Sql.obj

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>
type Id_t = int|str
type AddInstOpt = Parameters<typeof ObjSql.new>[1]
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

	async Fn_addInst(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const emptyRow = tbl.factory.emptyRow
		const objsql = ObjSql.new(emptyRow, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const ans = async(inst:InstanceType_<FactT['Inst']>)=>{
			const row = inst.toRow()
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}

	async Fn_addRow(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const emptyRow = tbl.factory.emptyRow
		const objsql = ObjSql.new(emptyRow, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const ans = async(row:InstanceType_<FactT['Row']>)=>{
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}

	/**
	 * 運行旹判斷 是row抑inst
	 * @param db 
	 * @param opt 
	 * @returns 
	 */
	async Fn_add(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const emptyRow = tbl.factory.emptyRow
		const objsql = ObjSql.new(emptyRow, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const ans = async(
			target:InstanceType_<FactT['Row']>
				|InstanceType_<FactT['Inst']>
		)=>{
			let row:InstanceType_<FactT['Row']>
			if(target instanceof Mod.BaseInst){
				row = target.toRow()
			}else{
				row = target
			}
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
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


export class SchemaItem extends SqliteUtil.SqliteMaster{
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

	static new(name:str, type:SqliteUtil.SqliteMasterType.table):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str){
		const z = new this()
		z.__init__(name, type, tbl_name)
		return z
	}

	get This(){return SchemaItem}
}

class Trigger<Tbl_t extends Tbl<any>> extends SchemaItem{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof Trigger.new>){
		const z = this
		const name = args[0]
		const tbl = args[1]
		super.__init__(name, SqliteUtil.SqliteMasterType.trigger, tbl.name)
		return z
	}

	static new<Tbl_t extends Tbl<any>>(
		name:str
		,tbl:Tbl_t
	){
		const z = new this<Tbl_t>()
		z.__init__(name, tbl)
		return z
	}

	//@ts-ignore
	get This(){return Trigger}

	protected _tbl:Tbl_t
	get tbl(){return this._tbl}
	protected set tbl(v){this._tbl = v}
	
}

export class Index extends SchemaItem{
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
//const SI = SchemaItem.new.bind(SchemaItem)
const TRIG = Trigger.new.bind(Trigger)
const SMT = SqliteUtil.SqliteMasterType

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

	trig_aftIns_learnAltWordMt = TRIG('aftIns_learnAltWordMt', tbls.learn)
	trig_aftIns_propertyAltWordMt = TRIG('aftIns_propertyAltWordMt', tbls.property)
	trig_aftUpd_propertyAltWordMt = TRIG('aftUpd_propertyAltWordMt', tbls.property)
}

const schemaItems = new SchemaItems()

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
		const sqlObjPr = SqliteUtil.Sql.obj.new(new Row.Property())
		const stmtPr = await db.Prepare(
			sqlObjPr.geneFullInsertSql(z.tbls.property.name)
		)
		return async(e:Row.Property)=>{
			return await stmtPr.Run(sqlObjPr.getParams(e))
		}
	}

	async fn_addLearnRow(db:SqliteDb){
		const z = this
		const sqlObjPr = SqliteUtil.Sql.obj.new(new Row.Learn())
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

	static tbls = tbls
	static schemaItems = schemaItems

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}
	

	protected _schemaItems = schemaItems
	get schemaItems(){return this._schemaItems}
	protected set schemaItems(v){this._schemaItems = v}

	// protected _initSql = InitSql.new()
	// get initSql(){return this._initSql}
	// protected set initSql(v){this._initSql = v}

	protected _qrys:Qrys = Qrys.new()
	get qrys(){return this._qrys}
	set qrys(v){this._qrys = v}

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	async GetFn_addInst<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const ans = await tbl.Fn_addInst(z.db, opt)
		return ans as ReturnType<T['Fn_addInst']>
	}

	async GetFn_addRow<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const ans = await tbl.Fn_addRow(z.db, opt)
		return ans as ReturnType<T['Fn_addRow']>
	}


	async GetFn_add<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const Fn = await tbl.Fn_add(z.db, opt)
		return Fn as ReturnType<T['Fn_add']>
	}
	

	//TODO 褈構
	async Fn_AddJoinedRows(){
		const z = this
		const si = z.schemaItems
		const tbls = z.tbls
		const db = z.db
		const SqlObj = SqliteUtil.Sql.obj
		
		//const wordSqlObj = SqliteUitl.Sql.obj.new(rowFirst.word, {ignoredKeys: [Rows.WordRow.col.id]})
		const wordSqlObj = SqliteUtil.Sql.obj.new(new Row.TextWord(), {ignoredKeys: [tbls.textWord.col.id]})
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

	async Fn_ClassifyWordsByIsExist(){
		const z = this
		const sql = z.qrys.selectExistFromWord('_')
		const stmt = await z.db.Prepare(sql)

		const fn = async(words:JoinedWord[])=>{
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
		return fn
	}

	async GetAllJoinedRow(){
		const z = this
		const allIdSql = z.qrys.getAllWordId('_')
		const [,allId] = await z.db.All<{_:int}>(allIdSql)
		const SeekRowFn = await z.Fn_SeekJoinedRowById()
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
	async Fn_AddWordsDistinctProperty(words:JoinedWord[]){
		const z = this

		const ClassifyWordsByIsExist = await z.Fn_ClassifyWordsByIsExist()
		const AddJRows = await z.Fn_AddJoinedRows()
		const SeekById = await z.Fn_SeekJoinedRowById()
		const SeekByText = await z.Fn_SeekJoinedRowBy(z.tbls.textWord.col.text)
		const AddPr = await z.GetFn_addRow(e=>e.property)

		const Fn = async()=>{
			/** 㕥存 未加過之prop */
			const diffPropertys = [] as Mod.Property[]
			const [duplicateNeoWords, nonExistWords] = await ClassifyWordsByIsExist(words)
			for(const neo of duplicateNeoWords){ //遍歷 待加之褈複詞
				//const oldRow = await seekById(neo.textWord.id)
				const exsistingJoinedRows = await SeekByText(neo.textWord.text)
				const oldRow = exsistingJoinedRows[0]
				if(oldRow == void 0){
					throw new Error(`oldRow == null\nthis should have been in db`) // duplicateNeoWords 當潙 既存于數據庫之詞
				}
				const oldJw = JoinedWord.fromRow(oldRow)
				const ua = JoinedWord.diffProperty(neo, oldJw)
				diffPropertys.push(...ua)
			}
			
			//const addPr = await z.qrys.fn_addPropertyRow(z.db)
			
			await AddJRows(nonExistWords.map(e=>e.toRow()))
			for(const e of diffPropertys){
				await AddPr(e.toRow())
			}
			return true
		}
		return Fn
	}


	async Fn_SeekJoinedRowById(){
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
	async Fn_SeekJoinedRowBy(col:str){
		const z = this
		const tbls = z.tbls
		const tbl = tbls.textWord
		const seekById = await z.Fn_SeekJoinedRowById()
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

	/**
	 * 尋 最晚近ʹ 學ʹ記錄
	 * @returns 
	 */
	async Fn_SeekLatestLearnByWid(){
		const z = this
		const tbl = z.tbls.learn
		const sql = 
`SELECT *, MAX(${tbl.col.ct}) AS _
FROM ${tbl.name}
WHERE ${tbl.col.wid}=?`

		const stmt = await z.db.Prepare(sql)
		const Fn = async(wid:Id_t)=>{
			const pair = await stmt.All<Row.Learn & I__<int>>([wid])
			const ans = QryAns.fromPair(pair)
			return ans
		}
		return Fn
	}

	/**
	 * 確保 新加入ʹlearnˋ最新
	 * @returns 
	 */
	async Fn_AddValidLearnRows(){
		const z = this
		const SeekLatestLearn = await z.Fn_SeekLatestLearnByWid()
		const AddLearn = await z.GetFn_add(e=>e.learn)
		const Fn = async(learn:(Row.Learn))=>{
			const latestLearnAns = await SeekLatestLearn(learn.wid)
			const latestLearn = $(latestLearnAns.data[0])
			if(latestLearn.ct >= learn.ct){
				return
			}
			const ans = await AddLearn(learn)
			return ans
		}
		return Fn
	}

	// /**
	//  * @noUsage
	//  */
	// async Fn_addLearnRecords(){
	// 	const z = this
	// 	const tbl = z.tbls.learn
	// 	const objSql = ObjSql.new(tbl.emptyRow)
	// 	const sql = objSql.geneFullInsertSql(tbl.name)
	// 	const stmt = await z.db.Prepare(sql)

	// 	const Fn = async(rows:Row.Learn[])=>{
	// 		const ans = [] as RunResult[]
	// 		for(const row of rows){
	// 			const params = objSql.getParams(row)
	// 			const ua = await stmt.Run(params)
	// 			ans.push(ua)
	// 		}
	// 		return ans
	// 	}
	// 	return Fn
	// }


}
