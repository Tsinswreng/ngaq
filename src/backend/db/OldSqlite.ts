import {$a, RegexReplacePair, copyIgnoringKeys, delay, lodashMerge, pathAt} from '@shared/Ut';
import sqlite3 from 'sqlite3';
const sqltVb = sqlite3.verbose()
//import { Database,RunResult, Statement } from 'sqlite3';
import { RunResult } from 'sqlite3';
import { SqlitePool } from '@backend/db/sqlite/old_pool/Pool';
type Database = sqlite3.Database
type Statement = sqlite3.Statement
export namespace SqliteType {
	export type Database = sqlite3.Database
	export type Statement = sqlite3.Statement
	export type RunResult = sqlite3.RunResult
	export type NonArrObj = object&{length?:never}
	export class SqlError extends Error{
		constructor(message?: string){
			super(message)
		}
	}
}
import {objArrToStrArr,serialReplace,$} from '@shared/Ut'
import _ from 'lodash';
import * as fs from 'fs'
import Stream from 'stream'
import path from 'path';
const Ut = {
	objArrToStrArr:objArrToStrArr,
	serialReplace:serialReplace,
	$:$
}

/**
 * 訊ˇ格式化˪ᵗ錯誤對象。回調中ᵗerr對象ˋ不含調用堆棧ᵗ訊旹可用此
 * @param err 
 * @param msg 
 * @returns 
 */
const sqlErr=(err:Error, msg?:any)=>{
	let e = {
		name:err?.name,
		message:err?.message,
		stack:err?.stack,
		msg: msg
	}
	return new Error(JSON.stringify(e, null, 2)) 
	//console.log(e)
	//return err
	//return new Error()
}

const raise = (err:Error, ...msg:any[])=>{
	let e = {
		name:err.name,
		message:err.message,
		stack:err.stack,
		msg: msg
	}
	throw new Error(
		JSON.stringify(e)
	)
}

//PRAGMA table_info
export interface SqliteTableInfo{
	cid:number //列ᵗ序
	name:string
	type:string
	notnull: 0|1
	dflt_value:number|null//默認值
	pk:0|1 //主鍵
}

export interface Sqlite_sequence{
	name:string
	seq:number
}

export interface Sqlite_master{
	type:string 
	name:string //存储了数据库对象的名称，包括表、视图、索引等。
	tbl_name:string //也存储了数据库对象的名称，但通常用于描述表（table）对象的名称。
	rootpage:number //rootpage 用于标识一个 B-Tree 的根节点在数据库文件中的页码
	sql:string
}

// export class SqlToValuePair{
// 	constructor(
// 		public sql:string,
// 		public values:any[][]
// 	){}
// }

export class SqlGenerator{
	protected constructor(){

	}

	static new(props:{
		_tblName:string
	}){
		const o = new this()
		Object.assign(o, props)
		return o
	}

	protected _tblName:string
	get tblName(){return this._tblName}

	/**
	 * 生成sql芝重命名表
	 * @param table 
	 * @param neoName 
	 * @returns 
	 */
	static renameTable(table:string, neoName:string){
		const ans = 
`ALTER TABLE '${table}'
RENAME TO ${neoName};`
		return ans
	}

	/**
	 * 生成sql語句芝新增列
	 * @param table 
	 * @param neoColumn 新列
	 * @param type 新列之類型
	 * @param defaultV 默認值。可選。若需設字串以潙默認值旹則需手動增引號㕥裹㞢、㕥使合sql之語法
	 * @returns 
	 */
	static addColumn(table:string, neoColumn:string, type:string, defaultV?){
		let defaultStr = ''
		if(defaultV !== void 0){
			defaultStr = `DEFAULT ${defaultV}`
		}

		let ans = 
`ALTER TABLE '${table}'
ADD COLUMN '${neoColumn}' ${type} ${defaultStr};`
		return ans
	}

	/**
	 * 整數安全ₐ SELECT *
	 * @param db 
	 * @param table 
	 * @param needToBeCastedToText =['INT', 'INTEGER']
	 * @returns 
	 */
	static async selectAllIntSafe(db:Database, table:string, needToBeCastedToText=['INT', 'INTEGER']){
		let part = await OldSqlite.genSql_columnCastToText(db, table, needToBeCastedToText)
		const sql = `SELECT ${part} FROM '${table}'`
		return sql
	}

	/**
	 * id, name, age -> CAST(id AS TEXT)AS id, name, CAST(age AS TEXT)AS age
	 * @param db 
	 * @param table 
	 * @param needToBeCastedToText =['INT', 'INTEGER']
	 * @returns 
	 */
	static async castColTypeToText(db:Database, table:string, needToBeCastedToText=['INT', 'INTEGER']){
		const tableInfos = await OldSqlite.getTableInfo(db, table)
		$a(tableInfos, `tableInfos is empty. table:\n${table}\n:table`)
		const [columns, types] = map_columnToType(tableInfos)
		let casted = cast(columns, types,needToBeCastedToText)
		return casted

		function map_columnToType(tableInfo:SqliteTableInfo[]){
			const columns:string[] = []
			const types:string[] = []
			for(const oneColumn of tableInfo){
				columns.push(oneColumn.name)
				types.push(oneColumn.type)
			}
			return [columns, types]
		}
	
	//map_columnToType:Map<string, string>
		function cast(columns:string[], types:string[], needToBeCastedToText=['INT', 'INTEGER']){
			if(columns.length !== types.length){throw new Error()}
			const set_needToCast = new Set(needToBeCastedToText)
			const items:string[] = []
			for(let i = 0; i < columns.length; i++){
				let unus = ''
				if(	set_needToCast.has(types[i])	){
					let c = columns[i]
					unus = `CAST(${c} AS TEXT) AS ${c}`
				}else{
					unus = columns[i]
				}
				items.push(unus)
			}
			let result = items.join(',')
			return result
		}
	}

