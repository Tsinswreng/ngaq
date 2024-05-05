import { InstanceType_ } from "@shared/Type";
import { Tempus_Event, Word, WordEvent } from "@shared/entities/Word/Word";
import Tempus from "@shared/Tempus";
import * as Le from "@shared/linkedEvent"
import { $ } from "@shared/Ut";

export type RMB_FGT = typeof WordEvent.FGT|typeof WordEvent.RMB
export type RMB_FGT_nil = typeof WordEvent.FGT|typeof WordEvent.RMB|undefined
//type WordEvent = typeof WordEvent




class Status{
	static new(){
		const o = new this()
		return o
	}
	/** 憶|忘|未背 */
	memorize:typeof WordEvent.RMB| typeof WordEvent.FGT|undefined = void 0
	/** memorize狀態ˋ變ʹ時間 */
	date:Tempus|undefined
}


export class MemorizeWord{

	protected constructor(){

	}

	static new(word:Word){
		const o = new this()
		o.__init__(word)
		return o
	}

	protected __init__(word:Word){
		const z = this
		z._word = word
		z.init()
		return z
	}

	get This(){return MemorizeWord}


	/** Word實體 */
	protected _word:Word
	get word(){return this._word}

	/** 權重 */
	protected _weight:number
	get weight(){return this._weight}
	set weight(v){this._weight = v}

	/** 原有ᐪ */
	protected _date__event:Tempus_Event[]
	get date__event(){return this._date__event}

	protected _status = Status.new()
	get status(){return this._status}


	init(){
		const z = this
		z._date__event = Word.getSortedDateToEventObjs(z.word)
	}


	/**
	 * 未背ʹ單詞ˇ 設 憶抑忘
	 * 若已有事件則返false
	 * @param ev 
	 * @returns 
	 */
	setInitEvent(ev:RMB_FGT){
		const z = this
		const mw = this
		if(mw.status.memorize == void 0){
			mw.status.memorize = ev
			mw.status.date = Tempus.new()
			//z.emitter.emit(z.events.addEvent, mw, ev)
			return true
		}
		return false
	}

	/**
	 * 撤銷
	 * 返 撤銷前ʹ單詞memorize事件
	 */
	undo(){
		const z = this
		const mw = this
		const oriMemorizeState = mw.status.memorize
		mw.status.memorize = void 0
		return oriMemorizeState
		//z.emitter.emit(z.events.undo, mw, oriMemorizeState)
	}

	/**
	 * MemorizeWord實例中 新加ʹ背ˡ狀態及日期ˇ 合入 內ʹWord實例中
	 */
	merge(){
		const z = this
		if(z.status.memorize === WordEvent.RMB){
			z.word.dates_rmb.push($(z.status.date))
		}else if(z.status.memorize === WordEvent.FGT){
			z.word.dates_fgt.push($(z.status.date))
		}else{

		}
	}
	
	

}

