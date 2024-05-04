type Args<T> = T extends any[]? T : never

export class Reason<Arg extends any[] = any[]>{
	protected constructor(){

	}
	static new<Arg extends any[]>(msg:string='' ,prop?:{
		//_msg:string
	}){
		const z = new this<Arg>()
		z.__init__(msg, prop)
		return z
	}

	protected __init__(msg:string, prop?){
		const z = this
		z._msg = msg
		Object.assign(z,prop)
		return z
	}

	protected _msg:string
	get msg(){return this._msg}
	set msg(v){this._msg = v}

	protected _args:Arg
	get args(){return this.args}
	set args(v){this._args = v}
}


export class Exception extends Error{
	protected constructor(...args:ConstructorParameters<typeof Error>){
		super(...args)
	}
	static new(msg:string='', opt?){
		const z = new this()
		z.__init__(msg, opt)
		return z
	}

	protected __init__(msg:string='', opt?){
		const z = this
		z.message = msg
		return z
	}

	static for<Arg extends any[]>(
		reason:Reason<Arg>
		, ...args:Arg
	){
		const o = this.new(reason.msg)
		o._reason = reason
		
		return o
	}

	protected _reason:Reason = Reason.new()
	get reason(){return this._reason}
}