	/**
	 * 由對象ᵗ鍵與值 產 sql插入語句。
	 * 若表ᵗ自增主鍵潙id、則obj不宜有id字段。
	 * [2023-09-20T09:18:24.000+08:00]{未驗}
	 * obj:object&{length?:never}
	 * @param table 
	 * @param obj 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	static insert(table:string, obj:SqliteType.NonArrObj, ignoredKeys?:string[]):[string, any[]]{
		if(ignoredKeys !== void 0){
			obj = copyIgnoringKeys(obj, ignoredKeys)
		}
		
		let keys = Object.keys(obj)
		const columns = keys.join(', ');
		const placeholders = keys.map(()=>'?').join(',')
		let insertSql = `INSERT INTO '${table}' (${columns}) VALUES (${placeholders})`
		let values = Object.values(obj)
		return [insertSql,values]
	}

	/**
	 * 由對象ᵗ鍵與值 產 sql修改語句。
	 * 若表ᵗ自增主鍵潙id、則obj不宜有id字段。id當另外傳入作第三個參數。
	 * [2023-09-20T09:18:49.000+08:00]{未驗}
	 * @param table 
	 * @param obj 
	 * @param id 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	static updateById(table:string, obj:object&{length?:never}, id:number|string, ignoredKeys?:string[]):[string, any[]]{
		if(ignoredKeys !== void 0){
			obj = copyIgnoringKeys(obj, ignoredKeys)
		}
		const keys = Object.keys(obj)
		const values:any[] = Object.values(obj) //不寫:any[] vscode不報錯、但ts-node報錯
		values.push(id)
		const updateQuery = `UPDATE '${table}' SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
		return [updateQuery, values]
	}


	/**
	 * getCreateTableSqlTemplateFromSqlite_master
	 * 從sqlite_master査一表之sql字段。返回一個函數作潙建表sql語句之字串模板。
	 * !不嚴謹!
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	static async getCreateTableSqlTemplateFromSqlite_master(db:Database, table:string){
		const sql = `SELECT sql from 'sqlite_master' WHERE type='table' AND name=?`
		const r = await OldSqlite.all<any>(db, sql, table)
		if(r.length === 0){
			throw new Error(`table not exist:\n${table}`)
		}
		//console.log(r)//t
		const originSql:string = $a(r[0].sql as string)
		if(typeof(originSql)!=='string'){throw new Error(`typeof(originSql)!=='string'`)}
		const oldTable = table
		const sqlTemplateFunction:(table:string)=>string = (table:string)=>{
			//sqlite_master中CREATE TABLE 必潙大寫
			const targetSql = originSql.replace(new RegExp(`^CREATE TABLE (['"\`\\[])?${oldTable}(['"\`\\]])?`), `CREATE TABLE '${table}'`)
			return targetSql
		}
		return sqlTemplateFunction
		/*
		<坑>{sqlite_master表中sql字段即初創其表旹所珩之sql。故CREAT TABLE 後之表名有無引號、是何引號皆同於創表旹。
		表名可用引號括起、含: 「''」, 「""」,「``」,「[]」、表名內亦可有引號、只需與最外圍之引號不配對即可、如「['"`]」。但不支持轉義、如叵「'\''」。
		故sqlite之表名可支持絕大多數任意字串、唯「'」「"」「`」「[」或「]」不同時ᵈ現即可。
		}
		*/
	}
}

/**
 * 此庫是sqlite3庫之封裝。
 * 
 *
 */
export default class OldSqlite {
	private constructor(){}

	static SqlGenerator = SqlGenerator

	static sqltVb = sqltVb

	static genSql_SelectAllIntSafe = SqlGenerator.selectAllIntSafe
	static genSql_addColumn = SqlGenerator.addColumn
	static genSql_renameTable = SqlGenerator.renameTable
	static genSql_columnCastToText = SqlGenerator.castColTypeToText
	static genQry_insert = SqlGenerator.insert
	static genQry_updateById = SqlGenerator.updateById
	static getCreateTableSqlTemplateFromSqlite_master = SqlGenerator.getCreateTableSqlTemplateFromSqlite_master

	public static readonly openMode = {
		CREATE : sqltVb.OPEN_CREATE // 不能只寫此、否則無讀ᵗ權
		,READONLY :  sqltVb.OPEN_READONLY
		,READWRITE: sqltVb.OPEN_READWRITE
		,FULLMUTEX: sqltVb.OPEN_FULLMUTEX //確保同一時間只有一個連接可以寫入數據庫。
		,SHAREDCACHE: sqltVb.OPEN_SHAREDCACHE //允許多個連接共享緩存。這樣可以提高性能，但要小心多個連接同時寫入數據庫可能會引起問題。
		,PRIVATECACHE: sqltVb.OPEN_PRIVATECACHE //每個連接都有自己的緩存，不與其他連接共享。
		,URI: sqltVb.OPEN_URI //設置這個選項可以讓數據庫支持 URI 文件名。

		,DEFAULT: sqltVb.OPEN_READWRITE | sqltVb.OPEN_CREATE | sqltVb.OPEN_FULLMUTEX
		,DEFAULT_CREATE : sqltVb.OPEN_READWRITE | sqltVb.OPEN_CREATE | sqltVb.OPEN_FULLMUTEX|sqltVb.OPEN_CREATE
	}

