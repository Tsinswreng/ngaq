import { ProcessEvents } from "./Event";
import { MemorizeWord, RMB_FGT } from "@shared/entities/Word/MemorizeWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'
import { Exception } from "@shared/Exception";

//type Asyncable<T> = T|Promise<T>
type Task<T> = Promise<T>

class SvcErrReason{
	static new(){
		const o = new this()
		return o
	}
	didnt_load = Reason.new('didnt_load')
	didnt_sort = Reason.new('didnt_sort')
	cant_start_when_unsave = Reason.new('cant_start_when_unsave')
}

// const isb = new Int32Array(new SharedArrayBuffer(4))
// Atomics.wait(isb, 0, 0, 1000)

export interface I_MemorizeLogic{

}

class ProcessStatus{

	load = false 
	sort = false
	start = false
	save = true
}

/**
 * 背單詞 流程 業務理則
 */
export abstract class VocaSvc{
	static async New():Promise<VocaSvc>{
		//@ts-ignore
		const z = new this()
		z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		return z
	}

	protected abstract _emitter:Le.LinkedEmitter
	get emitter(){return this._emitter}

	protected _processEvents = ProcessEvents.new()
	get processEvents(){return this._processEvents}

	protected _processStatus = new ProcessStatus()
	get processStatus(){return this._processStatus}

	protected _processErrReasons = new SvcErrReason()
	get processErrReasons(){return this._processErrReasons}

	protected _wordsToLearn:MemorizeWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	emitErr(err:Error|any){
		const z = this
		z.emitter.emit(z.processEvents.error, err)
	}

	/**
	 * 加載 待背ʹ詞、賦予this._wordsToLearn
	 * 或直ᵈ取自數據庫、或發網絡請求
	 */
	abstract load():Task<boolean>

	/**
	 * this._wordsToLearnˇ排序。算權重,篩選等皆由此。
	 */
	abstract sort():Task<boolean>

	/**
	 * 始背單詞。
	 */
	abstract start():Task<boolean>
	// start():Task<boolean>{
	// 	const z = this
	// 	if(!z._processStatus.load){
	// 		throw Exception.for(z.processErrReasons.didnt_load)
	// 	}
	// 	z._processStatus.start = true
	// 	return Promise.resolve(true)
	// }

	abstract learnByIndex(index:integer, event:RMB_FGT):Task<boolean>

	abstract save():Task<boolean>

	abstract restart():Task<boolean>

	


}












/**
 * 負責觸發事件
 */
export abstract class Abs_MemorizeLogic_deprecated implements I_MemorizeLogic{

	protected constructor(){}

	readonly This = Abs_MemorizeLogic_deprecated
	// static new():Abs_ReciteLogic {
	// 	//@ts-ignore
	// 	const o = new this()
	// 	return o
	// }

	static async New():Promise<Abs_MemorizeLogic_deprecated>{
		//@ts-ignore
		const o = new this()
		return Promise.resolve(o)
	}

	protected async __Init__(){
		
	}
	
	static ErrReason = SvcErrReason
	static errReasons = this.ErrReason.new()

	protected _reciteConfig

	protected abstract _emitter: Le.LinkedEmitter
	abstract get emitter():Le.LinkedEmitter

	protected _wordsToLearn:MemorizeWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	protected static _events = ProcessEvents.instance
	static get events(){return this._events}

	protected _curWordIndex = 0
	get curWordIndex(){return this._curWordIndex}

	protected _status = {
		load: false
		,calcWeight: false
		,sort: false
		,start: false
		,save: true
	}

	addListeners(){
		const z = this
		const Z = z.This
		const event__fn = [] as [Le.Event, (this:Abs_MemorizeLogic_deprecated)=>unknown][]
		const es = Z.events
		event__fn.push(
			[es.load, z.on_load.bind(z)]
			,[es.sort, z.on_calcWeight.bind(z)]
			//,[es.sort, z.on_sort.bind(z)]
			,[es.start, z.on_start.bind(z)]
			,[es.save, z.on_save.bind(z)]
			,[es.restart, z.on_restart.bind(z)]
		)
		for(let [event, fn] of event__fn){
			z.emitter.on(event,fn)
		}
	}

	abstract on_load(...params:any[])

	abstract on_calcWeight(...params:any[])

	// abstract on_sort()

	abstract on_start(...params:any[])

	abstract on_save(...params:any[])

	abstract on_restart(...params:any[])

}