import { Tempus_Event, Word } from "./Word";

export class MemorizeWord{

	protected constructor(){

	}

	static new(word:Word){
		const o = new this()
		o._word = word
		o.init()
		return o
	}

	protected _word:Word
	get word(){return this._word}

	protected _weight:number
	get weight(){return this._weight}
	set weight(v){this._weight = v}

	protected _date__event:Tempus_Event[]
	get date__event(){return this._date__event}

	init(){
		const z = this
		z._date__event = Word.getSortedDateToEventObjs(z.word)
	}

}