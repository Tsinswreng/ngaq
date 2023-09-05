import { IVocaRow } from "@shared/SingleWord2"
import Ut from "@shared/Ut"
import moment from "moment"
/**
 * 舊版ᵗ詞表
 */
export interface Old_IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	fullComments:string[]
	//annotation:string //
	addedTimes:number
	addedDates:string[]
	reviewedDates:string[] //皆 空數組也
	reviewedTimes:number // 皆 0
	rememberedTimes:number
	rememberedDates:string[]
	forgottenTimes:number
	forgottenDates:string[]
}

export default class ParseOld{
	/**
	 * 舊對象轉新對象
	 * @param objs 
	 * @returns 
	 */
	public static parseOldObj(objs:Old_IVocaRow[]){

		let lingMap = new Map([
			['eng', 'english'],
			['jap', 'japanese'],
		])

		const r:IVocaRow[]=[]
		for(const e of objs){
			const t = parseOne(e)
			r.push(t)
		}
		return r

		function parseOne(obj:Old_IVocaRow){
			let neo:IVocaRow = {
				id:obj.id,
				ling:Ut.nng(lingMap.get(obj.ling)),
				wordShape:obj.wordShape,
				mean:JSON.stringify(obj.fullComments),
				annotation:'[]',
				tag: '[]',
				dates_add: convertDate(obj.addedDates),
				dates_rmb: convertDate(obj.rememberedDates), 
				dates_fgt: convertDate(obj.forgottenDates),
				times_add: obj.addedTimes,
				times_rmb: obj.rememberedTimes,
				times_fgt: obj.forgottenTimes
			}

			return neo
		}

		//YYYYMMDDHHmmss 字串數組 轉 JSON格式ᵗ YYYY.MM.DD-HH:mm:ss.SSS 數字數組
		function convertDate(old:string[]){
			//let neo = Ut.convertDateFormat(old, 'YYYYMMDDHHmmss', 'YYYYMMDDHHmmssSSS')
			//return JSON.stringify(neo)
			let neo:string[] = []
			for(const e of old){
				let n = moment(e, 'YYYYMMDDHHmmss').format('YYYY.MM.DD-HH:mm:ss.SSS')
				neo.push(n)
			}
			return JSON.stringify(neo)
		}

		/* //YYYYMMDDHHmmss 字串數組 轉 JSON格式ᵗ YYYYMMDDHHmmssSSS 數字數組
		function deprecated_convertDate(old:string[]){
			//let neo = Ut.convertDateFormat(old, 'YYYYMMDDHHmmss', 'YYYYMMDDHHmmssSSS')
			//return JSON.stringify(neo)
			let neo:string[] = []
			for(const e of old){
				let n = parseInt(e)
				n *= 1000
				neo.push(n+'')
			}
			return JSON.stringify(neo)
		} */

	}
}