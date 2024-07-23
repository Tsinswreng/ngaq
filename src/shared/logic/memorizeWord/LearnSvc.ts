//import { SvcWord3, RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/SvcWord3";

import { RMB_FGT, RMB_FGT_nil } from "@shared/logic/memorizeWord/LearnEvents";
import { I_WordWithStatus } from "@shared/interfaces/WordIf";
import { Exception, Reason } from "@shared/error/Exception";
import * as Le from '@shared/linkedEvent'
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { LearnBelong } from "@shared/model/word/NgaqRows";
import * as Mod from '@shared/model/word/NgaqModels'
import * as Row from "@shared/model/word/NgaqRows";
import {classify} from '@shared/tools/classify'
import type * as WordIF from "@shared/interfaces/WordIf";
type WordEvent = Row.LearnBelong
const WordEvent = Row.LearnBelong
type SvcWord = I_WordWithStatus

//import { Word, WordEvent } from "@shared/entities/Word/Word";

// enum WordEvent{
// 	ADD=LearnBelong.add
// 	,rmb=LearnBelong.rmb
// 	,fgt=LearnBelong.fgt
// }

//type Asyncable<T> = T|Promise<T>
//type Task<T> = Promise<T>

// function requireStatusStart(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value;
//     descriptor.value = function(...args: any[]) {
//         const z = this;
//         if (!z.svcStatus.start) {
//             throw Exception.for(z.svcErrReasons.not_started);
//         }
//         return originalMethod.apply(this, args);
//     };
//     return descriptor;
// }


const EV = Le.SelfEmitEvent.new.bind(Le.Event)
export class Events extends Le.SelfEmitEvents{

	static new(emitter:Le.LinkedEmitter){
		const z = new this()
		z.__init__(emitter)
		return z
	}
	/** 
	 * MemorizeWord: ʃ蔿ˋ何詞。
	 */
	//neoEvent = EV<[MemorizeWord, RMB_FGT_nil]>('neoEvent')
	/** RMB_FGT_nil: 撤銷前ʹ事件 */
	undo = EV<[SvcWord, RMB_FGT_nil]>('undo')
	start = EV<[]>('start')
	//test=EV('')
	learnBySvcWord = EV<[SvcWord, RMB_FGT]>('learnByWord')

	/**
	 * 在wordsToLearn中ʹ索引, 詞ˉ自身, 新ʹ事件
	 * @deprecated
	 */
	learnByIndex = EV<[int, SvcWord, RMB_FGT]>('learnByIndex')
	/**
	 * SvcWord3[] 保存ʹ諸詞
	 */
	save = EV<[SvcWord[]]>('save')

	/**
	 * _loadWeightAlgo拋錯旹則觸此事件、然後隱ᵈ用默認權重洏不強ᵈ退ᵣ流程
	 */
	load_weight_err = EV<[Error]>('load_weight_err')
}

const RN = Reason.new.bind(Reason)
export class SvcErrReason{
	static new(){
		const o = new this()
		return o
	}
	load_err = Reason.new<[Error]>(`load_err`)
	load_weight_err = RN<[Error]>('load_weight_err')
	didnt_load = Reason.new('didnt_load')
	didnt_sort = Reason.new('didnt_sort')
	cant_start_when_unsave = Reason.new('cant_start_when_unsave')
	cant_load_after_start = Reason.new('cant_load_after_start')
	cant_learn_when_unstart = Reason.new('cant_learn_when_unstart')
	/** 褈保存 */
	save_duplicated = RN('save_duplicated')
}

// const isb = new Int32Array(new SharedArrayBuffer(4))
// Atomics.wait(isb, 0, 0, 1000)

export interface I_MemorizeLogic{

}

export class SvcStatus{

	load = false
	loadWeightAlgo = false
	sort = false
	start = false
	save = true
}

export class LearnedWords{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof LearnedWords.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return LearnedWords}

	protected _event__wordSet: Map<RMB_FGT, Map<SvcWord, undef>> = new Map()
	get event__wordSet(){return this._event__wordSet}
	protected set event__wordSet(v){this._event__wordSet = v}
	
	getWordSet(event:RMB_FGT){
		const z = this
		const got = z._event__wordSet.get(event)
		return got
	}

	delete(event:RMB_FGT_nil, word:SvcWord){
		const z = this
		if(event == null){
			return true
		}
		const got = z._event__wordSet.get(event)
		return got?.delete(word)
	}
	clear(event:RMB_FGT){
		const z = this
		const words = z.getWordSet(event)
		return words?.clear()
	}

}


/**
 * 背單詞 流程 業務理則
 */
