import { HistoryDbSrc } from "./HistoryDbSrc"
import {I_readN} from '@shared/Type'
import { HistoryDbRow } from "./HistoryDbRow"
import * as SqliteUitl from '@backend/sqlite/sqliteUitl'
import { SqliteDb } from "@backend/sqlite/Sqlite"


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

	protected _dbSrc:HistoryDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}

	get db(){return this._dbSrc.db}

	protected _tblName:str
	get tblName(){return this._tblName}
	protected set tblName(v){this._tblName = v}

	

	async insert(readN:I_readN<HistoryDbRow>){
		const z = this
		const col = HistoryDbRow.col
		const first = readN.read(1)
		if(first== void 0){
			console.error('123') //t
			return
		}

		const sqlObj = SqliteUitl.Sql.obj.new(first, {
			ignoredKeys: [col.id]
		})
		const sql = sqlObj.geneFullInsertSql(z._tblName, {orIgnore:false})
		const stmt = z.db.prepare(sql)
		//...
	}
	
}