	public static readonly meta ={
		querySqlite_master_unsafeInt:OldSqlite.querySqlite_master_unsafeInt.bind(OldSqlite)
		,qureySqlite_sequence_unsafeInt:OldSqlite.qureySqlite_sequence_unsafeInt
		,getTableInfo:OldSqlite.getTableInfo
	}

	public static readonly sql = {
		genSql_SelectAllIntSafe : OldSqlite.genSql_SelectAllIntSafe
		, genSql_columnCastToText:OldSqlite.genSql_columnCastToText
		, genSql_insert:OldSqlite.genQry_insert
		, genSql_updateById:OldSqlite.genQry_updateById
		, getCreateTableSqlTemplateFromSqlite_master: OldSqlite.getCreateTableSqlTemplateFromSqlite_master
		, genSql_addColumn:OldSqlite.genSql_addColumn
		, genSql_renameTable:OldSqlite.genSql_renameTable
	}

	static readonly genSqy = {
		genQry_insert:OldSqlite.genQry_insert
		, genQry_updateById:OldSqlite.genQry_updateById
	}

	public static readonly stmt = {
		all : OldSqlite.stmtAll
		, get: OldSqlite.stmtGet
		, run : OldSqlite.stmtRun
		, getStmt_selectAllSafe : OldSqlite.getStmt_selectAllSafe
		, getStmt_insertObj: OldSqlite.getStmt_insertObj
	}


	public static readonly fn = {
		stmtGetRows: OldSqlite.stmtGetRows_fn
		, stmtInsertObjs: OldSqlite.stmtInsertObjs_fn
		,dbInsertObjs_fn: OldSqlite.dbInsertObjs_fn
		,qryValuesInColumn_fn: OldSqlite.qryValuesInColumn_fn
	}

	public static readonly table = {
		copyTable : OldSqlite.copyTable
		, isColumnExist: OldSqlite.isColumnExist
		, isTableExist : OldSqlite.isTableExist
		, copyTableStructureCrossDb : OldSqlite.copyTableStructureCrossDb
		, copyTableCrossDb : OldSqlite.copyTableCrossDb
	}

	static readonly pool = SqlitePool.new()

	static connectViaPool(filePath:string, mode?:number){
		return C.pool.connect(filePath, mode)
	}

	/**
	 * 封裝之 無回調ₐ new Database
	 * 異步者也。
	 * @param filePath 
	 * @deprecated
	 * @returns 
	 */
	public static newDatabaseAsync(filePath:string, mode?:number){
		return new sqltVb.Database(filePath, mode, (err)=>{
			if(err){
				//throw err
				//throw sqlErr(err)
				throw err
			}
		})
	}

	/**
	 * 以promise封裝之 無回調ₐ new Database
	 * @param filePath 
	 * @param mode 
	 * @returns 
	 */
	public static newDatabase(filePath:string, mode:number=C.openMode.DEFAULT){
		return new Promise<sqlite3.Database>((res, rej)=>{
			
			const db = new sqltVb.Database((filePath), mode, (err)=>{
				
				if(err){
					//throw sqlErr(err)
					rej(err)
					return
				}
				res(db)
			})
		})
	}

	/**
	 * 不用回調㕥処錯旹、縱已啓用verbose、抛錯旹亦無調用堆棧之訊。
	 * 異步者也、會立即返Statement實例但若有錯則不會立即報錯
	 * @param db 
	 * @param sql 
	 * @param params 
	 * @deprecated
	 * @returns 
	 */
	public static prepareAsync(db:Database, sql:string, params?:any){
		return db.prepare(sql, params, (err)=>{
			if(err){
				throw err
				//throw sqlErr(err)
				//rej(err)
			}
		})
	}

	/**
	 * promise封裝的db.prepare
	 * @param db 
	 * @param sql 
	 * @param params 
	 * @returns 
	 */
	public static prepare(db:Database, sql:string, params?:any){
		return new Promise<Statement>((res, rej)=>{
			const stmt = db.prepare(sql, params, (err)=>{
				if(err){
					//throw err
					//throw sqlErr(err)
					rej(err)//若throw則可能捕不到
					return
				}
				res(stmt)
			})
		})
	}
	
	/**
	 * 封在Promise裏的db.all()、方便在異步函數裏用await取值。
	 * @param db Database 實例
	 * @param sql 
	 * @param params 
	 * @returns 
	 */
	public static all<T>(db:Database, sql:string, params?:any){
		return new Promise<T[]>((s,j)=>{
			db.all<T>(sql, params,(err,rows:T[])=>{
				if(err){
					j(err);return
				}
				s(rows)
			})
		})
	}

	/**
	 * 珩sql、返RunResult
	 * @param db 
	 * @param sql 
	 * @param params 
	 * @returns     {lastID: number,changes: number}
	 */
	public static run(db:Database, sql:string, params?:any){
		return new Promise<RunResult>((s,j)=>{
			db.run(sql, params, function(err){
				if(err){
					j(err); return
					//throw sqlErr(err)
				}
				s(this)
			})
		})
	}
	/*<>{run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;}
	當回調函數ᵗ定義ʸ有this旹、叶回調函數時形參列表不用再寫this。
	又 箭頭函數不能有己ʰ向ᵗthisˉ引用、故需用傳統函數㕥叶回調函數。此旹乃可其內ʸ用this㕥取RunResult。*/

