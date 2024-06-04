import { mergeErrStack } from "@shared/Ut";
import sqlite3, { Database } from "sqlite3";


//PRAGMA table_info
export interface SqliteTableInfo{
	cid:number //列ᵗ序
	name:string
	type:string
	notnull: 0|1
	dflt_value:number|null//默認值
	pk:0|1 //主鍵
}

export interface Sqlite_sequence{
	name:string
	seq:number
}

export interface Sqlite_master{
	type:string 
	name:string //存储了数据库对象的名称，包括表、视图、索引等。
	tbl_name:string //也存储了数据库对象的名称，但通常用于描述表（table）对象的名称。
	rootpage:number //rootpage 用于标识一个 B-Tree 的根节点在数据库文件中的页码
	sql:string
}



export class DbErr extends Error{
	protected constructor(message?:string){
		super(message)
	}
	protected __init__(...args:Parameters<typeof DbErr.new>){
		const z = this
		z._err = args[0]
		const sql = args[1]
		z.sql = sql??z.sql
		const recErr = args[2]
		z._err.stack += '\n\n' + (recErr?.stack??'')
		//console.log(z.err.stack)//t
	}
	static new(err:Error, sql?:str, recordErr?:Error){
		const z = new this(err.message)
		z.__init__(err, sql, recordErr)
		return z
	}
	protected _err:Error
	get err(){return this._err}

	sql:str=''
}
const DE = DbErr.new.bind(DbErr)


type NewDatabase = ConstructorParameters<typeof sqlite3.Database>
export class SqliteDb extends Object{

	protected constructor(){
		super()
	}

	protected __init__(...args:Parameters<typeof SqliteDb.new>){
		const z = this
		z._db = args[0]
		return z
	}

	static new(db:Database){
		const z = new this()
		z.__init__(db)
		return z
	}

	/**
	 * console.log(2)之後卡死不動
	 * @deprecated
	 * @param fileName 
	 * @param mode 
	 * @returns 
	 */
	static rawConnectByPathAsync(fileName:NewDatabase[0], mode?:NewDatabase[1]){
		const recErr = new Error()
		return new Promise<sqlite3.Database>((res, rej)=>{
			const dbRaw = new sqlite3.Database(fileName, mode, function(err){
				if(err != void 0){
					rej(DE(err, void 0, recErr));return
				}
				res(dbRaw)
			})
		})
	}

	static rawConnectByPath(fileName:NewDatabase[0], mode?:NewDatabase[1]){
		return new sqlite3.Database(fileName, mode)
	}

	get This(){return SqliteDb}

	static readonly sqlite_master = 'sqlite_master'
	static readonly sqlite_sequence = 'sqlite_sequence'
	//static get sqlite_master(){return 'sqlite_master'}

	protected _db:Database
	get db(){return this._db}
	
	/**
	 * 
	 * @param sql 
	 * @returns Promise<[sqlite3.Statement, T[]]>
	 */
	static all<T>(db:sqlite3.Database, sql:str, params:any){
		const recErr = new Error()
		return new Promise<[sqlite3.Statement, T[]]>((res,rej)=>{
			db.all<T>(sql, params ,function(this, err, rows){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res([this,rows])
			})
		})
	}

	all<T>(sql:str, params?:any){
		const z = this
		return z.This.all<T>(z.db, sql ,params)
	}
	
	/**
	 * 
	 * @param sql 
	 * @param params 
	 * @returns Promise<sqlite3.RunResult>
	 */
	static run(db:sqlite3.Database, sql:str, params?:any){
		const recErr = new Error()
		return new Promise<sqlite3.RunResult>((res,rej)=>{
			db.run(sql, params ,function(this, err){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res(this)
			})
		})
	}

	run(sql:str, params?:any){
		const z = this
		return z.This.run(z.db, sql ,params)
	}

	/**
	 * 
	 * @param sql 
	 * @param params 
	 * @returns Promise<[sqlite3.Statement, T]>
	 */
	static get<T>(db:sqlite3.Database, sql:str, params:any){
		const recErr = new Error()
		return new Promise<[sqlite3.Statement, T]>((res,rej)=>{
			db.get<T>(sql, params, function(this, err, row){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res([this, row])
			})
		})
	}

	get<T>(sql:str, params:any){
		const z = this
		return z.This.get<T>(z.db, sql, params)
	}

	static exec(db:sqlite3.Database, sql:str){
		const recErr = new Error()
		return new Promise<sqlite3.Statement>((res, rej)=>{
			db.exec(sql, function(this, err){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res(this)
			})
		})
	}

	exec(sql:str){
		const z = this
		return z.This.exec(z.db, sql)
	}

	static close(db:Database){
		const recErr = new Error()
		return new Promise<bool>((res, rej)=>{
			db.close(function(err){
				if(err != void 0){
					rej(DE(err, void 0, recErr));return
				}
				res(true)
			})
		})
	}

	close(){
		const z = this
		return z.This.close(z.db)
	}

	static prepareRaw(db:sqlite3.Database, sql:str, params?:any){
		const recErr = new Error()
		return new Promise<sqlite3.Statement>((res,rej)=>{
			db.prepare(sql, params, function(this, err){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res(this)
			})
		})
	}

