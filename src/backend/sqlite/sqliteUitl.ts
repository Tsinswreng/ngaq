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

class CreateSql{
	
	/**
	 * @deprecated 理則不善。緣UPDATE中新ᐪ與舊ᐪˋ皆褈複也。
	 * 生成一个用于创建 SQLite 触发器的 SQL 语句，该触发器用于在插入操作时检查是否存在重复的行。
	 * 并在存在重复时用新数据覆盖旧数据。
	 * @param {string} tblName - 表名，触发器将在该表上创建。
	 * @param {string} triggerName - 触发器名称，用于在数据库中标识触发器。
	 * @param {string[]} colNames - 列名数组，触发器将检查重复值的列。
	 * @param {object} opt - 选项对象，包含是否应检查触发器是否已存在的标志（ifNotExists）。
	 * @param {boolean} opt.ifNotExists - 如果为 true，则创建触发器之前检查触发器是否已存在。
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

	getParams(obj=this.obj){
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