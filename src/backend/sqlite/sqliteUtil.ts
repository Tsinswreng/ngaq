/* 
毫秒級時間戳
SELECT strftime('%s', 'now') || substr(strftime('%f', 'now'), 4) AS timestamp
*/

import type sqlite3 from "sqlite3"
import type { SqliteDb } from "./Sqlite"
import * as DbQry from '@shared/IF/DbQryResult'
import type { NullableEleArr } from "@shared/Type"

/**
 * 若T是數組 如str[]、 則得 (str|undef)[]
 * 若T非數組、則得T
 */
type SelfOrNullableEleArr<T> = T extends Array<infer Ele>?
NullableEleArr<Ele>
:T

type NS<T> = SelfOrNullableEleArr<T>

export class SqliteQryResult<T> implements
DbQry.I_data<
	NS<T>
>
,DbQry.I_lastId
,DbQry.I_affectedRows
{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof SqliteQryResult.new>){
		const z = this
		z.data = args[0] as NS<T>
		return z
	}

	static new<T>(data:T){
		const z = new this<T>()
		z.__init__(data)
		return z
	}

	static fromPair<T>(pair:[sqlite3.RunResult, T[]]){
		// const ans = SqliteQryResult.new(pair[1])
		// ans.lastId = pair[0]?.lastID
		// ans.affectedRows = pair[0]?.changes
		// return ans
		const data = pair[1]
		const runResult = pair[0]
		const ans = this.fromRunResult<T[]>(runResult)
		ans.data = data
		return ans
	}

	
	static fromRunResult<T=undef>(runResult:sqlite3.RunResult){
		const ans = SqliteQryResult.new<T>(void 0 as T)
		ans.lastId = runResult.lastID
		ans.affectedRows = runResult.changes
		return ans
	}

	//get This(){return SqliteQryResult}
	protected _data:NS<T>
	get data(){return this._data}
	protected set data(v){this._data = v}

	protected _lastId?:int
	get lastId(){return this._lastId}
	protected set lastId(v){this._lastId = v}
	
	protected _affectedRows?:int
	get affectedRows(){return this._affectedRows}
	protected set affectedRows(v){this._affectedRows = v}
}

// export class SqliteQryRec{
// 	protected constructor(){}
// 	protected __init__(...args: Parameters<typeof SqliteQryRec.new>){
// 		const z = this
// 		return z
// 	}

// 	static new(){
// 		const z = new this()
// 		z.__init__()
// 		return z
// 	}

// 	//get This(){return SqliteQryRec}

// 	protected _time = Tempus.new()
// 	get time(){return this._time}
// 	protected set time(v){this._time = v}

// 	protected _sql:str
// 	get sql(){return this._sql}
// 	protected set sql(v){this._sql = v}

// 	protected _params:any
// 	get params(){return this._params}
// 	protected set params(v){this._params = v}
	
// 	protected _qryResult:SqliteQryResult
// 	get qryResult(){return this._qryResult}
// 	set qryResult(v){this._qryResult = v}
	
// }




export enum SqliteMasterType{
	table='table'
	,index='index'
	,trigger='trigger'
}

export class SqliteMaster{
	type:SqliteMasterType
	name:str
	tbl_name:str
	rootpage:int
	sql:str
}


export interface I_optCheckExist{
	/** 
	 * checkExist潙false旹 在 創建旹 表現潙 有 if not exsists 
	 * 在 刪除旹 表現潙 有 if EXISTS
	 */
	checkExist:bool
}


/**
 * 默認有IF NOT EXISTS
 * @param opt 
 * @returns 
 */
export function geneIfNotExists(opt:I_optCheckExist|undef){
	let ifNE = IF_NOT_EXISTS
	if(opt?.checkExist === true){
		ifNE = ''
	}
	return ifNE
}


export interface CreateTriggerOpt extends I_optCheckExist{
	// ifNotExists = false
}

export interface CreateIndexOpt extends I_optCheckExist{

}
export const IF_NOT_EXISTS = 'IF NOT EXISTS'

