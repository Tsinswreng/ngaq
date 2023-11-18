require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import sqlite3 from 'sqlite3';

const sqlt = sqlite3.verbose()

type Database = sqlite3.Database
type Statement = sqlite3.Statement
import { RunResult } from 'sqlite3';
import Sqlite from '@shared/db/Sqlite';
import _ from 'lodash';
import SingleWord2, { VocaDbTable } from '@shared/SingleWord2';
import VocaRaw2 from '@shared/VocaRaw2';
import { IVocaRow } from '@shared/SingleWord2';
import { $, $a, creatFileSync, pathAt } from '@shared/Ut';
import Tempus from '@shared/Tempus';
import * as fs from 'fs'
//const rootDir:string = require('app-root-path').path


//export type VocaTableColumnName = VocaDbTable
const VocaTableColumnName = VocaDbTable

/* export class VocaTableColumnName{
	public static readonly id='id'
	public static readonly wordShape='wordShape'
	public static readonly pronounce='pronounce'
	public static readonly mean='mean'
	public static readonly annotation='annotation'
	public static readonly tag='tag'
	public static readonly times_add='times_add'
	public static readonly dates_add='dates_add'
	public static readonly times_rmb='times_rmb'
	public static readonly dates_rmb='dates_rmb'
	public static readonly times_fgt='times_fgt'
	public static readonly dates_fgt='dates_fgt'
	public static readonly table='table' //此字段ˋ實ˋ不存。
	public static readonly source='source'
} */

export default class VocaSqlite{


	// 廢棄˪ᵗ構造函數
	// constructor(props:{
	// 	_dbName?:string,
	// 	_dbPath?:string,
	// 	_tableName?:string,
	// 	_backupDbPath?:string
	// },creatNewIfNotExist=true){
	// 	Object.assign(this, props)
	// 	if(creatNewIfNotExist){
	// 		VocaSqlite.creatDbFileSync(this.dbPath, true)
	// 	}
	// 	this.dbPath = this._dbPath
	// }

	private constructor(){
	}

	static new(
		props:{
			_dbName?:string,
			_dbPath?:string,
			_tableName?:string,
			_backupDbPath?:string
			,mode?:number
		}
	){
		const o = new this()
		Object.assign(this, props)
		if(props._dbPath !== void 0){
			o._db = Sqlite.newDatabaseAsync(props._dbPath, props.mode)
		}
		return o
	}

