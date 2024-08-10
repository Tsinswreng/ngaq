import { I_DbIniter } from "@shared/dbFrame/I_DbIniter"
import type { SqliteDb } from "@backend/sqlite/Sqlite"
export class DbIniter implements I_DbIniter {
	protected constructor(){}

	protected __init__(...args: Parameters<typeof DbIniter.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return DbIniter}
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
	getAllTblSql(): str[] {
		return []
	}
	getAllIdxSql(): str[] {
		return []
	}
	getAllTrigSql(): str[] {
		return []
	}
}
