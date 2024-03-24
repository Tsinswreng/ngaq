//import { Priority } from "@shared/SingleWord2"
import { Priority } from "@shared/entities/Word/Word"
import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
type Conf0 = typeof Priority.defaultConfig
type Fn<Return=any> = (...args:any[])=>Return
export class Abs_WordWeight implements I_WordWeight{

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

