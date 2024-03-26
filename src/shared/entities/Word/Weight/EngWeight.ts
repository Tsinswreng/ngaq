import { inherit } from "@shared/Ut";
import { Abs_WordWeight } from "./_Base";



export class EngWeight extends Abs_WordWeight{
	protected constructor(){
		super()
	}

	static new(...prop:Parameters<typeof Abs_WordWeight.new>){
		const f = Abs_WordWeight.new(...prop)
		const c = new this()
		const o = inherit(c,f)
		return o
	}

}


