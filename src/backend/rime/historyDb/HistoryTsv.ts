import type { I_readN } from "@shared/Type"
import { Line } from "../Line"
import { Tsv } from "../Tsv"
import { HistoryDbRow } from "./HistoryDbRow"
import { $a } from "@shared/Ut"

class ParseErr extends Error{

}


export class HistoryLine extends Line{
	protected constructor(){
		super()
	}
	protected __init__(...args: Parameters<typeof HistoryLine.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args: Parameters<typeof Line.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	static kvSeperator = '\t'

	static toDbRow(line:HistoryLine){
		const $n = (s:str)=>{
			const num = parseInt(s)
			if(!isFinite(num)){
				throw new Error(`\n${s}\n!isFinite(num)`)
			}
			return num
		}
		const z = this
		const ar = line.rawText.split(z.kvSeperator)
		const c = HistoryDbRow.col
		const ans:HistoryDbRow = {
			[c.text]: $a(ar[0])
			,[c.cnt]: $n(ar[1])
			,[c.modifiedTime]: $n(ar[2])
			,[c.createdTime]: $n(ar[3])
		}
		return ans
	}
	toDbRow(){
		return HistoryLine.toDbRow(this)
	}
	
	//get This(){return CommitHistoryLine}
}

export class HistoryTsv extends Tsv{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof HistoryTsv.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return HistoryTsv}

	//protected _readNObj:I_readN<Promise<str[]>>
	get readNObj(){return this._readNObj}
	protected set readNObj(v){this._readNObj = v}

	protected override handleLine(lineTxt: str): HistoryLine {
		const z = this
		z.linePos++
		const ans = HistoryLine.new(lineTxt, z.linePos)
		return ans
	}

	override async readLines(num: int): Promise<Line[]> {
		const z = this
		const strArr = await z.readNObj.read(num)
		if(strArr ==void 0 || strArr.length === 0){
			return []
		}
		const ans = [] as HistoryLine[]
		for(const str of strArr){
			const ua = z.handleLine(str)
			ans.push(ua)
		}
		return ans
	}
	
}
