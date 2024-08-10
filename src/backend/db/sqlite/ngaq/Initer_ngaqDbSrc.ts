import * as SqliteUtil from "@backend/sqlite/sqliteUtil"
//import { Index } from "./NgaqDbSrc"
import { Index } from "@shared/dbFrame/Index"
import { NgaqDbSrc } from "./NgaqDbSrc"
import { SqliteDb } from "@backend/sqlite/Sqlite"
import { DbIniter } from "../dbFrame/DbIniter"

export class InitSql_ngaqDbSrc extends DbIniter{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof InitSql_ngaqDbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return InitSql_ngaqDbSrc}

	protected _items = NgaqDbSrc.schemaItems
	get items(){return this._items}
	protected set items(v){this._items = v}

	protected _tables = NgaqDbSrc.tbls
	get tables(){return this._tables}
	protected set tables(v){this._tables = v}

	//TODO
	protected _indexs
	get indexs(){return this._indexs}
	set indexs(v){this._indexs = v}

	
	

	static async MkSchema(db:SqliteDb){
		const z = InitSql_ngaqDbSrc.new()
		return await z.MkSchema(db)
	}

	// static MkSchema(db:SqliteDb){
	// 	const z = InitSql_ngaqDbSrc.new()
	// 	return z.MkSchema(db)
	// }

	async MkSchema(db:SqliteDb){
		const x = this
		const z = {
			db: db
			,initSql: x
		}
		const sqls = z.initSql.getAllTblSql()
		await z.db.BeginTrans()
		for(const sql of sqls){
			await z.db.Run(sql)
		}

		const sqlsIdx = z.initSql.getAllIdxSql()
		for(const sql of sqlsIdx){
			await z.db.Run(sql)
		}

		const sqlTrig = z.initSql.getAllTrigSql()
		for(const sql of sqlTrig){
			await z.db.Run(sql)
		}
		await z.db.Commit()
		return true
	}
	

	getAllTblSql(){
		const z = this
		const ans:str[] = [
			z.mkTbl_word()
			,z.mkTbl_property()
			,z.mkTbl_learn()
			,z.mkTbl_relation()
			,z.mkTbl_wordRelation()
			//,z.mkIdx_wordText()
		]
		return ans
	}

	getAllTrigSql(){
		const z = this
		const ans:str[] = [
			z.mkTrig_aftIns_learnAltWordMt()
			,z.mkTrig_aftIns_propertyAltWordMt()
			,z.mkTrig_aftUpd_propertyAltWordMt()
		]
		return ans
	}

	getAllIdxSql(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const keys = Object.keys(z.items)
		const ans = [] as str[]
		for(const k of keys){
			const cur = z.items[k]
			if(
				!(
					cur instanceof Index
					//&& cur.type === SqliteUtil.SqliteMasterType.index
				)
			){
				continue
			}
			const sql = SqliteUtil.Sql.create.index(cur.tbl_name, cur.name, cur.cols, {checkExist: false})
			ans.push(sql)
		}
		return ans
	}

	mkTbl_word(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.textWord
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,UNIQUE(${c.text}, ${c.belong})
)`//褈複ˋ少者放UNIQUE()元組內ʹ前
		return ans
	}

	mkTbl_learn(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.learn
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.belong} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES ${z.tables.textWord.name}(${z.tables.textWord.col.id})
)`
		return ans
	}

	mkTbl_property(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.property
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.wid} INTEGER NOT NULL
	,${c.text} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES ${z.tables.textWord.name}(${z.tables.textWord.col.id})
)`
		return ans
	}

	mkTbl_relation(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.relation
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.belong} TEXT NOT NULL
	,${c.name} TEXT NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
)`
		return ans
	}

	mkTbl_wordRelation(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const tbl = z.tables.wordRelation
		const c = tbl.col
		const ans = 
`CREATE TABLE ${ifNE} "${tbl.name}"(
	${c.id} INTEGER PRIMARY KEY
	,${c.wid} INTEGER NOT NULL
	,${c.rid} INTEGER NOT NULL
	,${c.ct} INTEGER NOT NULL
	,${c.mt} INTEGER NOT NULL
	,FOREIGN KEY(${c.wid}) REFERENCES "${z.tables.textWord.name}"(${z.tables.textWord.col.id})
	,FOREIGN KEY(${c.rid}) REFERENCES "${z.tables.textWord.name}"(${z.tables.relation.col.id})
)`
		return ans
	}

	

	mkTrig_aftIns_learnAltWordMt(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const trig = z.items.trig_aftIns_learnAltWordMt
		const c = z.tables.learn.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tables.textWord.name} SET ${c.mt} = NEW.${c.mt}
	WHERE ${z.tables.textWord.name}.${z.tables.textWord.col.id} = NEW.${trig.tbl.col.wid};
END;
`
		return ans
	}

	mkTrig_aftIns_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftIns_propertyAltWordMt
		const c = z.tables.textWord.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER INSERT ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tables.textWord.name} SET ${c.mt} = NEW.${c.mt}
	WHERE ${z.tables.textWord.name}.${z.tables.textWord.col.id} = NEW.${trig.tbl.col.wid};
END;
`
		return ans
	}

	mkTrig_aftUpd_propertyAltWordMt(){
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const item = z.items
		const trig = z.items.trig_aftUpd_propertyAltWordMt
		const c = z.tables.textWord.col
		const ans = 
`CREATE TRIGGER ${ifNE} "${trig.name}"
AFTER UPDATE ON ${trig.tbl_name}
FOR EACH ROW
BEGIN
	UPDATE ${z.tables.textWord.name} SET ${c.mt} = NEW.${c.mt}
	WHERE ${z.tables.textWord.name}.${z.tables.textWord.col.id} = NEW.${trig.tbl.col.wid};
END;
`
		return ans
	}
}
