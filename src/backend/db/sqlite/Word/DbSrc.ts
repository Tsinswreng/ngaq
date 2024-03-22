import sqlite3 from 'sqlite3';
type Database = sqlite3.Database
type Statement = sqlite3.Statement
type RunResult = SqliteType.RunResult
import Sqlite, { SqliteTableInfo, SqliteType } from '@backend/db/Sqlite';
import _ from 'lodash';
import Word, { VocaDbTable } from '@shared/SingleWord2';
import VocaRaw2, { config } from '@shared/VocaRaw2';
import { IVocaRow } from '@shared/SingleWord2';
import { $, $a, creatFileSync, lodashMerge, pathAt } from '@shared/Ut';
import Tempus from '@shared/Tempus';
import Stream from 'stream';
import lodash from 'lodash'
import { CreateTableConfig, Abs_DbSrc, New_Abs_DbSrc } from '@backend/db/sqlite/_base/DbSrc';
import { WordTableMetadataDbSrc } from '@backend/db/sqlite/Word/TableMetadata/DbSrc';
import {WordTable} from '@backend/db/sqlite/Word/Table'
const VocaTableColumnName = VocaDbTable


export class WordDbSrc extends Abs_DbSrc{
	protected constructor(){
		super()
	}

	static override async New(props:New_Abs_DbSrc & {
		_tableMetadataDbSrc?:WordTableMetadataDbSrc
	}){
		const o = new this()
		Object.assign(o, props)
		if(props._dbPath !== void 0){
			o._db = await Sqlite.newDatabase(props._dbPath, props._mode)
		}
		props._tableMetadataDbSrc = props._tableMetadataDbSrc?? await WordTableMetadataDbSrc.New({
			_dbPath:props._dbPath
		})
		WordTableMetadataDbSrc.emmiter__handler.set(o, props._tableMetadataDbSrc)
		return o
	}

	// /**
	//  * @deprecated
	//  * @param props 
	//  * @returns 
	//  */
	// static new(
	// 	props:{
	// 		_dbName?:string,
	// 		_dbPath?:string,
	// 		_tableName?:string,
	// 		_backupDbPath?:string
	// 		,mode?:number
	// 	}
	// ){
	// 	const o = new this()
	// 	Object.assign(o, props)
	// 	if(props._dbPath !== void 0){
	// 		o._db = Sqlite.newDatabaseAsync(props._dbPath, props.mode)
	// 	}
	// 	return o
	// }

	protected _tableMetadataDbSrc:WordTableMetadataDbSrc
	get tableMetadataDbSrc(){return this._tableMetadataDbSrc}

	public static defaultDbPath = process.cwd()+'/db/'+'voca'+'.db' 

	//private _dbName = 'voca';
	// protected _dbName:string
	// public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}

	//private _dbPath = process.cwd()+'/db/'+this._dbName+'.db' 
	protected _dbPath:string = ''
	;public get dbPath(){return this._dbPath;};

	protected _tableName?:string 
	;get tableName(){return this._tableName;};;set tableName(v){this._tableName=v;};

	protected _db = Sqlite.newDatabaseAsync(this.dbPath)
	;public get db(){return this._db;};

	protected _backupDbPath = this.dbPath
	;public get backupDbPath(){return this._backupDbPath;};;public set backupDbPath(v){this._backupDbPath=v;};

	/**
	 * 新建數據庫
	 * @param path 
	 * @param ifNotExists 
	 */
	public static creatDbFileSync(path:string, ifNotExists=false){
		creatFileSync(path, ifNotExists)
	}public creatDbFileSync(ifNotExists=false){
		WordDbSrc_.creatDbFileSync(this.dbPath, ifNotExists)
	}

