import type { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { Derangement, Word_t as DWord } from "./Derangement"
import { GroupByLang, Word_t as GWord } from "./GroupByLang";
import { Tempus_EventCalc, Word_t as TWord } from "./Tempus_EventCalc";
declare const __return:{_:any}


export interface Word_t extends DWord, GWord, TWord{

}

//declare let a :Word_t



class Main implements I_WordWeight<Word_t>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Main.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Main}
	setParam(key: string, v: any): boolean {
		return true
	}
	async Run(words: Word_t[]):Task<Word_t[]>{
		words = await Tempus_EventCalc.new().Run(words) as Word_t[]
		words = await Derangement.new().Run(words) as Word_t[]
		words = await GroupByLang.new().Run(words) as Word_t[]
		return words
	}
}

