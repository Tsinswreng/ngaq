import { I_WordWeight } from "@shared/interfaces/I_WordWeight"

type Fn<Return=any> = (...args:any[])=>Return
export class WordWeight implements I_WordWeight{

	protected constructor(){

	}

	static new(prop?:{}){
		const o = new this()
		return o
	}

	protected _name='_default'
	get name(){return this._name}

	protected _includeTables= void 0
	get includeTables(){return this._includeTables}

	protected _excludeTables = void 0
	get excludeTables(){return this._excludeTables}

	params
	filterBefore?:(...args:any[])=>boolean
	calcPrioFnArr?: Fn<any>[] | undefined;
}

/* 

_metadata表增一字段、id潙0、以存總ᵗ默認ᵗ權重算法。
其創ʴᵗ時即建元數據表之時。

表ʸ存ᵗ權重算法代碼ˋ用json
從數數據表中取出特定表ᵗ權重算法類
支持導入他ᵗ表ᵗ權重算法類、然後改參數。

*/