	/**
	 * 創建單詞表
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static createTable_deprecated(db:Database, table:string, ifNotExists=false){
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			const c = VocaTableColumnName
			return `
			CREATE TABLE ${isExist} '${table}' (
				${c.id} INTEGER PRIMARY KEY,
				${c.wordShape} TEXT NOT NULL,
				${c.variant} TEXT,
				${c.pronounce} TEXT NOT NULL,
				${c.mean} TEXT NOT NULL,
				${c.annotation} TEXT NOT NULL,
				${c.tag} TEXT NOT NULL,
				${c.times_add} INTEGER DEFAULT 0,
				${c.dates_add} TEXT NOT NULL,
				${c.times_rmb} INTEGER DEFAULT 0,
				${c.dates_rmb} TEXT NOT NULL,
				${c.times_fgt} INTEGER DEFAULT 0,
				${c.dates_fgt} TEXT NOT NULL,
				${c.source} TEXT NOT NULL
			);
			`
		}
		return Sqlite.all(db, getSql(table))
	}public creatTable_deprecated(table=$a(this.tableName), ifNotExists=false){
		return WordDbSrc_.createTable_deprecated(this.db, table, ifNotExists)
	}


	createTable(table=$a(this.tableName), config={ifNotExists:false}){
		const ifNotExists = config.ifNotExists
		return WordDbSrc_.createTable_deprecated(this.db, table, ifNotExists)
	}

	/**
	 * 跨數據庫備份表
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @returns 
	 */
	public static backupTable(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable+Tempus.new().iso){
		return Sqlite.table.copyTableCrossDb(srcDb, srcTable, targetDb, neoName)
		//return Sqlite.copyTableCrossDb(srcDb, srcTable, targetDb, neoName)
	}
	public backupTable(srcDb = this.db, srcTable = $a(this.tableName), targetDb=Sqlite.newDatabaseAsync(this.backupDbPath), neoName=this.tableName+Tempus.new().iso){
		return WordDbSrc_.backupTable( srcDb, srcTable , targetDb, neoName)
	}

	/**
	 * 在當前數據庫內備份表、默認表名 @see {table + Tempus.new().iso}
	 * @param db 
	 * @param table 
	 * @param newName 
	 * @returns 
	 */
	public static backupTableInDb(db:Database, table:string, newName=table+Tempus.new().iso){
		return Sqlite.copyTable(db, $(newName), table)
	}public backupTableInDb(oldTable=this.tableName, newName=oldTable+Tempus.new().iso){
		const table:string = $a(oldTable)
		return WordDbSrc_.backupTableInDb(this.db, table, newName)
	}

	/**
	 * 取 整個詞表之 可讀流
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static async readStream(db:Database, table:string, opts?:Stream.ReadableOptions){
		const stmt = await Sqlite.stmt.getStmt_selectAllSafe(db, table)
		return Sqlite.readStream_json(stmt, opts, {assign:false,fn:(row:VocaDbTable)=>{C.attachTableName([row], table)}})
	}public readStream(table:string=$a(this.tableName)){
		return C.readStream(this.db, table)
	}


	/**
	 * 備份所有表
	 * @param db 
	 * @param neoNamePostfix 原表名ᵗ後ʸᵗʃ添
	 * @deprecated
	 * @returns 
	 */
	public static async backAllTables(db:Database, neoNamePostfix=Tempus.new().iso){
		const master = await Sqlite.querySqlite_master_unsafeInt(db)
		const tbl_names = master.map(e=>e.tbl_name)
		const neoNames = tbl_names.map(e=>e+=neoNamePostfix)
		const prms:Promise<unknown>[] = []
		for(let i = 0; i < tbl_names.length; i++){
			const oldName = tbl_names[i]; const neoName = neoNames[i]
			const p = this.backupTableInDb(db, oldName, neoName)
			prms.push(p)
		}
		return prms
	}
	/**
	 * @deprecated
	 * @returns 
	 */
	public backAllTables(){
		return WordDbSrc_.backAllTables(this.db)
	}


	/**
	 * 檢ᵣ詞ᵗ數組ᵗtable屬性
	 * @param table 
	 * @param words 
	 */
	static checkTable = WordTable.checkTable
/* 	public static checkTable(table:string, words:Word[]){
		for(const w of words){
			if(w.table !== table){
				throw new Error(`w.table !== table\n${w.wordShape}\t${w.table}`)
			}
		}
	} */