export abstract class LearnSvc{
	static async New():Promise<LearnSvc>{
		//@ts-ignore
		const z = new this()
		await z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		z._events = Events.new(z.emitter)
		//console.log(z.events, 5)//t -
		return z
	}

	protected abstract _emitter:Le.LinkedEmitter
	get emitter(){return this._emitter}

	protected _events:Events
	get events(){return this._events}

	protected _status = new SvcStatus()
	get status(){return this._status}

	protected _errReasons = new SvcErrReason()
	get errReasons(){return this._errReasons}

	protected _wordsToLearn:SvcWord[] = []
	get wordsToLearn(){return this._wordsToLearn}

	protected _learnedWords = LearnedWords.new()
	get learnedWords(){return this._learnedWords}
	protected set learnedWords(v){this._learnedWords = v}
	

	/** 權重算法 */
	protected _weightAlgo: I_WordWeight<any, any>|undefined
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
		z.emitter.emit(z.events.error, err)
	}

	/**
	 * 加載 待背ʹ詞、賦予this._wordsToLearn
	 * 或直ᵈ取自數據庫、或發網絡請求
	 */
	protected abstract _Load():Task<boolean>

	async Load(){
		const z = this
		if(z.status.start){
			throw Exception.for(z.errReasons.cant_load_after_start)
		}
		try {
			await z._Load()
		} catch (error) {
			const err = error as Error
			throw Exception.for(z.errReasons.load_err, err)
		}

		z.status.load = true
		return true
	}

	/**
	 * 合併 忘˪ʹ詞與憶˪ʹ詞
	 * @deprecated
	 * @returns 
	 */
	merge_LearnedWords__index(){
		const z = this
		return new Map<SvcWord, int>([
			...z.rmbWord__index
			,...z.fgtWord__index
		])
	}

	/** 蔿SvcWord實例 賦index字段 */
	indexWord(){
		const z = this
		for(let i = 0; i < z.wordsToLearn.length; i++){
			z.wordsToLearn[i].index = i
		}
	}

	protected abstract _LoadWeightAlgo():Task<I_WordWeight<any, any>>


	/**
	 * 初加載權重算法
	 * 若既加載、再呼此則不理
	 */
	async InitWeightAlgo(){
		const z = this
		// 確保只用于初加載
		if(z.status.loadWeightAlgo === true){
			return false
		}
		try {
			z._weightAlgo = await z._LoadWeightAlgo()

			return true
		} catch (error) {
			//throw Exception.for(z.errReasons.load_weight_err, error)
			//z.emitErr(z.errReasons.load_weight_err)
			z.emitter.emit(z.events.load_weight_err, error)
			return false
		}finally{
			//TODO 加載默認權重算法
			z.status.loadWeightAlgo = true
		}
		return false
	}

	/**
	 * 用于顯式強制刷新權重算法ReloadWeightAlgo
	 * reload後立即褈開、新權重算法未必生效
	 * 緣權重算法中 可能有: 褈開再算旹詞芝權重不潙空且未背過者ʰ不復褈算權重
	 * 可試discardChange 與load併用
	 */
	async ReloadWeightAlgo(){
		const z = this
		z.status.loadWeightAlgo = false
		const ans = await z.InitWeightAlgo()
		return ans
	}


	/**
	 * 用于初排序。返ᵣ排序後ʹ詞、不改ᵣ他ʹ數據。
	 * @param svcWords 
	 */
	protected abstract _SortWords(svcWords:SvcWord[]):Task<SvcWord[]>

	/**
	 * this._wordsToLearnˇ排序。算權重,篩選等皆由此。
	 */
	protected async _Sort(){
		const z = this
		if(!z.status.loadWeightAlgo){
			await z.InitWeightAlgo()
		}
		z._wordsToLearn = await z._SortWords(z.wordsToLearn)
	}

	async Sort(){
		const z = this
		await z._Sort()
		z.indexWord()
		return true
	}

	/**
	 * 背過一輪後 再排序
	 * 只需重算 剛背過ʹ詞權重 及褈打亂
	 * @param svcWords 
	 * @returns 
	 */
	protected async _ResortWords(svcWords:SvcWord[]):Task<SvcWord[]>{
		const z = this
		return await z._SortWords(svcWords)
	}

	protected _Resort():Task<any>{
		return this._Sort()
	}

	/** 
	 * 可據SvcWord對象之Status 判斷此詞是否在上一輪中背ʴ過
	 */
	async Resort():Task<bool>{
		const z = this
		return z._Resort()
	}



	/**
	 * 始背單詞。
	 * @noUsage
	 */
	protected _Start():Task<boolean>{
		return Promise.resolve(true)
	}

	Start(){
		const z = this
		if(!z.status.load){
			throw Exception.for(z.errReasons.didnt_load)
		}
		if(!z.status.save){
			throw Exception.for(z.errReasons.cant_start_when_unsave)
		}
		z.status.start = true
		z.emitter.emit(z.events.start)
		return Promise.resolve(true)
	}

	protected abstract _Save(learnRows:Row.Learn[]):Task<any>

	/** 
	 * 保存並合入事件
	 * status會保留、下次褈算權重等旹有用
	 */
	async Save():Task<any>{
		const z = this
		if(!z.status.start){
			return
		}
		if(z.status.save){
			z.errReasons.save_duplicated.throw()
		}
		z.status.start = false
		const learnObjs = z.getLearnObjsToSave()
		const resp = await z._Save(learnObjs.map(e=>e.toRow()))
		z.mergeLearnedWords()
		z.status.save = true
		return resp
	}

	// protected abstract _saveOld(words:Word[]):Task<any>

	// async saveOld(){
	// 	const z = this
	// 	z._status.start = false
	// 	const svcWords = z.mergeLearnedWords()
	// 	const words = svcWords.map(e=>e.word)
	// 	//const ans = await z.dbSrc.saveWords(words)
	// 	const ans = await z._saveOld(words)
	// 	z.emitter.emit(z.events.save, svcWords)
	// 	z._status.save = true
	// 	return true
	// }

	/** @noUsage */
	protected _Restart():Task<boolean>{
		return Promise.resolve(true)
	}

	/** 
	 * 清 既學ʹ詞、褈排序
	 * 
	 */
	async Restart(){
		const z = this
		if(!z.status.save){
			throw Exception.for(z.errReasons.cant_start_when_unsave)
		}
		await z.Resort()
		z.clearLearnedWordRecordEtItsStatus()
		z.status.start = true
		return true
	}

	/** 
	 * 開始後 之操作
	 */
	chkStart(){
		const z = this
		if(!z._status.start){
			throw Exception.for(z.errReasons.cant_learn_when_unstart)
		}
		z.status.save = false
		return true
	}

	learnWord(mw:SvcWord, event:RMB_FGT){
		const z = this
		z.chkStart()
		const ans = mw.setInitEvent(event)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mw, event)
		}
		return ans
	}

	undo(mw:SvcWord){
		const z = this
		z.chkStart()
		const old = mw.undo()
		z.learnedWords.delete(old, mw)
		
		// if(old === WordEvent.rmb){
		// 	z.rmbWord__index.delete(mw)
		// }else if(old === WordEvent.fgt){
		// 	z.fgtWord__index.delete(mw)
		// }

		z.emitter.emit(z.events.undo, mw, old)
	}




	// static mergeSvcWords(toSave:SvcWord3[]){
	// 	return toSave.map(e=>e.innerWordMerge())
	// }

	/**
	 * 新ʹ事件ˇ合入已背ʹ單詞中、且在wordsToLearn中更新
	 */
	mergeLearnedWords(){
		const z = this
		const learnedSvcWords = [] as SvcWord[]
		for(const [k,wordSet] of z.learnedWords.event__wordSet){
			for(const [word, v] of wordSet){
				word.selfMerge()
				learnedSvcWords.push(word)
			}
		}
		return learnedSvcWords
		// for(const [word, index] of z.rmbWord__index){
		// 	z.wordsToLearn[index] = word.selfMerge()
		// 	learnedSvcWords.push(z.wordsToLearn[index])
		// }
		// for(const [word, index] of z.fgtWord__index){
		// 	z.wordsToLearn[index] = word.selfMerge()
		// 	learnedSvcWords.push(z.wordsToLearn[index])
		// }
		// return learnedSvcWords
	}

	/**
	 * 清ᵣ錄誧既學ʹ詞 及其中ʹ詞ʹ狀態
	 */
	clearLearnedWordRecordEtItsStatus(){
		const z = this
		const learnedWord = z.mergeLearnedWords()
		for(const lw of learnedWord){
			lw.clearStatus()
		}
		z.learnedWords.clear(WordEvent.rmb)
		z.learnedWords.clear(WordEvent.fgt)
		// const learnedWord__index = z.merge_LearnedWords__index()
		// for(const [word, index] of learnedWord__index){
		// 	word.clearStatus()
		// }
		// z._rmbWord__index.clear()
		// z._fgtWord__index.clear()
	}

	// freshLearnedWords(){

	// }

	learnByIndex(index:int, event:RMB_FGT){
		const z = this
		// if(index +1 > z.wordsToLearn.length){
		// 	return Promise.resolve(false)
		// }
		const word = z.wordsToLearn[index]
		if(word == void 0){
			return false
		}
		let ans:boolean
		return z.learnWord(word, event)
		// if(event === WordEvent.rmb){
		// 	ans = z.rmb(word)
		// 	if(ans){
		// 		z.rmbWord__index.set(word, index)
		// 	}
		// }else if(event === WordEvent.fgt){
		// 	ans = z.fgt(word)
		// 	if(ans){
		// 		z.fgtWord__index.set(word, index)
		// 	}
		// }else{
		// 	throw new Error('else')
		// }
		//return ans
	}

	/**
	 * 若已背過則撤銷
	 * @param index 
	 * @param event 
	 * @returns 單詞新加ʹ字件。若潙徹消則返undef
	 */
	learnOrUndoByIndex(index:int, event:RMB_FGT){
		const z = this
		const sword = z.wordsToLearn[index]
		if(sword == void 0){
			throw RangeError(`${index}\nout of ${z.wordsToLearn.length}`)
		}
		if(sword.status.memorize == void 0){
			const ok = z.learnByIndex(index, event)
			if(!ok){
				z.undo(sword)
				return void 0
			}
			return event
		}else{
			z.undo(sword)
			return void 0
		}
		
	}

	// /**
	//  * @deprecated
	//  * @param mw 
	//  * @param event 
	//  * @returns 
	//  */
	// learnByWord(mw:SvcWord, event:RMB_FGT):boolean{
	// 	const z = this
	// 	z.chkStart()
	// 	if(event === WordEvent.rmb){
	// 		return z.rmb(mw)
	// 	}else if(event === WordEvent.fgt){
	// 		return z.fgt(mw)
	// 	}else{
	// 		throw new Error('WordEvent error')
	// 	}
	// }

	/**
	 * 捨變、清既學ʹ詞、褈置狀態、不存ʃ變
	 * @returns 
	 */
	discardChangeEtEnd(){
		const z = this
		z.clearLearnedWordRecordEtItsStatus()
		z.resetStatus()
		return true
	}

	/**
	 * 褈置狀態
	 */
	resetStatus(){
		const z = this
		z._status = new SvcStatus()
	}

	
	static assignWeightByRef(words:SvcWord[], refArr:WordIF.I_WordForCalcWeight[]){
		const id__ref = classify(refArr, e=>e.id)
		for(let i = 0; i < refArr.length; i++){
			refArr[i].index = i
		}
		for(const w of words){
			const gotRef = id__ref.get(w.id)
			if(gotRef == void 0){
				w.weight = 0
				continue
			}
			w.weight = gotRef[0]?.weight??0
			w.index = gotRef[0]?.index
		}
	}

	getLearnObjsToSave(){
		const z = this
		const learns = z.wordsToLearn.map(e=>e.statusToLearnObj()).filter(e=>e!=null)
		return learns
	}

	/** 已背ʹ單詞中 憶者 */
	// protected _rmbWords:SvcWord3[] = []
	// get rmbWords(){return this._rmbWords}

	/** 已背ʹ單詞中 憶者 */
	/** @deprecated */
	protected _rmbWord__index:Map<SvcWord, int> = new Map()
	/** @deprecated */
	get rmbWord__index(){return this._rmbWord__index}

	// /** 已背ʹ單詞中 忘者 */
	// protected _fgtWords:SvcWord3[] = []
	// get fgtWords(){return this._fgtWords}

	/** 已背ʹ單詞中 忘者 */
	/** @deprecated */
	protected _fgtWord__index: Map<SvcWord, int> = new Map()
	/** @deprecated */
	get fgtWord__index(){return this._fgtWord__index}

	/** 
	 * @deprecated
	 * @noref
	 * 不合入 新ʹ事件
	 * 建議用 @see mergeLearnedWords
	 */
	getSvcWordsToSave(){
		const z = this
		const svcWords = [] as SvcWord[]
		for(const [w] of z.rmbWord__index){
			svcWords.push(w)
		}
		for(const [w] of z.fgtWord__index){
			svcWords.push(w)
		}
		// const words = svcWords.map(e=>e.word)
		// return words
		return svcWords
	}

	/** @deprecated */
	protected rmb(mw:SvcWord){
		const z = this
		z.chkStart()
		const ans = mw.setInitEvent(WordEvent.rmb)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mw, WordEvent.rmb)
		}
		return ans
	}

	/** @deprecated */
	protected fgt(mw:SvcWord){
		const z = this
		z.chkStart()
		const ans = mw.setInitEvent(WordEvent.fgt)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mw, WordEvent.fgt)
		} 
		return ans
	}
}
