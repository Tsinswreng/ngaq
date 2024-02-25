//import { Priority } from "@shared/SingleWord2"
import { Priority } from "@shared/entities/Word/Word"
type Conf0 = typeof Priority.defaultConfig
type Fn<Return=any> = <Return=any>(...args:any[])=>Return
interface I_WordPriority{
	/** 此配置項之名 */
	name:string
	/** 在哪些單詞表起效。若潙undefined則皆起效 */
	includeTables?:string[]
	/** 在哪些單詞表不起效 */
	excludeTables?:string[]
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

class PriorityConfig implements I_WordPriority{
	name=''
	includeTables= []
	params:Partial<Conf0>={}
	filterBefore?:(...args:any[])=>boolean
	calcPrioFnArr?: Fn<any>[] | undefined;

}

/*
模式一 二 三
指定配置文件路径
自ᵈ叶ᵣ算法代碼
*/

