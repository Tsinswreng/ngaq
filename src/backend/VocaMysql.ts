// import * as mysql2 from 'mysql2/promise'
// import * as Tp from 'Type'
// import VocaSqlite from './VocaSqlite';
// import Sqlite from 'db/Sqlite';
// import SingleWord2 from 'SingleWord2';

// export default class VocaMysql{

// 	public constructor(pool:mysql2.PoolOptions){
// 		this._pool = mysql2.createPool(pool)
// 	}

// 	private _pool:mysql2.Pool =  mysql2.createPool({
// 		host: 'localhost',
// 		user: 'root',
// 	})
// 	;public get pool(){return this._pool;};


// 	public static async getAllWords<T>(pool:mysql2.Pool, table:string){
// 		const sql = `SELECT * FROM ${table}` //mysql ᵗ表名不能加引號?
// 		let o = await pool.query(sql)
// 		let r = o[0] as T[]
// 		for(let i = 0; i < r.length; i++){
// 			(r[i] as any).ling = table
// 		}
// 		return r
// 	}

// 	public getAllWords<T>(table:string){
// 		return VocaMysql.getAllWords<T>(this.pool, table)
// 	}

// 	/**
// 	 * 單詞ˇ舊mysql表ᙆ新式ᵗsqliteᵗ詞表ʰ複製。
// 	 * @param pool 
// 	 * @param table 
// 	 * @param liteInst 
// 	 * @returns 
// 	 */
// 	public static async toSqliteTable_forOld(pool:mysql2.Pool, table:string, liteInst:VocaSqlite){
// 		let allWordsInMysql:Tp.Old_IVocaRow[]|null = await VocaMysql.getAllWords<Tp.Old_IVocaRow>(pool, table)
// 		let neoObjs: Tp.IVocaRow[]|null = SingleWord2.parseOldObj(allWordsInMysql); allWordsInMysql=null
// 		let neoInst: SingleWord2[]|null = SingleWord2.parse(neoObjs); neoObjs=null
// 		return liteInst.addWords_old(neoInst)
// 	}

// 	public async toSqliteTable_forOld(table:string, liteInst:VocaSqlite){
// 		return VocaMysql.toSqliteTable_forOld(this.pool, table, liteInst)
// 	}

// }