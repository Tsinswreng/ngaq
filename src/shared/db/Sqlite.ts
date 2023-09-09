//require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}

import {RegexReplacePair} from '@shared/Ut';
import { Database,RunResult } from 'sqlite3';
import {objArrToStrArr,serialReplace,$} from '@shared/Ut'
const Ut = {
	objArrToStrArr:objArrToStrArr,
	serialReplace:serialReplace,
	nng:$
}

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
	name:string
	tbl_name:string
	rootpage:number
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
		//console.log(sql)//t
		return new Promise<T[]>((s,j)=>{
			db.all(sql, params,(err,rows:T[])=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				//console.log(rows)//t
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
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(this)
			})
		})
	}
	/*<>{run(sql: string, callback?: (this: RunResult, err: Error | null) => void): this;}
	當回調函數ᵗ定義ʸ有this旹、叶回調函數時形參列表不用再寫this。
	又 箭頭函數不能有己ʰ向ᵗthisˉ引用、故需用傳統函數㕥叶回調函數。此旹乃可其內ʸ用this㕥取RunResult。*/

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

	public static copyTable(db:Database, newTable:string, oldTable:string){
		let sql = `CREATE TABLE '${newTable}' AS SELECT * FROM ${oldTable}`
		return Sqlite.all(db, sql)
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
				//DictDb.all(db,sql).then(()=>{})//t
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
	 * 
	 * @param db 
	 * @returns 
	 */
	public static async querySqlite_master(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ Sqlite.all<Sqlite_master>(db, sql)
	}

	/**
	 * 
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
						Promise.reject(err);return
					}
				})
			}
			db.run('COMMIT', (err)=>{
				if(err){Promise.reject(err);return}
			})
		})
	}

	/**
	 * 手動封裝的TRANSACTION
	 * @param db 
	 * @param sql 
	 * @param values 
	 * @returns 
	 */
	public static async transaction<T>(db:Database, sql:string, values:any[]){
		let result:T[] = []
		return new Promise<T[]>((s,j)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
				const stmt = db.prepare(sql, (err)=>{
					if(err){console.error(sql+'\n'+err+'\n');j(err);return} //<坑>{err+''後錯ᵗ訊會丟失行號 勿j(sql+'\n'+err)}
				})
				for(let i = 0; i < values.length; i++){
					stmt.each(values[i], (err, row:T)=>{
						if(err){console.error(sql+'\n'+err+'\n');j(err);return}
						result.push(row)
					})
				}
				db.all('COMMIT', (err,rows)=>{
					if(err){console.error(sql+'\n'+err+'\n');j(err);return}
					s(result)
				})
			})
			
		})
		
	}

	public static async isTableExist(db:Database, tableName:string){
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

	public static async alterIntoAllowNull(db:Database, tableName:string, columnName:string){
		let info = await Sqlite.getTableInfo(db, tableName, columnName)
		let type = Ut.nng(info).type
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
	public static countOccurrences(db:Database, table:string, column:string, value:any[]){
		function getSql(table:string, column:string){
			return `SELECT COUNT(*) FROM '${table}' WHERE ${column}=?` //寫binary似報錯
		}
		//return Sqlite.transaction()
	}


	/**
	 * 由對象ᵗ鍵與值 產 sql插入語句。
	 * 若表ᵗ自增主鍵潙id、則obj不宜有id字段。
	 * @param table 
	 * @param obj 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	public static getInsertSql(table:string, obj:Object):[string, any[]]{
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
	 * @param table 
	 * @param obj 
	 * @param id 
	 * @returns 返回值是長度潙2之數組、[0]是 帶佔位符之sql語句字串、[1]是佔位符ˋ對應ᵗ值ˉ數組。
	 */
	public static getUpdateByIdSql(table:string, obj:Object, id:number):[string, any[]]{
		const keys = Object.keys(obj)
		const values = Object.values(obj)
		values.push(id)
		const updateQuery = `UPDATE '${table}' SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
		return [updateQuery, values]
	}

}