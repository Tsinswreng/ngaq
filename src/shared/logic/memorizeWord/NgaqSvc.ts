import { SvcWord, RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/SvcWord";
import { Exception, Reason } from "@shared/error/Exception";
import * as Le from '@shared/linkedEvent'
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
	learnBySvcWord = EV<[SvcWord, RMB_FGT]>('learnByWord')

	/**
	 * 在wordsToLearn中ʹ索引, 詞ˉ自身, 新ʹ事件
	 * @deprecated
	 */
	learnByIndex = EV<[int, SvcWord, RMB_FGT]>('learnByIndex')
	/**
	 * SvcWord[] 保存ʹ諸詞
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

/**
 * 背單詞 流程 業務理則
 */
export abstract class NgaqSvc{
	static async New():Promise<NgaqSvc>{
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

	protected _events = new SvcEvents()
	get events(){return this._events}

	protected _status = new SvcStatus()
	get status(){return this._status}

	protected _errReasons = new SvcErrReason()
	get errReasons(){return this._errReasons}

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
		z.emitter.emit(z.events.error, err)
	}

	/**
	 * 加載 待背ʹ詞、賦予this._wordsToLearn
	 * 或直ᵈ取自數據庫、或發網絡請求
	 */
	protected abstract _load():Task<boolean>

	async load(){
		const z = this
		if(z.status.start){
			throw Exception.for(z.errReasons.cant_load_after_start)
		}
		try {
			await z._load()
		} catch (error) {
			const err = error as Error
			throw Exception.for(z.errReasons.load_err, err)
		}

		z.status.load = true
		return true
	}

	/**
	 * 合併 忘˪ʹ詞與憶˪ʹ詞
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

	protected abstract _loadWeightAlgo():Task<I_WordWeight>


	/**
	 * 初加載權重算法
	 * 若既加載、再呼此則不理
	 */
	async initWeightAlgo(){
		const z = this
		// 確保只用于初加載
		if(z.status.loadWeightAlgo === true){
			return false
		}
		try {
			z._weightAlgo = await z._loadWeightAlgo()

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
	 * reload後立即褈開、新權重算法未必生效
	 * 緣權重算法中 可能有: 褈開再算旹詞芝權重不潙空且未背過者ʰ不復褈算權重
	 * 可試discardChange 與load併用
	 */
	async reloadWeightAlgo(){
		const z = this
		z.status.loadWeightAlgo = false
		const ans = await z.initWeightAlgo()
		return ans
	}

	/**
	 * this._wordsToLearnˇ排序。算權重,篩選等皆由此。
	 */
	protected async _sort(){
		const z = this
		z._wordsToLearn = await z._sortWords(z.wordsToLearn)
	}

	async sort(){
		const z = this
		await z._sort()
		z.indexWord()
		return true
	}

	/**
	 * 用于初排序。返ᵣ排序後ʹ詞、不改ᵣ他ʹ數據。
	 * @param svcWords 
	 */
	protected abstract _sortWords(svcWords:SvcWord[]):Task<SvcWord[]>


	protected abstract _resort():Task<bool>

	/**
	 * 背過一輪後 再排序
	 * 只需重算 剛背過ʹ詞權重 及褈打亂
	 * @param svcWords 
	 */
	//protected abstract _resortWords(svcWords:SvcWord[]):Task<SvcWord[]>

	/** 
	 * 可據SvcWord對象之Status 判斷此詞是否在上一輪中背ʴ過
	 */
	async resort():Task<bool>{
		const z = this
		return z._resort()
		// const learnedWord__index = z.merge_LearnedWords__index()
		// const wordsToResort = [] as SvcWord[]
		// for(const [sw, index] of learnedWord__index){
		// 	wordsToResort.push(sw)
		// }
		// const resortedWords = await z._resortWords(wordsToResort)
	}

	/**
	 * 始背單詞。
	 * @deprecated
	 */
	protected abstract _start():Task<boolean>

	start(){
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

	protected abstract _saveOld(words:Word[]):Task<any>

	async saveOld(){
		const z = this
		z._status.start = false
		const svcWords = z.mergeLearnedWords()
		const words = svcWords.map(e=>e.word)
		//const ans = await z.dbSrc.saveWords(words)
		const ans = await z._saveOld(words)
		z.emitter.emit(z.events.save, svcWords)
		z._status.save = true
		return true
	}

	

	/** @deprecated */
	protected abstract _restart():Task<boolean>

	/** 
	 * 清 既學ʹ詞、褈排序
	 * //TODO 設 褈排序算法、只褈算變˪ʹ詞ʹ權重、並打亂䀬ʹ詞ʹ權重
	 */
	async restart(){
		const z = this
		if(!z.status.save){
			throw Exception.for(z.errReasons.cant_start_when_unsave)
		}
		await z.sort()
		z.clearLearnedWordRecordEtItsStatus()
		z.status.start = true
		return true
	}

	/** 
	 * 開始後 之操作
	 */
	startedOp(){
		const z = this
		if(!z._status.start){
			throw Exception.for(z.errReasons.cant_learn_when_unstart)
		}
		z.status.save = false
		return true
	}

	protected rmb(mw:SvcWord){
		const z = this
		z.startedOp()
		const ans = mw.setInitEvent(WordEvent.RMB)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mw, WordEvent.RMB)
		}
		return ans
	}

	protected fgt(mw:SvcWord){
		const z = this
		z.startedOp()
		const ans = mw.setInitEvent(WordEvent.FGT)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mw, WordEvent.FGT)
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
		z.emitter.emit(z.events.undo, mw, old)
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

	/**
	 * 清ᵣ錄誧既學ʹ詞 及其中ʹ詞ʹ狀態
	 */
	clearLearnedWordRecordEtItsStatus(){
		const z = this
		const learnedWord__index = z.merge_LearnedWords__index()
		for(const [word, index] of learnedWord__index){
			word.clearStatus()
		}
		z._rmbWord__index.clear()
		z._fgtWord__index.clear()
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

}
