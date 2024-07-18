import * as _ENV from '@shared/WordWeight/weightEnv'
import type { I_WordWeight } from '@shared/interfaces/I_WordWeight3'

export class OldWeightCodeParser{
	static parse(jsCode:string): (()=>I_WordWeight)|undefined{
		const fn = new Function('_ENV', jsCode)
		return ()=>{
			return fn(_ENV)
		}
	}
}