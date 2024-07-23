//import { SvcWord3, RMB_FGT } from "@shared/entities/Word/SvcWord3";
import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { LearnSvc } from "@shared/logic/memorizeWord/LearnSvc";
import EventEmitter3 from 'EventEmitter3'
import { Client } from "./Client";
//import { Word } from "@shared/entities/Word/Word";
import { Exception } from "@shared/error/Exception";
import { WebSvcWord } from "./entities/WebSvcWord";
import { $ } from "@shared/Ut";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { BlobWithText as BlobWithText } from "@shared/BlobWithText";
import { TagImg } from "@shared/TagImg";
import { JoinedRow } from "@shared/model/word/JoinedRow";
import { JoinedWord } from "@shared/model/word/JoinedWord";
import { SvcWord } from "@shared/logic/memorizeWord/SvcWord";
import { FnCodeParser } from "@shared/WordWeight/Schemas/ngaq4/FnCodeParser";
import { Opus } from "@ts/Worker/Opus";
import type * as WordIf from "@shared/interfaces/WordIf";
import { Learn } from "@shared/model/word/NgaqRows";

type WeightAlgo_t = I_WordWeight<SvcWord, WordIf.I_WordForCalcWeight>

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
		await super.__Init__()
		return z
	}

	protected _emitter: LinkedEmitter = Le.LinkedEmitter.new(new EventEmitter3())

	declare protected _wordsToLearn: WebSvcWord[];
	get wordsToLearn(){return this._wordsToLearn}

	protected _client = Client.new()
	get client(){return this._client}

	declare protected _weightAlgo: WeightAlgo_t|undefined
	get weightAlgo(){return this._weightAlgo}
	protected set weightAlgo(v){this._weightAlgo = v}
	

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

	protected override async _Load(){
		const z = this
		const jsonRows = await z.client.GetWordsFromAllTables()
		const rows:JoinedRow[] = jsonRows
		const jwords = rows.map(e=>JoinedWord.fromRow(e))
		//const words = jwords.map(e=>JoinedWord.toPlainWord(e))
		const memorizeWords = jwords.map(e=>WebSvcWord.new(e))
		z._wordsToLearn = memorizeWords
		return true
	}

	protected async _LoadWeightAlgo(){
		const z = this
		const algoCode = await z.client.GetWeightAlgoJs0()
		try {
			const fn = FnCodeParser.parse<WeightAlgo_t>(algoCode)
			const __return : {_?: WeightAlgo_t} = {}
			fn(__return)
			const calcer = __return._
			if(calcer == void 0 || calcer.Run == void 0){
				throw new Error(`calcer == void 0 || calcer.Run == void 0`)
			}
			return calcer
		} catch (error) {
			const err = error
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


	//TODO 用web worker、先隨機打亂ⁿ示、待算完權重後再排序ⁿ褈示
	protected override async _SortWords(svcWords: SvcWord[]): Promise<SvcWord[]> {
		const z = this
		//await z._initWeightAlgo_deprecated()
		const code = await z.client.GetWeightAlgoJs0()
		const calc = $(z.weightAlgo, 'z.weightAlgo')
		const gotWords = await calc.Run(svcWords)
		z.This.assignWeightByRef(svcWords, gotWords)
		svcWords.sort((a,b)=>{
			return $(a.index) - $(b.index)
		})
		return svcWords
		// const opus = Opus.mkByFn()
		// opus.Run(code)
		
		// opus = Opus.fromCode(code)
		
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

	protected async _Save(learnRows: Learn[]): Task<any> {
		const z = this
		return await z.client.AddLearnRows(learnRows)
	}

	// protected override async _saveOld(words: Word[]): Promise<any> {
	// 	const z = this
	// 	const rows = words.map(e=>WordDbRow.toPlain(e))
	// 	//const ans = await z.dbSrc.saveWords(words)
	// 	const ans = await z.client.saveWords(rows)
	// 	return ans
	// }


	protected async _Restart(): Promise<boolean> {
		return true
	}

	// protected async _sort(): Promise<boolean> {
	// 	return true
	// }

	protected async _Start(): Promise<boolean> {
		return true
	}

	protected async GetImgResp(){
		const z = this
		//return z.client.get_randomImg2()
		return z.client.get_randomImg4()
	}

	async GetImg_arrBuf(){
		const z = this
		const resp = await z.GetImgResp()
		const buf = await resp.arrayBuffer()
		const pack = BlobWithText.parse(buf)
		console.log(pack.text)//t
		return pack.arrBuf
	}

	async GetImg(){
		const z = this
		const resp = await z.GetImgResp()
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


