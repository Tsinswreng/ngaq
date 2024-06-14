import type { HistoryDbSrc } from "./HistoryDbSrc"
import type {I_perBatch, I_readN} from '@shared/Type'
import type { I_optCheckExist } from "@backend/sqlite/sqliteUitl"

import { HistoryDbRow } from "./HistoryDbRow"
import * as SqliteUitl from '@backend/sqlite/sqliteUitl'
import { SqliteDb } from "@backend/sqlite/Sqlite"


class Names{
	idx_text='idx_text'
	//trig_updateOnDuplicateInsert='trig_onUuplicate_insert'
	trig_chkModifiedTime = 'chkModifiedTime'
	errMsg_chkModifiedTime = 'modified_time cannot be earlier than created_time'
	//trig_uniqueTextEtCreatedTime = 'trig_unique_text__created_time'
	//errMsg_uniqueTextEtCreatedTime = '(text,created_time) is duplicated'
	trig_earlierDuplicate = 'earlierDuplicate'
	trig_laterDuplicate = 'laterDuplicate'
}


export class HistoryTbl{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof HistoryTbl.new>){
		const z = this
		z._dbSrc = args[0]
		z._tblName = args[1]
		return z
	}

	static new(dbSrc:HistoryDbSrc, tbl:str){
		const z = new this()
		z.__init__(dbSrc, tbl)
		return z
	}

	get This(){return HistoryTbl}

	protected _dbSrc:HistoryDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}

	get db(){return this._dbSrc.db}

	protected _tblName:str
	get tblName(){return this._tblName}
	protected set tblName(v){this._tblName = v}

	protected _names = new Names()
	get names(){return this._names}
	protected set names(v){this._names = v}
	
	static sql_createTextIdx(tblName:str, idxName:str){
		const z = this
		const c = HistoryDbRow.col
		return SqliteUitl.Sql.create.index(tblName, idxName, [c.text], {checkExist:false})
	}



	protected async init(){
		const z = this
		await z.createTextIdx()
		await z.mkTrig_chkModifiedTime()
		await z.mkTrig_laterDuplicate()
		await z.mkTrig_earlierDuplicate()
		return true
	}


	static sql_createTbl(tbl:str, opt?:I_optCheckExist){
		let ifNotExists = ''
		if(!opt?.checkExist){
			ifNotExists = SqliteUitl.IF_NOT_EXISTS
		}
		const c = HistoryDbRow.col
		const sql = 
`CREATE TABLE ${ifNotExists} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.cnt} INT DEFAULT 1
	,${c.createdTime} INTEGER DEFAULT (strftime('%s', 'now'))
	,${c.modifiedTime} INTEGER DEFAULT (strftime('%s', 'now'))
	,UNIQUE(${c.text},${c.belong})
)`
		return sql
	}

	async createTbl(opt:Parameters<typeof this.This.sql_createTbl>[1]){
		const z = this
		const tbl = z.tblName//args[0]
		//const opt = args[1]
		const sql = z.This.sql_createTbl(tbl, opt)
		await z.db.run(sql)
		await z.init()
		return true
	}

	createTextIdx(){
		const z = this
		const tblName = z.tblName
		const idxName = z.names.idx_text
		const sql = z.This.sql_createTextIdx(tblName, idxName)
		return z.db.run(sql)
	}


	/**
	 * if(text 相同 && NEW.created_time 更早)
	 * {update set created_time=新, cnt=MAX(新,舊), modified_time取最新}
	 * @param tbl 
	 * @param trig 
	 * @param errMsg 
	 * @param opt 
	 * @returns 
	 */
	static sql_mkTrig_earlierDuplicate(tbl:str, trig:str, opt?:I_optCheckExist){
		let ifNE = ''
		if(opt?.checkExist === false){
			ifNE = SqliteUitl.IF_NOT_EXISTS
		}
		const z = this
		const c = HistoryDbRow.col
		const sql =
`
CREATE TRIGGER ${ifNE} "${trig}" BEFORE INSERT ON "${tbl}"
FOR EACH ROW
WHEN EXISTS(
	SELECT 1 FROM "${tbl}"
	WHERE ${c.text} = NEW.${c.text} AND ${c.belong} = NEW.${c.belong}
	AND ${c.createdTime} >= NEW.${c.createdTime}
)
BEGIN
	UPDATE "${tbl}"
	SET
	${c.createdTime} = NEW.${c.createdTime}
	,${c.cnt} = CASE
		WHEN NEW.${c.cnt} > ${c.cnt} THEN NEW.${c.cnt}
		ELSE ${c.cnt}
	END
	,${c.modifiedTime}=
	CASE
		WHEN NEW.${c.modifiedTime} > ${c.modifiedTime} THEN NEW.${c.modifiedTime}
		ELSE ${c.modifiedTime}
	END
	WHERE ${c.text}=NEW.${c.text};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}

	mkTrig_earlierDuplicate(){
		const z = this
		const sql = z.This.sql_mkTrig_earlierDuplicate(
			z.tblName, z.names.trig_earlierDuplicate, {checkExist:false}
		)
		return z.db.run(sql)
	}

	/**
	 * if( NEW.text_ 既存于表 && NEW.created_time更晚 )
	 * { 改潙update、cnt+=NEW.cnt??1
	 * 	if(NEW.modified_time is null){modified_time = now()}
	 * 	else if(NEW.modified_time 更晚){modified_time = new的}
	 * 	else {不改modified_time}
	 * }
	 */
	static sql_mkTrig_laterDuplicate(tbl:str, trig:str, opt?:I_optCheckExist){
		let ifNE = ''
		if(opt?.checkExist === false){
			ifNE = SqliteUitl.IF_NOT_EXISTS
		}
		const z = this
		const c = HistoryDbRow.col
		const sql =
`
CREATE TRIGGER ${ifNE} "${trig}" BEFORE INSERT ON "${tbl}"
FOR EACH ROW
WHEN EXISTS(
	SELECT 1 FROM "${tbl}"
	WHERE ${c.text} = NEW.${c.text} 
	AND ${c.belong} = NEW.${c.belong}
	AND ${c.createdTime} < NEW.${c.createdTime}
)
BEGIN
	UPDATE "${tbl}"
	SET 
	${c.cnt} = ${c.cnt} +
	CASE
		WHEN NEW.${c.cnt} IS NULL THEN 1
		ELSE NEW.${c.cnt}
	END,
	${c.modifiedTime}=
	CASE
		WHEN NEW.${c.modifiedTime} IS NULL THEN (strftime('%s', 'now'))
		WHEN NEW.${c.modifiedTime} > ${c.modifiedTime} THEN NEW.${c.modifiedTime}
		ELSE ${c.modifiedTime}
	END
	WHERE ${c.text}=NEW.${c.text};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}

	async mkTrig_laterDuplicate(){
		const z = this
		const sql = z.This.sql_mkTrig_laterDuplicate(
			z.tblName, z.names.trig_laterDuplicate, {checkExist:false}
		)
		await z.db.run(sql)
		return true
	}


	/**
	 * modified_time < created_time 旹拋錯
	 * @param tbl 
	 * @param trig 
	 * @param errMsg 勿有特殊字符。因佢ˇ直ᵈ插入sql之引號中。
	 * @param opt 
	 */
	static sql_mkTrig_chkModifiedTimeGeCreatedTime(tbl:str, trig:str, errMsg:str, opt?:I_optCheckExist){
		let ifNE = ''
		if(opt?.checkExist === false){
			ifNE = SqliteUitl.IF_NOT_EXISTS
		}
		const z = this
		const c = HistoryDbRow.col
		const sql = 
`CREATE TRIGGER ${ifNE} "${trig}"
BEFORE UPDATE ON "${tbl}"
FOR EACH ROW
WHEN NEW.${c.modifiedTime} < OLD.${c.createdTime}
BEGIN
	SELECT RAISE(ABORT, '${errMsg}');
END;
`
		return sql
	}

	mkTrig_chkModifiedTime(){
		const z = this
		const tbl = z.tblName
		const trig = z.names.trig_chkModifiedTime
		const sql = z.This.sql_mkTrig_chkModifiedTimeGeCreatedTime(
			tbl, trig, z.names.errMsg_chkModifiedTime, {checkExist:false}
		)
		return z.db.run(sql)
	}


	async insertRows(rows:HistoryDbRow[]){
		const z = this
		const col = HistoryDbRow.col
		const first = rows[0]
		if(first== void 0){
			return
		}

		const sqlObj = SqliteUitl.Sql.obj.new(first, {
			ignoredKeys: [col.id]
		})
		const sql = sqlObj.geneFullInsertSql(z._tblName, {orIgnore:false})
		const stmt = await z.db.prepare(sql)
		const fn = async()=>{
			for(const row of rows){
				const params = sqlObj.getParams(row)
				await stmt.run(params)
			}
		}
		return await z.db.transaction(fn)
	}

	async insertStrm(readN:I_readN<Promise<HistoryDbRow[]>>, opt:I_perBatch){
		let perBatch = opt?.perBatch??9999
		const z = this
		const rows = await readN.read(perBatch)
		if(rows != void 0 && rows.length > 0){
			await z.insertRows(rows)
		}
		return true
	}
	
}
