
export interface I_return<T>{
	_:T
}

export class FnCodeParser{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof FnCodeParser.new>){
		const z = this
		z.targetCode = args[0]
		return z
	}

	static new(targetCode:str){
		const z = new this()
		z.__init__(targetCode)
		return z
	}

	protected _returnIdentifier = '__return'
	get returnIdentifier(){return this._returnIdentifier}
	set returnIdentifier(v){this._returnIdentifier = v}
	//get This(){return WeightCodeParse}
	protected _targetCode:str
	get targetCode(){return this._targetCode}
	protected set targetCode(v){this._targetCode = v}
	
	parse<T>(){
		const z = this
		const fn = new Function(
			z._returnIdentifier
			,z.targetCode
		)
		return fn as (__return:I_return<T>)=>void
	}

	static parse<T>(jsCode:str){
		const parser = FnCodeParser.new(jsCode)
		const fn = parser.parse<T>()
		return fn
	}

	static async Run<T>(jsCode:str){
		const z = this
		const fn = z.parse<T>(jsCode)
		const __return = {_:void 0} as I_return<T>
		await fn(__return)
		return __return._
	}
}

// export function parse<T>(jsCode:str){
// 	const parser = FnCodeParser.new(jsCode)
// 	const fn = parser.parse<T>()
// 	return fn
// }