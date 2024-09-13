import {Level, Iterator} from 'level'
import type { Pair } from '@shared/Type'
import type { I_GetN } from '@shared/IF/StreamIf'
import { I_LdbIter } from './I_LdbIter'
type TPair = Pair<str,str>

export class LdbIter implements I_LdbIter{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof LdbIter.new>){
		const z = this
		z.ldb = args[0]
		z.iter = z.ldb.iterator()
		return z
	}

	static new(ldb: Level){
		const z = new this()
		z.__init__(ldb)
		return z
	}

	get This(){return LdbIter}
	protected _ldb:Level
	get ldb(){return this._ldb}
	protected set ldb(v){this._ldb = v}

	protected _iter: Iterator<Level<str, str>,str,str>
	get iter(){return this._iter}
	protected set iter(v){this._iter = v}

	protected _pos = 0
	get pos(){return this._pos}
	protected set pos(v){this._pos = v}

	async GetN(n: int){
		const z = this
		const ans = [] as TPair[]
		for(let i = 0; i < n; i++){
			const ua = await z.iter.next()
			if(ua == void 0){
				break
			}
			ans.push(ua)
		}
		z.pos += n
		return ans
	}
	

	reset() {
		this.iter = this.ldb.iterator()
		this.pos = 0
	}
	
}


// const ldb = new Level('')
// const iter = ldb.iterator()
// for(;;){
//   const item = await iter.next()
// }