	private _dbName = 'voca';
	public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}

	private _dbPath = process.cwd()+'/db/'+this._dbName+'.db' 
	;public get dbPath(){return this._dbPath;};
	// ;public set dbPath(v){
	// 	this._dbPath=v;
	// 	this._db = new sqlt.Database(pathAt(this.dbPath), (err)=>{
	// 		if(err){throw err}
	// 	})
	// };

	private _tableName?:string 
	;public get tableName(){return this._tableName;};;public set tableName(v){this._tableName=v;};


	// private _db:Database = new sqlt.Database(pathAt(this.dbPath), (err)=>{
	// 	if(err){throw err}
	// })
	private _db = Sqlite.newDatabaseAsync(this.dbPath)
	;public get db(){return this._db;};

	private _backupDbPath = this.dbPath
	;public get backupDbPath(){return this._backupDbPath;};;public set backupDbPath(v){this._backupDbPath=v;};

	/**
	 * 新建數據庫
	 * @param path 
	 * @param ifNotExists 
	 */
	public static creatDbFileSync(path:string, ifNotExists=false){
		creatFileSync(path, ifNotExists)
	}public creatDbFileSync(ifNotExists=false){
		VocaSqlite.creatDbFileSync(this.dbPath, ifNotExists)
	}

	/**
	 * 創建單詞表
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static creatTable(db:Database, table:string, ifNotExists=false){
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			let c = VocaTableColumnName
			return `
			CREATE TABLE ${isExist} '${table}' (
				${c.id} INTEGER PRIMARY KEY,
				${c.wordShape} TEXT NOT NULL,
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
	}public creatTable(table=$a(this.tableName), ifNotExists=false){
		return VocaSqlite.creatTable(this.db, table, ifNotExists)
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
		return VocaSqlite.backupTable( srcDb, srcTable , targetDb, neoName)
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
		let table:string = $a(oldTable)
		return VocaSqlite.backupTableInDb(this.db, table, newName)
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
		return VocaSqlite.backAllTables(this.db)
	}


	/**
	 * 檢ᵣ詞ᵗ數組ᵗtable屬性
	 * @param table 
	 * @param words 
	 */
	public static checkTable(table:string, words:SingleWord2[]){
		for(const w of words){
			if(w.table !== table){
				throw new Error(`w.table !== table\n${w.wordShape}\t${w.table}`)
			}
		}
	}


	/**
	 * 數據庫ʸ原ᵈ無ᵗ詞ˇ添入庫
	 * @param db 
	 * @param table 
	 * @param word 
	 * @deprecated
	 */
	// private static initAddWord_deprecated(db:Database, table:string, word:SingleWord2):Promise<RunResult[][][]>
	// private static initAddWord_deprecated(db:Database, table:string, word:SingleWord2[]):Promise<RunResult[][][]>
	// private static async initAddWord_deprecated(db:Database, table:string, word:SingleWord2|SingleWord2[]){
	// 	let w:SingleWord2[]
	// 	if(Array.isArray(word)){
	// 		w = word
	// 	}else{
	// 		w = [word]
	// 	}
	// 	VocaSqlite.checkTable(table, w)
	// 	let [r, runResult] = await forArr(db, table, w)
	// 	return runResult

	// 	function forArr2(db:Database, table:string, words:SingleWord2[]){
			
	// 	}

	// 	function forArr(db:Database, table:string, words:SingleWord2[]){
	// 		const pairs:{sql:string, values:any[][]}[] = []
	// 		for(const w of words){
	// 			const [sql, value] = VocaSqlite.getInsertSql(table, w)
	// 			const unusPair = {sql:sql, values:[value]}
	// 			//console.log(`console.log(unusPair)`)
	// 			//console.log(unusPair)//t
	// 			pairs.push(unusPair)
	// 		}
	// 		return Sqlite.transaction_complex(db, pairs, 'run')
	// 	}
	// }

	/**
	 * 數據庫ʸ原ᵈ無ᵗ詞ˇ添入庫
	 * @param db 
	 * @param table 
	 * @param word 
	 * @deprecated
	 */
	private static initAddWord(db:Database, table:string, word:SingleWord2):Promise<RunResult[]>
	private static initAddWord(db:Database, table:string, word:SingleWord2[]):Promise<RunResult[]>
	private static async initAddWord(db:Database, table:string, word:SingleWord2|SingleWord2[]){
		let w:SingleWord2[]
		if(Array.isArray(word)){
			w = word
		}else{
			w = [word]
		}
		VocaSqlite.checkTable(table, w)
		//let [r, runResult] = await forArr(db, table, w)
		const forArr2=async(db:Database, table:string, words:SingleWord2[])=>{
			const [sql,] = VocaSqlite.getInsertSql(table, words[0])
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			for(const w of words){
				const [sql, value] = VocaSqlite.getInsertSql(table, w)
				const r = await Sqlite.stmtRun(stmt, value)
				runResult.push(r)
			}
			return runResult
		}

		const fn = async()=>{
			return forArr2(db, table, w)
		}

		const runResult:RunResult[] = await Sqlite.transaction(db, fn)
		return runResult
	}


	
