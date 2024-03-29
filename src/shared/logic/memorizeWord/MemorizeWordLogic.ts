import { MemorizeEvents } from "./Event";
import { MemorizeWord } from "@shared/entities/Word/MemorizeWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'

class ErrReason{
	didnt_load = Reason.new('')
}



export interface I_MemorizeLogic{

}

/**
 * 負責觸發事件
 */
export abstract class Abs_MemorizeLogic implements I_MemorizeLogic{

	protected constructor(){}

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
	

	protected _reciteConfig

	protected abstract _emitter: Le.LinkedEmitter
	abstract get emitter()

	protected _wordsToLearn:MemorizeWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	protected static _events = MemorizeEvents.instance
	static get events(){return this._events}

	protected _status = {
		load: false
		,calcWeight: false
		,sort: false
		,start: false
		,save: false
	}

	abstract on_load()

	abstract on_calcWeight()

	abstract on_sort()

	abstract on_start()

	abstract on_save()

	abstract on_restart()

}