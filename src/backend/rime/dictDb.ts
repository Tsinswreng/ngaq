import { Abs_DbSrc, CreateTableOpt } from "@backend/db/sqlite/_base/DbSrc"
import sqlite3 from "sqlite3"


export class Dict{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof Dict.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//static unicodeSeparator = '-'

}



export class DbRow{
	static readonly id='id'
	static readonly text = 'text'
	static readonly code = 'code'
	id:int
	text:str
	code:str
	protected constructor(){}
}

export class DictDbSrc extends Abs_DbSrc{

	protected constructor(){
		super()
	}
	protected __init__(...args: Parameters<typeof DictDbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	static async createTableSql(tblName:str, opt: CreateTableOpt){
		let ifNotExists = ''
		if(opt.ifNotExists){
			ifNotExists = 'IF NOT EXISTS'
		}
		return `CREATE TABLE ${ifNotExists} "${tblName}" (
			id INT PRIMARY KEY
			,text TEXT
			,code TEXT
		)`
		
	}

	createTable(table: string, opt: CreateTableOpt): Promise<unknown> {
		throw new Error("Method not implemented.")
	}
}




export class DictTbl{

}



