
export class Opus<Arg=any, Ret=any>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Opus.new>){
		const z = this
		return z
	}

	protected static new<Arg=any, Ret=any>(){
		const z = new this<Arg, Ret>()
		z.__init__()
		return z
	}

	//get This(){return Opus}

	protected _jsCode:str = ""
	get jsCode(){return this._jsCode}
	protected set jsCode(v){this._jsCode = v}

	protected _url:str = ""
	get url(){return this._url}
	protected set url(v){this._url = v}

	protected _worker:Worker
	get worker(){return this._worker}
	protected set worker(v){this._worker = v}
	
	static fromCode<Arg=any, Ret=any>(code:str){
		const z = Opus.new<Arg, Ret>()
		const blob = new Blob([code], { type: 'application/javascript' });
		const url = URL.createObjectURL(blob);
		const worker = new Worker(url);
		z.jsCode = code
		z.url = url
		z.worker = worker
		return z
	}

	terminate(){
		const z = this
		z.worker.terminate()
		z._url = ""
		URL.revokeObjectURL(z._url);
	}

	static Run<Arg, Ret>(worker:Worker, message:Arg ,opt?:Parameters<typeof Worker.prototype.postMessage>[1]){
		return new Promise<Ret>((res, rej)=>{
			worker.onmessage = (event)=>{
				res(event.data)
			}
			worker.onerror = (err)=>{
				rej(err)
			}
			worker.postMessage(message, opt)
		})
	}

	Run<A=Arg, R=Ret>(message:A ,opt?:Parameters<typeof Worker.prototype.postMessage>[1]){
		const z = this
		const worker = z.worker
		return Opus.Run<A, R>(worker, message, opt)
	}


	static code_useFn = 
`self.onmessage = function(event){
	const data = event.data
	if(typeof data !== 'string'){
		throw new TypeError("event.data is not string")
	}
	const code = data
	const __return = {_:void 0 as any}
	const fn = new Function('__return', code)
	fn(__return)
	const ans = __return._
	self.postMessage(ans)
}`

	static mkByFn<R>(){
		const code = Opus.code_useFn
		const ans = Opus.fromCode<str, R>(code)
		return ans
	}

	// test(){
	// 	const worker = this.worker
	// 	const self = worker
	// 	//in worker
	// 	self.onmessage = function(event){
	// 		const data = event.data
	// 		if(typeof data !== 'string'){
	// 			throw new TypeError("event.data is not string")
	// 		}
	// 		const code = data
	// 		const __return = {_:void 0 as any}
	// 		const fn = new Function('__return', code)
	// 		fn(__return)
	// 		const ans = __return._
	// 		self.postMessage(ans)
	// 	}
	// }
}