	public static stmtAll<T>(stmt:Statement, params?:any){
		return new Promise<[RunResult,T[]]>((res, rej)=>{
			stmt.all<T>(params, function(err, rows){
				if(err){
					rej(err);return
					//throw sqlErr(err)
				}
				const this_runResult = this
				res([this_runResult,rows])
			})
		})
	}

	/**
	 * select * 查不到結果旹 返 undefined
	 * @param stmt 
	 * @param params 
	 */
	public static stmtGet<T>(stmt:Statement, params:any):Promise<[RunResult,T|undefined]>
	public static stmtGet<T>(stmt:Statement):Promise<(T|undefined)>

	public static stmtGet<T>(stmt:Statement, params?:any){
		if(params !== void 0){
			return new Promise<[RunResult,T|undefined]>((res, rej)=>{
				stmt.get<T>(params, function(err, rows){
					if(err){
						//rej( sqlErr(err) );return //此處抛錯會失調用堆棧ᵗ訊
						rej(err)
						//throw sqlErr(err)
					}
					const this_runResult = this
					res([this_runResult,rows])
				})
			})
		}
		else{
			return new Promise<(T|undefined)>((res, rej)=>{
				stmt.get<T>(function(err, rows){
					if(err){
						rej(err);return
						//throw sqlErr(err)
					}
					res(rows)
					//res([this_runResult,rows])
				})
			})
		}

	}

	
	/**
	 * 每次執行旹回調中之this之指嚮皆同?
	 * @param stmt 
	 * @param params 
	 * @returns 
	 */
	public static stmtRun(stmt:Statement, params?:any){
		return new Promise<RunResult>((res, rej)=>{
			stmt.run(params, function(this, err){
				if(err){
					rej(err)
					return
				}
				const this_runResult = this
				res(this_runResult)
			})
		})
	}



	public static async stream_readAll(db:Database, table:string){
		const sql_selectAll = await OldSqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = OldSqlite.prepareAsync(db, sql_selectAll)
		return OldSqlite.readStream_json(stmt)
	}


	/**
	 * read方法中只get一次。若改成一次get多行也快不了幾多
	 * @param stmt 
	 * @param opts 
	 * @returns 
	 */
	public static readStream_json(
		stmt:Statement
		, opts?:Stream.ReadableOptions
		, preproccess:{
			assign: boolean
			,fn?:Function
		}={
			assign: false
			,fn:(x)=>{return x}
		}
	){ 
		const readStream = new Stream.Readable(opts)
		if(opts!== void 0 &&'read' in opts){}
		else{
			if(preproccess !== void 0 && preproccess.fn !== void 0 && preproccess.assign){
				readStream._read = function(){
					stmt.get((err,row)=>{ //勿傳params、如 若params潙undefined、則get只返表之首行
						if(err){throw err} //AI之寫法:this.emit('error', err); // 如果出现错误，发出错误事件
						if(row == void 0){
							this.push(null)
						}else{
							row = preproccess.fn!(row)
							this.push(
								JSON.stringify(row)+'\n'
							)
						}
					})
				}
			}else if (preproccess !== void 0 && preproccess.fn !== void 0 && preproccess.assign===false){
				readStream._read = function(){
					stmt.get((err,row)=>{ //勿傳params、如 若params潙undefined、則get只返表之首行
						if(err){throw err} //AI之寫法:this.emit('error', err); // 如果出现错误，发出错误事件
						if(row == void 0){
							this.push(null)
						}else{
							preproccess.fn!(row)
							this.push(
								JSON.stringify(row)+'\n'
							)
						}
					})
				}
			}
			else{
				readStream._read = function(){
					stmt.get((err,row)=>{ //勿傳params、如 若params潙undefined、則get只返表之首行
						if(err){throw err} //AI之寫法:this.emit('error', err); // 如果出现错误，发出错误事件
						if(row == void 0){
							this.push(null)
						}else{
							this.push(
								JSON.stringify(row)+'\n'
							)
						}
					})
				}
			}
			
		}
		return readStream
	}


	public static async getStmt_selectAllSafe(db:Database, table:string){
		const sql = await OldSqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = await OldSqlite.prepare(db, sql)
		return stmt
	}

	/**
	 * 取amount個之 數據庫中完整之行
	 * 取盡時則返、故結果之長未必等於amount
	 * 每次調用旹皆從頭始取
	 * 整數安全
	 * @param db 
	 * @param table 
	 * @param amount 
	 * @deprecated
	 * @returns 
	 */
	public static async getManyRows_stmt<T=any>(db:Database, table:string, amount:number){
		const sql = await OldSqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = await OldSqlite.prepare(db, sql)
		return stmt
	}


	/**
	 * 取盡時則返、故結果之長未必等於amount
	 * @param db 
	 * @param stmt 
	 * @param amount 
	 */
	public static async stmtGetRows_transaction<T=any>(db:Database, stmt:Statement, amount:number){
		const fn = OldSqlite.stmtGetRows_fn<T>(stmt, amount)
		return await OldSqlite.transaction(db, fn)
	}

	public static stmtGetRows_fn<T=any>(stmt:Statement, amount:number){
		const result:(T)[] = []
		const fn = async()=>{
			for(let i = 0; i < amount; i++){
				const row = (await OldSqlite.stmtGet<T>(stmt))
				
				if(row === void 0){break}
				result.push(row)
			}
			return result
		}
		return fn
	}


