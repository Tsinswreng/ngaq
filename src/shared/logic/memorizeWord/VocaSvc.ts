import { SvcWord, RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/SvcWord";
import { Reason } from "@shared/Exception";
import * as Le from '@shared/linkedEvent'
import { Exception } from "@shared/Exception";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { Word, WordEvent } from "@shared/entities/Word/Word";

//type Asyncable<T> = T|Promise<T>
type Task<T> = Promise<T>

const EV = Le.Event.new.bind(Le.Event)

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
	learnByIndex = EV<[integer, SvcWord, RMB_FGT]>('learnByIndex')
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
	load_err = Reason.new_deprecated<[Error]>(`load_err`)
	didnt_load = Reason.new_deprecated('didnt_load')
	didnt_sort = Reason.new_deprecated('didnt_sort')
	cant_start_when_unsave = Reason.new_deprecated('cant_start_when_unsave')
	cant_load_after_start = Reason.new_deprecated('cant_load_after_start')
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
	protected _rmbWords:Set<SvcWord> = new Set
	get rmbWords(){return this._rmbWords}

	// /** 已背ʹ單詞中 忘者 */
	// protected _fgtWords:SvcWord[] = []
	// get fgtWords(){return this._fgtWords}

	/** 已背ʹ單詞中 忘者 */
	protected _fgtWords: Set<SvcWord> = new Set()
	get fgtWords(){return this._fgtWords}

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

	// start():Task<boolean>{
	// 	const z = this
	// 	if(!z._processStatus.load){
	// 		throw Exception.for(z.processErrReasons.didnt_load)
	// 	}
	// 	z._processStatus.start = true
	// 	return Promise.resolve(true)
	// }

	protected abstract _save(words:Word[]):Task<any>

	async save(){
		const z = this
		z._svcStatus.start = false
		const svcWords = z.getSvcWordsToSave()
		VocaSvc.mergeSvcWords(svcWords)
		const words = svcWords.map(e=>e.word)
		//const ans = await z.dbSrc.saveWords(words)
		const ans = await z._save(words)
		z.emitter.emit(z.svcEvents.save, svcWords)
		z._svcStatus.save = true
		return true
	}

	protected abstract _restart():Task<boolean>

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



	rmb(mw:SvcWord){
		const z = this
		const ans = mw.setInitEvent(WordEvent.RMB)
		if(ans){
			z.rmbWords.add(mw)
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.RMB)
		}
		return ans
	}

	fgt(mw:SvcWord){
		const z = this
		const ans = mw.setInitEvent(WordEvent.FGT)
		if(ans){
			z.fgtWords.add(mw)
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.FGT)
		}
		return ans
	}

	undo(mw:SvcWord){
		const z = this
		const old = mw.undo()
		if(old === WordEvent.RMB){
			z.rmbWords.delete(mw)
		}else if(old === WordEvent.FGT){
			z.fgtWords.delete(mw)
		}
		z.emitter.emit(z.svcEvents.undo, mw, old)
	}

	/** 不合入 新ʹ事件 */
	getSvcWordsToSave(){
		const z = this
		const svcWords = [] as SvcWord[]
		for(const w of z.rmbWords){
			svcWords.push(w)
		}
		for(const w of z.fgtWords){
			svcWords.push(w)
		}
		// const words = svcWords.map(e=>e.word)
		// return words
		return svcWords
	}

	static mergeSvcWords(toSave:SvcWord[]){
		return toSave.map(e=>e.merge())
	}


	clearLearnedWords(){
		const z = this
		z._rmbWords.clear()
		z._fgtWords.clear()
	}

	learnByIndex(index:integer, event:RMB_FGT){
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
		}else if(event === WordEvent.FGT){
			ans = z.fgt(word)
		}else{
			throw new Error('else')
		}
		return ans
	}


	learnByWord(mw:SvcWord, event:RMB_FGT):boolean{
		const z = this
		if(event === WordEvent.RMB){
			return z.rmb(mw)
		}else if(event === WordEvent.FGT){
			return z.fgt(mw)
		}else{
			throw new Error('WordEvent error')
		}
	}

}