/* 	private static async initAddWord(db:Database, table:string, word:SingleWord2|SingleWord2[]){
		let w:SingleWord2[]
		if(Array.isArray(word)){
			w = word
		}else{
			w = [word]
		}
		VocaSqlite.checkTable(table, w)
		let [r, runResult] = await forArr(db, table, w)
		return runResult
		function forArr(db:Database, table:string, words:SingleWord2[]){
			const pairs:{sql:string, values:any[][]}[] = []
			for(const w of words){
				const [sql, value] = VocaSqlite.getInsertSql(table, w)
				const unusPair = {sql:sql, values:[value]}
				//console.log(`console.log(unusPair)`)
				//console.log(unusPair)//t
				pairs.push(unusPair)
			}

			return Sqlite.old_transaction(db, pairs, 'run')
		}
	} */


// 	private static async deprecated_addWords(db:Database, table:string, words:SingleWord2[]){
// 		nna(words)
// //<坑>{舊版數據庫中 詞義ˉ數組蜮有重複元素、而SingleWord.intersect()合併單詞旹不會產重複元素。故初添前亦先除重}
// 		words = words.map(e=>SingleWord2.intersect(e,e))
// 		//const neoIds:number[] = []
// 		const neoWord_existedWordMap = await getNeoWord_existedWordMap(db, table, words)
// 		const [wordsToInitAdd, wordsToUpdate] = getWordsToAdd(neoWord_existedWordMap)//<坑>{記得判空、蜮得空數組}

// 		let runResult1: RunResult[] = []
// 		if(wordsToInitAdd.length !== 0){
// 			runResult1 = await VocaSqlite.initAddWord(db, table, wordsToInitAdd)
// 		}
// 		if(wordsToUpdate.length !== 0){
// 			await VocaSqlite.setWordsByIds(db, table, (wordsToUpdate))
// 		}
// 		const initAddIds = runResult1.map(e=>e.lastID)
// 		const modifiedIds = wordsToUpdate.map(e=>$(e.id))
// 		return [initAddIds, modifiedIds]

// 		async function getNeoWord_existedWordMap(db:Database, table:string, words:SingleWord2[]){
// 			words = VocaRaw2.merge(words)
// 			const neoWord_existedWordMap = new Map<SingleWord2, SingleWord2|undefined>()
// 			const neoWordShapes:string[] = words.map(e=>e.wordShape)
// 			const existedRows:(IVocaRow)[][] = await VocaSqlite.qryWordByWordShape(db, table, neoWordShapes)
// 			if(words.length !== existedRows.length){throw new Error(`words.length !== existedRows.length`)}
// 			for(let i = 0; i < existedRows.length; i++){
// 				const curNeoWord = words[i]
				
// 				if(existedRows[i].length === 0){
// 					neoWord_existedWordMap.set(curNeoWord, undefined)
	
// 				}else if (existedRows[i].length === 1){
// 					const curExistedWord = SingleWord2.parse(existedRows[i][0])
// 					neoWord_existedWordMap.set(curNeoWord, curExistedWord)
// 				}else{
// 					throw new Error(`${existedRows[i][0].wordShape}在數據庫中有重複項`)
// 				}
// 			}
// 			return neoWord_existedWordMap
// 		}

// 		function getWordsToAdd(neoWord_existedWordMap:Map<SingleWord2, SingleWord2|undefined>){
// 			const wordsToInitAdd:SingleWord2[] = []
// 			const wordToUpdate:SingleWord2[] = []
// 			for(const [neoWord, existedWord] of neoWord_existedWordMap){
// 				if(existedWord === void 0){
// 					wordsToInitAdd.push(neoWord)
// 				}else{
// 					const united = SingleWord2.intersect(existedWord, neoWord)
// 					if(SingleWord2.isWordsEqual(existedWord, united, [VocaTableColumnName.id])){}//實則不必刪id再比。united之id固同於前者
// 					else{
// 						wordToUpdate.push(united)