	/**
	 * 數據庫ʸ原ᵈ無ᵗ詞ˇ添入庫
	 * @param db 
	 * @param table 
	 * @param word 
	 */
/* 	private static initAddWord(db:Database, table:string, word:Word):Promise<RunResult[]>
	private static initAddWord(db:Database, table:string, word:Word[]):Promise<RunResult[]>
	private static async initAddWord(db:Database, table:string, word:Word|Word[]){
		let w:Word[]
		if(Array.isArray(word)){
			w = word
		}else{
			w = [word]
		}
		WordDbSrc_.checkTable(table, w)
		//let [r, runResult] = await forArr(db, table, w)
		const forArr2=async(db:Database, table:string, words:Word[])=>{
			const [sql,] = WordDbSrc_.genQry_insert(table, words[0])
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			runResult.length = words.length
			//let lastRunResut
			for(let i = 0; i < words.length; i++){
				const w = words[i]
				const [sql, value] = WordDbSrc_.genQry_insert(table, w)
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
	} */

	//@ts-ignore
	private static initAddWord = WordTable.initAddWord
	

	/**
	 * 添詞、@param words 之各ᵗ表名ˋ當皆同、否則報錯
	 * 内含transaction
	 * @param db 
	 * @param words 
	 * @returns [initAddIds, modifiedIds]
	 */
	static addWordsOfSameTable_fn = WordTable.addWordsOfSameTable_fn
	/* public static async addWordsOfSameTable_fn(db:Database, words:Word[]){
		$a(words)
		
		//const tableToWordsMap = SingleWord2.classify(words)
		const table0 = $(words[0].table)
		WordDbSrc_.checkTable(table0, words)
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
					return await WordDbSrc_.initAddWord(db, table, wordsToInitAdd)
				}
				//runResult1 = await Sqlite.transaction(db, fn)
				runResult1 = await fn()
			}
			if(wordsToUpdate.length !== 0){
				const fn =  WordDbSrc_.setWordsByIds_fn(db, table, (wordsToUpdate))
				await fn()
			}
			const initAddIds = runResult1.map(e=>e.lastID)
			const modifiedIds = wordsToUpdate.map(e=>$(e.id))
			return [initAddIds, modifiedIds]

		}

		async function getNeoWord_existedWordMap(db:Database, table:string, words:Word[]){
			
			words = VocaRaw2.merge(words) 
			const neoWord_existedWordMap = new Map<Word, Word|undefined>()
			const neoWordShapes:string[] = words.map(e=>e.wordShape)
			const existedRows:(IVocaRow)[][] = await WordDbSrc_.qryWordByWordShape(db, table, neoWordShapes)
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
					if(Word.isWordsEqual(existedWord, united, [VocaTableColumnName.id])){}//實則不必刪id再比。united之id固同於前者
					else{
						wordsToUpdate.push(united)
					}
				}
			}
			return [wordsToInitAdd, wordsToUpdate]
		}
		
	} */
	
	
	public addWordsOfSameTable(words:Word[]){
		WordDbSrc_.checkTable($(this.tableName), words)
		return WordDbSrc_.addWordsOfSameTable_fn(this.db, words)
	}
	
	/**
	 * 由詞形查詢單詞。返回ᵗ單詞數組中table字段與表名 同。
	 * @param db 
	 * @param table 
	 * @param wordShape 
	 * @returns 
	 */
	static qryWordByWordShape = WordTable.qryWordByWordShape
	/* public static async qryWordByWordShape(db:Database, table:string, wordShape:string):Promise<IVocaRow[]>
	public static async qryWordByWordShape(db:Database, table:string, wordShape:string[]):Promise<(IVocaRow)[][]>

	public static async qryWordByWordShape(db:Database, table:string, wordShape:string|string[]){
		const cl = VocaDbTable
		if(typeof wordShape === 'string'){
			return forOne(db, table, wordShape)
		}else{
			const fn = await Sqlite.fn.qryValuesInColumn_fn<IVocaRow>(db, table, cl.wordShape, wordShape)
			//let d2 = await Sqlite.qryValuesInColumn_unsafeInt_transaction<IVocaRow>(db, table, VocaTableColumnName.wordShape, wordShape)
			const d2 = await fn()
			const r = d2
			for(let i = 0; i < r.length; i++){
				if(r[i].length !== 0){
					WordDbSrc_.attachTableName(r[i], table)
				}
			}
			return r
		}

		async function forOne(db:Database, table:string, wordShape:string){
			const sql = `SELECT * FROM '${table}' WHERE ${VocaTableColumnName.wordShape}=?`
			const r = await Sqlite.all<IVocaRow>(db, sql, wordShape)
			//if(r.length === 0 || r === void 0){return undefined}
			WordDbSrc_.attachTableName(r, table)
			return r
		}
	} */

