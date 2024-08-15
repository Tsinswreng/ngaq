import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { LearnSvc } from "@shared/logic/memorizeWord/LearnSvc";
import EventEmitter3 from 'EventEmitter3'
import { Client } from "./Client";
import { Exception } from "@shared/error/Exception";
import { WebSvcWord } from "./entities/WebSvcWord";
import { $, As } from "@shared/Common";
import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { BlobWithText } from "@shared/tools/BlobWithText";
import { TagImg } from "@shared/tools/TagImg";
import { JoinedRow } from "@shared/model/word/JoinedRow";
import { JoinedWord } from "@shared/model/word/JoinedWord";
import { SvcWord } from "@shared/logic/memorizeWord/SvcWord";
import { FnCodeParser } from "@shared/WordWeight/Schemas/ngaq4/FnCodeParser";
import { Opus } from "@ts/Worker/Opus";
import type * as WordIf from "@shared/interfaces/WordIf";
import { Learn } from "@shared/model/word/NgaqRows";
import { ref } from "vue";

type WeightAlgo_t = I_WordWeight<SvcWord, WordIf.I_WordForCalcWeight>


class Statistics{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Statistics.new>){
		const z = this
		z.svc = args[0]
		z.client = z.svc.client
		z._Fetch()
		return z
	}

	static new(svc:WebNgaqSvc){
		const z = new this()
		z.__init__(svc)
		return z
	}

	protected _Fetch(){
		const z = this
		return z.client.Get_recentLearnCnt().then(cnt=>{
			z.recentLearnCnt.value = cnt
		}).catch(e=>z.onErr(e))
	}

	onErr(v){
		console.error(v)
	}

	protected _svc:WebNgaqSvc
	get svc(){return this._svc}
	protected set svc(v){this._svc = v}

	protected _client:Client
	get client(){return this._client}
	protected set client(v){this._client = v}

	protected _recentLearnCnt = ref(0)
	get recentLearnCnt(){return this._recentLearnCnt}
	set recentLearnCnt(v){this._recentLearnCnt = v}
	


}


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
		z.statistics = Statistics.new(z)
		return z
	}

	protected _linkedEmitter: LinkedEmitter = Le.LinkedEmitter.new(new EventEmitter3())

	declare protected _wordsToLearn: WebSvcWord[];
	get wordsToLearn(){return this._wordsToLearn}

	protected _client = Client.new()
	get client(){return this._client}

	declare protected _weightAlgo: WeightAlgo_t|undefined
	get weightAlgo(){return this._weightAlgo}
	protected set weightAlgo(v){this._weightAlgo = v}

	/** @lateinit */
	protected _statistics: Statistics
	get statistics(){return this._statistics}
	protected set statistics(v){this._statistics = v}


	
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

	//TODO 用web worker、先隨機打亂ⁿ示、待算完權重後再排序ⁿ褈示
	protected override async _SortWords(svcWords: SvcWord[]): Promise<SvcWord[]> {
		const z = this
		const calc = $(z.weightAlgo, 'z.weightAlgo')
		const gotWords = await calc.Run(svcWords)
		z.This.assignWeightByRef(svcWords, gotWords)
		svcWords.sort((a,b)=>{
			return $(a.index) - $(b.index)
		})
		return svcWords
	}

	protected async _Save(learnRows: Learn[]): Task<any> {
		const z = this
		return await z.client.AddLearnRows(learnRows)
	}

	protected async _Restart(): Promise<boolean> {
		return true
	}

	protected async _Start(): Promise<boolean> {
		return true
	}

	protected async GetImgResp(){
		const z = this
		const ans = await z.client.Get_randomImg()
		// console.log(ans) ArrayBuffer
		// console.log(typeof ans)
		return As(ans, ArrayBuffer)
	}

	// async GetImg_arrBuf(){
	// 	const z = this
	// 	// const resp = await z.GetImgResp()
	// 	// const buf = await resp.arrayBuffer()
	// 	const buf = await z.GetImgResp()
	// 	const pack = BlobWithText.parse(buf)
	// 	console.log(pack.text)//t
	// 	return pack.arrBuf
	// }

	async GetImg(){
		const z = this
		const resp = await z.GetImgResp()
		const buf = resp
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

}


