

class Inspect{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Inspect.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return Inspect}

	protected _obj:any
	get obj(){return this._obj}
	protected set obj(v){this._obj = v}
	
}
