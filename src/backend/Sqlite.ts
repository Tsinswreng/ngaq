import sqlite3, { Database } from "sqlite3";

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

	get This(){return SqliteDb}

	protected _db:Database
	get db(){return this._db}
	
	/**
	 * 
	 * @param sql 
	 * @returns Promise<[sqlite3.Statement, T[]]>
	 */
	static all<T>(db:sqlite3.Database, sql:str, params:any){
		return new Promise<[sqlite3.Statement, T[]]>((res,rej)=>{
			db.all<T>(sql, params ,function(this, err, rows){
				if(err != void 0){
					rej(err);return
				}
				res([this,rows])
			})
		})
	}

	all<T>(sql:str, params:any){
		const z = this
		return z.This.all<T>(z.db, sql ,params)
	}
	
	/**
	 * 
	 * @param sql 
	 * @param params 
	 * @returns Promise<sqlite3.RunResult>
	 */
	static run(db:sqlite3.Database, sql:str, params:any){
		return new Promise<sqlite3.RunResult>((res,rej)=>{
			db.run(sql, params ,function(this, err){
				if(err != void 0){
					rej(err);return
				}
				res(this)
			})
		})
	}

	run(sql:str, params:any){
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
		return new Promise<[sqlite3.Statement, T]>((res,rej)=>{
			db.get<T>(sql, params, function(this, err, row){
				if(err != void 0){
					rej(err);return
				}
				res([this, row])
			})
		})
	}

	get<T>(sql:str, params:any){
		const z = this
		return z.This.get<T>(z.db, sql, params)
	}

	static close(db:Database){
		return new Promise<bool>((res, rej)=>{
			db.close(function(err){
				if(err != void 0){
					rej(err);return
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
		return new Promise<sqlite3.Statement>((res,rej)=>{
			db.prepare(sql, params, function(this, err){
				if(err != void 0){
					rej(err);return
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
		const ans = Statement.new(raw)
		return ans
	}

	prepare(sql:str, params?:any){
		const z = this
		return z.This.prepare(z.db, sql, params)
	}
}

export class Statement extends Object{

	protected constructor(){
		super()
	}

	protected __init__(...args:Parameters<typeof Statement.new>){
		const z = this
		z._db = args[0]
		return z
	}

	static new(statement:sqlite3.Statement){
		const z = new this()
		z.__init__(statement)
		return z
	}

	get This(){return Statement}

	protected _db:sqlite3.Statement
	get db(){return this._db}
	
	/**
	 * 
	 * @param sql 
	 * @returns Promise<[sqlite3.Statement, T[]]>
	 */
	static all<T>(db:sqlite3.Statement, params?:any){
		return new Promise<[sqlite3.Statement, T[]]>((res,rej)=>{
			db.all<T>(params ,function(this, err, rows){
				if(err != void 0){
					rej(err);return
				}
				res([this,rows])
			})
		})
	}

	all<T>(params?:any){
		const z = this
		return z.This.all<T>(z.db, params)
	}
	
	/**
	 * 
	 * @param sql 
	 * @param params 
	 * @returns Promise<sqlite3.RunResult>
	 */
	static run(db:sqlite3.Statement, params?:any){
		return new Promise<sqlite3.RunResult>((res,rej)=>{
			db.run(params ,function(this, err){
				if(err != void 0){
					rej(err);return
				}
				res(this)
			})
		})
	}

	run(params?:any){
		const z = this
		return z.This.run(z.db, params)
	}

	/**
	 * 
	 * @param sql 
	 * @param params 
	 * @returns Promise<[sqlite3.Statement, T]>
	 */
	static get<T>(db:sqlite3.Statement, params?:any){
		return new Promise<[sqlite3.Statement, T?]>((res,rej)=>{
			db.get<T>(params, function(this, err, row){
				if(err != void 0){
					rej(err);return
				}
				res([this, row])
			})
		})
	}

	get<T>(params?:any){
		const z = this
		return z.This.get<T>(z.db, params)
	}


}