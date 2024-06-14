import type { I_readN } from "@shared/Type"
import { Line } from "./Line"


export class Status{
	end = false
	linePos = -1
}

export class Tsv{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tsv.new>){
		const z = this
		z._readNObj = args[0]
		return z
	}

	static new(readNObj:I_readN<Promise<str[]>>){
		const z = new this()
		z.__init__(readNObj)
		return z
	}

	get This(){return Tsv}

	protected _readNObj:I_readN<Promise<str[]>>
	get readNObj(){return this._readNObj}
	protected set readNObj(v){this._readNObj = v}

	/** 當前処理ʹ行號 */
	//protected _linePos = -1
	get linePos(){return this.status.linePos}
	protected set linePos(v){this.status.linePos = v}

	protected _status
	get status(){return this._status}
	protected set status(v){this._status = v}
	

	async readLines(num:int){
		const z = this
		const lines = await z.readNObj.read(num)
		if(lines == void 0 || lines.length === 0){
			z.status.end = true
			return []
		}
		const ans:Line[] = []
		for(const lineTxt of lines){
			if(lineTxt == void 0){continue}
			const ua = z.handleLine(lineTxt)
			ans.push(ua)
		}
		return ans
	}

	protected handleLine(lineTxt:str):Line{
		const z = this
		z.linePos++
		const ans = Line.new(lineTxt, z.linePos)
		return ans
	}
	
}