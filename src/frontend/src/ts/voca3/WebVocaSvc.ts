import { MemorizeWord, RMB_FGT } from "@shared/entities/Word/MemorizeWord";
import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { VocaSvc } from "@shared/logic/memorizeWord/VocaSvc";
import EventEmitter3 from 'EventEmitter3'
import { Client } from "./Client";
import { WordDbRow } from "@shared/dbRow/Word";
import { Word } from "@shared/entities/Word/Word";
import { Exception } from "@shared/Exception";
import { WebMemorizeWord } from "./entities/WebMemorizeWord";
import { WordEvent } from "@shared/SingleWord2";
import { WeightCodeParser } from "@shared/WordWeight/Parser/WeightCodeParser";
import { $ } from "@shared/Ut";

export class WebVocaSvc extends VocaSvc{

	readonly This = WebVocaSvc
	protected constructor(){
		super()
	}

	
	static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		return z
	}

	protected _emitter: LinkedEmitter = Le.LinkedEmitter.new(new EventEmitter3())

	declare protected _wordsToLearn: WebMemorizeWord[];
	get wordsToLearn(){return this._wordsToLearn}

	/** 已背ʹ單詞中 憶者 */
	protected _rmbWords:WebMemorizeWord[] = []
	get rmbWords(){return this._rmbWords}

	/** 已背ʹ單詞中 忘者 */
	protected _fgtWords:WebMemorizeWord[] = []
	get fgtWords(){return this._fgtWords}

	// protected _learnedWords: WebMemorizeWord[] = []
	// get learnedWords(){return this._learnedWords}

	protected _client = Client.new()
	get client(){return this._client}


	// protected _weightAlgoParser:WeightCodeParser = 
	// get weightAlgoParser(){return this._weightAlgoParser}
	// set weightAlgoParser(v){this._weightAlgoParser = v}


	async load(): Promise<boolean> {
		const z = this
		const jsonRows = await z.client.getWordsFromAllTables()
		const rows:WordDbRow[] = JSON.parse(jsonRows)
		const words = rows.map(e=>WordDbRow.toEntity(e))
		const memorizeWords = words.map(e=>WebMemorizeWord.new(e))
		z._wordsToLearn = memorizeWords
		z.svcStatus.load = true
		return Promise.resolve(true)
	}

	protected async _initWeightAlgo(){
		const z = this
		const algoCode = await z.client.getWeightAlgoJs0()
		try {
			const ans = WeightCodeParser.parse(algoCode)
			z._weightAlgo = $(ans)()
		} catch (error) {
			const err = error as Error
			throw err
		}
	}

	//TODO
	async sort(): Promise<boolean> {
		const z = this
		await z._initWeightAlgo()
		if(z.weightAlgo == void 0){
			throw new Error(`z.weightAlgo == void 0`) //TODO 用exception
		}
		try {
			const gotWords = await z.weightAlgo.run(z.wordsToLearn)
			z._wordsToLearn = gotWords as WebMemorizeWord[]
			return true
		} catch (error) {
			const err = error as Error
			throw err //TODO 用exception
		}
		return false
	}
	start(): Promise<boolean> {
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


	learnByIndex(index: integer, event: RMB_FGT): Promise<boolean> {
		throw new Error('not supported')
		const z = this
		if(index +1 > z.wordsToLearn.length){
			return Promise.resolve(false)
		}
		const ans = z.wordsToLearn[index].setInitEvent(event)
		if(ans){
			z.emitter.emit(z.svcEvents.learnByIndex, index, z.wordsToLearn[index], event)
		}
		return Promise.resolve(ans)
	}


	async learnByWord(mw:WebMemorizeWord, event:RMB_FGT):Promise<boolean>{
		const z = this
		if(event === WordEvent.RMB){
			return z.rmb(mw)
		}else if(event === WordEvent.FGT){
			return z.fgt(mw)
		}else{
			throw new Error('WordEvent error')
		}
	}

	rmb(mw:WebMemorizeWord){
		const z = this
		const ans = mw.setInitEvent(WordEvent.RMB)
		if(ans){
			z.rmbWords.push(mw)
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.RMB)
		}
		return ans
	}

	fgt(mw:WebMemorizeWord){
		const z = this
		const ans = mw.setInitEvent(WordEvent.FGT)
		if(ans){
			z.fgtWords.push(mw)
			z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.FGT)
		}
		return ans
	}

	async save(): Promise<boolean> {
		const z = this
		z._svcStatus.start = false
		//merge all
		for(let i = 0; i < z.wordsToLearn.length; i++){
			z.wordsToLearn[i].merge()
		}
		const words = z.wordsToLearn.map(e=>e.word)
		const rows = words.map(e=>WordDbRow.toPlain(e))
		//const ans = await z.dbSrc.saveWords(words)
		const ans = await z.client.saveWords(rows)
		z.emitter.emit(z.svcEvents.save, ans)
		z._svcStatus.save = true
		return true
	}
	async restart(): Promise<boolean> {
		const z = this
		const ans = await z.start()
		return ans
	}
	
}