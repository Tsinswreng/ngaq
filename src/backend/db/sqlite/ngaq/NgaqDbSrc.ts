import type { I__, InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Common'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import type * as Sqlite from '@backend/sqlite/Sqlite'

import { JoinedRow } from '@shared/model/word/JoinedRow'
import { JoinedWord } from '@shared/model/word/JoinedWord'
import * as Row from '@shared/model/word/NgaqRows'
import * as Mod from '@shared/model/word/NgaqModels'
import Tempus from '@shared/Tempus'
import { AddInstOpt } from '../dbFrame/Tbl'
import { Tbl } from '../dbFrame/Tbl'
type Id_t = int|str
const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>

import { Tbls } from './NgaqDbStuff'
const tbls = Tbls.inst

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
	//static schemaItems = schemaItems

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}
	

	// protected _schemaItems = schemaItems
	// get schemaItems(){return this._schemaItems}
	// protected set schemaItems(v){this._schemaItems = v}

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
		const ans = await tbl.Fn_AddInst(z.db, opt)
		return ans as ReturnType<T['Fn_AddInst']>
	}

	async GetFn_addRow<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const ans = await tbl.Fn_AddRow(z.db, opt)
		return ans as ReturnType<T['Fn_AddRow']>
	}


	async GetFn_Add<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const Fn = await tbl.Fn_Add(z.db, opt)
		return Fn as ReturnType<T['Fn_Add']>
	}

	/**
	 * 
	 * @returns textWordʹQryAns
	 */
	async Fn_AddJoined(){
		const z = this
		const AddTextWord = await z.GetFn_Add(e=>e.textWord)
		const AddLearn = await z.GetFn_Add(e=>e.learn)
		const AddProperty = await z.GetFn_Add(e=>e.property)

		const Fn = async(joined:JoinedWord|JoinedRow)=>{
			const twAns = await AddTextWord(joined.textWord)
			const wid = $(twAns.lastId, 'tw.lastId')
			for(const pr of joined.propertys){
				pr.wid = wid
				await AddProperty(pr)
			}
			for(const le of joined.learns){
				le.wid = wid
				await AddLearn(le)
			}
			return twAns
		}
		return Fn
	}


	

	async Fn_IsWordExist(){
		const z = this
		const c = z.tbls.textWord.col
		const sql = 
`SELECT EXISTS(
	SELECT * FROM ${z.tbls.textWord.name} 
	WHERE ${c.text} = ? AND ${c.belong} = ?
) AS "_"`
		
		const stmt = await z.db.Prepare(sql)
		const Fn = async(word:Mod.TextWord)=>{
			const param = [word.text, word.belong]
			const [,got] = await stmt.All<I__<int>>(param)
			if(got[0]?._ === 0){
				return false
			}
			return true
		}
		return Fn
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

		/* 
Tempus__WordIf.I_WordFromTxt
先看待添ʹtextWord
const gotOldWord = seekTextWordByWordText()
if(newTextWord.ct = gotOldWord.ct){
	捨; return
}
到此亦不可直ᵈ添textWord
word一旦添入、則ct不變
褈添(添芝將致times_addˋ增者)旹、新詞ʹct不同於舊ᐪ



declare new is 待添ʹproperty
SELECT * FROM property
where ct = new.ct
AND wid->textWord.text = newʹtextWord.text;
若尋不見則直添新ʹproperty
否則不添

		*/

	/**
	 * 用于 從txt詞表中取(無Learnˉ屬性 之 諸JoinedWordᵘ)後再添厥入庫
	 * 成功則自動添一Learn(belong=add)
	 * @returns Task:[initAddAns, duplicatedWordPropAddAns] as [QryAns<any>[], QryAns<any>[]]
	 */
	async Fn_AddWordsFromTxt(){
		const z = this
		//let c = z.tbls.textWord.col
// 		const seek_textWord_by_text_ct_belong = await z.db.Prepare(
// `SELECT * FROM ${z.tbls.textWord.name}
// WHERE ${c.text}=? AND ${c.ct}=? AND ${c.belong}=?`
// 		)
		//const AddTextWord = await z.GetFn_Add(e=>e.textWord)
		//const IsExist = await z.Fn_IsWordExist()
		const SeekJoinedRowByTextEtBelong = await z.Fn_SeekJoinedRowByTextEtBelong()
		const AddJ = await z.Fn_AddJoined()
		const AddLearn = await z.GetFn_Add(e=>e.learn)
		const AddProp = await z.GetFn_Add(e=>e.property)
		
		const Fn = async(words:JoinedWord[])=>{
			const initAddAns = [] as QryAns<any>[]
			const duplicatedWordPropAddAns = [] as QryAns<any>[]
			for(const word of words){
				const tw = word.textWord.toRow()
				const got = await SeekJoinedRowByTextEtBelong(tw.text, tw.belong)
				if(got.length === 0){ //表中無此詞則直ᵈ添
					const twAns = await AddJ(word)
					const learn = Mod.Learn.new({
						id: NaN
						,wid: $(twAns.lastId)
						,ct: word.textWord.ct
						,mt: word.textWord.mt
						,belong: Row.LearnBelong.add
					})
					await AddLearn(learn)
					initAddAns.push(twAns)
					continue
				}

//表中既有此詞>
				//取差集 得 未添過之prop
				const propToAdd = JoinedWord.diffProperty(word, JoinedWord.fromRow(got[0]))
				let hasAddedProp = false
				const oldWordId = $(got[0]?.textWord?.id)
				for(const neoProp of propToAdd){
					hasAddedProp = true
					neoProp.wid = oldWordId
					const ua = await AddProp(neoProp.toRow())
					duplicatedWordPropAddAns.push(ua)
				}
				if(hasAddedProp){
					const learn = Mod.Learn.new({
						id: NaN
						,wid: oldWordId
						,ct: word.textWord.ct
						,mt: word.textWord.mt
						,belong: Row.LearnBelong.add
					})
					await AddLearn(learn)
				}
			} //~for(const word of words)
			return [initAddAns, duplicatedWordPropAddAns] as [QryAns<any>[], QryAns<any>[]]
		}
		return Fn
	}





	/**
	 * 
	 */
	async Fn_SeekJoinedRowById(){
		const z = this
		const sqlTw = z.qrys.selectTextWordById()
		const stmtTw = await z.db.Prepare(sqlTw)
		const sqlPr = z.qrys.selectPropertysByWid()
		const stmtPr = await z.db.Prepare(sqlPr)
		const sqlLe = z.qrys.selectLearnsByWid()
		const stmtLe = await z.db.Prepare(sqlLe)

		const Fn = async(id:int|str)=>{
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
				textWord: textWord
				,propertys: propertys
				,learns: learns
			})
			return jRow
		}
		return Fn
	}

	async Fn_SeekJoinedRowByTextEtBelong(){
		const z = this
		const tbl = z.tbls.textWord
		const SeekJoinedRowById = await z.Fn_SeekJoinedRowById()
		const sql = 
`SELECT ${tbl.col.id} FROM ${tbl.name}
WHERE ${tbl.col.text}=? AND ${tbl.col.belong}=?`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(text:str, belong:str)=>{
			const [, gotWords] = await stmt.All<Row.TextWord>([text, belong])
			const ans = [] as JoinedRow[]
			for(const word of gotWords){
				const id = word.id
				const ua = await SeekJoinedRowById(id)
				if(ua != null){
					ans.push(ua)
				}
			}
			return ans
		}
		return Fn
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
	 * 只用于rmb與fgt
	 * @returns 
	 */
	async Fn_AddValidLearnRows(){
		const z = this
		const SeekLatestLearn = await z.Fn_SeekLatestLearnByWid()
		const AddLearn = await z.GetFn_Add(e=>e.learn)
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

	/**
	 * !勿只刪textWord洏不刪他ʹ屬性
	 * @returns 
	 */
	protected async Fn_Del_textWordById(){
		const z = this
		const tbl = z.tbls.textWord
		const sql = `DELETE FROM ${tbl.name} WHERE ${tbl.col.id} = ?`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(id:Id_t)=>{
			const res = await stmt.Run([id])
			const ua = QryAns.fromRunResult(res)
			return ua
		}
		return Fn
	}

	/**
	 * 
	 * @param tbl 須有wid列
	 * @returns 
	 */
	protected async Fn_Del_by_wid(tbl:Tbl<any>){
		const z = this
		const widCol = $(tbl.col?.wid, `${tbl.name}\ndo not have wid col`)
		const sql = `DELETE FROM ${tbl.name} WHERE ${widCol} = ?`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(wid:Id_t)=>{
			const res = await stmt.Run([wid])
			const ua = QryAns.fromRunResult(res)
			return ua
		}
		return Fn
	}

	async Fn_Del_prop_by_Wid(){
		const z = this
		const DelProp = await z.Fn_Del_by_wid(z.tbls.property)
		return DelProp
	}

	async Fn_Del_learn_by_wid(){
		const z = this
		const DelLearn = await z.Fn_Del_by_wid(z.tbls.learn)
		return DelLearn
	}

	async Fn_Del_joined_by_wordId(){
		const z = this
		const DelTextWord = await z.Fn_Del_textWordById()
		const DelProp = await z.Fn_Del_prop_by_Wid()
		const DelLearn = await z.Fn_Del_learn_by_wid()

		const Fn = async(id:Id_t)=>{
			const ans = [] as QryAns<undef>[][]
			const ua2 = await DelProp(id)
			ans.push([ua2])
			const ua3 = await DelLearn(id)
			ans.push([ua3])
			const ua1 = await DelTextWord(id)
			ans.push([ua1])
			return ans
		}
		return Fn
	}



	/**
	 * WHERE ${unixMills} - ${tbl.col.ct} <= ?
	 */
	async Fn_Seek_recentLearnId(){
		const z = this
		const tbls = z.tbls
		const tbl = tbls.learn
		const unixMills = SqliteUtil.snippet.unixMills()
		const sql = 
`SELECT ${tbl.col.id} AS _ FROM ${tbl.name}
WHERE (${unixMills}) - ${tbl.col.ct} <= ?`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(mills:int|str)=>{
			const pair = await stmt.All<I__<int>>([mills])
			const ans = QryAns.fromPair(pair)
			return ans
		}
		return Fn
	}


	/**
	 * 
	 * WHERE ${sn.unixMills()} - ${tbl.col.ct} <= ?
	 * @returns 
	 */
	async Fn_Cnt_recentLearn(){
		const z = this
		const tbl = z.tbls.learn
		const sn = SqliteUtil.snippet
		const sql = 
`SELECT COUNT(*) AS _
FROM ${tbl.name}
WHERE (${sn.unixMills()}) - ${tbl.col.ct} <= ?`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(recentMills:int|str=1000*60*60*24)=>{
			const pair = await stmt.All<I__<int>>([recentMills])
			const ans = QryAns.fromPair(pair)
			return ans
		}
		return Fn
	}


	/**
	 * 
	 * WHERE ${sn.unixMills()} - ${tbl.col.ct} <= ?
	 * @returns 
	 */
	async Fn_Cnt_recentLearn_gb_learnBelong(){
		const z = this
		const tbl = z.tbls.learn
		const sn = SqliteUtil.snippet
		const sql = 
`SELECT ${tbl.col.belong}, COUNT(*) AS _
FROM ${tbl.name}
WHERE (${sn.unixMills()}) - ${tbl.col.ct} <= ?
GROUP BY ${tbl.col.belong}`
		const stmt = await z.db.Prepare(sql)
		const Fn = async(recentMills:int|str=1000*60*60*24)=>{
			const pair = await stmt.All<{
				[tbl.col.belong]:Row.LearnBelong
				,_:int
			}>([recentMills])
			const ans = QryAns.fromPair(pair)
			return ans
		}
		return Fn
	}

	/**
	 * 未嘗學ʹ詞
	 * @returns 
	 */
	async Fn_Cnt_unlearned(){
		const z = this
		const learnTbl = z.tbls.learn
		const textWordTbl = z.tbls.textWord
		const sql =
`SELECT ${textWordTbl.col.belong}, COUNT(*) AS _
FROM ${textWordTbl.name}
WHERE ${textWordTbl.col.id} NOT IN (
	SELECT ${learnTbl.col.wid} FROM ${learnTbl.name}
	WHERE ${learnTbl.col.belong} <> '${Row.LearnBelong.add}'
)
GROUP BY ${textWordTbl.col.belong}`
		const stmt = await z.db.Prepare(sql)
		const Fn = async()=>{
			const pair = await stmt.All<{
				[textWordTbl.col.belong]:Row.LearnBelong
				,_:int
			}>()
			const ans = QryAns.fromPair(pair)
			return ans
		}
		return Fn
	}


}



/**
 * @deprecated
 */
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

	// protected _schemaItems = schemaItems
	// get schemaItems(){return this._schemaItems}
	// protected set schemaItems(v){this._schemaItems = v}

	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	

	/**
	 * WHERE ${c.text} = ? AND ${c.belong} = ?
	 * @deprecated
	 * @returns 
	 */
	selectExistFromWord(colAlias='_'){
		const z = this
		const c = z.tbls.textWord.col
		const sql = 
`SELECT EXISTS(
	SELECT * FROM ${z.tbls.textWord.name} 
	WHERE ${c.text} = ? AND ${c.belong} = ?
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




/* 
查詢未學習的詞、按語言分組
O(learn表的记录数 + textWord表的记录数 * 子查询结果的记录数)
SELECT belong, COUNT(*) AS _
FROM textWord
WHERE id NOT IN (
	SELECT wid FROM learn
	WHERE learn.belong <> 'add'
)
GROUP BY belong

或
O(textWord表的记录数 * learn表的记录数 + textWord表的记录数)，简化为 O(textWord表的记录数 * learn表的记录数)。
SELECT tw.belong AS belong, COUNT(*) AS _
FROM textWord tw
LEFT JOIN learn l ON tw.id = l.wid AND l.belong <> 'add'
WHERE l.wid IS NULL
GROUP BY tw.belong

*/