export class Reason{
	protected constructor(){

	}
	static new(msg:string='' ,prop?:{
		_msg:string
	}){
		const o = new this()
		o._msg = msg
		Object.assign(o,prop)
		return o
	}

	protected _msg:string
	get msg(){return this._msg}
}


export class Exception extends Error{
	protected constructor(...args:ConstructorParameters<typeof Error>){
		super(...args)
	}
	static new(msg:string='', opt?){
		const c = new this()
		c.message = msg
		return c
	}

	static for(reason:Reason){
		const o = this.new(reason.msg)
		o._reason = reason
		return o
	}

	protected _reason:Reason = Reason.new()
	get reason(){return this._reason}
}