	/**
	 * 插入對象
	 * @param db 
	 * @param table 
	 * @param objs 
	 * @param ignoredKeys 
	 * @returns 
	 */
	public static async dbInsertObjs(db:Database, table:string, objs:SqliteType.NonArrObj[], ignoredKeys?:string[]){
		const [insertSql, ] = OldSqlite.genQry_insert(table, objs[0], ignoredKeys)
		// const stmt = db.prepare(insertSql, function(err){
		// 	if(err){throw err}
		// })
		const stmt = await OldSqlite.prepare(db, insertSql)
		const runResults:RunResult[] =[]
		for(const o of objs){
			const [,params] = OldSqlite.genQry_insert(table, o, ignoredKeys)
			const runResult = await OldSqlite.stmtRun(stmt, params)
			runResults.push(runResult)
		}
		return runResults
	}


	public static dbInsertObjs_fn(db:Database, table:string, objs:SqliteType.NonArrObj[], ignoredKeys?:string[]){
		const fn = async()=>{
			const ans = await C.dbInsertObjs(db, table, objs, ignoredKeys)
			return ans
		}
		return fn
	}


	public static async getStmt_insertObj(db:Database, table:string, objs:SqliteType.NonArrObj, ignoredKeys?:string[]){
		const [insertSql, ] = OldSqlite.genQry_insert(table, objs, ignoredKeys)
		// const stmt = db.prepare(insertSql, function(err){
		// 	if(err){throw err}
		// })
		const stmt = await OldSqlite.prepare(db, insertSql)
		return stmt
	}

	public static async stmtInsertObjs_deprecated(stmt:Statement, table:string, objs:Object[], ignoredKeys?:string[]){
		const runResults:RunResult[] =[]
		const fn = async()=>{
			
		}
		for(const o of objs){
			const [,params] = OldSqlite.genQry_insert(table, o, ignoredKeys)
			const runResult = await OldSqlite.stmtRun(stmt, params)
			runResults.push(runResult)
		}
		return runResults
	}

	public static stmtInsertObjs_fn(db:Database, stmt:Statement, table:string, objs:Object[], ignoredKeys?:string[]){
		const runResults:RunResult[] =[]
		const fn = async()=>{
			for(const o of objs){
				const [,params] = OldSqlite.genQry_insert(table, o, ignoredKeys)
				const runResult = await OldSqlite.stmtRun(stmt, params)
				runResults.push(runResult)
			}
			return runResults
		}
		return fn
	}


	/**
	 * 數據庫中ᵗ表ˇ轉二維數組
	 * 無整數安全
	 * @deprecated
	 * @param db 
	 * @param table 
	 * @param column 
	 * @returns 
	 */
	public static async toStrTable_unsafeInt(db:Database, table:string, column?:string[]){
		let sql
		if(!column){
			sql = `SELECT * FROM '${table}'`
		}else{
			sql = `SELECT ${[...column]} FROM '${table}'`
		}
		let rows = await OldSqlite.all(db, sql)
		return Ut.objArrToStrArr(rows)
	}

	/**
	 * 複製表
	 * @param db 
	 * @param newTable 
	 * @param oldTable 
	 * @returns 
	 */

	public static async copyTable(db:Database, newTable:string, oldTable:string){
		//let sql = `CREATE TABLE '${newTable}' AS SELECT * FROM ${oldTable}` //<坑>{新表ᵗ自增主鍵ˋ不會隨原表}
		//return OldSqlite.all(db, sql)
		const creatSqlFun = await OldSqlite.getCreateTableSqlTemplateFromSqlite_master(db,oldTable)
		const creatSql = creatSqlFun(newTable)
		//console.log(creatSql)//t
		//console.log(`console.log(creatSql)`)
		await OldSqlite.all(db, creatSql)
		const insertSql = `INSERT INTO '${newTable}' SELECT * FROM '${oldTable}'`
		return OldSqlite.all(db, insertSql)
		//return new Promise(()=>{})
	}


