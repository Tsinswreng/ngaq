export class Dict{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof Dict.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//static unicodeSeparator = '-'

}
