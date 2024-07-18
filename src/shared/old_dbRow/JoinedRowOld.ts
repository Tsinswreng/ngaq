import { LearnRow, PropertyRow, WordRow } from "@shared/old_dbRow/wordDbRowsOld"
import { PubNonFuncProp } from "@shared/Type"


export class JoinedRowOld{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof JoinedRowOld.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(prop:PubNonFuncProp<JoinedRowOld>){
		const z = new this()
		z.__init__(prop)
		return z
	}

	get This(){return JoinedRowOld}

	word:WordRow
	learns:LearnRow[]
	propertys:PropertyRow[]
}



