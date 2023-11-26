import {$a, RegexReplacePair, copyIgnoringKeys, delay, lodashMerge} from '@shared/Ut';
import sqlite3 from 'sqlite3';
const sqltVb = sqlite3.verbose()
//import { Database,RunResult, Statement } from 'sqlite3';
import { RunResult } from 'sqlite3';
type Database = sqlite3.Database
type Statement = sqlite3.Statement
export namespace SqliteType {
	export type Database = sqlite3.Database
	export type Statement = sqlite3.Statement
	export type RunResult = sqlite3.RunResult
	export type NonArrObj = object&{length?:never}
}
import {objArrToStrArr,serialReplace,$} from '@shared/Ut'
import _ from 'lodash';
import * as fs from 'fs'
import Stream from 'stream'

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


/**
 * 此庫是sqlite3庫之封裝。
 * 
 *
 */
export default class Sqlite{
	private constructor(){}

	static sqltVb = sqltVb

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
		querySqlite_master_unsafeInt:Sqlite.querySqlite_master_unsafeInt
		,qureySqlite_sequence_unsafeInt:Sqlite.qureySqlite_sequence_unsafeInt
		,getTableInfo:Sqlite.getTableInfo
	}

	public static readonly sql = {
		genSql_SelectAllIntSafe : Sqlite.genSql_SelectAllIntSafe
		, genSql_columnCastToText:Sqlite.genSql_columnCastToText
		, genSql_insert:Sqlite.genSql_insert
		, genSql_updateById:Sqlite.genSql_updateById
		, getCreateTableSqlTemplateFromSqlite_master: Sqlite.getCreateTableSqlTemplateFromSqlite_master
	}

	public static readonly stmt = {
		all : Sqlite.stmtAll
		, get: Sqlite.stmtGet
		, run : Sqlite.stmtRun
		, getStmt_selectAllSafe : Sqlite.getStmt_selectAllSafe
		, getStmt_insertObj: Sqlite.getStmt_insertObj
	}

	public static readonly transactions = {
		getManyRows: Sqlite.getManyRows_transaction
		, stmtGetRows: Sqlite.stmtGetRows_transaction
		,stmtInsertObjs :Sqlite.stmtInsertObjs_transaction
		,dbInsertObjs:Sqlite.dbInsertObjs_transaction
	}

	public static readonly fn = {
		stmtGetRows: Sqlite.stmtGetRows_fn
		, stmtInsertObjs_fn: Sqlite.stmtInsertObjs_fn
	}

	public static readonly table = {
		copyTable : Sqlite.copyTable 
		, isColumnExist: Sqlite.isColumnExist
		, isTableExist : Sqlite.isTableExist
		, copyTableStructureCrossDb : Sqlite.copyTableStructureCrossDb
		, copyTableCrossDbNonBatch : Sqlite.copyTableCrossDbNonBatch
		, copyTableCrossDb : Sqlite.copyTableCrossDb
		, qryByIds_unsafeInt: Sqlite.qryByIds_unsafeInt
		, qryValuesInColumn_unsafeInt : Sqlite.qryValuesInColumn_unsafeInt
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
				throw sqlErr(err)
			}
		})
	}

	/**
	 * 以promise封裝之 無回調ₐ new Database
	 * @param filePath 
	 * @param mode 
	 * @returns 
	 */
	public static newDatabase(filePath:string, mode?:number){
		return new Promise<sqlite3.Database>((res, rej)=>{
			const db = new sqltVb.Database(filePath, mode, (err)=>{
				if(err){
					throw sqlErr(err)
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
				//throw err
				throw sqlErr(err)
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
					throw sqlErr(err)
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
					//console.error(sql+'\n'+err+'\n');j(err);return
					//j(sqlErr(err,sql));
					//j(err)
					throw sqlErr(err)
					//throw new Error()
					//throw sqlErr(err, sql)//t
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
					//console.error(sql+'\n'+err+'\n');j(err);return
					//j(err); return
					throw sqlErr(err)
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
					//rej(err);return
					throw sqlErr(err)
				}
				const this_runResult = this
				res([this_runResult,rows])
			})
		})
	}

	public static stmtGet<T>(stmt:Statement, params:any):Promise<[RunResult,T|undefined]>
	public static stmtGet<T>(stmt:Statement):Promise<(T|undefined)>

	public static stmtGet<T>(stmt:Statement, params?:any){
		if(params !== void 0){
			return new Promise<[RunResult,T|undefined]>((res, rej)=>{
				stmt.get<T>(params, function(err, rows){
					if(err){
						//rej(err);return
						throw sqlErr(err)
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
						//rej(err);return
						throw sqlErr(err)
					}
					res(rows)
					//res([this_runResult,rows])
				})
			})
		}

	}

	
	public static stmtRun(stmt:Statement, params?:any){
		return new Promise<RunResult>((res, rej)=>{
			stmt.run(params, function(err){
				if(err){
					//rej(err);return
					//console.log(new Error())//t
					//console.error(err)
					//console.log(`調用堆棧ᵗ訊ˋ泯`)
					//似當錯潙 SQLITE_BUSY 旹 則 必無調用堆棧之訊
					//throw err
					//throw sqlErr(err)
					//rej(sqlErr(err))
					throw sqlErr(err)
				}
				const this_runResult = this
				res(this_runResult)
			})
		})
	}



	public static async stream_readAll(db:Database, table:string){
		const sql_selectAll = await Sqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = Sqlite.prepareAsync(db, sql_selectAll)
		return Sqlite.readStream(stmt)
	}


	/**
	 * 
	 * @param stmt 
	 * @param opts 
	 * @deprecated
	 * @returns 
	 */
	public static readStream(stmt:Statement, opts?:Stream.ReadableOptions){
		const readStream = new Stream.Readable(opts)
		if(opts!== void 0 &&'read' in opts){}
		else{
			readStream._read = function(){
				stmt.get((err,row)=>{ //勿傳params、如 若params潙undefined、則get只返表之首行
					if(err){throw err} //AI之寫法:this.emit('error', err); // 如果出现错误，发出错误事件
					if(row == void 0){
						this.push(null)
					}else{
						this.push(
							JSON.stringify(row)
						)
					}
				})
			}
		}
		return readStream
	}

	public static async getStmt_selectAllSafe(db:Database, table:string){
		const sql = await Sqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = await Sqlite.prepare(db, sql)
		return stmt
	}

	/**
	 * 取amount個之 數據庫中完整之行
	 * 取盡時則返、故結果之長未必等於amount
	 * 每次調用旹皆從頭始取
	 * @param db 
	 * @param table 
	 * @param amount 
	 * @returns 
	 */
	public static async getManyRows_transaction<T=any>(db:Database, table:string, amount:number){
		const sql = await Sqlite.genSql_SelectAllIntSafe(db, table)
		const stmt = await Sqlite.prepare(db, sql)
		return Sqlite.stmtGetRows_transaction<T>(db, stmt, amount)
		// const fn=async()=>{
		// 	const result:(T|undefined)[] = []
		// 	for(let i = 0; i < amount; i++){
		// 		const row = (await Sqlite.stmtGet<T>(stmt))[1]
		// 		result.push(row)
		// 	}
		// 	return result
		// }
		// const result = await Sqlite.transaction(db, fn)
		// return result
	}

	/**
	 * 取盡時則返、故結果之長未必等於amount
	 * @param db 
	 * @param stmt 
	 * @param amount 
	 */
	public static async stmtGetRows_transaction<T=any>(db:Database, stmt:Statement, amount:number){
		const fn = Sqlite.stmtGetRows_fn<T>(stmt, amount)
		return await Sqlite.transaction(db, fn)
	}

	public static stmtGetRows_fn<T=any>(stmt:Statement, amount:number){
		const result:(T)[] = []
		const fn = async()=>{
			for(let i = 0; i < amount; i++){
				const row = (await Sqlite.stmtGet<T>(stmt))
				
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
		const [insertSql, ] = Sqlite.genSql_insert(table, objs[0], ignoredKeys)
		// const stmt = db.prepare(insertSql, function(err){
		// 	if(err){throw err}
		// })
		const stmt = await Sqlite.prepare(db, insertSql)
		const runResults:RunResult[] =[]
		for(const o of objs){
			const [,params] = Sqlite.genSql_insert(table, o, ignoredKeys)
			const runResult = await Sqlite.stmtRun(stmt, params)
			runResults.push(runResult)
		}
		return runResults
	}

	public static async dbInsertObjs_transaction(db:Database, table:string, objs:SqliteType.NonArrObj[], ignoredKeys?:string[]){
		const fn = async()=>{
			const ans = await C.dbInsertObjs(db, table, objs, ignoredKeys)
			return ans
		}
		return C.transaction(db, fn)
	}

	public static async getStmt_insertObj(db:Database, table:string, objs:SqliteType.NonArrObj, ignoredKeys?:string[]){
		const [insertSql, ] = Sqlite.genSql_insert(table, objs, ignoredKeys)
		// const stmt = db.prepare(insertSql, function(err){
		// 	if(err){throw err}
		// })
		const stmt = await Sqlite.prepare(db, insertSql)
		return stmt
	}

	public static async stmtInsertObjs_deprecated(stmt:Statement, table:string, objs:Object[], ignoredKeys?:string[]){
		const runResults:RunResult[] =[]
		const fn = async()=>{
			
		}
		for(const o of objs){
			const [,params] = Sqlite.genSql_insert(table, o, ignoredKeys)
			const runResult = await Sqlite.stmtRun(stmt, params)
			runResults.push(runResult)
		}
		return runResults
	}

	public static stmtInsertObjs_fn(db:Database, stmt:Statement, table:string, objs:Object[], ignoredKeys?:string[]){
		const runResults:RunResult[] =[]
		const fn = async()=>{
			for(const o of objs){
				const [,params] = Sqlite.genSql_insert(table, o, ignoredKeys)
				const runResult = await Sqlite.stmtRun(stmt, params)
				runResults.push(runResult)
			}
			return runResults
		}
		return fn
	}

	public static async stmtInsertObjs_transaction(db:Database, stmt:Statement, table:string, objs:Object[], ignoredKeys?:string[]){
		const runResults:RunResult[] =[]
		const fn = async()=>{
			for(const o of objs){
				const [,params] = Sqlite.genSql_insert(table, o, ignoredKeys)
				const runResult = await Sqlite.stmtRun(stmt, params) //*
				runResults.push(runResult)
			}
			return runResults
		}
		return Sqlite.transaction(db, fn)
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
		let rows = await Sqlite.all(db, sql)
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
		//return Sqlite.all(db, sql)
		const creatSqlFun = await Sqlite.getCreateTableSqlTemplateFromSqlite_master(db,oldTable)
		const creatSql = creatSqlFun(newTable)
		//console.log(creatSql)//t
		//console.log(`console.log(creatSql)`)
		await Sqlite.all(db, creatSql)
		const insertSql = `INSERT INTO '${newTable}' SELECT * FROM '${oldTable}'`
		return Sqlite.all(db, insertSql)
		//return new Promise(()=>{})
	}

	/**
	 * 從sqlite_master査一表之sql字段。返回一個函數作潙建表sql語句之字串模板。
	 * !不嚴謹!
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static async getCreateTableSqlTemplateFromSqlite_master(db:Database, table:string){
		const sql = `SELECT sql from 'sqlite_master' WHERE type='table' AND name=?`
		const r = await Sqlite.all<any>(db, sql, table)
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
			let r = (await  Sqlite.all<{distinct_count:number}>(db, sql))[0].distinct_count
			return r
		}else{
			let tableInfo = await Sqlite.getTableInfo(db, tableName)
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
				prms.push(Sqlite.all(db,sql))
			}
			//console.log(114514)

			return Promise.all(prms)
		}else{
			let sql = `DROP TABLE ${tableName};`
			return Sqlite.all(db, sql)
		}
	}

	/**
	 * 
	 * @param db 
	 * @returns 
	 */
	public static async dropAllTables(db:Database){
		let tableNames:string[] = []
		let info = await Sqlite.querySqlite_master_unsafeInt(db)
		//let prms:Promise<any>[] = []
		for(let i = 0; i < info.length;i++){
			//prms.push(DictDb.DropTable(db,seqs[i].name))
			if(info[i].type === 'table' && info[i].name !== 'sqlite_sequence' && info[i].name !== 'sqlite_master')
			{tableNames.push(info[i].name)}
		}
		return Sqlite.dropTable(db,tableNames)
		//return Promise.all(prms)
	}

	/**
	 * The only one that must exist is sqlite_master, this is database's schema.
	 * @param db 
	 * @returns 
	 */
	public static async querySqlite_master_unsafeInt(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ Sqlite.all<Sqlite_master>(db, sql)
	}

	/**
	 * sqlite_sequence will exist if any table includes the AUTOINCREMENT keyword (which is restricted to only being used for an alias of the rowid column).
	 * @param db 
	 * @returns 
	 */
	public static async qureySqlite_sequence_unsafeInt(db:Database){
		let sql = `SELECT * FROM sqlite_sequence`
		return /* await */ Sqlite.all<Sqlite_sequence>(db, sql)
	}

	/**
	 * 
	 */
	public static async isColumnExist(db:Database, tableName:string, columnName:string){
		let tableInfo = await Sqlite.getTableInfo(db, tableName)
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
		let prms = Sqlite.all<SqliteTableInfo>(db,sql)
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
		let result = await Sqlite.all<{result?:string}>(db, sql)
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
	 * @param db 
	 * @param fn 
	 * @returns 
	 */
	public static async transaction<T=any>(db:Database, fn:()=>T):Promise<Awaited<T>>{
		return new Promise<Awaited<T>>((res, rej)=>{
			db.serialize(async()=>{
				await Sqlite.beginTransaction(db)
				const result: Awaited<T> = await fn() // 須寫await、否則慢如蕪事務
				await Sqlite.commit(db)
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
					throw sqlErr(err)
				}
				res()
			})
		})
	}

	/**
	 * 始事務
	 * @param db 
	 */
	public static commit(db:Database){
		return new Promise<void>((res,rej)=>{
			db.run(`COMMIT`, function(err){
				if(err){
					//throw err
					throw sqlErr(err)
				}
				res()
			})
		})

	}

	/**
	 * 始事務
	 * @param db 
	 * @deprecated
	 */
	public static beginTransactionAsync(db:Database){
		db.run(`BEGIN TRANSACTION`, function(err){
			if(err){
				//throw err
				throw sqlErr(err)
			}
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
	 * 手動ᵈ封裝ᵗ事務 
	 * @param db 
	 * @template T 數據庫中每行ᵗ類型 
	 * @param {{sql:string, values:any[][]}[]} sqlToValuePairs values必須是二維數組、否則報錯。未用佔位符旹則設潙[[],[]]
	 * @param {'each'|'run'} method statement對象ˋ將調ᵗ函數
	 * @returns {Promise<[T[][][], RunResult[][][]]>}  第n條sql對應T[n]和RunResult[n]
	 * @deprecated
	 * @instance
	 * 
	 */
	// public static async transaction_complex<T>(
	// 	db:Database,
	// 	//sqlToValuePairs:{sql:string, values:any[][]}[],
	// 	sqlToValuePairs:SqlToValuePair[],
	// 	method: 'each'|'run'
	// ){
	// 	const result3D:T[][][] = []
	// 	const runResult3D: RunResult[][][] = []
	// 	return new Promise<[T[][][], RunResult[][][]]>((res,rej)=>{
	// 		db.serialize(()=>{
	// 			db.run('BEGIN TRANSACTION')
	// 			//<遍歷sql>
	// 			for(let i = 0; i < sqlToValuePairs.length; i++){
	// 				const curSql:string = sqlToValuePairs[i].sql;
	// 				const value2D:(any|undefined)[][] = sqlToValuePairs[i].values
	// 				//[[1],[2],[3]]
	// 				if(!Array.isArray(value2D)){throw new Error(`!Array.isArray(value2D)`)}
	// 				const result2D:T[][] = []
	// 				const runResult2D:RunResult[][] = []
	// 				const stmt = db.prepare(curSql, (err)=>{
	// 					if(err){rej((err));return}
	// 					const each = ()=>{
	// 						for(const value1D of value2D){
	// 							const result1D:T[] = []
	// 							const runResult1D:RunResult[] = []
	// 							if(!Array.isArray(value1D)){throw new Error(`!Array.isArray(value1D)`)}
	// 							stmt.each<T>(value1D, function(this, err, row:T){ // AI謂ˌ査無果旹不珩回調。
	// 								if(err){
	// 									console.error(value2D)//t
	// 								rej(sqlErr(err, [curSql, value2D]));return
	// 								}//<坑>{err對象中不帶行號與調用堆棧之訊}
	// 								result1D.push(row)
	// 								runResult1D.push(this)
	// 							})
	// 							result2D.push(result1D)
	// 							runResult2D.push(runResult1D)
	// 						}
	// 					}
	// 					const run = ()=>{
	// 						for(const value1D of value2D){
	// 							if(!Array.isArray(value1D)){throw new Error(`!Array.isArray(value1D)`)}
	// 							const runResult1D:RunResult[] = []
	// 							stmt.run(value1D, function(this, err){
	// 								if(err){
	// 									console.error(`console.error(curSql)`)
	// 									console.error(curSql)//t
	// 									console.error(`console.error(curValue)`)
	// 									console.error(value2D)//t
	// 									rej(sqlErr(err, [curSql, value2D]));return
	// 								}
	// 									//innerResult.push(row)
	// 									runResult1D.push(this)
	// 							})
	// 							runResult2D.push(runResult1D)
	// 						}
							
	// 					}
	// 					switch(method){
	// 						case 'each': each(); break;
	// 						case 'run': run(); break;
	// 						default: rej('unmatched method')
	// 					}
	// 				})
	// 				result3D.push(result2D)
	// 				runResult3D.push(runResult2D)
	// 			}
	// 			//</遍歷sql>
	// 			db.run('COMMIT', function(err){
	// 				if(err){
	// 					rej(sqlErr(err, sqlToValuePairs));return
	// 				}
	// 				res([result3D,runResult3D])
	// 			})
	// 		})
	// 	})
	// }


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
		const result = await Sqlite.all(db, sql, table)
		return result.length===0
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
		let info = await Sqlite.getTableInfo(db, tableName, columnName)
		let type = Ut.$(info).type
		let sql = `ALTER TABLE '${tableName}' MODIFY COLUMN ${columnName} ${type}`
		return Sqlite.all(db, sql)
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
		return Sqlite.all(db, sql)
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
		return (await Sqlite.all<{sum_result:number}>(db, sql))[0].sum_result
	}


	/**
	 * 
	 * @param db 
	 * @param table 
	 * @param column 
	 * @param value 
	 */
	// public static countOccurrences(db:Database, table:string, column:string, value:any[]){
	// 	function getSql(table:string, column:string){
	// 		return `SELECT COUNT(*) FROM '${table}' WHERE ${column}=?` //寫binary似報錯
	// 	}
	// 	//return Sqlite.transaction()
	// }


	/**
	 * 由對象ᵗ鍵與值 產 sql插入語句。
	 * 若表ᵗ自增主鍵潙id、則obj不宜有id字段。
	 * [2023-09-20T09:18:24.000+08:00]{未驗}
	 * obj:object&{length?:never}
	 * @param table 
	 * @param obj 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	public static genSql_insert(table:string, obj:SqliteType.NonArrObj, ignoredKeys?:string[]):[string, any[]]{
		if(ignoredKeys !== void 0){
			obj = copyIgnoringKeys(obj, ignoredKeys)
		}
		
		let keys = Object.keys(obj)
		// for(const k of keys){
		// 	if(	typeof (obj[k]) === 'string'	){
		// 		obj[k] = obj[k]+''
		// 	}
		// }
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
	public static genSql_updateById(table:string, obj:object&{length?:never}, id:number, ignoredKeys?:string[]):[string, any[]]{
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
	 * 跨數據庫複製表結構。若表ˉneoName既存則應報錯
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @returns 
	 */
	public static async copyTableStructureCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){
		const fn_creatSql = await Sqlite.getCreateTableSqlTemplateFromSqlite_master(srcDb, srcTable)
		const creatSql = fn_creatSql(neoName)
		return Sqlite.all(targetDb, creatSql)
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
	public static async copyTableCrossDbNonBatch(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){
		const fn_creatSql = await Sqlite.getCreateTableSqlTemplateFromSqlite_master(srcDb, srcTable)
		const creatSql = fn_creatSql(neoName)
		await Sqlite.all(targetDb, creatSql)
		//const fn_selectAll = (table:string)=>{return `SELECT * FROM '${table}'`}
		const selectAll_safe = await Sqlite.genSql_SelectAllIntSafe(srcDb, srcTable)
		//const srcRows = await Sqlite.all<object>(srcDb, fn_selectAll(srcTable))
		const srcRows = await Sqlite.all<object>(srcDb, selectAll_safe)
		//console.log(srcRows)//t
		let insertSql = Sqlite.genSql_insert(neoName, srcRows[0])[0]
		//console.log(insertSql)//t
		const values:any[] = []
		for(const row of srcRows){
			const v:any[] = Sqlite.genSql_insert(neoName, row)[1]
			//console.log(v)//t
			values.push(v)
		}

		const stmt_select = await Sqlite.prepare(srcDb, selectAll_safe)
		const stmt_insert = await Sqlite.prepare(targetDb, insertSql)

		const fn = async()=>{
			for(const v of values){
				await Sqlite.stmtRun(stmt_insert, v)
				//stmt_insert.run(v)
			}
		}
		
		return Sqlite.transaction(targetDb, fn)

		
		//return Sqlite.transaction(targetDb, [{sql:insertSql, values:values}], 'run')
	}

	/**
	 * 分批跨數據庫複製表
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @param batchAmount 每批ᵗ行數、默認8192
	 */
	public static async copyTableCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable, batchAmount=8192){
		
		await Sqlite.copyTableStructureCrossDb(srcDb, srcTable, targetDb, neoName)
		//console.log('modor')
		//return //t
		const firstRow = (await Sqlite.getManyRows_transaction(srcDb, srcTable, 1))[0]
		const stmt_insert = await Sqlite.getStmt_insertObj(targetDb, neoName, firstRow)
		const sql = await Sqlite.sql.genSql_SelectAllIntSafe(srcDb, srcTable)
		//console.log(sql)//t 如sql謬則有調用堆棧
		const stmt_get = await Sqlite.prepare(srcDb, sql)
		// 注意 事務不能嵌套
		// srcDb 和targetDb不是同一個db、不能放在同一個transaction裏

		for(let i = 0;;i++){
			
			process.stdout.write(`\r${i}`)
			const rows = await Sqlite.stmtGetRows_transaction(srcDb, stmt_get, batchAmount) //不能用getManyRows、因每次循環旹其內ᵗstmt皆異
			await Sqlite.stmtInsertObjs_transaction(targetDb, stmt_insert, neoName, rows) // *
			if(rows.length !== batchAmount){break}
		}
		//const getRowFn = Sqlite.stmtGetRows_fn(stmt_get, batchAmount)
		
		// const fn = async()=>{
		// 	for(;;){
		// 		//const rows = await Sqlite.stmtGetRows_transaction(srcDb, stmt_get, batchAmount) //不能用getManyRows、因每次循環旹其內ᵗstmt皆異
		// 		//await Sqlite.stmtInsertObjs_transaction(targetDb, stmt_insert, neoName, rows)
		// 		const rows = await getRowFn() //fast
		// 		//console.log(`console.log(rows.length)`)
		// 		//console.log(rows.length)
		// 		//const insertFn = Sqlite.stmtInsertObjs_fn(targetDb, stmt_insert, neoName, rows)
		// 		//await insertFn()
		// 		for(const r of rows){
		// 			const [,v] = Sqlite.sql.getSql_insert(neoName, r)
		// 			await Sqlite.stmtRun(stmt_insert, v)
		// 		}
				
		// 		if(rows.length !== batchAmount){break}
		// 	}
			
		// }
		// return Sqlite.transaction(targetDb, fn)
	}

	// public static async copyTableCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){
	// 	const isNeoNameExist = await Sqlite.isTableExist(targetDb, neoName)
	// 	// if already exist
	// 	if(!isNeoNameExist){throw new Error()}

	// 	const fn_creatSql = await Sqlite.getCreatTableSqlTemplateFromSqlite_master(srcDb, srcTable)
	// 	const creatSql = fn_creatSql(neoName)
	// 	await Sqlite.all(targetDb, creatSql)
	// 	const sql_selectAll = await Sqlite.getSql_SelectAllIntSafe(srcDb, srcTable)
	// 	//const sql_selectAll = `SELECT * FROM '${srcTable}'` //t // 一樣會報datatype mismatch
	// 	const srcStmt = Sqlite.prepare(srcDb, sql_selectAll)
	// 	//srcDb.prepare(sql_selectAll)
		
	// 	const srcReadStream = Sqlite.readStream(srcStmt)
		
	// 	let srcStmt2: Statement|null = Sqlite.prepare(srcDb, sql_selectAll)
	// 	//srcDb.prepare(sql_selectAll)
	// 	let firstRow:any = (await Sqlite.stmtGet(srcStmt2))[1]
	// 	const insertSql:string = Sqlite.getSql_insert(neoName, $(firstRow))[0]
	// 	srcStmt2 = null
	// 	firstRow = null
	// 	const targetStmt = Sqlite.prepare(targetDb, insertSql)
	// 	//const testSql = `INSERT INTO '${neoName}' (id, wordShape, pronounce, mean, annotation, tag, times_add, dates_add, times_rmb, dates_rmb, times_fgt, dates_fgt, source) VALUES (CAST(? AS INTEGER),?,?,?,?,?,?,?,?,?,?,?,?)`//t
	// 	//const testStmt = Sqlite.prepare(targetDb,testSql)//t
	// 	//targetDb.prepare(insertSql)

	// 	// return new Promise(async(res, rej)=>{
	// 	// 	try {
	// 	// 		const runResult:RunResult[] = []
	// 	// 		let stmt:Statement
	// 	// 		let i = 0;
	// 	// 		// @ts-ignore
	// 	// 		for await (const chunk of srcReadStream.iterator()){
	// 	// 			console.log(i)//t
	// 	// 			console.log(
	// 	// 				String(chunk)
	// 	// 			)//t
	// 	// 			const row = JSON.parse(chunk)

	// 	// 			if(i===0){
	// 	// 				stmt =await Sqlite.getStmt_insertObj(targetDb, neoName, row)
	// 	// 			}
	// 	// 			const unusResult = (await Sqlite.stmtInsertObjs($(stmt!), neoName, [row]))[0]
	// 	// 			runResult.push(unusResult)
	// 	// 			i++
					
	// 	// 		}
	// 	// 		res(runResult)
	// 	// 	} catch (er) {
	// 	// 		throw er
	// 	// 	}
			
	// 	// })

	// 	// return new Promise<RunResult[]>(async(res, rej)=>{
	// 	// 	const runResults:RunResult[]=[]
	// 	// 	let cnt = 0;//t
	// 	// 	let chunk:string;
	// 	// 	//console.log(srcReadStream.isPaused()) false
	// 	// 	srcReadStream.once('readable', async()=>{
	// 	// 		console.log(`a`)

	// 	// 		for(;(chunk = srcReadStream.read())!=null;){
	// 	// 			cnt++
	// 	// 			console.log(cnt)//t
	// 	// 			console.log(String(chunk))//t
	// 	// 			let row = JSON.parse(chunk)
	// 	// 			const params = Sqlite.getSql_insert(neoName, row)[1]
	// 	// 			// console.log(`console.log(insertSql)`)
	// 	// 			// console.log(insertSql)
	// 	// 			// console.log(`console.log(params)`)
	// 	// 			// console.log(params)
	// 	// 			const unusRunResult = await Sqlite.stmtRun(targetStmt, params) //縱改用once亦報錯 datatype dismatch、蓋非並行干擾之咎
	// 	// 			runResults.push(unusRunResult)
	// 	// 		}
	// 	// 		res(runResults)
	// 	// 	})
	// 	// })

	// 	return new Promise<RunResult[]>((res, rej)=>{
	// 		const runResults:RunResult[]=[]
	// 		let cnt = 0;//t
	// 		let cnt2 = 0
	// 		srcReadStream.on('data', async(chunk:string)=>{ //異步者也、有弊焉
	// 			try {
	// 				let row = JSON.parse(chunk)
	// 				const params = Sqlite.getSql_insert(neoName, row)[1]
	// 				//console.log(cnt)//t
	// 				//const unusRunResult = await Sqlite.stmtRun(targetStmt, params)// *
	// 				Sqlite.stmtRun(targetStmt, params).then(()=>{
	// 					console.log(cnt2)
	// 					cnt2++ // very slow
	// 				})
	// 				//runResults.push(unusRunResult) 
	// 				//console.log(cnt)
	// 				//console.log(runResults)//t //多個異步操作ˋ改ᵣ同一數組、檢既知有蠹
	// 				cnt++
	// 			} catch (er) {
	// 				//console.error(e)
	// 				const e:any = er
	// 				srcReadStream.destroy()
	// 				console.error(`err in try catch in on data`) // showed
	// 				throw e
	// 				//rej(e)
	// 				//return
	// 			}
				
	// 			/* targetStmt.run(params, function(err){
	// 				if(err){
	// 					throw err
	// 				}
	// 				runResults.push(this)
	// 			}) */
	// 		})

	// 		srcReadStream.on('end', ()=>{
	// 			srcReadStream.destroy()
	// 			res(runResults)
	// 		})
	// 		srcReadStream.on('error',(err)=>{
	// 			if(err){
	// 				console.error(`on error`) // did not show
	// 			}
	// 		})
	// 	})
	// }

	// public static async qryByOneId<T>(db:Database, table:string, id:number, idColumnName='id'):Promise<T[]>{
	// 	const sql = `SELECT * FROM '${table}' WHERE ${idColumnName}=?`
	// 	const pair = {sql:sql, values:[[id]]}
	// 	const r = await Sqlite.old_transaction<T>(db, [pair], 'each')
	// 	return r[0][0]
	// }

	/**
	 * 由id數組查詢行
	 * 無整數安全
	 * @param db 
	 * @param table 
	 * @param id 
	 * @param idColumnName 
	 * @returns 
	 */
	public static qryByIds_unsafeInt<T>(db:Database, table:string, id:number[], idColumnName='id'):Promise<T[][]>{
		// const sql = `SELECT * FROM '${table}' WHERE ${idColumnName}=?`
		// const ids:[number][] = id.map(e=>[e])
		// const pair = {sql:sql, values:ids}
		// const r = await Sqlite.transaction<T>(db, [pair], 'each')
		// return r[0][0]
		return Sqlite.qryValuesInColumn_unsafeInt(db, table, idColumnName, id)
	}

	/**
	 * 在columnˉ列中尋values
	 * 無整數安全
	 * @param db 
	 * @param table 
	 * @param column 
	 * @param values 
	 * @returns 
	 */
	public static async qryValuesInColumn_unsafeInt<T>(db:Database, table:string, column:string, values:any[]){
		//const vs = values.map(e=>[e])

		const sql = `SELECT * FROM '${table}' WHERE ${column}=?`
		const stmt = await Sqlite.prepare(db, sql)
		const fn=async()=>{
			const result:T[][] = []
			for(const v of values){
				const [,rows] = await Sqlite.stmtAll<T>(stmt, v)
				result.push(rows)
			}
			
			return result
		}
		const result = await Sqlite.transaction(db, fn)
		//const sqlPair = new SqlToValuePair(sql, vs)
		//const [rows, runResults] = await Sqlite.transaction_complex<T>(db, [sqlPair], 'each')
		return result
	}

	/**
	 * id, name, age -> CAST(id AS TEXT)AS id, name, CAST(age AS TEXT)AS age
	 * @param db 
	 * @param table 
	 * @param needToBeCastedToText =['INT', 'INTEGER']
	 * @returns 
	 */
	public static async genSql_columnCastToText(db:Database, table:string,needToBeCastedToText=['INT', 'INTEGER']){
		const tableInfos = await Sqlite.getTableInfo(db, table)
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
	 * 整數安全ₐ SELECT *
	 * @param db 
	 * @param table 
	 * @param needToBeCastedToText =['INT', 'INTEGER']
	 * @returns 
	 */
	public static async genSql_SelectAllIntSafe(db:Database, table:string, needToBeCastedToText=['INT', 'INTEGER']){
		let part = await Sqlite.genSql_columnCastToText(db, table, needToBeCastedToText)
		const sql = `SELECT ${part} FROM '${table}'`
		return sql
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
const C = Sqlite;
type C = Sqlite
