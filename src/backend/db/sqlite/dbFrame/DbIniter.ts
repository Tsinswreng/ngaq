import { I_DbIniter } from "@shared/dbFrame/I_DbIniter"
import type { SqliteDb } from "@backend/sqlite/Sqlite"
import * as SqliteUtil from "@backend/sqlite/sqliteUtil"
import { Index } from "@shared/dbFrame/Index"
export abstract class DbIniter implements I_DbIniter {
	protected constructor(){}

	protected __init__(...args: Parameters<typeof DbIniter.new>){
		const z = this
		return z
	}

	static new(){
		//@ts-ignore
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return DbIniter}
	abstract tables:Object
	abstract indexs:Object
	//abstract triggers
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
	abstract getAllTblSql(): str[] 
	abstract getAllTrigSql(): str[]

	getAllIdxSql(): str[] {
		const z = this
		const ifNE = SqliteUtil.IF_NOT_EXISTS
		const keys = Object.keys(z.indexs)
		const ans = [] as str[]
		for(const k of keys){
			const cur = z.indexs[k]
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

}
