//require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}

import {$a, RegexReplacePair, copyIgnoringKeys} from '@shared/Ut';
import { Database,RunResult } from 'sqlite3';
import {objArrToStrArr,serialReplace,$} from '@shared/Ut'
import _ from 'lodash';
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
const sqlErr=(err:Error, ...msg:any[])=>{
	let e = {
		name:err.name,
		message:err.message,
		stack:err.stack,
		msg: msg
	}
	return new Error(JSON.stringify(e))
}

//PRAGMA table_info
export interface SqliteTableInfo{
	cid:number
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

export default class Sqlite{
	private constructor(){}

	
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
					j(err)
					return;
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
					j(sqlErr(err,sql)); return
				}
				s(this)
			})
		})
	}
	/*<>{run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;}
	當回調函數ᵗ定義ʸ有this旹、叶回調函數時形參列表不用再寫this。
	又 箭頭函數不能有己ʰ向ᵗthisˉ引用、故需用傳統函數㕥叶回調函數。此旹乃可其內ʸ用this㕥取RunResult。*/

	/**
	 * 數據庫中ᵗ表ˇ轉二維數組
	 * @param db 
	 * @param table 
	 * @param column 
	 * @returns 
	 */
	public static async toStrTable(db:Database, table:string, column?:string[]){
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
		const creatSqlFun = await Sqlite.getCreatTableSqlTemplateFromSqlite_master(db,oldTable)
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
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static async getCreatTableSqlTemplateFromSqlite_master(db:Database, table:string){
		const sql = `SELECT sql from 'sqlite_master' WHERE type='table' AND name=?`
		const pair = {sql:sql, values:[[table]]}
		const r = await Sqlite.transaction(db, [pair], 'each')
		const originSql:string = $a(  ((r[0][0][0] as any ).sql)as string  )
		if(typeof(originSql)!=='string'){throw new Error(`typeof(originSql)!=='string'`)}
		const oldTable = table
		const sqlTemplateFunction:(table:string)=>string = (table:string)=>{
			const targetSql = originSql.replace(new RegExp(`^CREATE TABLE "${oldTable}"`), `CREATE TABLE "${table}"`)
			return targetSql
		}
		return sqlTemplateFunction
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
		let info = await Sqlite.querySqlite_master(db)
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
	public static async querySqlite_master(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ Sqlite.all<Sqlite_master>(db, sql)
	}

	/**
	 * sqlite_sequence will exist if any table includes the AUTOINCREMENT keyword (which is restricted to only being used for an alias of the rowid column).
	 * @param db 
	 * @returns 
	 */
	public static async qureySqlite_sequence(db:Database){
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
	 * 手動ᵈ封裝ᵗ事務
	 * @param db 
	 * @template T 數據庫中每行ᵗ類型
	 * @param {{sql:string, values:any[]}[]} sqlToValuePairs 
	 * @param {'each'|'run'} method statement對象ˋ將調ᵗ函數
	 * @returns {Promise<[T[][], RunResult[]]>}  第n條sql對應T[n]和RunResult[n]
	 * @deprecated
	 * @instance
	 * 
	 */
	public static async deprecated_transaction<T>(
		db:Database,
		sqlToValuePairs:{sql:string, values:any[]}[],
		method: 'each'|'run'
		){
		const result:T[][] = []
		const runResult: RunResult[] = []
		return new Promise<[T[][], RunResult[]]>((res,rej)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
				for(let i = 0; i < sqlToValuePairs.length; i++){
					const curSql:string = sqlToValuePairs[i].sql;
					const curValue:(any|undefined)[] = sqlToValuePairs[i].values
					const innerResult:T[] = []
					const stmt = db.prepare(curSql, (err)=>{
						if(err){rej(sqlErr(err));return}
						const each = ()=>{
							stmt.each<T>(curValue, function(this, err, row:T){ // AI謂ˌ査無果旹不珩回調。
								if(err){
									console.error(curValue)//t
									rej(sqlErr(err, curSql, curValue));return
								}//<坑>{err對象中不帶行號與調用堆棧之訊}
									innerResult.push(row)
									runResult.push(this)
							})
						}
						const run = ()=>{
							stmt.run(curValue, function(this, err){
								if(err){
									console.error(`console.error(curSql)`)
									console.error(curSql)//t
									console.error(`console.error(curValue)`)
									console.error(curValue)//t
									rej(sqlErr(err, curSql, curValue));return
								}
									//innerResult.push(row)
									runResult.push(this)
							})
						}
						switch(method){
							case 'each': each(); break;
							case 'run': run(); break;
							default: rej('unmatched method')
						}
					})
					result.push(innerResult)
				}
				db.run('COMMIT', function(err){
					if(err){
						rej(sqlErr(err, sqlToValuePairs));return
					}
					res([result,runResult])
				})
			})
		})
	}





	/**
	 * 手動ᵈ封裝ᵗ事務 
	 * @param db 
	 * @template T 數據庫中每行ᵗ類型 
	 * @param {{sql:string, values:any[][]}[]} sqlToValuePairs values必須是二維數組、否則報錯
	 * @param {'each'|'run'} method statement對象ˋ將調ᵗ函數
	 * @returns {Promise<[T[][], RunResult[]]>}  第n條sql對應T[n]和RunResult[n]
	 * @instance
	 * 
	 */
	public static async transaction<T>(
		db:Database,
		sqlToValuePairs:{sql:string, values:any[][]}[],
		method: 'each'|'run'
	){
		
		const result:T[][] = []
		const runResult: RunResult[] = []
		return new Promise<[T[][], RunResult[]]>((res,rej)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
				for(let i = 0; i < sqlToValuePairs.length; i++){
					const curSql:string = sqlToValuePairs[i].sql;
					const value2D:(any|undefined)[][] = sqlToValuePairs[i].values
					if(!Array.isArray(value2D)){throw new Error(`!Array.isArray(value2D)`)}
					const innerResult:T[] = []
					const stmt = db.prepare(curSql, (err)=>{
						if(err){rej(sqlErr(err));return}
						
						const each = ()=>{
							for(const value1D of value2D){
								if(!Array.isArray(value1D)){throw new Error(`!Array.isArray(value1D)`)}
								stmt.each<T>(value1D, function(this, err, row:T){ // AI謂ˌ査無果旹不珩回調。
									if(err){
										console.error(value2D)//t
										rej(sqlErr(err, curSql, value2D));return
									}//<坑>{err對象中不帶行號與調用堆棧之訊}
										innerResult.push(row)
										runResult.push(this)
								})
							}
						}
						const run = ()=>{
							for(const value1D of value2D){
								if(!Array.isArray(value1D)){throw new Error(`!Array.isArray(value1D)`)}
								stmt.run(value1D, function(this, err){
									if(err){
										console.error(`console.error(curSql)`)
										console.error(curSql)//t
										console.error(`console.error(curValue)`)
										console.error(value2D)//t
										rej(sqlErr(err, curSql, value2D));return
									}
										//innerResult.push(row)
										runResult.push(this)
								})
							}
							
						}
						switch(method){
							case 'each': each(); break;
							case 'run': run(); break;
							default: rej('unmatched method')
						}
					})
					result.push(innerResult)
				}
				db.run('COMMIT', function(err){
					if(err){
						rej(sqlErr(err, sqlToValuePairs));return
					}
					res([result,runResult])
				})
			})
		})
	}


	


	// public static async deprecated_transactionAll<T>(
	// 	db:Database,
	// 	sqlToValuePairs:{sql:string, values:any[]}[]
	// 	){
	// 	//if(sqls.length !== values.length){throw new Error(`sqls.length !== values.length`)}
	// 	const result:T[][] = []
	// 	return new Promise<T[][]>((res,rej)=>{
	// 		db.serialize(()=>{
	// 			db.run('BEGIN TRANSACTION')
	// 			for(let i = 0; i < sqlToValuePairs.length; i++){
	// 				const curSql:string = sqlToValuePairs[i].sql;
	// 				const curValue:(any|undefined)[] = sqlToValuePairs[i].values
	// 				//if(Array.isArray(curValue)){}
	// 				const innerResult:T[] = []
	// 				const stmt = db.prepare(curSql, (err)=>{
	// 					for(let j = 0; j < curValue?.length; j++){
	// 						stmt.each(curValue[j], (err, row:T)=>{
	// 							if(err){console.error(curSql);rej(err)}
	// 							innerResult.push(row)
	// 						})
	// 					}
	// 				})
	// 				result.push(innerResult)
	// 			}
	// 			db.all('COMMIT', (err,rows)=>{
	// 				if(err){console.error(sqlToValuePairs);;rej(err);return}
	// 				res(result)
	// 			})
	// 		})
	// 	})
	// }


	// public static async transaction<T>(db:Database, sqls:string[], values:any[][]){
	// 	if(sqls.length !== values.length){throw new Error(`sqls.length !== values.length`)}
	// 	const result:T[][] = []
	// 	return new Promise<T[][]>((res,rej)=>{
	// 		db.serialize(()=>{
	// 			db.run('BEGIN TRANSACTION')
	// 			for(let i = 0; i < sqls.length; i++){
	// 				const curSql:string = sqls[i];
	// 				const curValue:(any|undefined)[] = values[i]
	// 				//if(Array.isArray(curValue)){}
	// 				const innerResult:T[] = []
	// 				const stmt = db.prepare(curSql, (err)=>{
	// 					for(let j = 0; j < curValue?.length; j++){
	// 						stmt.each(curValue[j], (err, row:T)=>{
	// 							if(err){console.error(curSql);rej(err)}
	// 							innerResult.push(row)
	// 						})
	// 					}
	// 				})
	// 				result.push(innerResult)
	// 			}
	// 			db.all('COMMIT', (err,rows)=>{
	// 				if(err){console.error(sqls);;rej(err);return}
	// 				res(result)
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
	 * @param table 
	 * @param obj 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	public static getSql_insert(table:string, obj:object&{length?:never}, ignoredKeys?:string[]):[string, any[]]{
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
	public static getSql_updateById(table:string, obj:object&{length?:never}, id:number, ignoredKeys?:string[]):[string, any[]]{
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
	 * 跨數據庫複製表
	 * 不分批、表太大則可能爆內存
	 * @param srcDb 
	 * @param srcTable 
	 * @param targetDb 
	 * @param neoName 
	 * @returns 
	 */
	public static async copyTableCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable){
		const fn_creatSql = await Sqlite.getCreatTableSqlTemplateFromSqlite_master(srcDb, srcTable)
		const creatSql = fn_creatSql(neoName)
		await Sqlite.all(targetDb, creatSql)
		const fn_selectAll = (table:string)=>{return `SELECT * FROM '${table}'`}
		const srcRows = await Sqlite.all<object>(srcDb, fn_selectAll(srcTable))
		//console.log(srcRows)//t
		let insertSql = Sqlite.getSql_insert(neoName, srcRows[0])[0]
		//console.log(insertSql)//t
		const values:any[] = []
		for(const row of srcRows){
			const v:any[] = Sqlite.getSql_insert(neoName, row)[1]
			values.push(v)
		}
		return Sqlite.transaction(targetDb, [{sql:insertSql, values:values}], 'run')
	}



}