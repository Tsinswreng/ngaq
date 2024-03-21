import { EventEmitter } from "events";
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { $a } from "@shared/Ut";
export interface I_SqliteDbSrc{

	get db():SqliteType.Database
	get dbName():string
	get dbPath():string
	get backupDbPath():string|undefined
	get eventEmmiter(): EventEmitter
	get eventNames(): EventNames
	createTable(table:string, config:CreateTableConfig):Promise<unknown>
	genQry_insert(table:string, obj:Object):[string, unknown[]]
	genQry_updateById(table:string, obj:Object, id:number|string):[string, unknown[]]
	//createTable: (table:string, config:CreateTableConfig)=>Promise<unknown>
}

export class CreateTableConfig{
	static new(){
		return new this()
	}
	ifNotExists = false
}

type Para_EventEmitter = ConstructorParameters<typeof EventEmitter>[0]
export class SqliteDbEventEmitter extends EventEmitter{
	protected constructor(p:Para_EventEmitter){
		super(p)
	}
	static new(props?:Para_EventEmitter){
		if(props != void 0){
			const o = new SqliteDbEventEmitter(props)
			return o
		}
		const o = new SqliteDbEventEmitter({captureRejections:true})
		return o
	}
}


export class EventNames{
	protected constructor(){}
	static new(){
		return new this()
	}
	createTable_before = 'createTable_before'
	createTable_after = 'createTable_after'
	error = 'error'
}

export interface Abs_SqliteDbSrc_Static<Self>{
	new:(...params:any[])=>Self
	New:(...params:any[])=>Promise<Self>
}

export interface I_DbRow_Static<Self, Entity>{
	toEntity(o:Self):Entity
	toPlain(o:Entity):Self
}


abstract class _Abs_SqliteDbSrc implements I_SqliteDbSrc{

	protected constructor(){}

	static new(p):_Abs_SqliteDbSrc{
		throw new Error('')
	}

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
	

	protected _db: SqliteType.Database
	get db(){return this._db}

	protected _eventEmmiter = SqliteDbEventEmitter.new()
	get eventEmmiter(){return this._eventEmmiter}

	protected _eventNames = EventNames.new()
	get eventNames(){return this._eventNames}

	protected _dbName:string
	get dbName(){return this._dbName}
	
	protected _dbPath: string
	get dbPath(){return this._dbPath}
	
	protected _backupDbPath:string
	get backupDbPath(){return this._backupDbPath}
	protected _mode:number = Sqlite.openMode.DEFAULT_CREATE

	abstract createTable(table: string, config: CreateTableConfig): Promise<unknown>;

	genQry_insert(table: string, obj: Object): [string, unknown[]] {
		throw new Error()
	}

	genQry_updateById(table: string, obj: Object, id: string | number): [string, unknown[]] {
		throw new Error()
	}

}


//export const Abs_SqliteDbSrc = _Abs_SqliteDbSrc
export const Abs_SqliteDbSrc:Abs_SqliteDbSrc_Static<_Abs_SqliteDbSrc> & typeof _Abs_SqliteDbSrc = _Abs_SqliteDbSrc //不寫& typeof xxx 則不可繼承
export type Abs_SqliteDbSrc = _Abs_SqliteDbSrc

