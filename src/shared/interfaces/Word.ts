import {Word} from '@shared/entities/Word/Word'
import Tempus from '@shared/Tempus'
/**
 * 單詞表中每列的列名。蔿 保持統一 和 方便改名 、sql語句中通過此類中的列名常量間接訪問類名而非直接用寫死的字符串字面量
 * 畀表增字段: 改VocaTableColumnName, 改IVocaRow, 改SingleWord2字段, 改SingleWord2構造器, 改 創表之sql函數, 改 parse與stringfy, VocaRaw2ʸ改getWordInWordUnit, 改ᵣ既存ᵗ表, 同步 shared
 */

/**
 * 㕥約束數據庫ᵗ表中ᵗ行
 * 原ᵗ VocaTableColumnName 與 IVocaRow皆由此代。
 */
export class VocaDbTable{
	public static readonly id='id'
	public static readonly wordShape='wordShape'
	public static readonly variant = 'variant'
	public static readonly pronounce='pronounce'
	public static readonly mean='mean'
	public static readonly annotation='annotation'
	public static readonly tag='tag'
	public static readonly times_add='times_add'
	public static readonly dates_add='dates_add'
	public static readonly times_rmb='times_rmb'
	public static readonly dates_rmb='dates_rmb'
	public static readonly times_fgt='times_fgt'
	public static readonly dates_fgt='dates_fgt'
	public static readonly table='table' //此字段ˋ實ˋ不存。
	public static readonly source='source'
	/**
	 * 私有構造器。若需創對象則:
	 * const o : ClassName = {在此逐個字段賦值} 不推薦
	 */
	private constructor(
		public table:string //數據庫中本無此字段、㕥存表名。
		,public wordShape:string
		//,public variant:string
		,public pronounce:string
		,public mean:string
		,public annotation:string //
		,public tag:string
		,public times_add:number|string
		,public dates_add:string
		,public times_rmb:number|string
		,public dates_rmb:string
		,public times_fgt:number|string
		,public dates_fgt:string
		,public source:string
		,public id?:number|string //從數據庫中取數據時id必不潙空
	){}


	/**
	 * 把SingWord2單詞對象轉成IVocaRow對象
	 * @param sw 
	 * @param ignoredKeys 忽略之字段
	 */
	public static toPlain(sw:Word, ignoredKeys?:string[]):IVocaRow
	public static toPlain(sw:Word[], ignoredKeys?:string[]):IVocaRow[]

	public static toPlain(sw:Word|Word[]){
		if(Array.isArray(sw)){
			return sw.map(e=>soloFieldStringfy(e))
		}else{
			return soloFieldStringfy(sw)
		}

		function soloFieldStringfy(sw:Word, ignoredKeys?:string[]):IVocaRow{
			const sf = JSON.stringify
			let result:IVocaRow = {
				id:sw.id,
				table:sw.table,
				wordShape:sw.wordShape
				//variant: sf(sw._variant)
				,pronounce: sf(sw.pronounce),
				mean:JSON.stringify(sw.mean),
				annotation:sf(sw.annotation),
				tag: sf(sw.tag),
				dates_add:stringfyDateArr(sw.dates_add),
				times_add:sw.times_add,
				dates_rmb:stringfyDateArr(sw.dates_rmb),
				times_rmb:sw.times_rmb,
				dates_fgt:stringfyDateArr(sw.dates_fgt),
				times_fgt:sw.times_fgt,
				source: sf(sw.source)
			}
			if(ignoredKeys !== void 0){
				for(const k of ignoredKeys){
					delete result[k]
				}
			}
			return result
	
			function stringfyDateArr(dates:Tempus[]){
				let strArr:string[] = dates.map(e=>Tempus.toISO8601(e))
				// for(const d of dates){
				// 	let t = Tempus.toISO8601(d)
				// 	strArr.push(t)
				// }
				return JSON.stringify(strArr)
			}
	
		}

	}

	/**
	 * 把IVocaRow單詞對象轉成SingWord2對象
	 * @param obj 
	 * @returns 
	 */
	public static toEntity(obj:IVocaRow):Word
	public static toEntity(obj:IVocaRow[]):Word[]

	public static toEntity(obj:IVocaRow|IVocaRow[]){
		if(Array.isArray(obj)){
			return obj.map(e=>soloParse(e))
		}else{
			return soloParse(obj)
		}

		function soloParse(obj:IVocaRow){
			const num = (n:number|string|undefined)=>{
				if(typeof n === 'string'){
					return parseFloat(n)
				}
				return n
			}
			let sw:Word
			try{
				const ps = JSON.parse
				sw = new Word({
					id:num(obj.id)
					,wordShape:obj.wordShape
					//,variant: ps(obj.variant)
					,pronounce: JSON.parse(obj.pronounce),
					mean:JSON.parse(obj.mean),
					annotation:JSON.parse(obj.annotation),
					tag:JSON.parse(obj.tag) as string[],
					table:obj.table,
					dates_add:parseDateJson(obj.dates_add),
					dates_rmb : parseDateJson(obj.dates_rmb),
					dates_fgt : parseDateJson(obj.dates_fgt),
					source: JSON.parse(obj.source) 
				})
	
				return sw
	
				function parseDateJson(datesStr:string){
					let strArr:string[] = JSON.parse(datesStr)
					if(!Array.isArray(strArr)){
						throw new TypeError(`!Array.isArray(strArr)`)
					}
					return strArr.map(e=>Tempus.new(e))
				}
	
			}catch(e){
				console.error(`console.error(obj)`);console.error(obj);console.error(`/console.error(obj)`)
				console.error(`console.error(e)`);console.error(e);console.error(`/console.error(e)`)
			}
			throw new Error() //怎麼寫在外面
			
		}

	}

}
export type IVocaRow = VocaDbTable