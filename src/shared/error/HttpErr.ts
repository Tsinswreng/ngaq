export class HttpErr extends Error{
	protected constructor(msg:str=''){super(msg)}
	protected __init__(...args: Parameters<typeof HttpErr.new>){
		const z = this
		z.code = args[0]
		return z
	}

	static new(code:int , msg:str = ''){
		const z = new this(msg)
		z.__init__(code, msg)
		return z
	}

	get This(){return HttpErr}

	code:int
}