// 						// let ex = SingleWord2.fieldStringfy(existedWord,['id'])
// 						// let ne = SingleWord2.fieldStringfy(united,['id'])
// 						// console.log(1)
// 						// console.log(JSON.stringify(ex).length)
// 						// console.log(JSON.stringify(ex))
// 						// console.log(2)
// 						// console.log(JSON.stringify(ne).length)
// 						// console.log(JSON.stringify(ne))
// 						// console.log(SingleWord2.isWordsEqual(ex,ne,['id']))
// 					}
// 				}
// 			}
// 			return [wordsToInitAdd, wordToUpdate]
// 		}
		
// 	}

	/**
	 * 添詞、@param words 之各ᵗ表名ˋ當皆同、否則報錯
	 * @param db 
	 * @param words 
	 * @returns [initAddIds, modifiedIds]
	 */
	public static async addWordsOfSameTable(db:Database, words:SingleWord2[]){
		$a(words)
		
		//const tableToWordsMap = SingleWord2.classify(words)
		const table0 = $(words[0].table)
		VocaSqlite.checkTable(table0, words)

		return addWordsOfSameTable(db, table0, words)

		async function addWordsOfSameTable(db:Database, table:string, words:SingleWord2[]){
			words = words.map(e=>SingleWord2.intersect(e,e))//<坑>{舊版數據庫中 詞義ˉ數組蜮有重複元素、而SingleWord.intersect()合併單詞旹不會產重複元素。故初添前亦先除重}
			
			//const neoIds:number[] = []
			const neoWord_existedWordMap = await getNeoWord_existedWordMap(db, table, words)
			const [wordsToInitAdd, wordsToUpdate] = getWordsToAdd(neoWord_existedWordMap)//<坑>{記得判空、蜮得空數組}
			// wordsToUpdate.map(e=>{
			// 	if(e.wordShape === 'fixate'){console.log(e)}
			// })//t -
			let runResult1: RunResult[] = []
			
			
			if(wordsToInitAdd.length !== 0){
				
				//let d3 = await VocaSqlite.initAddWord_deprecated(db, table, wordsToInitAdd)
				//runResult1 = d3.flat(2)
				runResult1 = await VocaSqlite.initAddWord(db, table, wordsToInitAdd)
			}
			if(wordsToUpdate.length !== 0){
				
				await VocaSqlite.setWordsByIds(db, table, (wordsToUpdate))
			}
			const initAddIds = runResult1.map(e=>e.lastID)
			const modifiedIds = wordsToUpdate.map(e=>$(e.id))
			return [initAddIds, modifiedIds]

		}

		async function getNeoWord_existedWordMap(db:Database, table:string, words:SingleWord2[]){
			
			words = VocaRaw2.merge(words) 
			const neoWord_existedWordMap = new Map<SingleWord2, SingleWord2|undefined>()
			const neoWordShapes:string[] = words.map(e=>e.wordShape)
			const existedRows:(IVocaRow)[][] = await VocaSqlite.qryWordByWordShape(db, table, neoWordShapes)
			//console.log(`console.log(existedRows)`)
			//console.log(existedRows)//t
			if(words.length !== existedRows.length){throw new Error(`words.length !== existedRows.length`)}
			for(let i = 0; i < existedRows.length; i++){
				const curNeoWord = words[i]
				
				if(existedRows[i].length === 0){
					neoWord_existedWordMap.set(curNeoWord, undefined)
				}else if (existedRows[i].length === 1){
					const curExistedWord = SingleWord2.parse(existedRows[i][0])
					neoWord_existedWordMap.set(curNeoWord, curExistedWord)
				}else{
					throw new Error(`${existedRows[i][0].wordShape}在數據庫中有重複項`)
				}
			}
			//console.log(`console.log(neoWord_existedWordMap)`)
			//console.log(neoWord_existedWordMap)//t
			return neoWord_existedWordMap
		}

		function getWordsToAdd(neoWord_existedWordMap:Map<SingleWord2, SingleWord2|undefined>){
			const wordsToInitAdd:SingleWord2[] = []
			const wordsToUpdate:SingleWord2[] = []
			for(const [neoWord, existedWord] of neoWord_existedWordMap){
				if(existedWord === void 0){
					wordsToInitAdd.push(neoWord)
				}else{
					const united = SingleWord2.intersect(existedWord, neoWord)
					if(SingleWord2.isWordsEqual(existedWord, united, [VocaTableColumnName.id])){}//實則不必刪id再比。united之id固同於前者
					else{
						wordsToUpdate.push(united)
					}
				}
			}
			// wordsToUpdate.map(e=>{
			// 	if(e.wordShape === 'fixate'){console.log(e)}
			// })//t -
			return [wordsToInitAdd, wordsToUpdate]
		}
		
	}public addWordsOfSameTable(words:SingleWord2[]){
		VocaSqlite.checkTable($(this.tableName), words)
		return VocaSqlite.addWordsOfSameTable(this.db, words)
	}
	
	

	/**
	 * 添加單詞數組。返回變更˪ᵗid數組。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @returns 
	 */
	// public static async addWords_old(db:Database, table:string, words:SingleWord2[]){
	// 	//const prms:Promise<number|void>[] = []
	// 	const neoIds:number[] = []
	// 	words = VocaRaw2.merge(words)
	// 	for(const e of words){
	// 		//prms.push(VocaSqlite.addOneWord(db, table, e).catch((e)=>{console.error(e)}))
	// 		let id = await VocaSqlite.addOneWord_old(db, table, e)
	// 		if(id===undefined){continue;}
	// 		neoIds.push(id)
	// 	}
	// 	return neoIds
	// }public addWords_old(words:SingleWord2[]){
	// 	return VocaSqlite.addWords_old(this.db, this.tableName, words)
	// }

	/**
	 * 添加單詞數組。返回Promise對象數組。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @returns 
	 */
	/* public static deprecated_addWords(db:Database, table:string, words:SingleWord2[]){
		const prms:Promise<any>[] = []
		words = VocaRaw2.merge(words)
		for(const e of words){
			prms.push(VocaSqlite.addOneWord(db, table, e).catch((e)=>{console.error(e)}))
		}
		return prms
	} */



	/* public static deprecated_addWords(db:Database, table:string, words:Tp.IVocaRow[]){
		const prms:Promise<any>[] = []
		for(const e of words){
			prms.push(VocaSqlite.deprecated_addOneWord(db, table, e).catch((e)=>{console.error(e)}))
		}
		return prms
	} */

	/**
	 * 由詞形查詢單詞。返回ᵗ單詞數組中table字段與表名 同。
	 * @param db 
	 * @param table 
	 * @param wordShape 
	 * @returns 
	 */
	public static async qryWordByWordShape(db:Database, table:string, wordShape:string):Promise<IVocaRow[]>
	public static async qryWordByWordShape(db:Database, table:string, wordShape:string[]):Promise<(IVocaRow)[][]>

	public static async qryWordByWordShape(db:Database, table:string, wordShape:string|string[]){
		if(typeof wordShape === 'string'){
			return forOne(db, table, wordShape)
		}else{
			
			let d2 = await Sqlite.qryValuesInColumn_unsafeInt<IVocaRow>(db, table, VocaTableColumnName.wordShape, wordShape)
			const r = d2
			for(let i = 0; i < r.length; i++){
				if(r[i].length !== 0){
					VocaSqlite.attachTableName(r[i], table)
				}
			}
			return r
		}

		async function forOne(db:Database, table:string, wordShape:string){
			const sql = `SELECT * FROM '${table}' WHERE ${VocaTableColumnName.wordShape}=?`
			let r = await Sqlite.all<IVocaRow>(db, sql, wordShape)
			//if(r.length === 0 || r === void 0){return undefined}
			VocaSqlite.attachTableName(r, table)
			return r
		}
	}

	// public static async qryWordByWordShape(db:Database, table:string, wordShape:string|string[]){
	// 	if(typeof wordShape === 'string'){
	// 		return forOne(db, table, wordShape)
	// 	}else{
	// 		const sqlToValuePairs:{sql:string, values:any[]}[] = []
	// 		for(const curShape of wordShape){
	// 			const sql = `SELECT * FROM '${table}' WHERE ${VocaTableColumnName.wordShape}=?`
	// 			const pair:{sql:string, values:any[][]} = {sql: sql, values: [[curShape]]}
	// 			sqlToValuePairs.push(pair)
	// 		}
	// 		let [r, runResult] = await Sqlite.old_transaction<IVocaRow>(db, sqlToValuePairs, 'each')
	// 		for(let i = 0; i < r.length; i++){
	// 			if(r[i].length !== 0){
	// 				VocaSqlite.attachTableName(r[i], table)
	// 			}
	// 		}
	// 		return r
	// 	}

	// 	async function forOne(db:Database, table:string, wordShape:string){
	// 		const sql = `SELECT * FROM '${table}' WHERE ${VocaTableColumnName.wordShape}=?`
	// 		let r = await Sqlite.all<IVocaRow>(db, sql, wordShape)
	// 		//if(r.length === 0 || r === void 0){return undefined}
	// 		VocaSqlite.attachTableName(r, table)
	// 		return r
	// 	}
	// }
	// public async qryWordByWordShape(table=$a(this.tableName), wordShape:string|string[]){
	// 	return VocaSqlite.qryWordByWordShape(this.db, table, wordShape)
	// }

	/**
	 * 畀words增ling字段。直ᵈ改原數組、無返。
	 * @param words 
	 * @param table 
	 */
	public static attachTableName(words:IVocaRow[], table:string){
		let lingField = VocaTableColumnName.table
		for(let i = 0; i < words.length; i++){
			words[i][lingField] = table
		}
	}

	/**
	 * 添加一個單詞。若所加之詞既存于數據庫則取併集。
	 * @param db 
	 * @param table 
	 * @param word 
	 * @returns 返 數據庫中改˪ᵗid。若 欲加ᵗ詞 與 數據庫中既存ᵗ詞ˋ併ᵣ後相同、則返undefined
	 */
	// private static async addOneWord_old(db:Database, table:string, word:SingleWord2):Promise<number|undefined>{
	// 	let existedWordArr:IVocaRow[]|null = await VocaSqlite.qryWordByWordShape(db, table, word.wordShape)
	// 	// 從數據庫中取出詞旹當補ling字段、首次添旹不能併重複ᐪ、鈣緣非待一詞加畢後再加他ᵗ詞。。
	// 	if(existedWordArr.length===0){//若此詞未嘗被加入過數據庫
	// 		let r = await initAddOneWord(db, table, word)
	// 		return r.lastID
	// 	}else if(existedWordArr.length!==1){
	// 		console.error(existedWordArr)
	// 		throw new Error(`${existedWordArr[0].wordShape}在數據庫中有重複項`)
	// 	}else{//若數據庫中既存此詞、則合併
			
	// 		let exsistedWord:IVocaRow|null = existedWordArr[0];existedWordArr = null
	// 		// //若兩單詞全同 (不會入此支)
	// 		// if(SingleWord2.isRowObjEqual(exsistedWord,SingleWord2.fieldStringfy([word])[0])){
	// 		// 	return
	// 		// }
	// 		let oldSw:SingleWord2|null=SingleWord2.parse(exsistedWord);exsistedWord=null
	// 		//let swToBeAdd:SingleWord2|null=SingleWord2.soloParse(word)
	// 		let swToBeAdd:SingleWord2|null=word
	// 		let united:SingleWord2|null=SingleWord2.intersect(oldSw,swToBeAdd);swToBeAdd=null
	// 		//let row = SingleWord2.soloFieldStringfy(united);united=null
	// 		if(SingleWord2.isWordsEqual(united, oldSw)){
	// 			return
	// 		}
	// 		await VocaSqlite.setWordByOneId(db, table, united, Ut.$(united.id))
	// 		return Ut.$(united.id)
	// 	}

	// 	function initAddOneWord(db:Database, table:string, word:SingleWord2){
	// 		let m = VocaSqlite.getInsertSql(table, word)
	// 		return Sqlite.run(db, m[0], m[1])
	// 	}

	// }

	/**
	 * 在數據庫中覆蓋指定id處之單詞
	 * @param db 
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	// private static setWordByOneId(db:Database, table:string, word:SingleWord2, id:number){
	// 	let m = VocaSqlite.getUpdateByIdSql(table, word, id)
	// 	return Sqlite.all(db, m[0], m[1])
	// }

	/**
	 * 用transaction批量ᵈ由id蔿行重設詞。
	 * 緣 取sql語句之函數 需傳SingleWord2故形參擇此。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @param ids 
	 * @returns 
	 */
	public static setWordsByIds(db:Database, table:string, words:SingleWord2[], ids?:number[]){
		//if(words.length === 0){throw new Error(`words.length === 0`)}
		
		VocaSqlite.checkTable(table, words)
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

		let sql = VocaSqlite.getUpdateByIdSql(table, $(words[0],'words[0]'), ids[0])[0]
		//console.log(`console.log(sql)`)
		//console.log(sql)//t

		
		const fn = async()=>{
			const stmt = await Sqlite.prepare(db, sql)
			const runResult:RunResult[] = []
			for(let i = 0; i < words.length; i++){
				let w = words[i]; let id = $(ids)[i]
				let [,v] = VocaSqlite.getUpdateByIdSql(table, w, id)
				const r = await Sqlite.stmtRun(stmt, v)
				runResult.push(r)
			}
			return runResult
		}
		return Sqlite.transaction(db, fn)
	}

	/**
	 * 用transaction批量ᵈ由id蔿行重設詞。
	 * 緣 取sql語句之函數 需傳SingleWord2故形參擇此。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @param ids 
	 * @returns 
	 */
	// public static setWordsByIds_deprecated(db:Database, table:string, words:SingleWord2[], ids?:number[]){
	// 	//if(words.length === 0){throw new Error(`words.length === 0`)}
		
	// 	VocaSqlite.checkTable(table, words)
	// 	$a(words)
	// 	if(ids === void 0){
	// 		ids = []
	// 		for(const w of words){
	// 			ids.push($(w.id))
	// 		}
	// 	}
	// 	if(words.length !== ids.length){
	// 		throw new Error(`words.length !== ids.length`)
	// 	}

	// 	let sql = VocaSqlite.getUpdateByIdSql(table, $(words[0],'words[0]'), ids[0])[0]
	// 	//console.log(`console.log(sql)`)
	// 	//console.log(sql)//t
	// 	const values:any[][] = []
	// 	const sqlPair:{sql:string, values:any[]}[] = []
	// 	for(let i = 0; i  <words.length; i++){
	// 		let w = words[i]; let id = ids[i]
	// 		let v = VocaSqlite.getUpdateByIdSql(table, w, id)[1]
			
	// 		values.push(v)
	// 	}
	// 	//let a:any[] = []
	// 	//let b:any[][] = []
		
	// 	//return Sqlite.deprecated_transactionForOneSql(db, sql, values)
	// 	//console.log(`console.log([{sql:sql, values:values}])`)
	// 	//console.log([{sql:sql, values:values}])//t
	// 	return Sqlite.transaction_complex(db, [{sql:sql, values:values}], 'run')
		
	// }
	
	public setWordsByIds(words:SingleWord2[], ids:number[]){
		let table:string=$(this.tableName)
		return VocaSqlite.setWordsByIds(this.db, table, words, ids)
	}


	/**
	 * 由詞ˉ對象生成 改ᵗsql語句。
	 * 緣需複製值ⁿ得IVocaRow對象、故形參ᵘ擇SingleWord2。
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	public static getUpdateByIdSql(table: string, word:SingleWord2,id: number){
		VocaSqlite.checkTable(table, [word])
		const c = VocaTableColumnName
		let obj = SingleWord2.fieldStringfy($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.getSql_updateById(table, obj, id)
	}

	/**
	 * 由詞ˉ對象生成 增ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @returns 
	 */
	public static getInsertSql(table: string, word:SingleWord2){
		VocaSqlite.checkTable(table, [word])
		const c = VocaTableColumnName
		let obj = SingleWord2.fieldStringfy($(word))
		delete obj[c.id]; delete (obj as any)[c.table]
		return Sqlite.getSql_insert(table, obj)
	}



	public static async getAllWords(db:Database, table:string){
		const sql = `SELECT * FROM '${table}'`
		let r = await Sqlite.all<IVocaRow>(db, sql)
		VocaSqlite.attachTableName(r, table)
		return r
	}public getAllWords(table?:string){
		let table_=table??this.tableName
		return VocaSqlite.getAllWords(this.db, $(table_))
	}


	/**
	 * 數據庫ʰ既複習ᵗ單詞ˇ批量ᵈ依表名ⁿ存。此函數不可用于初添。
	 * @param db 
	 * @param sws 
	 * @param table 
	 * @returns 
	 */
	public static saveWords(db:Database, sws:SingleWord2[]){
		const tableToWordsMap = SingleWord2.classify(sws)
		const prms:Promise<number[][]>[] = []
		for(const [table, words] of tableToWordsMap){
			const pr = this.addWordsOfSameTable(db, words)
			prms.push(pr)
		}
		return prms
	}

	// public static async censusByDate(db:Database, table:string){
	// 	const allRows:IVocaRow[] = await VocaSqlite.getAllWords(db, table)

	// }


	//public static saveWords(db:Database, sws:SingleWord2[], table:string):Promise<unknown[]>
	// public static saveWords(db:Database, sws:SingleWord2[]){
	// 	const tableToWordsMap = classify(sws)
	// 	const prms:Promise<unknown>[] = []
	// 	for(const [table,words] of tableToWordsMap){
	// 		const pr = this.setWordsByIds(db, table, words)
	// 		//const pr = VocaSqlite.addWordsOfSameTable()
	// 		prms.push(pr)
	// 	}
	// 	return prms

	// 	function classify(sws:SingleWord2[]){
	// 		return SingleWord2.classify(sws)
	// 	}
	// }

	/**
	 * 由id數組取詞形數組
	 * 作此函數只蔿 每添詞後返前端ʰʃ添ᵗ詞ᵗ詞形ˇ
	 * @param db 
	 * @param table 
	 * @param ids 
	 * @returns 
	 */
	public static async getWordShapesByIds(db:Database, table:string, ids:number[]){
		const rows2d = await Sqlite.qryByIds_unsafeInt<IVocaRow>(db, table, ids)
		const rows = rows2d.flat(1)
		return rows.map(e=>e.wordShape)
	}

	// public static async traverseTempus(db:Database, table:string){
	// 	//const tempi:Tempus[] = []
	// 	//鍵: Tempus;  值: [id, 列名]
	// 	//const map_tempusToIdEtEvent = new Map<string, [number, string]>()

	// 	let rows = await this.getAllWords(db, table)
	// 	for(const r of rows){

	// 	}
	// }

}


// namespace VocaSqliteUtil{
// 	function getWordShapeByIds(){

// 	}
// }

// function reverseMap<K,V>(map:Map<K,V>){
// 	const result = new Map<V,K>()
// 	for(const [k,v] of map){
// 		result.set(v, k)
// 	}
// 	return result
// }