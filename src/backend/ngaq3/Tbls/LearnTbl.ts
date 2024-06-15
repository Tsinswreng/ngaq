// import type { SqliteDb } from "@backend/sqlite/Sqlite"
// import type { I_optCheckExist } from "@backend/sqlite/sqliteUitl"
// import * as SqliteUitl from '@backend/sqlite/sqliteUitl'

// import {
// 	LearnRow
// } from '@backend/ngaq3/DbRows/wordDbRows'
// import { BaseTbl, BaseTblNames } from "../BaseTbl"


// class LearnTbl extends BaseTbl{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof LearnTbl.new>){
// 		const z = this
// 		return z
// 	}

// 	static new(){
// 		const z = new this()
// 		z.__init__()
// 		return z
// 	}

// 	get This(){return LearnTbl}

// 	static sql_mkTbl(tbl:str, opt?:I_optCheckExist){
// 		let ifNE = SqliteUitl.geneIfNotExists(opt)
// 		const c = LearnRow.col
// 		const ans = 
// `CREATE TABLE ${ifNE} "${tbl}"(
// 	${c.id} INTEGER PRIMARY KEY
// 	,${c.wid} INTEGER
// 	,${c.time} INTEGER
// 	,${c.status} TEXT
// 	,FOREIGN KEY(${c.wid}) REFERENCE TO
// )`
// 	}

// 	mkTbl(): Promise<any> {
		

// 	}

// 	init() {
		
// 	}
// }
