import { SqliteDbSrc } from "@shared/interfaces/SqliteDbSrc";
import Sqlite, { SqliteType } from "@backend/db/Sqlite";

export class VocaTableDbSrc implements SqliteDbSrc{
	protected _db: SqliteType.Database
	get db(){return this._db}

	protected _dbName:string
	get dbName(){return this._dbName}
	
	protected _dbPath: string
	get dbPath(){return this._dbPath}
	
	protected _backupDbPath:string
	get backupDbPath(){return this._backupDbPath}
	protected _mode:number = Sqlite.openMode.DEFAULT_CREATE

	protected constructor(
	){}

	static async New(props:{
		_dbName?:string,
		_dbPath:string,
		_backupDbPath?:string
		,_mode?:number
	}){
		//@ts-ignore
		const o = new this()
		Object.assign(o, props)
		if(o._dbPath != void 0){
			o._db = await Sqlite.newDatabase(o._dbPath, o._mode)
		}
		return o
	}
}