class ColType{
	int = 'INT'
	integer = 'INTEGER'
	text = 'TEXT'
}

class Snippet{
	colType = new ColType()
	IF_NOT_EXISTS = 'IF NOT EXISTS'
	integerPrimaryKey = 'INTEGER PRIMARY KEY'
	notNull = 'NOT NULL'
	unique = 'UNIQUE'
	now_unixMills = `(strftime('%s', 'now') || substr(strftime('%f', 'now'), 4))`
	foreignKey(key:str, refTbl:str, refCol:str){
		const ans = 
`FOREIGN KEY(${key}) REFERENCES ${refTbl}(${refCol})`
		return ans
	}

	unixMills(alias='unixMills'){
		const z = this
		const sql =
`SELECT ${z.now_unixMills} AS ${alias}`
		return sql
	}
}

export const snippet = new Snippet()
class CreateSql{
	
	/**
	 * @deprecated 理則不善。緣UPDATE中新ᐪ與舊ᐪˋ皆褈複也。
	 * 生成一个用于创建 SQLite 触发器的 SQL 语句，该触发器用于在插入操作时检查是否存在重复的行。
	 * 并在存在重复时用新数据覆盖旧数据。
	 * @param {string} tblName - 表名，触发器将在该表上创建。
	 * @param {string} triggerName - 触发器名称，用于在数据库中标识触发器。
	 * @param {string[]} colNames - 列名数组，触发器将检查重复值的列。
	 * @param_deprecated {object} opt - 选项对象，包含是否应检查触发器是否已存在的标志（ifNotExists）。
	 * @param {boolean} param_deprecated.ifNotExists - 如果为 true，则创建触发器之前检查触发器是否已存在。
	 * @returns {string} 返回一个包含触发器创建 SQL 语句的字符串。
	 */
	static trigger_replaceDuplicate(tblName:str, triggerName:str , colNames:str[], opt:CreateTriggerOpt){

		/** a = NEW.a ${join} b = NEW.b ... */
		function geneSeg(colNames:str[], join:str):str{
			const arr = colNames.map(e=>{
				return ` ${e}=NEW.${e} `
			})
			return arr.join(join)
		}
		const whereClause = geneSeg(colNames, ' AND ') /** a = NEW.a AND b = NEW.b ... */
		const toSet = geneSeg(colNames, ',') /** a = NEW.a , b = NEW.b ... */
		let ifNotExists = ''
		if(!opt.checkExist){
			ifNotExists = IF_NOT_EXISTS
		}
		const sql = 
`CREATE TRIGGER ${ifNotExists} "${triggerName}" 
BEFORE INSERT ON "${tblName}"
FOR EACH ROW 
WHEN EXISTS (SELECT 1 FROM "${tblName}" WHERE ${whereClause})
BEGIN
	UPDATE "${tblName}"
	SET ${toSet}
	WHERE ${whereClause};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}


	/**
	 * 性能不如 INSERT OR IGNORE INTO xxx
	 * @param tblName 
	 * @param triggerName 
	 * @param colNames 
	 * @param opt 
	 * @returns 
	 */
	static trigger_ignore_duplicate_insert(tblName:str, triggerName:str , colNames:str[], opt:CreateTriggerOpt){

		/** a = NEW.a ${join} b = NEW.b ... */
		function geneSeg(colNames:str[], join:str):str{
			const arr = colNames.map(e=>{
				return ` ${e}=NEW.${e} `
			})
			return arr.join(join)
		}
		const whereClause = geneSeg(colNames, ' AND ') /** a = NEW.a AND b = NEW.b ... */
		const toSet = geneSeg(colNames, ',') /** a = NEW.a , b = NEW.b ... */
		let ifNotExists = ''
		if(!opt.checkExist){
			ifNotExists = IF_NOT_EXISTS
		}
		const sql = 
`CREATE TRIGGER ${ifNotExists} "${triggerName}" 
BEFORE INSERT ON "${tblName}"
FOR EACH ROW 
WHEN EXISTS (SELECT 1 FROM "${tblName}" WHERE ${whereClause})
BEGIN
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}


