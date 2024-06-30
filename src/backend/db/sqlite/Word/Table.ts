/** @deprecated */
import { $, $a} from "@shared/Ut";
import { Abs_Table } from "../_base/Table";
import { RunResult } from "sqlite3";
import { WordDbRow } from "@shared/dbRow/Word";
import { Word } from "@shared/entities/Word/Word";
import Sqlite, {SqliteType} from "@backend/db/Sqlite";
import lodash from 'lodash'
import { I_DbSrc } from "../_base/DbSrc";

/* 
learnByIndex,0,r
*/

type Database = SqliteType.Database
export class WordTable extends Abs_Table{

	protected constructor(){
		super()
	}

	static new(...params:Parameters<typeof Abs_Table.new>){

		const o = new this()
		o.__init__(...params)
		return o
	}

	protected override __init__(props: { _dbSrc: I_DbSrc; _tableName: string; }): void {
		super.__init__(props)
	}
	/* addRecords_fn(objs: WordDbRow[]|Word[]){
		if(objs.length === 0){
			return Promise.resolve([])
		}
		if( $(objs[1]) instanceof Word ){
			return _WordTable.addWordsOfSameTable_fn(this.dbSrc.db, objs as Word[])
		}
		
	} */

	get This(){return WordTable}

	/**
	 * 數據庫ʸ原ᵈ無ᵗ詞ˇ添入庫
	 * @param db 
	 * @param table 
	 * @param word 
	 */
	private static initAddWord(db:Database, table:string, word:Word):Promise<RunResult[]>
	private static initAddWord(db:Database, table:string, word:Word[]):Promise<RunResult[]>
	private static async initAddWord(db:Database, table:string, word:Word|Word[]){
		let w:Word[]
		if(Array.isArray(word)){
			w = word
		}else{
			w = [word]
		}
		WordTable.checkTable(table, w)
		//let [r, runResult] = await forArr(db, table, w)
		const forArr2=async(db:Database, table:string, words:Word[])=>{
			const [sql,] = WordTable.genQry_insert(table, words[0])
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			runResult.length = words.length
			//let lastRunResut
			for(let i = 0; i < words.length; i++){
				const w = words[i]
				const [sql, value] = WordTable.genQry_insert(table, w)
				const r = await Sqlite.stmtRun(stmt, value)
				const copyR:RunResult = lodash.cloneDeep(r)//每次循環 r所指ᵗ地址ˋ皆不變、唯其所指ᵗ數據ˋ變˪
				// runResult.push(r)
				runResult[i] = copyR
				//lastRunResut = r
			}
			return runResult
		}

		const fn = async()=>{
			return forArr2(db, table, w)
		}

		const runResult:RunResult[] = await fn() //await Sqlite.transaction(db, fn)
		return runResult
	}

	/**
	 * 檢ᵣ詞ᵗ數組ᵗtable屬性
	 * @param table 
	 * @param words 
	 */
	static checkTable(table:string, words:Word[]){
		for(const w of words){
			if(w.belong !== table){
				throw new Error(`w.table !== table\n${w.wordShape}\t${w.belong}`)
			}
		}
	}

