//import { SvcWord3, RMB_FGT } from "@shared/entities/Word/SvcWord3";
import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { LearnSvc } from "@shared/logic/memorizeWord/LearnSvc";
import EventEmitter3 from 'EventEmitter3'
import { Client } from "./Client";
import { WordDbRow } from "@shared/old_dbRow/Word";
//import { Word } from "@shared/entities/Word/Word";
import { Exception } from "@shared/error/Exception";
import { WebSvcWord } from "./entities/WebSvcWord";
import { OldWeightCodeParser as WeightCodeParser } from "@shared/WordWeight/Parser/WeightCodeParser";
import { $ } from "@shared/Ut";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight3";
import { BlobWithMeta as BlobWithText } from "@shared/BlobWithMeta";
import { TagImg } from "@shared/TagImg";
import { JoinedRow } from "@shared/model/word/JoinedRow";
import { JoinedWord } from "@shared/model/word/JoinedWord";
import { SvcWord } from "@shared/logic/memorizeWord/SvcWord";

export class WebNgaqSvc extends LearnSvc{


	readonly This = WebNgaqSvc
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

	declare protected _wordsToLearn: WebSvcWord[];
	get wordsToLearn(){return this._wordsToLearn}

	/** 已背ʹ單詞中 憶者 */
	// protected _rmbWord__index:WebSvcWord[] = []
	// get rmbWord__index(){return this._rmbWord__index}

	// /** 已背ʹ單詞中 忘者 */
	// protected _fgtWord__index:WebSvcWord[] = []
	// get fgtWord__index(){return this._fgtWord__index}

	// protected _learnedWords: WebMemorizeWord[] = []
	// get learnedWords(){return this._learnedWords}

	protected _client = Client.new()
	get client(){return this._client}


	// protected _weightAlgoParser:WeightCodeParser = 
	// get weightAlgoParser(){return this._weightAlgoParser}
	// set weightAlgoParser(v){this._weightAlgoParser = v}


	// protected async _load(): Promise<boolean> {
	// 	const z = this
	// 	const jsonRows = await z.client.getWordsFromAllTables()
	// 	const rows:WordDbRow[] = JSON.parse(jsonRows)
	// 	const words = rows.map(e=>WordDbRow.toEntity(e))
	// 	const memorizeWords = words.map(e=>WebSvcWord.new(e))
	// 	z._wordsToLearn = memorizeWords
	// 	z.svcStatus.load = true
	// 	return Promise.resolve(true)
	// }

	protected override async _load(){
		const z = this
		const jsonRows = await z.client.GetWordsFromAllTables()
		//console.log(jsonRows)//t
		//const rows:JoinedRow[] = JSON.parse(jsonRows)
		const rows:JoinedRow[] = jsonRows
		const jwords = rows.map(e=>JoinedWord.new(e))
		//const words = jwords.map(e=>JoinedWord.toPlainWord(e))
		const memorizeWords = jwords.map(e=>WebSvcWord.new(e))
		z._wordsToLearn = memorizeWords
		return true
	}


	/**
	 * @deprecated
	 */
	protected async _initWeightAlgo_deprecated(){
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

	protected async _loadWeightAlgo(): Promise<I_WordWeight> {
		const z = this
		const algoCode = await z.client.getWeightAlgoJs0()
		try {
			const ans = WeightCodeParser.parse(algoCode)
			return $(ans)()
		} catch (error) {
			const err = error as Error
			throw err
		}
	}


	//TODO
	// async sort(): Promise<boolean> {
	// 	const z = this
	// 	await z._initWeightAlgo()
	// 	if(z.weightAlgo == void 0){
	// 		throw new Error(`z.weightAlgo == void 0`) //TODO 用exception
	// 	}
	// 	try {
	// 		const gotWords = await z.weightAlgo.run(z.wordsToLearn)
	// 		z._wordsToLearn = gotWords as WebSvcWord[]
	// 		return true
	// 	} catch (error) {
	// 		const err = error as Error
	// 		throw err //TODO 用exception
	// 	}
	// 	return false
	// }


	//TODO
	protected async _sortWords(svcWords: SvcWord[]): Promise<SvcWord[]> {
		const z = this
		//await z._initWeightAlgo_deprecated()
		return svcWords
		// await z.initWeightAlgo()
		// if(z.weightAlgo == void 0){
		// 	throw new Error(`z.weightAlgo == void 0`) //TODO 用exception
		// }
		// try {
		// 	const gotWords = await z.weightAlgo.run(z.wordsToLearn)
		// 	return gotWords
		// } catch (error) {
		// 	throw error //TODO 用exception
		// }
		
	}
	protected _resort(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}



	// protected override async _saveOld(words: Word[]): Promise<any> {
	// 	const z = this
	// 	const rows = words.map(e=>WordDbRow.toPlain(e))
	// 	//const ans = await z.dbSrc.saveWords(words)
	// 	const ans = await z.client.saveWords(rows)
	// 	return ans
	// }


	protected async _restart(): Promise<boolean> {
		return true
	}

	// protected async _sort(): Promise<boolean> {
	// 	return true
	// }

	protected async _start(): Promise<boolean> {
		return true
	}

	protected async getImgResp(){
		const z = this
		//return z.client.get_randomImg2()
		return z.client.get_randomImg4()
	}

	async getImg_arrBuf(){
		const z = this
		const resp = await z.getImgResp()
		const buf = await resp.arrayBuffer()
		const pack = BlobWithText.parse(buf)
		console.log(pack.text)//t
		return pack.arrBuf
	}

	async getImg(){
		const z = this
		const resp = await z.getImgResp()
		const buf = await resp.arrayBuffer()
		const pack = BlobWithText.parse(buf)
		const tagImg = TagImg.new(pack.arrBuf, pack.text)
		tagImg.url = pack.text
		return tagImg
	}

	// async getNumArrImg(){
	// 	const z = this
	// 	const resp = await z.getImg()
	// 	const json = await resp.json()
	// 	console.log(json['text'])//t
	// 	const buffer = json['blob']
	// 	//console.log(buffer)//t
	// 	const arr:int[] = buffer.data
	// 	return arr
	// }

	

	// rmb(mw:WebSvcWord){
	// 	const z = this
	// 	const ans = mw.setInitEvent(WordEvent.RMB)
	// 	if(ans){
	// 		z.rmbWords.push(mw)
	// 		z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.RMB)
	// 	}
	// 	return ans
	// }

	// fgt(mw:WebSvcWord){
	// 	const z = this
	// 	const ans = mw.setInitEvent(WordEvent.FGT)
	// 	if(ans){
	// 		z.fgtWords.push(mw)
	// 		z.emitter.emit(z.svcEvents.learnByMWord, mw, WordEvent.FGT)
	// 	}
	// 	return ans
	// }

	// async _save(): Promise<boolean> {
	// 	const z = this
	// 	z._svcStatus.start = false
	// 	//merge all
	// 	for(let i = 0; i < z.wordsToLearn.length; i++){
	// 		z.wordsToLearn[i].merge()
	// 	}
	// 	const words = z.wordsToLearn.map(e=>e.word)
	// 	const rows = words.map(e=>WordDbRow.toPlain(e))
	// 	//const ans = await z.dbSrc.saveWords(words)
	// 	const ans = await z.client.saveWords(rows)
	// 	z.emitter.emit(z.svcEvents.save, ans)
	// 	z._svcStatus.save = true
	// 	return true
	// }

	//TODO 判斷狀態
	// async _restart(): Promise<boolean> {
	// 	const z = this
	// 	await z._sort()
	// 	await z._start()
	// 	return true
	// }
	
}