import { Word } from "./Word";

export class MemorizeWord{

	protected constructor(){

	}

	static new(word:Word){
		const o = new this()
		o._word = word
		return o
	}

	protected _word:Word
	get word(){return this._word}

	protected _weight:number
	get weight(){return this._weight}
	set weight(v){this._weight = v}


}