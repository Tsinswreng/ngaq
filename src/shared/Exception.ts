import * as Le from '@shared/linkedEvent'
const Event = Le.Event
type Event = Le.Event

type Args<T> = T extends any[]? T : never

export class Reason<Arg extends any[] = any[]> extends Event{
	protected constructor(){
		super()
	}

	static new_deprecated<Arg extends any[]>(msg:string='' ,prop?:{
		//_msg:string
	}){
		const z = new this<Arg>()
		z.__init__deprecated(msg, prop)
		return z
	}

	protected __init__deprecated(name:string, prop?){
		const z = this
		super.__init__deprecated(name)
		z._name = name
		Object.assign(z,prop)
		return z
	}

	static new<Arg extends any[]>(name:string, base?:Reason){
		const z = new this<Arg>()
		z.__init__(name, base)
		return z
	}

	protected __init__(...params:Parameters<typeof Reason.new>){
		const z = this
		z._name = params[0]
		z._base = params[1]
	}

	declare protected _name:string
	get name(){return this._name}
	set name(v){this._name = v}

	protected _args:Arg
	get args(){return this.args}
	set args(v){this._args = v}
}


export class Exception extends Error{
	protected constructor(...args:ConstructorParameters<typeof Error>){
		super(...args)
	}

	protected static new_deprecated(msg:string='', opt?){
		const z = new this()
		z.__init__deprecated(msg, opt)
		return z
	}

	protected __init__deprecated(msg:string='', opt?){
		const z = this
		z.message = msg
		return z
	}

	static new(reason:Reason){
		const z = new this()
		z.__init__(reason)
		return z
	}

	protected __init__(...params:Parameters<typeof Exception.new>){
		const z = this
		z._reason = params[0]
		return z
	}

	static for<Arg extends any[]>(
		reason:Reason<Arg>
		, ...args:Arg
	){
		const o = this.new(reason)
		o._reason = reason
		return o
	}

	static getArgs<Arg extends any[]>(
		reason: Reason<Arg>
		, ...args:Arg
	){
		return args
	}

	protected _reason:Reason
	get reason(){return this._reason}
}


