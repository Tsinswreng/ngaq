import { SvcWord, RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/SvcWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'
import { Exception } from "@shared/Exception";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";

//type Asyncable<T> = T|Promise<T>
type Task<T> = Promise<T>

const EV = Le.Event.new.bind(Le.Event)

class SvcEvents extends Le.Events{
	/** 
	 * MemorizeWord: ʃ蔿ˋ何詞。
	 */
	//neoEvent = EV<[MemorizeWord, RMB_FGT_nil]>('neoEvent')
	/** RMB_FGT_nil: 撤銷前ʹ事件 */
	undo = EV<[SvcWord, RMB_FGT_nil]>('undo')
	start = EV<[]>('start')
	//test=EV('')
	learnByMWord = EV<[SvcWord, RMB_FGT]>('learnByWord')

	/** 在wordsToLearn中ʹ索引, 詞ˉ自身, 新ʹ事件 */
	learnByIndex = EV<[integer, SvcWord, RMB_FGT]>('learnByIndex')
	save = EV('save')
}

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

class SvcStatus{

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

	protected _svcEvents = new SvcEvents()
	get svcEvents(){return this._svcEvents}

	protected _svcStatus = new SvcStatus()
	get svcStatus(){return this._svcStatus}

	protected _svcErrReasons = new SvcErrReason()
	get svcErrReasons(){return this._svcErrReasons}

	protected _wordsToLearn:SvcWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	/** 權重算法 */
	protected _weightAlgo: I_WordWeight|undefined
	get weightAlgo(){return this._weightAlgo}

	/** 
	 * 此輪已複習ʹ詞
	 * 留予子類實現
	 * 可按憶忘事件分類
	 */
	// protected _learnedWords:MemorizeWord[] = []
	// get learnedWords(){return this._learnedWords}

	emitErr(err:Error|any){
		const z = this
		z.emitter.emit(z.svcEvents.error, err)
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
