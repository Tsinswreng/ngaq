type Fn<Return=any> = (...args:any[])=>Return
import type { SvcWord } from "@shared/entities/Word/SvcWord"
//import type { ChangeRecord, TempusEventRecord } from "@shared/WordWeight/ChangeRecord"
import type Tempus from "@shared/Tempus"
import type { LearnBelong } from "@shared/dbRow/NgaqRows"


export interface I_WordWeight<Word_t>{
	/**
	 * 篩選,算權重,打亂,排序,錄ᵣ變 等 皆由此
	 * @param words 
	 */
	Run<T extends Word_t>(words:T[]):Promise<Word_t[]>
	wordId__changeRec?: Map<str, I_ChangeRecord[]>
	/**
	 * 權重參數設置
	 * 如
	 * {
	 * 	"默認ʹ加ˡ權重": "200"
	 * }
	 */
	paramOpt?:kvobj
	setParam(key:string, v):boolean
}


export interface I_ChangeRecord{
	/** 變後ʹ權重 */
	after
	reason?
}

export type Num_t = number