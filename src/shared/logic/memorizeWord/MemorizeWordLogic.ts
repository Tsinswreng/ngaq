import { MemorizeEvents } from "./Event";
import { MemorizeWord } from "@shared/entities/Word/MemorizeWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'

class _ErrReason{
	static new(){
		const o = new this()
		return o
	}
	didnt_load = Reason.new('didnt_load')
	didnt_calcWeight = Reason.new('didnt_calcWeight')
}

// const isb = new Int32Array(new SharedArrayBuffer(4))
// Atomics.wait(isb, 0, 0, 1000)

export interface I_MemorizeLogic{

}

/**
 * 負責觸發事件
 */
export abstract class Abs_MemorizeLogic implements I_MemorizeLogic{

	protected constructor(){}

	readonly This = Abs_MemorizeLogic
	// static new():Abs_ReciteLogic {
	// 	//@ts-ignore
	// 	const o = new this()
	// 	return o
	// }

	static async New():Promise<Abs_MemorizeLogic>{
		//@ts-ignore
		const o = new this()
		return Promise.resolve(o)
	}

	protected async __init__(){
		
	}
	
	static ErrReason = _ErrReason
	static errReasons = this.ErrReason.new()

	protected _reciteConfig

	protected abstract _emitter: Le.LinkedEmitter
	abstract get emitter():Le.LinkedEmitter

	protected _wordsToLearn:MemorizeWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	protected static _events = MemorizeEvents.instance
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
		const event__fn = [] as [Le.Event, (this:Abs_MemorizeLogic)=>unknown][]
		const es = Z.events
		event__fn.push(
			[es.load, z.on_load.bind(z)]
			,[es.calcWeight, z.on_calcWeight.bind(z)]
			,[es.sort, z.on_sort.bind(z)]
			,[es.start, z.on_start.bind(z)]
			,[es.save, z.on_save.bind(z)]
			,[es.restart, z.on_restart.bind(z)]
		)
		for(let [event, fn] of event__fn){
			z.emitter.on(event,fn)
		}
	}

	abstract on_load()

	abstract on_calcWeight()

	abstract on_sort()

	abstract on_start()

	abstract on_save()

	abstract on_restart()

}