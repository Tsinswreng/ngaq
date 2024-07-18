import sqlite3 from 'sqlite3';
type Database = sqlite3.Database
type Statement = sqlite3.Statement
type RunResult = SqliteType.RunResult
import OldSqlite, { SqliteTableInfo, SqliteType } from '@backend/db/OldSqlite';
import _ from 'lodash';
import Word, { VocaDbTable } from '@shared/SingleWord2';
import { IVocaRow } from '@shared/SingleWord2';
import { $, $a, instanceAs, creatFileSync, lodashMerge, pathAt, As } from '@shared/Ut';
import Tempus from '@shared/Tempus';
import Stream from 'stream';
import lodash from 'lodash'
import { CreateTableOpt, Abs_DbSrc, New_Abs_DbSrc } from '@backend/db/sqlite/_base_deprecated/DbSrc';
import { WordTmdDbSrc as WordTmdDbSrc } from '@backend/db/sqlite/OldWord/Tmd/DbSrc';
import {WordTable} from '@backend/db/sqlite/OldWord/Table'
import { Abs_Table } from '../_base_deprecated/Table';
import { WordTmdTable } from './Tmd/Table';
import { WordTmd } from '@backend/old_entities/WordTmd';
import { WordTmdDbRow } from '@backend/old_dbRow/WordTmd';
const VocaTableColumnName = VocaDbTable


export class WordDbSrc extends Abs_DbSrc{
	protected constructor(){
		super()
	}

	static override async New(props:New_Abs_DbSrc & {
		_tmdDbSrc?:WordTmdDbSrc
	}){

		const o = new this
		await o.__Init__(props)
		return o
	}


	protected async __Init__(props:Parameters<typeof WordDbSrc.New>[0]){
		const o = this
		if(props._dbPath !== void 0){
			o._dbRaw = await OldSqlite.newDatabase(props._dbPath, props._mode)
		}
		props._tmdDbSrc = props._tmdDbSrc?? await WordTmdDbSrc.New({
			_dbPath:props._dbPath
		})
		props._TableClass = props._TableClass?? WordTable
		WordTmdDbSrc.emmiter__handler.set(o, props._tmdDbSrc)
		Object.assign(o, props)
		o._tmdTable = o.tmdDbSrc.tmdTable
		o.initMdListener()
		return o
	}

	get This(){return WordDbSrc}

	protected _tmdTable:WordTmdTable
	get tmdTable(){return this._tmdTable}

	declare protected _TableClass: typeof WordTable;
	get TableClass():typeof WordTable{return this._TableClass}

	loadTable(tableName:string, opt?:{
	}){
		const z = this
		const ans = z.TableClass.new({
			_tableName: tableName
			,_dbSrc: z
		})
		return ans
	}

	initMdListener(){
		const s = this
		const outerErr = new Error()
		//每創詞表旹即試創元訊表
		s.linkedEmitter.on(s.events.createTable_after,async (table:string)=>{
			try {
				await s.tmdDbSrc.createTable(void 0, {ifNotExists:true})
				let metadataTable_:any = await s.tmdDbSrc.openTable(WordTmdDbSrc.metadataTableName)
				const metadataTable = instanceAs(metadataTable_, WordTmdTable)
				metadataTable_ = null
				const entity = WordTmd.new({
					_tableName: $a(table)
				})
				const row = WordTmdDbRow.toDbRow(entity)
				metadataTable.addRecords([
					row
				]).then((d)=>{
					console.log(d)//t
				})
			} catch (error) {
				const err = error as Error
				err.stack += '\n\n' + outerErr.stack
				throw err
			}
		})
		
	}

	protected _tmdDbSrc:WordTmdDbSrc
	get tmdDbSrc(){return this._tmdDbSrc}

	public static defaultDbPath = process.cwd()+'/db/'+'voca'+'.db' 

	//private _dbName = 'voca';
	// protected _dbName:string
	// public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}

	//private _dbPath = process.cwd()+'/db/'+this._dbName+'.db' 
	protected _dbPath:string = ''
	;public get dbPath(){return this._dbPath;};

	/**@deprecated */
	protected _tableName?:string 
	/**@deprecated */
	get tableName(){return this._tableName;}
	/**@deprecated */
	set tableName(v){this._tableName=v;}

