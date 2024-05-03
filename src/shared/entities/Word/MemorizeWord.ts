import { InstanceType_ } from "@shared/Type";
import { Tempus_Event, Word, WordEvent } from "@shared/entities/Word/Word";

//type WordEvent = typeof WordEvent
class Status{
	static new(){
		const o = new this()
		return o
	}
	memorize:typeof WordEvent.RMB| typeof WordEvent.FGT|undefined = void 0
}



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

	protected _status = Status.new()
	get status(){return this._status}

	init(){
		const z = this
		z._date__event = Word.getSortedDateToEventObjs(z.word)
	}

}

