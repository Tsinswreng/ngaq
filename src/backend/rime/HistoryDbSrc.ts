import { SqliteDb } from "@backend/sqlite/Sqlite";
import * as SqliteUitl from "@backend/sqlite/sqliteUitl";
import { I_optCheckExist } from "@backend/sqlite/sqliteUitl";
import type { sqlite3 } from "sqlite3";
import { HistoryDbRow } from "./HistoryDbRow";




/* 

Sqlite數據庫表中id,text_,cnt,created_time,modified_time
幫我寫觸發器:
在插入前檢查將要插入的text_、如果待插的text_已存在數據庫中 則將此插入操作改爲update操作。
再寫一個 在update前檢查的觸發器、若update的內容不存在則改爲insert into、修改時間和創建時間一致、cnt爲1

CREATE TRIGGER before_insert_my_table
BEFORE INSERT ON my_table
FOR EACH ROW
WHEN EXISTS (SELECT 1 FROM my_table WHERE text_ = NEW.text_)
BEGIN
    -- 更新现有记录，使用插入语句中的数据
    UPDATE my_table
    SET cnt = NEW.cnt,
        created_time = NEW.created_time,
        modified_time = NEW.modified_time
    WHERE text_ = NEW.text_;
    -- 取消插入操作
    SELECT RAISE(IGNORE);
END;




*/


class Names{
	idx_text='idx_text'
	trigger_replace_duplicate='trigger_replace_duplicate'
}

export class HistoryDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof HistoryDbSrc.new>){
		const z = this
		z._db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	get This(){return HistoryDbSrc}

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	protected _names = new Names()
	get names(){return this._names}
	protected set names(v){this._names = v}
	

	static sql_createTbl(tbl:str, opt?:I_optCheckExist){
		let ifNotExists = ''
		if(!opt?.checkExist){
			ifNotExists = SqliteUitl.IF_NOT_EXISTS
		}
		const c = HistoryDbRow.col
		const sql = 
`CREATE TABLE ${ifNotExists} "${tbl}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.text_} TEXT NOT NULL UNIQUE
	,${c.cnt} INT DEFAULT 1
	,${c.created_time} INTEGER DEFAULT (strftime('%s', 'now'))
	,${c.modified_time} INTEGER DEFAULT (strftime('%s', 'now'))
)`
		return sql
	}

	createTbl(...args:Parameters<typeof HistoryDbSrc.sql_createTbl>){
		const tbl = args[0]
		const opt = args[1]
		const z = this
		const sql = z.This.sql_createTbl(tbl, opt)
		return z.db.run(sql)
	}

	static sql_createTextIdx(tblName:str, idxName:str){
		const z = this
		const c = HistoryDbRow.col
		return SqliteUitl.Sql.create.index(tblName, idxName, [c.text_], {checkExist:false})
	}

	createTextIdx(tblName:str){
		const z = this
		const idxName = z.names.idx_text
		const sql = z.This.sql_createTextIdx(tblName, idxName)
		return z.db.run(sql)
	}

	/**
	 * if( NEW.text_ 既存于表 ){ 改潙update、cnt+=NEW.cnt??1、modified_time = NEW.modified_time??now() }
	 */
	static sql_mkTrig_updateOnDuplicateInsert(tbl:str, trig:str, opt?:I_optCheckExist){
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
WHEN EXISTS(SELECT 1 FROM "${tbl}" WHERE ${c.text_} = NEW.${c.text_})
BEGIN
	UPDATE "${tbl}"
	SET 
	${c.cnt} = ${c.cnt} +
	CASE
		WHEN NEW.${c.cnt} IS NULL THEN 1
		ELSE NEW.${c.cnt}
	END,
	${c.modified_time}=
	CASE
		WHEN NEW.${c.modified_time} IS NULL THEN (strftime('%s', 'now'))
		ELSE NEW.${c.modified_time}
	END
	WHERE ${c.text_}=NEW.${c.text_};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}

	/**
	 * modified_time < created_time 旹拋錯
	 * @param tbl 
	 * @param trig 
	 * @param errMsg 勿有特殊字符。因佢ˇ直ᵈ插入sql之引號中。
	 * @param opt 
	 */
	static sql_mkTrig_chkModifiedTime(tbl:str, trig:str, errMsg:str, opt?:I_optCheckExist){
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
WHEN NEW.${c.modified_time} < OLD.${c.modified_time}
BEGIN
	SELECT RAISE(ABORT, '${errMsg}')
END;
`
		return sql
	}
	
}
