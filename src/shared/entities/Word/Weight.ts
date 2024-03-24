//import { Priority } from "@shared/SingleWord2"
import { Priority } from "@shared/entities/Word/Word"
type Conf0 = typeof Priority.defaultConfig
type Fn<Return=any> = <Return=any>(...args:any[])=>Return
export interface I_WordWeight{
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

export class WordWeight implements I_WordWeight{

	protected constructor(){

	}

	static new(){
		const o = new this()
		return o
	}


	protected _name='_default'
	get name(){return this._name}

	protected _includeTables= void 0
	get includeTables(){return this._includeTables}

	protected _excludeTables = void 0
	get excludeTables(){return this._excludeTables}

	params:Partial<Conf0>={}
	filterBefore?:(...args:any[])=>boolean
	calcPrioFnArr?: Fn<any>[] | undefined;
}

