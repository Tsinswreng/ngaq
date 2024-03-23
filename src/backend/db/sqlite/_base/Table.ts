import { I_DbSrc } from "@backend/db/sqlite/_base/DbSrc"
//import { Db_User } from "@shared/interfaces/User"
import Sqlite, {SqliteType} from "@backend/db/Sqlite"
import { $a, inherit } from "@shared/Ut"
//import EventEmitter = require("eventemitter3")
import { EventEmitter } from "eventemitter3";
type RunResult = SqliteType.RunResult
//type Para_EventEmitter = ConstructorParameters<typeof EventEmitter>[0]
import * as Le from '@shared/linkedEvent'
export class InnerTableEventEmitter extends EventEmitter{
	protected constructor(props?:ConstructorParameters<typeof EventEmitter>){
		super()
	}
	static new(props?:ConstructorParameters<typeof EventEmitter>){
		if(props != void 0){
			const o = new InnerTableEventEmitter(...props)
			return o
		}
		const o = new InnerTableEventEmitter()
		return o
	}
}

export class LinkedEventEmitter extends Le.Emitter{
	protected _eventEmitter: Le.I_EventEmitter = InnerTableEventEmitter.new()
	protected constructor(){
		super()
	}
	static new(...params:Parameters<typeof Le.Emitter.new>){
		const f = Le.Emitter.new(...params)
		const c = new this()
		return inherit(c,f)
	}
}


export class EventNames_deprecated{
	protected constructor(){}
	static new(){
		return new this()
	}
	addRecords_before = 'addRecords_before'
	addRecords_after = 'addRecords_after'
	error = 'error'
}



export class Events extends Le.Events{
	protected constructor(){
		super()
	}
	static new(){
		return new this()
	}
	addRecords_before = Le.Event.new('addRecords_after')
	addRecords_after = Le.Event.new('addRecords_after')
	error = Le.Event.new('error')
}


type Row = Object

export abstract class Abs_Table{
	protected constructor(){

	}

	static new(props:{
		_dbSrc: I_DbSrc
		_tableName:string
	}):Abs_Table{
		//@ts-ignore
		const o = new this()
		Object.assign(o, props)
		return o
	}

	
	protected _eventNames = EventNames_deprecated.new()
	get eventNames(){return this._eventNames}

	protected _events = Events.new()
	get events(){return this._events}

/* 	protected _eventEmitter_deprecated = InnerTableEventEmitter.new()
	get eventEmitter_deprecated(){return this._eventEmitter_deprecated} */

	protected _linkedEmitter = Le.Emitter.new(InnerTableEventEmitter.new())
	get linkedEmitter(){return this._linkedEmitter}

	protected _dbSrc:I_DbSrc
	get dbSrc(){return this._dbSrc}

	protected _tableName:string
	get tableName(){return this._tableName}


	async addRecords(objs:Row[]):Promise<RunResult[]>{
		const fn = await this.addRecords_fn(objs)
		return fn()
	}

	async addRecords_fn(objs:Row[]):Promise<()=>Promise<RunResult[]>>{
		$a(objs, 'empty array')

		const args = arguments
		const events = this.events
		/* const emt = this.eventEmitter_deprecated
		const names = this.eventNames
		emt.emit(names.addRecords_before, args) */

		const emt = this.linkedEmitter
		emt.emit(events.addRecords_before, args)
		

		const [sql,] = this.genQry_insert(this.tableName, objs[0])
		const stmt = await Sqlite.prepare(this.dbSrc.db, sql)
		const fn = async()=>{
			const ans = [] as RunResult[]
			for(let i = 0; i < objs.length; i++){
				const o = objs[i]
				const [, value] = this.genQry_insert(this.tableName, o)
				const r = await Sqlite.stmtRun(stmt, value)
				ans.push(r)
			}
			//emt.emit(names.addRecords_after, args, ans)
			emt.emit(events.addRecords_after, args, ans)
			return ans
		}
		return fn
	}

	genQry_insert(table: string, obj: Row, opt?:{ignoredKeys?:string[]}): [string, unknown[]] {
		const ignoredKeys = opt?.ignoredKeys
		return Sqlite.genQry_insert(table, obj, ignoredKeys)
	}

	genQry_updateById(table: string, obj: Row, id: string | number, opt?:{ignoredKeys?:string[]}): [string, unknown[]] {
		const ignoredKeys = opt?.ignoredKeys
		return Sqlite.genQry_updateById(table, obj, id, ignoredKeys)
	}
}

// export type Abs_Table = _Abs_Table
// export const Abs_Table = _Abs_Table
