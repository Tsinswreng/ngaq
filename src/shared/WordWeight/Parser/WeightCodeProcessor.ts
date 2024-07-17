import { I_WordWeight } from '@shared/interfaces/I_WordWeight3'
import { compileTs, readTsConfig } from '@shared/Ut'
import * as _ENV from '@shared/WordWeight/weightEnv'


export class WeightCodeProcessor{
	protected constructor(){}
	static new(src:string){
		const z = new this()
		z.__init__(src)
		return z
	}
	protected __init__(...param:Parameters<typeof WeightCodeProcessor.new>){
		const z = this
		z._src = param[0]
	}

	get This(){return WeightCodeProcessor}

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


	static process(str:string){
		let ans = str
		ans = C.rmDeleteTag(ans)
		ans = C.tsToJs(ans).outputText
		return ans
	}
	
	/**
	 * //TODO 傳入 權重參數
	 */
	parse(): (()=>I_WordWeight)|undefined
	{
		const z = this
		const jsCode = C.process(z.src)
		z._jsCode = jsCode
		try {
			const fn = new Function('_ENV' ,jsCode)
			return ()=>{
				return fn(_ENV)
			}
		} catch (error) {
			console.error(error)
			console.error(jsCode)
		}
		
		// return ()=>{
		// 	eval(jsCode)
		// }
	}
}

const C = WeightCodeProcessor
type  C = WeightCodeProcessor