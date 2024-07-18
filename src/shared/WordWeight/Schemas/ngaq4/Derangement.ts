/* 
打亂 過濾 處理標籤等
*/
import type { I_ChangeRecord, I_WordWeight } from "@shared/interfaces/I_WordWeight"
// import type { InstanceType_ } from "@shared/Type"
// import type { 
// 	I_Tempus_Event
// 	, I_Tempus_EventWord
// }
// from '@shared/interfaces/ngaqWeightWord/Tempus_eventWord'
// import { LearnBelong } from '@shared/dbRow/NgaqRows'
// import { TempusEventRecord } from "./ChangeRecord"
// import Tempus from "@shared/Tempus"
// import { N2S } from "@shared/Sros"
// import { Sros } from "@shared/Sros"
// import { $ } from "@shared/Common"
// import {key__arrMapPush} from '@shared/tools/key__arrMapPush'

import {getShuffle} from '@shared/tools/getShuffle'

export type Word_t = any
export class Derangement implements I_WordWeight<Word_t>{
	protected constructor(){}

	protected __init__(...args: Parameters<typeof Derangement.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return Derangement}
	setParam(key: string, v: any): boolean {
		return true
	}
	Run(words: any[]): Promise<any[]> {
		const ans = getShuffle(
			words, 8,
			Math.floor(words.length / 8)
		)
		return Promise.resolve(ans)
	}
	//wordId__changeRec?: Map<string, I_ChangeRecord[]>
	//paramOpt?: kvobj<string, any> | undefined
}
