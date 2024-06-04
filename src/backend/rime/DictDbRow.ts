import { Line } from "./tsv"

class Col{
	static readonly id='id'
	static readonly text = 'text'
	static readonly code = 'code'
}
export class DbRow{
	// static readonly id='id'
	// static readonly text = 'text'
	// static readonly code = 'code'

	static readonly col=Col
	id?:int //自增主鍵、從數據庫取數據旹當非空
	text:str
	code:str
	protected constructor(){}

	/**
	 * 
	 * @param lines 正文ʹ行、不含元數據
	 * @returns 
	 */
	static linesToDbRows(lines:Line[]){
		const valids = lines.map(e=>e.processedText())
		const dbRows = [] as DbRow[]
		for(const v of valids){
			if(v == void 0 || v === ''){continue}
			const [text, code] = v.split('\t')
			const row:DbRow = {
				text:text
				,code:code
			}
			dbRows.push(row)
		}
		return dbRows
	}
}