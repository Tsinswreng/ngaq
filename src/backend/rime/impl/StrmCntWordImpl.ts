import { StrmCntWord } from "../service/StrmCntWord"
import { I_StrmCntWord } from "../service/I_StrmCntWord"
import { Deferrable } from "@shared/Type"
import { CntWordRow } from "../models/CntWord/CntWordRows"
import { Level } from "level"
import { LdbIter } from "@backend/util/LdbIter"
import { cntWordParser } from "../service/CntWordParser"
export class StrmCntWordImpl implements I_StrmCntWord{
	protected constructor(){}

	protected __init__(...args: Parameters<typeof StrmCntWordImpl.new>){
		const z = this
		z.strmCntWord = args[0]
		return z
	}

	static new(strmCntWord: StrmCntWord){
		const z = new this()
		z.__init__(strmCntWord)
		return z
	}

	static fromPath(...args:ConstructorParameters<typeof Level<str, str>>){
		const level = new Level(...args)
		const ldbIter = LdbIter.new(level)
		const strmCntWord = StrmCntWord.new({
			ldbIter:ldbIter
			,cntWordParser:cntWordParser
		})
		return this.new(strmCntWord)
	}

	get This(){return StrmCntWordImpl}

	protected _strmCntWord: StrmCntWord
	get strmCntWord(){return this._strmCntWord}
	protected set strmCntWord(v){this._strmCntWord = v}

	GetN(n: int): Deferrable<CntWordRow[]> {
		return this.strmCntWord.GetN(n)
	}

	reset() {
		//throw new Error("Method not implemented.")
		return this.strmCntWord.reset()
	}
	
}
