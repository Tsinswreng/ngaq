import * as Row from "@shared/dbRow/NgaqRows"
import { PubNonFuncProp } from "@shared/Type"


export class JoinedRow{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof JoinedRow.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(prop:PubNonFuncProp<JoinedRow>){
		const z = new this()
		z.__init__(prop)
		return z
	}

	get This(){return JoinedRow}

	word:Row.TextWord
	learns:Row.Learn[]
	propertys: Row.Property[]
}