	public static checkTableName(table:string){
		if(table[0]===table[table.length-1]){
			if(table[0].match(/['"`\[\]]/g)){}
		}
	}

	/**
	 * 統計表的某列中不重樣的值的數量
	 * @param tableName 
	 * @param columnName 不填列名則每一列都會被統計
	 * @returns 
	 */
	public static async countDistinct(db:Database,tableName:string):Promise<{column_name:string, distinct_count:number}[]>
	public static async countDistinct(db:Database,tableName:string, columnName:string):Promise<number>;
	
	public static async countDistinct(db:Database, tableName:string, columnName?:string){
		if(columnName){
			let sql = `SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
			let r = (await  OldSqlite.all<{distinct_count:number}>(db, sql))[0].distinct_count
			return r
		}else{
			let tableInfo = await OldSqlite.getTableInfo(db, tableName)
			let sql = ''
			//`SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
			for(let i = 0; i < tableInfo.length; i++){
				//console.log(i)
				//console.log(tableInfo[i])
				columnName = tableInfo[i].name
				sql += `SELECT '${columnName}' AS column_name, COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
				if(i !== tableInfo.length-1){sql += ' UNION '}
				else{/* sql += ORDER BY column_name; */}
			}
			
			return await new Promise<{column_name:string, distinct_count:number}[]>((s,j)=>{
				
				db.all(sql, (err, rows:{column_name:string,distinct_count:number}[])=>{
					if(err || rows.length !== tableInfo.length){
						console.error('<sql>');console.error(sql);console.error('</sql>')
						console.error('<tableInfo>');console.error(tableInfo);console.error('</tableInfo>')
						console.error('<rows>');console.error(rows);console.error('</rows>')
						console.error('|| rows.length !== tableInfo.length')
						j(err);
						return
					}
					s(rows)
				})
			})
		}
	}

	/**
	 * 見名知意。
	 * @param db 
	 * @param tableName 
	 * @returns 
	 */
	public static async dropTable(db:Database, tableName:string|string[]){
		if(Array.isArray(tableName)){
			// let sql = `DROP TABLE ?;`
			// let v:string[] = tableName
			// return DictDb.transaction(db, sql, v) <坑>{蓋佔位符ˉ?皆不可㕥代表名}
			let prms:Promise<any>[] = []
			for(let i = 0; i < tableName.length; i++){
				let sql = `DROP TABLE '${tableName[i]}';`
				//console.log(sql)
				prms.push(OldSqlite.all(db,sql))
			}
			//console.log(114514)

			return Promise.all(prms)
		}else{
			let sql = `DROP TABLE ${tableName};`
			return OldSqlite.all(db, sql)
		}
	}

	/**
	 * 
	 * @param db 
	 * @returns 
	 */
	public static async dropAllTables(db:Database){
		let tableNames:string[] = []
		let info = await OldSqlite.querySqlite_master_unsafeInt(db)
		//let prms:Promise<any>[] = []
		for(let i = 0; i < info.length;i++){
			//prms.push(DictDb.DropTable(db,seqs[i].name))
			if(info[i].type === 'table' && info[i].name !== 'sqlite_sequence' && info[i].name !== 'sqlite_master')
			{tableNames.push(info[i].name)}
		}
		return OldSqlite.dropTable(db,tableNames)
		//return Promise.all(prms)
	}

	/**
	 * The only one that must exist is sqlite_master, this is database's schema.
	 * only rootpage is int and it is int32, compatible with number of js
	 * @param db 
	 * @returns 
	 */
	public static async querySqlite_master_unsafeInt(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ OldSqlite.all<Sqlite_master>(db, sql)
	}

	/**
	 * sqlite_sequence will exist if any table includes the AUTOINCREMENT keyword (which is restricted to only being used for an alias of the rowid column).
	 * @param db 
	 * @returns 
	 */
	public static async qureySqlite_sequence_unsafeInt(db:Database){
		let sql = `SELECT * FROM sqlite_sequence`
		return /* await */ OldSqlite.all<Sqlite_sequence>(db, sql)
	}

	/**
	 * 
	 */
	public static async isColumnExist(db:Database, tableName:string, columnName:string){
		let tableInfo = await OldSqlite.getTableInfo(db, tableName)
		for(let i = 0; i < tableInfo.length; i++){
			if(tableInfo[i].name === columnName){
				return true
			}
		}
		return false
	}

	/**
	 * const sql = `PRAGMA table_info('${tableName}')`
	 * @param db 
	 * @param tableName 
	 * @param columnName 若填此則返回
	 */
	public static async getTableInfo(db:Database, tableName:string, columnName:string):Promise<SqliteTableInfo|undefined>
	public static async getTableInfo(db:Database, tableName:string):Promise<SqliteTableInfo[]>
	public static async getTableInfo(db:Database, tableName:string, columnName?:string){
		const sql = `PRAGMA table_info('${tableName}')`
		let prms = OldSqlite.all<SqliteTableInfo>(db,sql)
		if(columnName){
			let infos = await prms
			for(let i = 0; i < infos.length; i++){
				if(infos[i].name === columnName){
					return infos[i]
				}
			}
			return undefined
		}else{
			
			return prms
		}
	}

	/**
	 * 一列ˇ正則表達式ᶤ批量ᵈ換
	 * @param db 
	 * @param table 
	 * @param column 
	 * @param replacementPair 
	 * @deprecated
	 * @returns 
	 */
	public static async serialReplace(db:Database, table:string, column:string, replacementPair:RegexReplacePair[]){
		let sql = `SELECT ${column} AS result FROM '${table}'`
		let result = await OldSqlite.all<{result?:string}>(db, sql)
		let strArr:string[] = []
		for(let i = 0; i < result.length; i++){
			if(!result[i].result){Promise.reject('!result[i].result');return}//似無用
			strArr.push(result[i].result!)
		}
		if(strArr.length !== result.length){Promise.reject('strArr.length !== result.length');return}
		let newStrArr = Ut.serialReplace(strArr, replacementPair)
		let replaceMap:Map<string, string> = new Map()
		for(let i = 0; i < newStrArr.length; i++){
			replaceMap.set(strArr[i], newStrArr[i])
		}
		db.serialize(()=>{
			db.run('BEGIN TRANSACTION');
			//let updateSql = `UPDATE '${table}' SET ${column} = (CASE WHEN ${column}=? THEN ? END)`
			let updateSql = `UPDATE '${table}' SET ${column} = ? WHERE ${column}= ?`
			const stmt = db.prepare(updateSql)
			for(const[k,v] of replaceMap){
				stmt.run([v,k], (err)=>{
					if(err){
						console.error(updateSql)
						console.error([v,k])
						//Promise.reject(err)
						Promise.reject(sqlErr(err))
						;return
					}
				})
			}
			db.run('COMMIT', (err)=>{
				if(err){
					//Promise.reject(err);return
					Promise.reject(sqlErr(err));return
				}
			})
		})
	}

	/**
	 * 若不同db對象指向同一數據庫 則在fn中調用 由別的db產生的statement實例好像也可以
	 * @param db 異步
	 * @param fn 
	 * @returns 
	 */
	public static async transaction<T=any>(db:Database, fn:()=>T):Promise<Awaited<T>>{
		return new Promise<Awaited<T>>((res, rej)=>{
			db.serialize(async()=>{
				await OldSqlite.beginTransaction(db)
				const result: Awaited<T> = await fn() // 須寫await、否則慢如蕪事務
				await OldSqlite.commit(db)
				res(result)
			})
		})
	}

	/**
	 * 始事務
	 * @param db 
	 */
	public static beginTransaction(db:Database){
		return new Promise<void>((res,rej)=>{
			db.run(`BEGIN TRANSACTION`, function(err){
				if(err){
					//throw err
					//throw sqlErr(err)
					rej(err)
				}
				res()
			})
		})
	}

	/**
	 * 提交事務
	 * @param db 
	 */
	public static commit(db:Database){
		return new Promise<void>((res,rej)=>{
			db.run(`COMMIT`, function(err){
				if(err){
					//throw err
					//throw sqlErr(err)
					rej(err)
				}
				res()
			})
		})
	}

	/**
	 * 提交事務
	 * @param db 
	 * @deprecated
	 */
	public static commitAsync(db:Database){
		db.run(`COMMIT`, function(err){
			if(err){
				//throw err
				throw sqlErr(err)
			}
		})
	}



	/**
	 * 手動封裝的TRANSACTION 
	 * 舊版也。只能珩一條sql
	 * @param db 
	 * @param sql 
	 * @param values 
	 * @deprecated
	 * @returns 
	 */
	public static async deprecated_transactionForOneSql<T>(db:Database, sql:string, values:any[]){
		let result:T[] = []
		return new Promise<T[]>((s,j)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
				const stmt = db.prepare(sql, (err)=>{
					if(err){
						//console.error(sql+'\n'+err+'\n');j(err);return
						j(sqlErr(err,sql));return
					} //<坑>{err+''後錯ᵗ訊會丟失行號 勿j(sql+'\n'+err)}
				})
				for(let i = 0; i < values.length; i++){
					stmt.each(values[i], (err, row:T)=>{
						if(err){
							//console.error(sql+'\n'+err+'\n');j(err);return
							j(sqlErr(err,sql));return
						}
						result.push(row)
					})
				}
				db.all('COMMIT', (err,rows)=>{
					if(err){
						//console.error(sql+'\n'+err+'\n');j(err);return
						j(sqlErr(err,sql));return
					}
					s(result)
				})
			})
			
		})
		
	}


	public static async isTableExist(db:Database, table:string){
		let sql = `SELECT name FROM sqlite_master WHERE  type='table' AND name=?;`
		const result = await OldSqlite.all(db, sql, table)
		return result.length!==0
	}

	public static async deprecated_isTableExist(db:Database, tableName:string){
		let sql = `SELECT name FROM sqlite_master WHERE  type='table' AND name='${tableName}';`
		return new Promise<boolean>((resolve, reject)=>{
			db.get(sql, (err, result:any)=>{
				if(err){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw err
				}
				if(!result){
					resolve(false)
					return false
				}
				console.log(result)
				//console.log(result)
				/* if(!result || !result.hasOwnProperty('name')){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw new Error(`!result.hasOwnProperty('name')`)
				} */
				if(result.name === tableName){
					resolve(true)
					return true
					//return true
				}else{
					console.log('<result>')
					console.log(result)
					console.log('</result>')
					console.log('<tableName>')
					console.log(tableName)
					console.log('</tableName>')
					throw new Error('意外')
					//return false
				}
				//resolve(result as string)
			})
			
		})
	}

	/**
	 * 使NOT NULL 之列轉潙 允空值ˌᐪ
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @returns 
	 */
	public static async alterIntoAllowNull(db:Database, tableName:string, columnName:string){
		let info = await OldSqlite.getTableInfo(db, tableName, columnName)
		let type = Ut.$(info).type
		let sql = `ALTER TABLE '${tableName}' MODIFY COLUMN ${columnName} ${type}`
		return OldSqlite.all(db, sql)
	}

	/**
	 * 把一列中的null值轉爲指定值
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @param target 
	 * @returns 
	 */
	public static async castNull(db:Database, tableName:string, columnName:string, target:any){
		let sql = `UPDATE '${tableName}' SET ${columnName} = \ 
CASE WHEN ${columnName} IS NULL THEN ${target} ELSE ${columnName} END;`
		return OldSqlite.all(db, sql)
	}

	/**
	 * 對某列求和、支持字符串轉數字
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @returns 
	 */
	public static async getSum(db:Database, tableName:string, columnName:string):Promise<number>{
		let sql = `SELECT SUM(CASE \
WHEN '${tableName}' NOT NULL AND ${columnName} GLOB '*[0-9]*' \
THEN CAST(${columnName} AS INTEGER) \
ELSE 0 \
END) AS sum_result \
FROM '${tableName}';`
		return (await OldSqlite.all<{sum_result:number}>(db, sql))[0].sum_result
	}



	/**
	 * 跨數據庫複製表結構。若表ˉneoName既存則應報錯
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @returns 
	 */
	public static async copyTableStructureCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){

		const fn_creatSql = await OldSqlite.getCreateTableSqlTemplateFromSqlite_master(srcDb, srcTable)
		const creatSql = fn_creatSql(neoName)
		return OldSqlite.all(targetDb, creatSql)
	}

	/**
	 * 跨數據庫複製表
	 * 不分批、表太大則可能爆內存
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @returns 
	 */

	public static async copyTableCrossDbNonBatch_fn(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){
		const fn_creatSql = await OldSqlite.getCreateTableSqlTemplateFromSqlite_master(srcDb, srcTable)
		const creatSql = fn_creatSql(neoName)
		await OldSqlite.all(targetDb, creatSql)
		//const fn_selectAll = (table:string)=>{return `SELECT * FROM '${table}'`}
		const selectAll_safe = await OldSqlite.genSql_SelectAllIntSafe(srcDb, srcTable)
		//const srcRows = await OldSqlite.all<object>(srcDb, fn_selectAll(srcTable))
		const srcRows = await OldSqlite.all<object>(srcDb, selectAll_safe)
		//console.log(srcRows)//t
		let insertSql = OldSqlite.genQry_insert(neoName, srcRows[0])[0]
		//console.log(insertSql)//t
		const values:any[] = []
		for(const row of srcRows){
			const v:any[] = OldSqlite.genQry_insert(neoName, row)[1]
			//console.log(v)//t
			values.push(v)
		}

		const stmt_select = await OldSqlite.prepare(srcDb, selectAll_safe)
		const stmt_insert = await OldSqlite.prepare(targetDb, insertSql)

		const fn = async()=>{
			for(const v of values){
				await OldSqlite.stmtRun(stmt_insert, v)
				//stmt_insert.run(v)
			}
		}
		
		return fn
	}


	/**
	 * 分批跨數據庫複製表 有transaction
	 * 不能複製空表
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @param batchAmount 每批ᵗ行數、默認8192
	 */
	public static async copyTableCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable, batchAmount=8192){
		
		try {
			await OldSqlite.copyTableStructureCrossDb(srcDb, srcTable, targetDb, neoName)
			//console.log('modor')
			//return //t
			let stmt_selectAllSafe = await OldSqlite.stmt.getStmt_selectAllSafe(srcDb, srcTable)
			//const firstRow = (await OldSqlite.getManyRows_transaction(srcDb, srcTable, 1))[0]
			const firstRow = await OldSqlite.stmt.get<Object>(stmt_selectAllSafe)
			if(firstRow == void 0){
				return
			}
			const stmt_insert = await OldSqlite.getStmt_insertObj(targetDb, neoName, $(firstRow))
			const sql = await OldSqlite.sql.genSql_SelectAllIntSafe(srcDb, srcTable)
			//console.log(sql)//t 如sql謬則有調用堆棧
			const stmt_get = await OldSqlite.prepare(srcDb, sql)
			// 注意 事務不能嵌套
			// srcDb 和targetDb不是同一個db、不能放在同一個transaction裏
	
			stmt_selectAllSafe = await OldSqlite.stmt.getStmt_selectAllSafe(srcDb, srcTable)
			const fn_stmtGet = await OldSqlite.fn.stmtGetRows(stmt_selectAllSafe, batchAmount)
			
			
			for(let i = 0;;i++){
				
				process.stdout.write(`\r${i}`)
				//const rows = await OldSqlite.stmtGetRows_transaction(srcDb, stmt_get, batchAmount) //不能用getManyRows、因每次循環旹其內ᵗstmt皆異
				//const rows = await OldSqlite.stmt.get(stmt_selectAllSafe, batchAmount)[1] //此處抛錯則泯調用堆棧訊
				const rows = await OldSqlite.transaction(srcDb, fn_stmtGet)
				//await OldSqlite.stmtInsertObjs_transaction(targetDb, stmt_insert, neoName, rows) // *
				const fn_insert = await OldSqlite.fn.stmtInsertObjs(targetDb, stmt_insert, neoName, rows)
				//await OldSqlite.stmt.run(stmt_insert, rows)
				await OldSqlite.transaction(targetDb, fn_insert)
				if(rows.length !== batchAmount){break}
			}
		} catch (error) {
			throw error
		}

	}


	public static async qryValuesInColumn_fn<T>(db:Database, table:string, column:string, values:any[]){
		const selector = await OldSqlite.sql.genSql_columnCastToText(db, table)
		const sql = `SELECT ${selector} FROM '${table}' WHERE ${column}=?`
		const stmt = await OldSqlite.prepare(db, sql)
		const fn=async()=>{
			const result:T[][] = []
			for(const v of values){
				const [,rows] = await OldSqlite.stmtAll<T>(stmt, v)
				result.push(rows)
			}
			
			return result
		}
		return fn
	}


	public static async filterExistTables(db:Database, tables:any[]){
		const nonNullTables:string[] = []
		for(const u of tables){
			const b = await OldSqlite.isTableExist(db,u)
			if(b){nonNullTables.push(u)}
		}
		return nonNullTables
	}

	/**把索引學完再來寫
	 * 創索引
	 * @param db 
	 * @param table 
	 * @param column 
	 * @param indexName 
	 * @returns 
	 */
	// public static createIndex(db:Database, table:string, column:string, indexName:string=column){
	// 	const sql = `CREATE INDEX '${indexName}' ON '${table}' (${column})`
	// 	return C.run(db, sql)
	// }

}
const C = OldSqlite;
type C = OldSqlite