	prepareRaw(sql:str, params?:any){
		const z = this
		return z.This.prepareRaw(z.db, sql, params)
	}

	static async prepare(db:sqlite3.Database, sql:str, params?:any){
		const z = this
		const raw = await z.prepareRaw(db, sql, params)
		const ans = Statement.new(raw, sql)
		return ans
	}

	prepare(sql:str, params?:any){
		const z = this
		return z.This.prepare(z.db, sql, params)
	}

	static beginTrans(db:sqlite3.Database){
		const z = this
		return z.run(db, 'BEGIN TRANSACTION')
	}
	static commit(db:sqlite3.Database){
		const z = this
		return z.run(db, 'COMMIT')
	}
	static rollback(db:sqlite3.Database){
		const z = this
		return z.run(db, 'ROLLBACK')
	}

	
	/**
	 * 
	 * @param db 
	 * @param fn 
	 * @returns Promise<[db.commit後之Runresult, fn被await之後之返ˡ值]>
	 */
	static transaction<T>(db:sqlite3.Database, fn:()=>T)
	:Promise<[sqlite3.RunResult, Awaited<T>]>
	{ //
		const z = this
		const recErr = new Error()
		return new Promise((res, rej)=>{
			db.serialize(async()=>{
				try {
					await z.beginTrans(db)
					const ans = await fn()
					const commitRes = await z.commit(db)
					res([commitRes, ans])
				} catch (error) {
					await z.rollback(db)
					if(error instanceof Error){
						error.stack += '\n\n' + recErr.stack
						rej(DE(error));return
					}
					rej(error)
				}
			})
		})
	}

	transaction<T>(fn:()=>T){
		const z = this
		return z.This.transaction(z.db, fn)
	}
}

export class Statement extends Object{

	protected constructor(){
		super()
	}

	protected __init__(...args:Parameters<typeof Statement.new>){
		const z = this
		z._db = args[0]
		z._sql = args[1]
		return z
	}

	static new(statement:sqlite3.Statement, sql:str){
		const z = new this()
		z.__init__(statement, sql)
		return z
	}

	get This(){return Statement}

	protected _db:sqlite3.Statement
	get db(){return this._db}

	protected _sql:str
	get sql(){return this._sql}
	
	/**
	 * 拋錯時無sql
	 * @param sql 
	 * @returns Promise<[sqlite3.Statement, T[]]>
	 */
	static all<T>(db:sqlite3.Statement, params?:any){
		const recErr = new Error()
		return new Promise<[sqlite3.Statement, T[]]>((res,rej)=>{
			db.all<T>(params ,function(this, err, rows){
				if(err != void 0){
					rej(DE(err, void 0, recErr));return
				}
				res([this,rows])
			})
		})
	}

	all<T>(params?:any){
		const z = this
		//return z.This.all<T>(z.db, params)
		const db = z.db
		const recErr = new Error()
		const sql = z.sql
		return new Promise<[sqlite3.Statement, T[]]>((res,rej)=>{
			db.all<T>(params ,function(this, err, rows){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res([this,rows])
			})
		})
	}
	
	/**
	 * 用於執行沒有返回值的 SQL 語句
	 * 不會返回查詢結果，只會返回執行操作的狀態。
	 * @param sql 
	 * @param params 
	 * @returns Promise<sqlite3.RunResult>
	 */
	static run(db:sqlite3.Statement, params?:any){
		const recErr = new Error()
		return new Promise<sqlite3.RunResult>((res,rej)=>{
			db.run(params ,function(this, err){
				if(err != void 0){
					rej(DE(err, void 0, recErr));return
				}
				res(this)
			})
		})
	}

	run(params?:any){
		const z = this
		//return z.This.run(z.db, params)
		const recErr = new Error()
		const db = z.db
		const sql = z.sql
		return new Promise<sqlite3.RunResult>((res,rej)=>{
			db.run(params ,function(this, err){
				if(err != void 0){
					rej(DE(err, sql, recErr));return
				}
				res(this)
			})
		})
	}

	/**
	 * 執行一條 SQL 查詢並返回一條結果。
	 * 用於查詢返回單行數據的情況，例如查詢主鍵或唯一索引的數據。
	 * @param sql 
	 * @param params 
	 * @returns Promise<[sqlite3.Statement, T]>
	 */
	static get<T>(db:sqlite3.Statement, params?:any){
		const recErr = new Error()
		return new Promise<[sqlite3.Statement, T?]>((res,rej)=>{
			db.get<T>(params, function(this, err, row){
				if(err != void 0){
					rej(DE(err, void 0 ,recErr));return
				}
				res([this, row])
			})
		})
	}

	get<T>(params?:any){
		const z = this
		//return z.This.get<T>(z.db, params)
		const recErr = new Error()
		const db = z.db
		const sql = z.sql
		return new Promise<[sqlite3.Statement, T?]>((res,rej)=>{
			db.get<T>(params, function(this, err, row){
				if(err != void 0){
					rej(DE(err, sql ,recErr));return
				}
				res([this, row])
			})
		})
	}

	// static each<T>(db:sqlite3.Statement, param:any, complete?: (err: Error | null, count: number) => void){
	// 	db.each<T>(param, function(this, err, row){

	// 	}, complete)
	// }

}