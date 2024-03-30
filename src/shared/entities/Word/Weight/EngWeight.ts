import { inherit } from "@shared/Ut";
import { WordWeight } from "./_Base";



export class EngWeight extends WordWeight{
	protected constructor(){
		super()
	}

	static new(...prop:Parameters<typeof WordWeight.new>){
		const f = WordWeight.new(...prop)
		const c = new this()
		const o = inherit(c,f)
		return o
	}

}


