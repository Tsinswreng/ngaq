import { InstanceType_ } from "@shared/Type";
import { JoinedWord } from "../../model/word/JoinedWord";
import Tempus from "@shared/Tempus";
import * as Le from "@shared/linkedEvent"
import { $ } from "@shared/Common";
import * as Mod from '@shared/model/word/NgaqModels'
import * as Row from "@shared/model/word/NgaqRows";
import type * as WordIf from "@shared/interfaces/WordIf";
import { RMB_FGT, RMB_FGT_nil } from "./LearnEvents";
import {classify} from '@shared/tools/classify'
import { key__arrMapPush } from "@shared/tools/key__arrMapPush";
import CyclicArray from "@shared/tools/CyclicArray";


const algo = {
	classify
}

type WordEvent = Row.LearnBelong
const WordEvent = Row.LearnBelong
// export type RMB_FGT = typeof WordEvent.fgt|typeof WordEvent.rmb
// export type RMB_FGT_nil = typeof WordEvent.fgt|typeof WordEvent.rmb|null

type Word = JoinedWord
//type WordEvent = typeof WordEvent

const LearnBelong = Row.LearnBelong
type LearnBelong = Row.LearnBelong

export class Tempus_Event{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tempus_Event.new>){
		const z = this
		z.tempus = args[0]
		z.event = args[1]
		return z
	}

	static new(tempus:Tempus, event:LearnBelong){
		const z = new this()
		z.__init__(tempus, event)
		return z
	}

	//get This(){return Tempus_Event}
	tempus:Tempus
	event:LearnBelong
}


class Status{
	static new(){
		const o = new this()
		return o
	}
	/** 憶|忘|未背 */
	memorize:typeof WordEvent.rmb| typeof WordEvent.fgt|null = null
	/** memorize狀態ˋ變ʹ時間 */
	date:Tempus|undefined
	/** 緩存 新ʹ事件 */
	neoLearnRec:Mod.Learn|null = null
}


