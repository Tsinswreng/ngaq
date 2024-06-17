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
	public static readonly ISO8601FULL_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
	public static readonly REGEXP_ISO8601FULL_DATE_FORMAT_ZERO = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'


	public static new(date?:string|number|bigint, format?:string){
		const o = new this()
		if(typeof date === 'bigint'){
			date = Number(date) // 
		}
		o._value = Tempus.rely(date).valueOf()
		return o
	}

	// public static new(date?:string|number|bigint, format?:string){
	// 	const o = new this()
	// 	if(typeof date === 'bigint'){
	// 		date = Number(date) // 
	// 	}
	// 	o._iso = JSON.parse(JSON.stringify(Tempus.rely(date, format))) //<坑>{若 外ʸ不套JSON.parse() 則會多一對雙引號}
	// 	if(o.iso === null){
	// 		console.error(Tempus.rely);console.error(date);console.error(format)
	// 		throw new Error(`date format is not proper`)
	// 	}
	// 	return o
	// 	// if(!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)){
	// 	// 	throw new Error(`!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)`)
	// 	// }
	// }

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
	//protected _iso:string = ''
	get iso(){return Tempus.toISO8601(this)};
	protected _value:int
	public static toISO8601(tempus:Tempus){
		//return tempus.iso
		//return JSON.stringify(Tempus.rely(tempus._value))
		return Tempus.rely(tempus._value).toISOString()
	}

	private static toRelyObj(tempus:Tempus){
		//return Tempus.rely(tempus.iso)
		return Tempus.rely(tempus._value)
	}

	public static format(tempus:Tempus, format=Tempus.ISO8601FULL_DATE_FORMAT){
		//return Tempus.rely(tempus.iso).format(format)
		return Tempus.rely(tempus._value).format(format)
	}

	// public static diff_mills(a:Tempus, b:Tempus){
	// 	let oa = Tempus.toRelyObj(a); let ob = Tempus.toRelyObj(b)
	// 	return oa.diff(ob, 'milliseconds')
	// }

	static diff_mills(a:Tempus, b:Tempus){
		return a._value - b._value
	}

	/** @deprecated */
	public static getSort(tempi:Tempus[]){
		let copy = tempi.slice()
		copy.sort((a,b)=>{return Tempus.diff_mills(a,b)})
		return copy
	}

	public static numberStr(tempus:Tempus){
		return Tempus.format(tempus, 'YYYYMMDDHHmmssSSS')
	}

	/**
	 * millis
	 */
	public static toUnixTime_mills(tempus:Tempus):number
	public static toUnixTime_mills(tempus:Tempus, type:'number'):number
	public static toUnixTime_mills(tempus:Tempus, type:'bigint'):bigint
	public static toUnixTime_mills(tempus:Tempus, type:'number'|'bigint'='number'){
		if(type === 'bigint'){
			//return BigInt(this.rely(tempus.iso).valueOf())
			return BigInt(tempus._value)
		}else{
			//return this.rely(tempus.iso).valueOf()
			return tempus._value
		}
	}

}