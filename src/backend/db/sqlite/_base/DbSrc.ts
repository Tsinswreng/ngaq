//import { EventEmitter } from "events";
import { EventEmitter } from "eventemitter3";
import Sqlite, { SqliteType } from "@backend/db/Sqlite";
import { $a, inherit } from "@shared/Ut";
import * as Le from '@shared/linkedEvent'
import { Abs_Table } from "./Table";
//type Para_EventEmitter = ConstructorParameters<typeof EventEmitter>[0]

export interface Abs_DbSrc_Static<Self>{
	new:(...params:any[])=>Self
	New:(...params:any[])=>Promise<Self>
}

export interface I_DbRow_Static<Self, Entity>{
	toEntity(o:Self):Entity
	toPlain(o:Entity):Self
}

export interface I_DbSrc{
	get db():SqliteType.Database
	get dbName():string
	get dbPath():string
	get backupDbPath():string|undefined
	get eventEmmiter_deprecated(): EventEmitter
	get eventNames_deprecated(): EventNames_deprecated
	createTable(table:string, config:CreateTableOpt):Promise<unknown>
	get linkedEmitter():Le.LinkedEmitter
	get events():Le.Events
	// genQry_insert(table:string, obj:Object):[string, unknown[]]
	// genQry_updateById(table:string, obj:Object, id:number|string):[string, unknown[]]
	//createTable: (table:string, config:CreateTableConfig)=>Promise<unknown>
}


export class EventNames_deprecated{
	protected constructor(){}
	static new(){
		return new this()
	}
	createTable_before = 'createTable_before'
	createTable_after = 'createTable_after'
	error = 'error'
}

export class Events extends Le.Events{
	protected constructor(){
		super()
	}
	static new(){
		return new this()
	}
	createTable_before = Le.Event.new('createTable_before')
	createTable_after = Le.Event.new('createTable_after')
}

export class LinkedEventEmitter extends Le.LinkedEmitter{
	protected _eventEmitter: EventEmitter = InnerDbSrcEventEmitter.new()
	protected constructor(){
		super()
	}
	static new(...params:Parameters<typeof Le.LinkedEmitter.new>){
		const f = Le.LinkedEmitter.new(...params)
		const c = new this()
		return inherit(c,f)
	}
}



export class CreateTableOpt{
	static new(){
		return new this()
	}
	ifNotExists = false
}

export class InnerDbSrcEventEmitter extends EventEmitter{
	protected constructor(){
		super()
	}
	static new(props?:ConstructorParameters<typeof EventEmitter>){
		if(props != void 0){
			const o = new InnerDbSrcEventEmitter(...props)
			return o
		}
		const o = new InnerDbSrcEventEmitter()
		return o
	}
}


export class DbSrcEventEmitter extends Le.LinkedEmitter{
	protected _eventEmitter: Le.I_EventEmitter = InnerDbSrcEventEmitter.new()
	protected constructor(){
		super()
	}
	static new(...params:Parameters<typeof Le.LinkedEmitter.new>){
		const f = Le.LinkedEmitter.new(...params)
		const c = new this()
		return inherit(c,f)
	}
}


export interface New_Abs_DbSrc{
	_dbName?:string,
	_dbPath:string,
	_backupDbPath?:string
	,_mode?:number
	,_TableClass?: typeof Abs_Table
}

export abstract class Abs_DbSrc implements I_DbSrc{

	protected constructor(){}

	/**
	 * @deprecated
	 * @param p 
	 */
	static new(p:never):Abs_DbSrc{
		throw new Error('')
	}

	static async New(props:New_Abs_DbSrc):Promise<Abs_DbSrc>{
		//@ts-ignore
		const o = new this()
		Object.assign(o, props)
		o._db = await Sqlite.newDatabase(o._dbPath, o._mode)
		
		//console.log(o.dbPath, o.db)
		return o
	}

	protected _TableClass = Abs_Table
	get TableClass(){return this._TableClass}
	

	protected _db: SqliteType.Database
	get db(){return this._db}

	protected _eventEmmiter_deprecated = InnerDbSrcEventEmitter.new()
	get eventEmmiter_deprecated(){return this._eventEmmiter_deprecated}

	protected _linkedEmitter = Le.LinkedEmitter.new(InnerDbSrcEventEmitter.new())
	get linkedEmitter(){return this._linkedEmitter}

	protected _eventNames_deprecated = EventNames_deprecated.new()
	get eventNames_deprecated(){return this._eventNames_deprecated}

	protected _events = Events.new()
	get events(){return this._events}

	protected _dbName:string
	get dbName(){return this._dbName}
	
	protected _dbPath: string
	get dbPath(){return this._dbPath}
	
	protected _backupDbPath:string
	get backupDbPath(){return this._backupDbPath}
	protected _mode:number = Sqlite.openMode.DEFAULT_CREATE

	abstract createTable(table: string, config: CreateTableOpt): Promise<unknown>;

	openTable(tableName:string){
		const s = this
		const table = s.TableClass.new({
			_tableName:tableName
			,_dbSrc: s
		})
		return table
	}


}

// export const Abs_DbSrc = _Abs_DbSrc
// //export const Abs_DbSrc:Abs_DbSrc_Static<_Abs_DbSrc> & typeof _Abs_DbSrc = _Abs_DbSrc //不寫& typeof xxx 則不可繼承
// export type Abs_DbSrc = _Abs_DbSrc