export class SvcWord implements
	WordIf.I_WordWithStatus, WordIf.I_LearnBl__Learns, WordIf.I_weight
	,WordIf.I_learns, WordIf.I_propertys, WordIf.I_PropertyBl_Propertys
	,WordIf.I_hasBeenLearnedInLastRound
{

	protected constructor(){

	}
	
	static new(word:Word){
		const o = new this()
		o.__init__(word)
		return o
	}

	protected __init__(word:Word){
		const z = this
		z.word = word
		z.id = word.textWord.id+''
		z.wordText = word.textWord.text
		z._status = Status.new()
		z._init_learnBl__learns()
		z._init_propertyBl_propertys()
		z._sortLearns()
		//z.sortDate__Event()
		return z
	}

	get This(){return SvcWord}


	/** 
	 * JoinedWord
	 * 宜避 從類外 直ᵈ訪此成員
	 */
	protected _word:Word
	protected get word(){return this._word}
	protected set word(v){this._word = v}

	/** 權重 */
	protected _weight:number|undef = void 0
	get weight(){return this._weight}
	set weight(v){this._weight = v}

	///** 原有ᐪ */
	// protected _date__event:Tempus_Event[]
	// get date__event(){return this._date__event}

	protected _status = Status.new()
	get status(){return this._status}

	/** 在wordsToLearn中ʹ索引 */
	protected _index:int|undef
	get index(){return this._index}
	set index(v){this._index = v}

	protected _learnBl__learns: Map<Row.LearnBelong, Mod.Learn[]> = new Map()
	get learnBl__learns(){return this._learnBl__learns}
	protected set learnBl__learns(v){this._learnBl__learns = v}

	protected _propertyBl__propertys : Map<Row.PropertyBelong|str, Mod.Property[]> = new Map()
	get propertyBl__propertys(){return this._propertyBl__propertys}
	protected set propertyBl__propertys(v){this._propertyBl__propertys = v}
	
	get learns(){
		return this.word.learns
	}

	get propertys(){
		return this.word.propertys
	}

	// get hasBeenLearnedInLastRound(){
	// 	//return this.status.memorize !== null
	// 	return this.historyStatus.backGet(0)?.memorize != null
	// }

	/**
	 * 予 權重算法 讀
	 * 若潙false且權重不爲空 則跳過而免冗算
	 * 保存旹 設ʃ存ʹ詞ʹ此成員 潙true
	 * 褈開ⁿ褈算權重旹、再設回蔿false
	 */
	protected _hasBeenLearnedInLastRound = false
	get hasBeenLearnedInLastRound(){return this._hasBeenLearnedInLastRound}
	set hasBeenLearnedInLastRound(v){this._hasBeenLearnedInLastRound = v}
	

	/**
	 * @lateinit
	 */
	protected _id:str = ""
	get id(){return this._id}
	protected set id(v){this._id = v}

	get belong(){
		return this.word.textWord.belong
	}

	/**
	 * @lateinit
	 */
	protected _wordText = ""
	get wordText(){return this._wordText}
	protected set wordText(v){this._wordText = v}

	/** @noUsage */
	protected _historyStatus = CyclicArray.new<Status>(16)
	/** @noUsage */
	get historyStatus(){return this._historyStatus}
	protected set historyStatus(v){this._historyStatus = v}


	countsOfEvent(event:Row.LearnBelong){
		const z = this
		return z._learnBl__learns.get(event)?.length??0
	}
	
	protected _init_learnBl__learns(){
		const z = this
		const ans = algo.classify(z.word.learns, (e)=>e.belong)
		z.learnBl__learns = ans
	}

	protected _init_propertyBl_propertys(){
		const z = this
		const ans = algo.classify(z.word.propertys, (e)=>e.belong)
		z.propertyBl__propertys = ans
	}

	static getSortedDateToEventObjs(word:JoinedWord){
		const tes = word.learns.map(e=>
			Tempus_Event.new(e.ct, e.belong)
		)
		tes.sort((a,b)=>Tempus.diff_mills(a.tempus,b.tempus))
		return tes
	}

	protected _sortLearns(){
		const z = this
		z.word.sortLearnsByCt()
	}

	// /** @deprecated 當置於子類 */
	// sortDate__Event(){
	// 	const z = this
	// 	z._date__event = SvcWord.getSortedDateToEventObjs(z.word)
	// }


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
		mw.status.memorize = null
		return oriMemorizeState
		//z.emitter.emit(z.events.undo, mw, oriMemorizeState)
	}

	
	/** 
	 * 褈初始化。清ᵣ己ʹ狀態與權重等。 
	 * @noUsage
	 */
	reInit(){
		const z = this
		const word = z.word
		z.__init__(word)
		return z
	}

	resetStatus(){
		const z = this
		z.historyStatus.addBackF(z.status)
		z._status = new Status()
	}

	addLearnRec(learn:Mod.Learn){
		const z = this
		key__arrMapPush(z.learnBl__learns, learn.belong, learn)
		z.learns.push(learn)
	}

	/** 合入 新加ʹ背ˡ記錄 */
	mergeNeoLearnRec(){
		const z = this
		//const neoEvent = z.status.memorize
		const neoLearnObj = z.statusToLearnObj()
		//key__arrMapPush(z.learnBl__learns, neoEvent, neoLearnObj)
		if(neoLearnObj != null){
			//z.learns.push(neoLearnObj)
			z.addLearnRec(neoLearnObj)
		}
		return neoLearnObj
	}

	/**
	 * 有緩存旹直ᵈ返緩存
	 */
	statusToLearnObj(){
		const z = this
		if(z.status.neoLearnRec != null ){
			return z.status.neoLearnRec
		}
		if(z.status.memorize == void 0 || z.status.date == void 0){
			return null
		}
		const belong = z.status.memorize
		const learn = Mod.Learn.new({
			id: NaN
			,wid: $(Number(z.id))
			,ct: z.status.date
			,mt: z.status.date
			,belong: belong
		})
		z.status.neoLearnRec = learn
		return learn
	}


/** @deprecated ---------------------------------------------------------------------------------------------------------------------------------------- */

	/** @deprecated */
	get times_add():int{
		return this._learnBl__learns.get(LearnBelong.add)?.length??0
	}

	/** @deprecated */
	get times_rmb():int{
		return this._learnBl__learns.get(LearnBelong.rmb)?.length??0
	}

	/** @deprecated */
	get times_fgt():int{
		return this._learnBl__learns.get(LearnBelong.fgt)?.length??0
	}
}
