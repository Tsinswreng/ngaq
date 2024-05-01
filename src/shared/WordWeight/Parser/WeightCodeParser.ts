import { compileTs, readTsConfig } from '@shared/Ut'
import * as L from '@shared/WordWeight/_lib'


export class WeightCodeParser{
	protected constructor(){}
	static new(src:string){
		const z = new this()
		z.__init__(src)
		return z
	}
	protected __init__(...param:Parameters<typeof WeightCodeParser.new>){
		const z = this
		z._src = param[0]
	}

	protected _src:string
	get src(){return this._src}

	protected _jsCode:string
	get jsCode(){return this._jsCode}


	static tsToJs(tsCode:string){
		return compileTs(tsCode, {
			target: 99
			,module: 99
		})
		// const tsconfig = readTsConfig()
		// return compileTs(tsCode, tsconfig)
	}

	/**
	 * //TODO test
	 * @param str 
	 * @returns 
	 */
	static rmDeleteTag(str:string){
		const start = `<@delete>`
		const end = `</@delete>`
		const reg = new RegExp(start+'.+'+end, 'gms')
		let ans = str.replace(reg, '')
		return ans
	}


	process(str:string){
		const z = this
		let ans = str
		ans = C.rmDeleteTag(ans)
		ans = C.tsToJs(ans).outputText
		return ans
	}
	

	parse(){
		const z = this
		const jsCode = z.process(z.src)
		const fn = new Function('L' ,jsCode)
		return ()=>{
			return fn(L)
		}
		// return ()=>{
		// 	eval(jsCode)
		// }
	}
}

const C = WeightCodeParser
type  C = WeightCodeParser