import * as _ENV from '@shared/WordWeight/_lib'
import type { I_WordWeight } from '@shared/interfaces/I_WordWeight'

export class WeightCodeParser{
	static parse(jsCode:string): (()=>I_WordWeight)|undefined{
		const fn = new Function('_ENV', jsCode)
		return ()=>{
			return fn(_ENV)
		}
	}
}