import { SvcWord, RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/SvcWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'
import { Exception } from "@shared/Exception";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { Word, WordEvent } from "@shared/entities/Word/Word";

//type Asyncable<T> = T|Promise<T>
type Task<T> = Promise<T>

const EV = Le.Event.new.bind(Le.Event)

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

export class SvcEvents extends Le.Events{
	/** 
	 * MemorizeWord: ʃ蔿ˋ何詞。
	 */
	//neoEvent = EV<[MemorizeWord, RMB_FGT_nil]>('neoEvent')
	/** RMB_FGT_nil: 撤銷前ʹ事件 */
	undo = EV<[SvcWord, RMB_FGT_nil]>('undo')
	start = EV<[]>('start')
	//test=EV('')
	learnByMWord = EV<[SvcWord, RMB_FGT]>('learnByWord')

	/**
	 * 在wordsToLearn中ʹ索引, 詞ˉ自身, 新ʹ事件
	 * @deprecated
	 */
	learnByIndex = EV<[int, SvcWord, RMB_FGT]>('learnByIndex')
	/**
	 * SvcWord[] 保存ʹ諸詞
	 */
	save = EV<[SvcWord[]]>('save')
}

export class SvcErrReason{
	static new(){
		const o = new this()
		return o
	}
	load_err = Reason.new<[Error]>(`load_err`)
	didnt_load = Reason.new('didnt_load')
	didnt_sort = Reason.new('didnt_sort')
	cant_start_when_unsave = Reason.new('cant_start_when_unsave')
	cant_load_after_start = Reason.new('cant_load_after_start')
	cant_learn_when_unstart = Reason.new('cant_learn_when_unstart')
}

// const isb = new Int32Array(new SharedArrayBuffer(4))
// Atomics.wait(isb, 0, 0, 1000)

export interface I_MemorizeLogic{

}

export class SvcStatus{

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

	/** 已背ʹ單詞中 憶者 */
	// protected _rmbWords:SvcWord[] = []
	// get rmbWords(){return this._rmbWords}

	/** 已背ʹ單詞中 忘者 */
	protected _rmbWord__index:Map<SvcWord, int> = new Map()
	get rmbWord__index(){return this._rmbWord__index}

	// /** 已背ʹ單詞中 忘者 */
	// protected _fgtWords:SvcWord[] = []
	// get fgtWords(){return this._fgtWords}

	/** 已背ʹ單詞中 忘者 */
	protected _fgtWord__index: Map<SvcWord, int> = new Map()
	get fgtWord__index(){return this._fgtWord__index}

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
	protected abstract _load():Task<boolean>

	async load(){
		const z = this
		if(z.svcStatus.start){
			throw Exception.for(z.svcErrReasons.cant_load_after_start)
		}
		try {
			await z._load()
		} catch (error) {
			const err = error as Error
			throw Exception.for(z.svcErrReasons.load_err, err)
		}

		z.svcStatus.load = true
		return true
	}

	/**
	 * this._wordsToLearnˇ排序。算權重,篩選等皆由此。
	 */
	protected abstract _sort():Task<boolean>
	abstract sort():Task<boolean>

	/**
	 * 始背單詞。
	 * @deprecated
	 */
	protected abstract _start():Task<boolean>

	start(){
		const z = this
		if(!z.svcStatus.load){
			throw Exception.for(z.svcErrReasons.didnt_load)
		}
		if(!z.svcStatus.save){
			throw Exception.for(z.svcErrReasons.cant_start_when_unsave)
		}
		z.svcStatus.start = true
		z.emitter.emit(z.svcEvents.start)
		return Promise.resolve(true)
	}

	protected abstract _save(words:Word[]):Task<any>

	async save(){
		const z = this
		z._svcStatus.start = false
		const svcWords = z.mergeLearnedWords()
		//VocaSvc.mergeSvcWords(svcWords) 
		const words = svcWords.map(e=>e.word)
		//const ans = await z.dbSrc.saveWords(words)
		const ans = await z._save(words)
		z.emitter.emit(z.svcEvents.save, svcWords)
		z._svcStatus.save = true
		return true
	}

	protected abstract _restart():Task<boolean>

	/** 
	 * 清 既學ʹ詞、褈排序
	 * //TODO 設 褈排序算法、只褈算變˪ʹ詞ʹ權重、並打亂䀬ʹ詞ʹ權重
	 */
	async restart(){
		const z = this
		if(!z.svcStatus.save){
			throw Exception.for(z.svcErrReasons.cant_start_when_unsave)
		}

		z.clearLearnedWords()
		await z.sort()
		z.svcStatus.start = true
		return true
	}

	/** 
	 * 開始後 之操作
	 */
	startedOp(){
		const z = this
		if(!z._svcStatus.start){
			throw Exception.for(z.svcErrReasons.cant_learn_when_unstart)
		}
		z.svcStatus.save = false
		return true
	}

	protected rmb(mw:SvcWord){
		const z = this
		z.startedOp()
		const ans = mw.setInitEvent(WordEvent.RMB)
		if(ans){
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.RMB)
		}
		return ans
	}

	protected fgt(mw:SvcWord){
		const z = this
		z.startedOp()
		const ans = mw.setInitEvent(WordEvent.FGT)
		if(ans){
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.FGT)
		}
		return ans
	}

	undo(mw:SvcWord){
		const z = this
		z.startedOp()
		const old = mw.undo()
		if(old === WordEvent.RMB){
			z.rmbWord__index.delete(mw)
		}else if(old === WordEvent.FGT){
			z.fgtWord__index.delete(mw)
		}
		z.emitter.emit(z.svcEvents.undo, mw, old)
	}

	/** 
	 * @deprecated
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


	// static mergeSvcWords(toSave:SvcWord[]){
	// 	return toSave.map(e=>e.innerWordMerge())
	// }

	/**
	 * 新ʹ事件ˇ合入已背ʹ單詞中、且在wordsToLearn中更新
	 */
	mergeLearnedWords(){
		const z = this
		const learnedSvcWords = [] as SvcWord[]
		for(const [word, index] of z.rmbWord__index){
			z.wordsToLearn[index] = word.selfMerge()
			learnedSvcWords.push(z.wordsToLearn[index])
		}
		for(const [word, index] of z.fgtWord__index){
			z.wordsToLearn[index] = word.selfMerge()
			learnedSvcWords.push(z.wordsToLearn[index])
		}
		return learnedSvcWords
	}


	clearLearnedWords(){
		const z = this
		z._rmbWord__index.clear()
		z._fgtWord__index.clear()
	}

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
		if(event === WordEvent.RMB){
			ans = z.rmb(word)
			if(ans){
				z.rmbWord__index.set(word, index)
			}
		}else if(event === WordEvent.FGT){
			ans = z.fgt(word)
			if(ans){
				z.fgtWord__index.set(word, index)
			}
		}else{
			throw new Error('else')
		}
		return ans
	}

	/**
	 * @deprecated
	 * @param mw 
	 * @param event 
	 * @returns 
	 */
	learnByWord(mw:SvcWord, event:RMB_FGT):boolean{
		const z = this
		z.startedOp()
		if(event === WordEvent.RMB){
			return z.rmb(mw)
		}else if(event === WordEvent.FGT){
			return z.fgt(mw)
		}else{
			throw new Error('WordEvent error')
		}
	}

}
