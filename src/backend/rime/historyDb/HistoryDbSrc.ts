import { HistoryTbl } from "./HistoryTbl";

import type { I_optCheckExist } from "@backend/sqlite/sqliteUitl";
import type { sqlite3 } from "sqlite3";

import { SqliteDb } from "@backend/sqlite/Sqlite";
import * as SqliteUitl from "@backend/sqlite/sqliteUitl";
import { HistoryDbRow } from "./HistoryDbRow";


/* 

在我的ts sqlite項目中、我有兩個類、其中一個類用來處理數據庫架構相關邏輯、另一個類用來處理單個表的操作。應該誰import誰?

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
	// idx_text='idx_text'
	// trigger_replace_duplicate='trigger_replace_duplicate'
	// errMsg_chkModifiedTime = 'modified_time cannot be earlier than created_time'
	tbl_commitHistory = 'commitHistory'
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

	getTblByName(name:str){
		const z = this
		return HistoryTbl.new(z, name)
	}

}
