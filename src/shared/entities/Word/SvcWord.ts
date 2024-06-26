import { InstanceType_ } from "@shared/Type";
import { Tempus_Event, Word, WordEvent } from "@shared/entities/Word/Word";
import Tempus from "@shared/Tempus";
import * as Le from "@shared/linkedEvent"
import { $ } from "@shared/Ut";
import * as Objs from '@shared/entities/Word/NgaqModels'
import { LearnBelong } from "@shared/dbRow/wordDbRows";
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


export class SvcWord{

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
		z._status = Status.new()
		z.sortDate__Event()
		return z
	}

	get This(){return SvcWord}


	/** 
	 * Word實體 
	 */
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

	/** 在wordsToLearn中ʹ索引 */
	protected _index:int|undef
	get index(){return this._index}
	set index(v){this._index = v}


	sortDate__Event(){
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
	 * SvcWord實例中 新加ʹ背ˡ狀態及日期ˇ 合入 內ʹWord實例中
	 * 只合入內ʹword實例 洏 不改自ʹ_date__event
	 * 原地改
	 */
	innerWordMerge(){
		const z = this
		if(z.status.memorize === WordEvent.RMB){
			z.word.dates_rmb.push($(z.status.date))
		}else if(z.status.memorize === WordEvent.FGT){
			z.word.dates_fgt.push($(z.status.date))
		}else{

		}
		return z
	}

	/** 褈初始化。清ᵣ己ʹ狀態與權重等。 */
	reInit(){
		const z = this
		const word = z.word
		z.__init__(word)
		return z
	}

	clearStatus(){
		const z = this
		z._status = new Status()
	}
	
	/**
	 * 合入 新加ʹ背ˡ狀態及日期後 褈初始化
	 */
	// selfMergeEtFresh(){
	// 	const z = this
	// 	z.innerWordMerge()
	// 	const word = z.word
	// 	z.__init__(word)
	// 	return z
	// }
	
	/** 合入 新加ʹ背ˡ狀態及日期 */
	selfMerge(){
		const z = this
		z.innerWordMerge()
		z.sortDate__Event()
		return z
	}

	
	toLearnObj(){
		const z = this
		if(z.status.memorize == void 0 || z.status.date == void 0){
			return null
		}
		let belong:LearnBelong
		if(z.status.memorize === WordEvent.RMB){
			belong = LearnBelong.rmb
		}else if(z.status.memorize === WordEvent.FGT){
			belong = LearnBelong.fgt
		}else{
			throw new Error()
		}
		const learn = Objs.Learn.new({
			wid: $(z.word.id)
			,ct: z.status.date
			,mt: z.status.date
			,belong: belong
		})
		return learn
	}

}

class ResortSvcWord{

	protected constructor(){}

	protected __init__(svcWord:SvcWord, index:int){
		const z = this
		z._svcWord = svcWord
		z._index = index
		return z
	}

	static new(svcWord:SvcWord, index:int){
		const z = new this()
		z.__init__(svcWord, index)
		return z
	}

	protected _svcWord:SvcWord
	get svcWord(){return this._svcWord}

	protected _index:int
	get index(){return this._index}

}