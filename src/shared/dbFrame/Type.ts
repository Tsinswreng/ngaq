import { I_Type } from "./I_Type"

export class Type implements I_Type {
	constructor(){}
	protected __init__(...args: Parameters<typeof Type.new>){
		const z = this
		z.name = args[0]
		return z
	}

	static new(name:str){
		const z = new this()
		z.__init__(name)
		return z
	}

	//get This(){return Type}

	name:str
}
