import { MemorizeWord, RMB_FGT } from "@shared/entities/Word/MemorizeWord";
import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { VocaSvc } from "@shared/logic/memorizeWord/VocaSvc";
import EventEmitter3 from 'EventEmitter3'
import { Client } from "./Client";
import { WordDbRow } from "@shared/dbRow/Word";
import { Word } from "@shared/entities/Word/Word";
import { Exception } from "@shared/Exception";

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

	protected _client = Client.new()
	get client(){return this._client}

	async load(): Promise<boolean> {
		const z = this
		const jsonRows = await z.client.getWordsFromAllTables()
		const rows:WordDbRow[] = JSON.parse(jsonRows)
		const words = rows.map(e=>WordDbRow.toEntity(e))
		const memorizeWords = words.map(e=>MemorizeWord.new(e))
		z._wordsToLearn = memorizeWords
		z.svcStatus.load = true
		return Promise.resolve(true)
	}
	async sort(): Promise<boolean> {
		return true
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