	protected _dbRaw = OldSqlite.newDatabaseAsync(this.dbPath)
	;public get dbRaw(){return this._dbRaw;};

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
		WordDbSrc.creatDbFileSync(this.dbPath, ifNotExists)
	}

	/**
	 * 創建單詞表
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static createTable_helper(db:Database, table:string, ifNotExists=false){
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
		return OldSqlite.all(db, getSql(table))
	}public creatTable_deprecated(table=$a(this.tableName), ifNotExists=false){
		return WordDbSrc.createTable_helper(this.dbRaw, table, ifNotExists)
	}


	createTable(table=$a(this.tableName), opt={ifNotExists:false}){
		const ifNotExists = opt.ifNotExists
		const args = arguments
		this.linkedEmitter.emit(this.events.createTable_before, table, opt)
		return WordDbSrc.createTable_helper(this.dbRaw, table, ifNotExists)
		.then((d)=>{
			this.linkedEmitter.emit(this.events.createTable_after, table, opt, d)
		})
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
		return OldSqlite.table.copyTableCrossDb(srcDb, srcTable, targetDb, neoName)
		//return OldSqlite.copyTableCrossDb(srcDb, srcTable, targetDb, neoName)
	}
	public backupTable(srcDb = this.dbRaw, srcTable = $a(this.tableName), targetDb=OldSqlite.newDatabaseAsync(this.backupDbPath), neoName=this.tableName+Tempus.new().iso){
		return WordDbSrc.backupTable( srcDb, srcTable , targetDb, neoName)
	}

	/**
	 * 在當前數據庫內備份表、默認表名 @see {table + Tempus.new().iso}
	 * @param db 
	 * @param table 
	 * @param newName 
	 * @returns 
	 */
	public static backupTableInDb(db:Database, table:string, newName=table+Tempus.new().iso){
		return OldSqlite.copyTable(db, $(newName), table)
	}public backupTableInDb(oldTable=this.tableName, newName=oldTable+Tempus.new().iso){
		const table:string = $a(oldTable)
		return WordDbSrc.backupTableInDb(this.dbRaw, table, newName)
	}

	/**
	 * 取 整個詞表之 可讀流
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static async readStream(db:Database, table:string, opts?:Stream.ReadableOptions){
		const stmt = await OldSqlite.stmt.getStmt_selectAllSafe(db, table)
		return OldSqlite.readStream_json(stmt, opts, {assign:false,fn:(row:VocaDbTable)=>{C.attachTableName([row], table)}})
	}public readStream(table:string=$a(this.tableName)){
		return C.readStream(this.dbRaw, table)
	}


	/**
	 * 備份所有表
	 * @param db 
	 * @param neoNamePostfix 原表名ᵗ後ʸᵗʃ添
	 * @deprecated
	 * @returns 
	 */
	public static async backAllTables(db:Database, neoNamePostfix=Tempus.new().iso){
		const master = await OldSqlite.querySqlite_master_unsafeInt(db)
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
		return WordDbSrc.backAllTables(this.dbRaw)
	}


	/**
	 * 檢ᵣ詞ᵗ數組ᵗtable屬性
	 * @param table 
	 * @param words 
	 */
	static checkTable = WordTable.checkTable




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

	
	
	public addWordsOfSameTable(words:Word[]){
		WordDbSrc.checkTable($(this.tableName), words)
		return WordDbSrc.addWordsOfSameTable_fn(this.dbRaw, words)
	}
	
	/**
	 * 由詞形查詢單詞。返回ᵗ單詞數組中table字段與表名 同。
	 * @param db 
	 * @param table 
	 * @param wordShape 
	 * @returns 
	 */
	static qryWordByWordShape = WordTable.qryWordByWordShape


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


	
	public setWordsByIds(words:Word[], ids:number[]){
		const table:string=$(this.tableName)
		return WordDbSrc.setWordsByIds_fn(this.dbRaw, table, words, ids)
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

	/**
	 * 由詞ˉ對象生成 增ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @returns 
	 */
	static genQry_insert = WordTable.genQry_insert

	public static async getAllWords(db:Database, table:string){
		const sql = `SELECT * FROM '${table}'`
		const r = await OldSqlite.all<IVocaRow>(db, sql)
		WordDbSrc.attachTableName(r, table)
		return r
	}public getAllWords(table?:string){
		const table_=table??this.tableName
		return WordDbSrc.getAllWords(this.dbRaw, $(table_))
	}


	/**
	 * 數據庫ʰ既複習ᵗ單詞ˇ批量ᵈ依表名ⁿ存。此函數不可用于初添。
	 * @param db 
	 * @param sws 
	 * @param table 
	 * @returns 
	 */
	static saveWords = WordTable.saveWords

	/**
	 * 數據庫ʰ既複習ᵗ單詞ˇ批量ᵈ依表名ⁿ存。此函數不可用于初添。
	 * 斯方法操作多個表、宜置于DbSrc類洏非Table類
	 * @param db 
	 * @param sws 
	 * @param table 
	 * @returns 
	 */
	saveWords(words:Word[]){
		const z = this
		return z.This.saveWords(z.dbRaw, words)
	}

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
		const rows2d_fn = await OldSqlite.qryValuesInColumn_fn<IVocaRow>(db, table, cl.id ,ids)
		const rows2d = await rows2d_fn()
		const rows = rows2d.flat(1)
		return rows.map(e=>e.wordShape)
	}


}
const C = WordDbSrc
type C = WordDbSrc

// const WordDbSrc = WordDbSrc
// export default WordDbSrc

