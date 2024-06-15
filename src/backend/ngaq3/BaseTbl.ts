import type { SqliteDb } from "@backend/sqlite/Sqlite"


export class BaseTblNames{

}

export abstract class BaseTbl{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof BaseTbl.new>){
		const z = this
		return z
	}

	static new(db:SqliteDb, tblName:str):BaseTbl{
		//@ts-ignore
		const z = new this()
		z.__init__(db,tblName)
		return z
	}

	get This(){return BaseTbl}

	protected _db:SqliteDb
	get db(){return this._db}
	set db(v){this._db = v}

	protected _tblName:str
	get tblName(){return this._tblName}
	protected set tblName(v){this._tblName = v}

	protected _names = new BaseTblNames()
	get names(){return this._names}
	protected set names(v){this._names = v}
	

	abstract mkTbl():Promise<any>

	init():any{}

	async mkTblEtInit(){
		const z = this
		await z.mkTbl()
		await z.init()
		return true
	}


}
