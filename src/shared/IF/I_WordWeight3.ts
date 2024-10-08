type Fn<Return=any> = (...args:any[])=>Return
import type { SvcWord3 } from "@shared/entities/Word/SvcWord3"
import type { ChangeRecord, TempusEventRecord } from "@shared/WordWeight/ChangeRecord"
import type { Word } from "@shared/entities/Word/Word"
export interface I_WordWeight{
	/**
	 * 篩選,算權重,打亂,排序,錄ᵣ變 等 皆由此
	 * @param mWords 
	 */
	run(mWords:SvcWord3[]):Promise<SvcWord3[]>
	// changeRecord?:ChangeRecord[]
	word__changeRecordOld?:Map<Word, ChangeRecord[]>
	wordId__changeRec?: Map<str, ChangeRecord[]>
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

/**
 * @deprecated
 */
export interface I_WordWeight_old{
	/** 此配置項之名 */
	get name():string
	/** 在哪些單詞表起效。若潙undefined則皆起效 */
	get includeTables():string[]|undefined
	/** 在哪些單詞表不起效 */
	get excludeTables():string[]|undefined
	/** 權重參數 */
	//params:Partial<Conf0>
	/** 過濾函數。true:保留、false:濾除。在算權重前過濾 */
	filterBefore?:(...args:any[])=>boolean
	/** 
	 * 㕥計算權重之函數數組
	 * 執行順序:先蔿每個單詞對象執行此數組中之首個函數、然後纔蔿每個單詞對象執行數組中之下一個函數。如是則可叶功能芝 把第一輪權重計算中所得均值傳入後續函數中作參數等。
	 */
	calcPrioFnArr?:(Fn)[]
	/** 計算最後權重 */
	calcFinPrioFn?:(Fn<number>)
	/** 過濾函數。true:保留、false:濾除。在算權重前過濾 */
	filterAfter?:(...args:any[])=>boolean

}