	static index(tbl:str, indexName:str, cols:str[], opt?:CreateIndexOpt){
		let ifNotExists = ''
		if(!opt?.checkExist){
			ifNotExists = IF_NOT_EXISTS
		}
		const sql = `CREATE INDEX ${ifNotExists} "${indexName}" ON ${tbl} (${cols.join(',')})`
		return sql
	}
}


function getObjKeys(obj:kvobj, ignoredKeys:str[]=[]){
	const igno = ignoredKeys
	const ignoSet = new Set<str>()
	if(igno != void 0){
		igno.map(e=>ignoSet.add(e))
	}
	const allKeys = Object.keys(obj)
	const keys = allKeys.filter(e=>!ignoSet.has(e))
	return keys
}

interface I_IgnoredKeys{
	ignoredKeys:str[]
}


export interface Opt_insert{
	orIgnore:bool
}

type ParamType = any[]


/** @deprecated  */
export class Qry{
	protected constructor(){}
	protected __init__deprecated(...args:Parameters<typeof Qry.new_deprecated>){
		const z = this
		z.sql = args[0]
		z.param_deprecated = args[1]
		return z
	}
	static new_deprecated(sql:str, params?:any[]){
		const z = new this()
		z.__init__deprecated(sql, params)
		return z
	}

	protected __init__(...args:Parameters<typeof Qry.new>){
		const z = this
		z._sql = args[0]
		z._param2dArr = args[1]
		return z
	}

	static new(sql:str, param2dArr:ParamType[]){
		const z = new this()
		z.__init__(sql ,param2dArr)
		return z
	}

	protected _sql:str
	get sql(){return this._sql}
	set sql(v){this._sql = v}

	/** 多組參數 */
	protected _param2dArr:ParamType[]
	get paramArr(){return this._param2dArr}
	set paramArr(v){this._param2dArr = v}
	


	protected _param_deprecated?:any[]
	get param_deprecated(){return this._param_deprecated}
	set param_deprecated(v){
		this._param_deprecated = v
	}


	async prepare(db:SqliteDb){
		const z = this
		const stmt = await db.Prepare(z.sql, z.param_deprecated)
		return stmt
	}
}

class ObjSql{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof ObjSql.new>){
		const z = this
		z._obj = args[0]
		const opt = args[1]
		z._keys = getObjKeys(z._obj, opt?.ignoredKeys)
		return z
	}
	static new(obj:kvobj, opt?:I_IgnoredKeys){
		const z = new this()
		z.__init__(obj, opt)
		return z
	}

	protected _obj:kvobj
	get obj(){return this._obj}
	set obj(v){this._obj = v}

	protected _keys:str[] = []
	get keys(){return this._keys}
	
	/**
	 * 
	 * @returns "列1,列2,..."
	 */
	getColNamesStr(){
		const z = this
		const keys = z.keys
		const columns = keys.join(', ');
		return columns
	}

	/**
	 * 
	 * @returns ?,?,? ...
	 */
	getPlaceholdersStr(){
		const z = this
		const keys = z.keys
		const placeholders = keys.map(()=>'?').join(',')
		return placeholders
	}

	getParams(obj=this.obj):ParamType{
		const z = this
		const keys = z.keys
		const ans = keys.map(e=>obj[e])
		return ans
	}

	/**
	 * 
	 * @param tbl 
	 * @returns `INSERT INTO '${tbl}' (${columns}) VALUES (${placeholders})`
	 */
	geneFullInsertSql(tbl:str ,opt?:Opt_insert){
		const z = this
		let orIgnore = ''
		if(opt?.orIgnore){
			orIgnore = 'OR IGNORE'
		}
		const columns = z.getColNamesStr()
		const placeholders = z.getPlaceholdersStr()
		return `INSERT ${orIgnore} INTO '${tbl}' (${columns}) VALUES (${placeholders})`
	}



}


class SelectSql{

}

export class Sql{
	protected constructor(){}
	static readonly create = CreateSql
	static readonly select = SelectSql
	static readonly obj = ObjSql
}