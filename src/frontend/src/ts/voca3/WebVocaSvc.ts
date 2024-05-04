import { RMB_FGT } from "@shared/entities/Word/MemorizeWord";
import { LinkedEmitter } from "@shared/linkedEvent";
import * as Le from "@shared/linkedEvent";
import { VocaSvc } from "@shared/logic/memorizeWord/VocaSvc";
import EventEmitter3 from 'EventEmitter3'

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

	load(): Promise<boolean> {
		const z = this
		
		return Promise.resolve(true)
	}
	sort(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	start(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	learnByIndex(index: integer, event: RMB_FGT): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	save(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	restart(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
	
}