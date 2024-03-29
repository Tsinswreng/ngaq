import { ReciteEvents } from "./ReciteEvent";
import { Word } from "@shared/entities/Word/Word";
import * as Le from '@shared/linkedEvent'

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

	protected _wordsToLearn:Word[] = []
	get wordsToLearn(){return this._wordsToLearn}

	protected static _events = ReciteEvents.instance
	static get events(){return this._events}

	abstract on_load()

	abstract on_calcWeight()

	abstract on_sort()

	abstract on_start()

	abstract on_save()

	abstract on_restart()

}