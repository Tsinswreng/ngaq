export class Trigger{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Trigger.new>){
		const z = this
		z.name= args[0]
		return z
	}

	static new(name:str, tbl?){
		const z = new this()
		z.__init__(name)
		return z
	}

	//get This(){return Trigger}
	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}

}
