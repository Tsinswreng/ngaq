import type { Belong, HistoryDbRow } from "./HistoryDbRow";
import type {I_readN} from '@shared/Type'

import { mkReadN } from "../mkTsvInst";
import { HistoryTsv ,HistoryLine } from "./HistoryTsv";

export class MkReadNRow implements I_readN<Promise<HistoryDbRow[]>>{


	protected constructor(){}
	protected __init__(...args: Parameters<typeof MkReadNRow.new>){
		const z = this
		z._path = args[0]
		z._belong = args[1]
		z._readNStr = mkReadN(z.path)
		z._tsv = HistoryTsv.new(z.readNStr)
		return z
	}

	static new(path:str, belong:Belong){
		const z = new this()
		z.__init__(path, belong)
		return z
	}

	protected _path:str
	get path(){return this._path}
	protected set path(v){this._path = v}
	

	protected _readNStr: ReturnType<typeof mkReadN>
	get readNStr(){return this._readNStr}
	protected set readNStr(v){this._readNStr = v}

	protected _tsv:HistoryTsv
	get tsv(){return this._tsv}
	protected set tsv(v){this._tsv = v}

	protected _belong:Belong
	get belong(){return this._belong}
	protected set belong(v){this._belong = v}
	
	
	async readN(n: int): Promise<HistoryDbRow[]> {
		const z = this
		const lines = await z.tsv.readLines(n)
		const ans = [] as HistoryDbRow[]
		for(const line of lines){
			if(line.type.meta != true){
				ans.push(line.toDbRow(z.belong))
			}
		}
		return ans
	}
	
}






