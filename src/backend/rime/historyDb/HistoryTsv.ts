import type { I_readN } from "@shared/Type"
import { Line } from "../Line"
import { Tsv, Status } from "../Tsv"
import { Belong, HistoryDbRow } from "./HistoryDbRow"
import { $, $a } from "@shared/Ut"

export class LineParseErr{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof LineParseErr.new>){
		const z = this
		z._err = args[0]
		z._line = args[1]
		return z
	}

	static new(err:Error, line:Line){
		const z = new this()
		z.__init__(err, line)
		return z
	}

	protected _err:Error
	get err(){return this._err}
	protected set err(v){this._err = v}

	protected _line
	get line(){return this._line}
	protected set line(v){this._line = v}
	
	
}


class HistoryTsvStatus extends Status{
	in_meta = false
	in_body = false
}

class LineType{
	meta?:bool
}

export class HistoryLine extends Line{

	static metaMark = '/'

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

	type = new LineType()

	static kvSeperator = '\t'

	static toDbRow(line:HistoryLine, belong:Belong){
		try {
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
				[c.text]: $(ar[0])
				,[c.belong]: belong
				,[c.cnt]: $n(ar[1])
				,[c.modifiedTime]: $n(ar[2])
				,[c.createdTime]: $n(ar[3])
			}
			return ans
		} catch (error) {
			if(error instanceof Error){
				const parErr = LineParseErr.new(error, line)
				throw parErr
			}else{
				throw error
			}
		}

	}
	toDbRow(belong:Belong){
		return HistoryLine.toDbRow(this, belong)
	}
	
	//get This(){return CommitHistoryLine}
}




export class HistoryTsv extends Tsv{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof HistoryTsv.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args:Parameters<typeof Tsv.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	get This(){return HistoryTsv}

	//protected _readNObj:I_readN<Promise<str[]>>
	get readNObj(){return this._readNObj}
	protected set readNObj(v){this._readNObj = v}


	protected _status = new HistoryTsvStatus()
	get status(){return this._status}
	protected set status(v){this._status = v}
	

	protected override handleLine(lineTxt: str): HistoryLine {
		const z = this
		z.linePos++
		const ans = HistoryLine.new(lineTxt, z.linePos)
		if(lineTxt.startsWith(HistoryLine.metaMark)){
			ans.type.meta = true
		}
		return ans
	}

	override async readLines(num: int): Promise<HistoryLine[]> {
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
