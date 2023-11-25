//import dayjs, { Dayjs } from "dayjs"
import moment from "moment"


/* export interface ITempus{
	static rely: any
} */

/**
 * 手動封裝ᵗ類、㕥存日期時間。
 * 蔿省內存、此類ᵗ實例只有一 字串ᵗ形ᵗ屬性ˉ_time。餘ᵗ方法ˋ皆靜態。
 */
export default class Tempus{
	
	private static readonly rely = moment
	public static ISO8601FULLdATEfORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
	public static REGEXPoFiSO8601FULLdATEfORMAT_ZERO = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'

	public static new(date?:string|number, format?:string){
		const o = new this()
		o._iso = JSON.parse(JSON.stringify(Tempus.rely(date, format))) //<坑>{若 外ʸ不套JSON.parse() 則會多一對雙引號}
		if(o.iso === null){
			console.error(Tempus.rely);console.error(date);console.error(format)
			throw new Error(`date format is not proper`)
		}
		return o
		// if(!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)){
		// 	throw new Error(`!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)`)
		// }
	}

	private constructor(){}

	// public constructor(date?:string|number, format?:string){
	// 	this._iso = JSON.parse(JSON.stringify(Tempus.rely(date, format))) //<坑>{若 外ʸ不套JSON.parse() 則會多一對雙引號}
	// 	if(this.iso === null){
	// 		console.error(Tempus.rely);console.error(date);console.error(format)
	// 		throw new Error(`date format is not proper`)
	// 	}
	// 	// if(!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)){
	// 	// 	throw new Error(`!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)`)
	// 	// }
	// }

	/**
	 * 形如'YYYY-MM-DDTHH:mm:ss.SSSZ'。用中時區。
	 */
	private _iso:string = ''
	;public get iso(){return this._iso;};

	public static toISO8601(tempus:Tempus){
		return tempus.iso
	}

	private static toRelyObj(tempus:Tempus){
		return Tempus.rely(tempus.iso)
	}

	public static format(tempus:Tempus, format=Tempus.ISO8601FULLdATEfORMAT){
		return Tempus.rely(tempus.iso).format(format)
	}

	public static diff_mills(a:Tempus, b:Tempus){
		let oa = Tempus.toRelyObj(a); let ob = Tempus.toRelyObj(b)
		return oa.diff(ob, 'milliseconds')
	}

	public static getSort(tempi:Tempus[]){
		let copy = tempi.slice()
		copy.sort((a,b)=>{return Tempus.diff_mills(a,b)})
		return copy
	}

	public static numberStr(tempus:Tempus){
		return Tempus.format(tempus, 'YYYYMMDDHHmmssSSS')
	}

	public static toUnixTime(tempus:Tempus){
		return this.rely(tempus.iso).valueOf()
	}

}