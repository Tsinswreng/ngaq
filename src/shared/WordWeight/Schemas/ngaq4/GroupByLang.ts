/* 
按詞ʹ語言 分組
*/

import type { I_ChangeRecord, I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { I_belong } from "@shared/Type"

type Word_t = I_belong<str>
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
	setParam(key: string, v: any): boolean {
		return true
	}
	run(words:Word_t[]){
		return Promise.resolve()
	}
}


