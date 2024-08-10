import type { PubNonFuncProp } from "@shared/Type"
import type { I_Index } from "./I_Index"
import type { I_Tbl } from "./I_Tbl"
import type { I_Fact } from "./I_Models"

export class Index implements I_Index{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Index.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(prop:PubNonFuncProp<Index>){
		const z = new this()
		z.__init__(prop)
		return z
	}

	static IDX<Fact extends I_Fact<any, any>>(
		name:str
		, tbl:I_Tbl<any>
		, fn: (e:I_Tbl<Fact>['col'])=>str[]
	){
		const ans = new Index()
		ans.name = name
		ans.tbl_name = tbl.name
		ans.cols = fn(tbl.col)
		ans.tbl = tbl
		return ans
	}

	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}

	protected _tbl_name:str
	get tbl_name(){return this._tbl_name}
	protected set tbl_name(v){this._tbl_name = v}
	
	protected _cols:str[]
	get cols(){return this._cols}
	protected set cols(v){this._cols = v}
	
	protected _tbl:I_Tbl<any>
	get tbl(){return this._tbl}
	protected set tbl(v){this._tbl = v}

	//get This(){return Index}
}