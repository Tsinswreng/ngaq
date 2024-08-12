import type { CntWordRow } from "../models/CntWord/CntWordRows"
import type { I_StrmCntWord } from "./I_StrmCntWord"
import type { I_CntWordParser } from "./I_CntWordParser"
import type { I_LdbIter } from "@backend/util/I_LdbIter"
import { cntWordParser } from "./CntWordParser"
import { I_pos } from "@shared/interfaces/StreamIf"
//import { LdbIter } from "@backend/util/LdbIter"
// import { cntWordParser } from "./CntWordParser"
// import { Level } from "level"

/**
 * 依賴 I_CntWordParser, I_LdbIter、流式ᵈ析CntWordRow
 */
export class StrmCntWord implements I_StrmCntWord{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof StrmCntWord.new>){
		const z = this
		const prop = args[0]
		//Object.assign(z, prop)
		z.ldbIter = prop.ldbIter
		z.cntWordParser = prop.cntWordParser
		return z
	}

	static new(prop:{
		ldbIter:I_LdbIter
		, cntWordParser:I_CntWordParser
	}){
		const z = new this()
		z.__init__(prop)
		return z
	}

	get This(){return StrmCntWord}

	protected _ldbIter:I_LdbIter
	get ldbIter(){return this._ldbIter}
	protected set ldbIter(v){this._ldbIter = v}

	protected _cntWordParser:I_CntWordParser
	get cntWordParser(){return this._cntWordParser}
	protected set cntWordParser(v){this._cntWordParser = v}
	

	async GetN(n: int){
		const z= this
		const tPair = await z.ldbIter.GetN(n)
		const cntWordRows: CntWordRow[] = []
		for(let i = 0; i < tPair.length; i++){
			const pair = tPair[i]
			try {
				const ua = cntWordParser.parse(pair[0], pair[1])
				if(ua != void 0){
					cntWordRows.push(ua)
				}
			} catch (err) {
				
				throw err
			}
		}
		//const cntWordRows = tPair.map(t=>z.cntWordParser.parse(t[0], t[1]))
		return cntWordRows
	}

	reset() {
		return this.ldbIter.reset()
	}
}

export class StrmErr extends Error implements I_pos{
	pos:int
	_err?:Error
}
