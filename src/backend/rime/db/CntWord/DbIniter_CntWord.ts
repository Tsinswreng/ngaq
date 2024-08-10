import { DbIniter } from "@backend/db/sqlite/dbFrame/DbIniter";
import * as DbStf from "@backend/rime/db/CntWord/CntWordDbStuff";
import { SqliteDb } from "@backend/sqlite/Sqlite";
import { IF_NOT_EXISTS } from "@backend/sqlite/sqliteUtil";
import * as SqliteUtil from "@backend/sqlite/sqliteUtil";
const ifNotExists = IF_NOT_EXISTS


export class DbIniter_CntWord extends DbIniter {
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof DbIniter_CntWord.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected _tables = DbStf.Tbls.tbls
	get tables(){return this._tables}
	protected set tables(v){this._tables = v}

	protected _indexs = DbStf.Indexs.idxs
	get indexs(){return this._indexs}
	protected set indexs(v){this._indexs = v}

	protected _triggers = DbStf.Triggers.trigs
	get triggers(){return this._triggers}
	protected set triggers(v){this._triggers = v}
	

	//get This(){return DbIniter_CntWord}
	override getAllTblSql(): str[] {
		const z = this
		return [
			z.mkTbl_cntWord()
		]
	}

	getAllTrigSql(): str[] {
		const z = this
		return [
			z.sql_mkTrig_chkMtGeCt()
		]
	}


	mkTbl_cntWord(){
		const z = this
		const tbl = z.tables.cntWord
		const c = tbl.col
		const sql = 
`CREATE TABLE ${ifNotExists} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.cnt} INT DEFAULT 1
	,${c.ct} INTEGER DEFAULT ${SqliteUtil.snippet.now_unixMills}
	,${c.mt} INTEGER DEFAULT ${SqliteUtil.snippet.now_unixMills}
	,UNIQUE(${c.text},${c.belong})
)`
		return sql
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
	sql_mkTrig_earlierDuplicate(){
		//tbl:str, trig:str
		const z = this
		let ifNE = ''
		ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.cntWord.name
		const trig = z.triggers.trig_earlierDuplicate.name
		const c = z.tables.cntWord.col
		const sql =
`
CREATE TRIGGER ${ifNE} "${trig}" BEFORE INSERT ON "${tbl}"
FOR EACH ROW
WHEN EXISTS(
	SELECT 1 FROM "${tbl}"
	WHERE ${c.text} = NEW.${c.text} AND ${c.belong} = NEW.${c.belong}
	AND ${c.ct} >= NEW.${c.ct}
)
BEGIN
	UPDATE "${tbl}"
	SET
	${c.ct} = NEW.${c.ct}
	,${c.cnt} = CASE
		WHEN NEW.${c.cnt} > ${c.cnt} THEN NEW.${c.cnt}
		ELSE ${c.cnt}
	END
	,${c.mt}=
	CASE
		WHEN NEW.${c.mt} > ${c.mt} THEN NEW.${c.mt}
		ELSE ${c.mt}
	END
	WHERE ${c.text}=NEW.${c.text};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}


	/**
	 * if( NEW.text_ 既存于表 && NEW.created_time更晚 )
	 * { 改潙update、cnt+=NEW.cnt??1
	 * 	if(NEW.modified_time is null){modified_time = now()}
	 * 	else if(NEW.modified_time 更晚){modified_time = new的}
	 * 	else {不改modified_time}
	 * }
	 */
	sql_mkTrig_laterDuplicate(){
		//tbl:str, trig:str
		const z = this
		const tbl = z.tables.cntWord.name
		const trig = z.triggers.trig_laterDuplicate.name
		let ifNE = ''
		ifNE = IF_NOT_EXISTS
		const c = z.tables.cntWord.col
		const sql =
`
CREATE TRIGGER ${ifNE} "${trig}" BEFORE INSERT ON "${tbl}"
FOR EACH ROW
WHEN EXISTS(
	SELECT 1 FROM "${tbl}"
	WHERE ${c.text} = NEW.${c.text} 
	AND ${c.belong} = NEW.${c.belong}
	AND ${c.ct} < NEW.${c.ct}
)
BEGIN
	UPDATE "${tbl}"
	SET 
	${c.cnt} = ${c.cnt} +
	CASE
		WHEN NEW.${c.cnt} IS NULL THEN 1
		ELSE NEW.${c.cnt}
	END,
	${c.mt}=
	CASE
		WHEN NEW.${c.mt} IS NULL THEN (strftime('%s', 'now'))
		WHEN NEW.${c.mt} > ${c.mt} THEN NEW.${c.mt}
		ELSE ${c.mt}
	END
	WHERE ${c.text}=NEW.${c.text};
	SELECT RAISE(IGNORE);
END;
`
		return sql
	}


	/**
	 * mt < ct 旹拋錯
	 * @param tbl 
	 * @param trig 
	 * @param errMsg 勿有特殊字符。因佢ˇ直ᵈ插入sql之引號中。
	 * @param opt 
	 */
	sql_mkTrig_chkMtGeCt(){
		//tbl:str, trig:str, errMsg:str
		const z = this
		const tbl = z.tables.cntWord.name
		const trig = z.triggers.trig_chkMt.name
		let ifNE = ''
		ifNE = IF_NOT_EXISTS
		const errMsg = 'modified_time cannot be earlier than created_time'
		const c = z.tables.cntWord.col
		const sql = 
`CREATE TRIGGER ${ifNE} "${trig}"
BEFORE UPDATE ON "${tbl}"
FOR EACH ROW
WHEN NEW.${c.mt} < OLD.${c.ct}
BEGIN
	SELECT RAISE(ABORT, '${errMsg}');
END;
`
		return sql
	}

}
