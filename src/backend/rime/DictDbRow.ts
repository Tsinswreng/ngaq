import { DictLine } from "./dictTsv"

class Col{
	static readonly id='id'
	static readonly dict_name = 'dict_name'
	static readonly text = 'text'
	static readonly code = 'code'
}
export class DbRow{
	// static readonly id='id'
	// static readonly text = 'text'
	// static readonly code = 'code'

	static readonly col=Col
	id?:int //自增主鍵、從數據庫取數據旹當非空
	dict_name:str
	text:str
	code:str
	protected constructor(){}

	/**
	 * //TODO const [text, code] = v.split('\t') 列ʹ順序ˋ未必如是
	 * @deprecated
	 * @param lines 正文ʹ行、不含元數據
	 * @returns 
	 */
	static linesToDbRows(lines:DictLine[], name:str){
		const valids = lines.map(e=>e.processedText())
		const dbRows = [] as DbRow[]
		for(const v of valids){
			if(v == void 0 || v === ''){continue}
			const [text, code] = v.split('\t') //TODO
			const row:DbRow = {
				dict_name: name
				,text:text
				,code:code
			}
			dbRows.push(row)
		}
		return dbRows
	}
}