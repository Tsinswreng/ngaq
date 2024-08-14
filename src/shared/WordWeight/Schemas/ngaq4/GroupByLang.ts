/* 
按詞ʹ語言 分組
*/

import type { I_ChangeRecord, I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { customSort } from "@shared/tools/customSort"
import { I_belong } from "@shared/Type"

export type Word_t = I_belong<str>

export class GroupByLang implements I_WordWeight<Word_t>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof GroupByLang.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return GroupByLang}
	setArg(key: string, v: any): boolean {
		return true
	}
	Run(words:Word_t[]){
		let e = 'english'
		let j = 'japanese'
		let l = 'latin'
		let i = 'italian'
		words = customSort(words, e=>e.belong, [
			e,j,e,j,null,null
		])
		return Promise.resolve(words)
	}
}