	/**
	 * 畀words增ling字段。直ᵈ改原數組、無返。
	 * @param words 
	 * @param table 
	 */
	static attachTableName = WordTable.attachTableName
/* 	public static attachTableName(words:IVocaRow[], table:string){
		const lingField = VocaTableColumnName.table
		for(let i = 0; i < words.length; i++){
			words[i][lingField] = table
		}
	} */



	/**
	 * 批量ᵈ由id蔿行重設詞。
	 * 緣 取sql語句之函數 需傳SingleWord2故形參擇此。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @param ids 
	 * @returns 
	 */
	static setWordsByIds_fn = WordTable.setWordsByIds_fn
/* 	public static setWordsByIds_fn(db:Database, table:string, words:Word[], ids?:number[]){
		//if(words.length === 0){throw new Error(`words.length === 0`)}
		
		WordDbSrc_.checkTable(table, words)
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

		const sql = WordDbSrc_.genQry_updateById(table, $(words[0],'words[0]'), ids[0])[0]

		const fn = async()=>{
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			for(let i = 0; i < words.length; i++){
				let w = words[i]; let id = $(ids)[i]
				let [,v] = WordDbSrc_.genQry_updateById(table, w, id)
				const r = await Sqlite.stmtRun(stmt, v)
				runResult.push(r)
			}
			return runResult
		}
		//return Sqlite.transaction(db, fn)
		return fn
	} */

	
	public setWordsByIds(words:Word[], ids:number[]){
		const table:string=$(this.tableName)
		return WordDbSrc_.setWordsByIds_fn(this.db, table, words, ids)
	}


	/**
	 * 由詞ˉ對象生成 改ᵗsql語句。
	 * 緣需複製值ⁿ得IVocaRow對象、故形參ᵘ擇SingleWord2。
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	static genQry_updateById = WordTable.genQry_updateById
/* 	public static genQry_updateById(table: string, word:Word,id: number){
		WordDbSrc_.checkTable(table, [word])
		const c = VocaTableColumnName
		const obj = Word.toDbObj($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.genQry_updateById(table, obj, id)
	} */

	/**
	 * 由詞ˉ對象生成 增ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @returns 
	 */
	static genQry_insert = WordTable.genQry_insert
/* 	public static genQry_insert(table: string, word:Word){
		WordDbSrc_.checkTable(table, [word])
		const c = VocaTableColumnName
		const obj = Word.toDbObj($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.genQry_insert(table, obj)
	} */



	public static async getAllWords(db:Database, table:string){
		const sql = `SELECT * FROM '${table}'`
		const r = await Sqlite.all<IVocaRow>(db, sql)
		WordDbSrc_.attachTableName(r, table)
		return r
	}public getAllWords(table?:string){
		const table_=table??this.tableName
		return WordDbSrc_.getAllWords(this.db, $(table_))
	}


	/**
	 * 數據庫ʰ既複習ᵗ單詞ˇ批量ᵈ依表名ⁿ存。此函數不可用于初添。
	 * @param db 
	 * @param sws 
	 * @param table 
	 * @returns 
	 */
	static saveWords = WordTable.saveWords
/* 	public static async saveWords(db:Database, sws:Word[]){
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
	} */


	/**
	 * 由id數組取詞形數組
	 * 作此函數只蔿 每添詞後返前端ʰʃ添ᵗ詞ᵗ詞形ˇ
	 * @param db 
	 * @param table 
	 * @param ids 
	 * @returns 
	 */
	public static async getWordShapesByIds(db:Database, table:string, ids:number[]){
		const cl = VocaDbTable
		const rows2d_fn = await Sqlite.qryValuesInColumn_fn<IVocaRow>(db, table, cl.id ,ids)
		const rows2d = await rows2d_fn()
		const rows = rows2d.flat(1)
		return rows.map(e=>e.wordShape)
	}


}
const C = WordDbSrc
type C = WordDbSrc

const WordDbSrc_ = WordDbSrc
export default WordDbSrc_