	/**
	 * 由詞ˉ對象生成 增ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @returns 
	 */
	static genQry_insert(table: string, word:Word){
		WordTable.checkTable(table, [word])
		const c = WordDbRow
		const obj = Word.toDbObj($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.genQry_insert(table, obj)
	}

		/**
	 * 由詞ˉ對象生成 改ᵗsql語句。
	 * 緣需複製值ⁿ得IVocaRow對象、故形參ᵘ擇SingleWord2。
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	static genQry_updateById(table: string, word:Word,id: number){
		WordTable.checkTable(table, [word])
		const c = WordDbRow
		const obj = Word.toDbObj($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.genQry_updateById(table, obj, id)
	}

	/**
	 * 數據庫ʰ既複習ᵗ單詞ˇ批量ᵈ依表名ⁿ存。此函數不可用于初添。
	 * @param db 
	 * @param sws 
	 * @param table 
	 * @returns //TODO
	 */
	static async saveWords(db:Database, sws:Word[]){
		const tableToWordsMap = Word.classify(sws)
		//const prms:Promise<number[][]>[] = []
		const ans:number[][][] = []
		for(const [table, words] of tableToWordsMap){
			const fn = await this.addWordsOfSameTable_fn(db, words)
			const pr = await Sqlite.transaction(db, fn)
			//prms.push(pr)
			ans.push(pr)
		}
		return ans
	}

	/**
	 * 批量ᵈ由id蔿行重設詞。
	 * 緣 取sql語句之函數 需傳SingleWord2故形參擇此。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @param ids 
	 * @returns 
	 */
	static setWordsByIds_fn(db:Database, table:string, words:Word[], ids?:number[]){
		//if(words.length === 0){throw new Error(`words.length === 0`)}
		
		WordTable.checkTable(table, words)
		$a(words)
		if(ids === void 0){
			ids = []
			for(const w of words){
				ids.push($(w.id))
			}
		}
		if(words.length !== ids.length){
			throw new Error(`words.length !== ids.length`)
		}

		const sql = WordTable.genQry_updateById(table, $(words[0],'words[0]'), ids[0])[0]

		const fn = async()=>{
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			for(let i = 0; i < words.length; i++){
				let w = words[i]; let id = $(ids)[i]
				let [,v] = WordTable.genQry_updateById(table, w, id)
				const r = await Sqlite.stmtRun(stmt, v)
				runResult.push(r)
			}
			return runResult
		}
		//return Sqlite.transaction(db, fn)
		return fn
	}


	/**
	 * 添詞、@param words 之各ᵗ表名ˋ當皆同、否則報錯
	 * 内含transaction
	 * @param db 
	 * @param words 
	 * @returns [initAddIds, modifiedIds]
	 */
	static async addWordsOfSameTable_fn(db:Database, words:Word[]){
		$a(words)
		
		//const tableToWordsMap = SingleWord2.classify(words)
		const table0 = $(words[0].belong)
		WordTable.checkTable(table0, words)
		const fn = async()=>{
			return await addWordsOfSameTable(db, table0, words)
		}
		return fn
		

		async function addWordsOfSameTable(db:Database, table:string, words:Word[]){
			words = words.map(e=>Word.intersect(e,e))//<坑>{舊版數據庫中 詞義ˉ數組蜮有重複元素、而SingleWord.intersect()合併單詞旹不會產重複元素。故初添前亦先除重}
			
			//const neoIds:number[] = []
			const neoWord_existedWordMap = await getNeoWord_existedWordMap(db, table, words)
			const [wordsToInitAdd, wordsToUpdate] = getWordsToAdd(neoWord_existedWordMap)//<坑>{記得判空、蜮得空數組}
			let runResult1: RunResult[] = []
			
			
			if(wordsToInitAdd.length !== 0){
				
				//let d3 = await VocaSqlite.initAddWord_deprecated(db, table, wordsToInitAdd)
				//runResult1 = d3.flat(2)
				const fn = async()=>{
					return await WordTable.initAddWord(db, table, wordsToInitAdd)
				}
				//runResult1 = await Sqlite.transaction(db, fn)
				runResult1 = await fn()
			}
			if(wordsToUpdate.length !== 0){
				const fn = WordTable.setWordsByIds_fn(db, table, (wordsToUpdate))
				await fn()
			}
			const initAddIds = runResult1.map(e=>e.lastID)
			const modifiedIds = wordsToUpdate.map(e=>$(e.id))
			return [initAddIds, modifiedIds]

		}

		async function getNeoWord_existedWordMap(db:Database, table:string, words:Word[]){
			
			words = Word.merge(words) 
			const neoWord_existedWordMap = new Map<Word, Word|undefined>()
			const neoWordShapes:string[] = words.map(e=>e.wordShape)
			const existedRows:(WordDbRow)[][] = await WordTable.qryWordByWordShape(db, table, neoWordShapes)
			if(words.length !== existedRows.length){throw new Error(`words.length !== existedRows.length`)}
			for(let i = 0; i < existedRows.length; i++){
				const curNeoWord = words[i]
				
				if(existedRows[i].length === 0){
					neoWord_existedWordMap.set(curNeoWord, undefined)
				}else if (existedRows[i].length === 1){
					const curExistedWord = Word.toJsObj(existedRows[i][0])
					neoWord_existedWordMap.set(curNeoWord, curExistedWord)
				}else{
					throw new Error(`${existedRows[i][0].wordShape}在數據庫中有重複項`)
				}
			}
			return neoWord_existedWordMap
		}

		function getWordsToAdd(neoWord_existedWordMap:Map<Word, Word|undefined>){
			const wordsToInitAdd:Word[] = []
			const wordsToUpdate:Word[] = []
			for(const [neoWord, existedWord] of neoWord_existedWordMap){
				if(existedWord === void 0){
					wordsToInitAdd.push(neoWord)
				}else{
					const united = Word.intersect(existedWord, neoWord)
					if(Word.isWordsEqual(existedWord, united, [WordDbRow.id])){}//實則不必刪id再比。united之id固同於前者
					else{
						wordsToUpdate.push(united)
					}
				}
			}
			return [wordsToInitAdd, wordsToUpdate]
		}
		
	}

	addWordsOfSameTable_fn(words:Word[]){
		return WordTable.addWordsOfSameTable_fn(this._dbSrc.dbRaw, words)
	}

	async addWordsOfSameTable(words:Word[]){
		const args = arguments
		const fn = await this.addWordsOfSameTable_fn(words)
		//this.eventEmitter_deprecated.emit(this.eventNames.addRecords_before, args)
		//this.linkedEmitter.emit(this.events.)
		this.linkedEmitter.emit(this.events.addRecords_before)
		return Sqlite.transaction(this.dbSrc.dbRaw, fn).then((d)=>{
			//this.eventEmitter_deprecated.emit(this.eventNames.addRecords_before, args, d)
		})
	}

	/**
	 * 由詞形查詢單詞。返回ᵗ單詞數組中table字段與表名 同。
	 * @param db 
	 * @param table 
	 * @param wordShape 
	 * @returns 
	 */
	static async qryWordByWordShape(db:Database, table:string, wordShape:string):Promise<WordDbRow[]>
	static async qryWordByWordShape(db:Database, table:string, wordShape:string[]):Promise<(WordDbRow)[][]>

	static async qryWordByWordShape(db:Database, table:string, wordShape:string|string[]){
		const cl = WordDbRow
		if(typeof wordShape === 'string'){
			return forOne(db, table, wordShape)
		}else{
			const fn = await Sqlite.fn.qryValuesInColumn_fn<WordDbRow>(db, table, cl.wordShape, wordShape)
			//let d2 = await Sqlite.qryValuesInColumn_unsafeInt_transaction<IVocaRow>(db, table, VocaTableColumnName.wordShape, wordShape)
			const d2 = await fn()
			const r = d2
			for(let i = 0; i < r.length; i++){
				if(r[i].length !== 0){
					WordTable.attachTableName(r[i], table)
				}
			}
			return r
		}

		async function forOne(db:Database, table:string, wordShape:string){
			const sql = `SELECT * FROM '${table}' WHERE ${WordDbRow.wordShape}=?`
			const r = await Sqlite.all<WordDbRow>(db, sql, wordShape)
			//if(r.length === 0 || r === void 0){return undefined}
			WordTable.attachTableName(r, table)
			return r
		}
	}

	/**
	 * 畀words增table字段。直ᵈ改原數組、無返。
	 * @param words 
	 * @param table 
	 */
	static attachTableName(words:WordDbRow[], table:string){
		const tableField = WordDbRow.table
		for(let i = 0; i < words.length; i++){
			words[i][tableField] = table
		}
	}

	/**
	 * @see {attachTableName} static
	 * @param rows 
	 */
	attachTableName(rows:WordDbRow[]){
		const z = this
		z.This.attachTableName(rows, z.tableName)
	}

	/**
	 * select *、但有table屬性、潙ʃ來自ʹ表名
	 * @returns 
	 */
	async selectAllWithTblName(){
		const z = this
		const rows = await z.selectAllNoTblName()
		z.attachTableName(rows)
		return rows
		//z.This.attachTableName(rows, z.tableName)
	}

	/**
	 * 普遍select *
	 * 整數作字串
	 * @returns 
	 */
	async selectAllNoTblName(){
		const z = this
		const db = z.dbSrc.dbRaw
		const sql = await Sqlite.SqlGenerator.selectAllIntSafe(z.dbSrc.dbRaw, z.tableName, [])
		//console.log(sql)
		const ans:WordDbRow[] = await Sqlite.all(db, sql)
		return ans
	}

}

// export const WordTable = WordTable
// export type WordTable = WordTable