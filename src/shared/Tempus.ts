import dayjs, { Dayjs } from "dayjs"

/* export interface ITempus{
	static rely: any
} */

/**
 * 手動封裝ᵗ類、㕥存日期時間。
 * 蔿省內存、此類ᵗ實例只有一 字串ᵗ形ᵗ屬性ˉ_time。餘ᵗ方法ˋ皆靜態。
 */
export default class Tempus{
	
	private static readonly rely = dayjs
	public static ISO8601FULLdATEfORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
	public static REGEXPoFiSO8601FULLdATEfORMAT_ZERO = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'

	public constructor(date?:string, format?:string){
		this._time = JSON.parse(JSON.stringify(Tempus.rely(date, format))) //<坑>{若 外ʸ不套JSON.parse() 則會多一對雙引號}
		if(this.time === null){
			console.error(date);console.error(format)
			throw new Error(`date format is not proper`)
		}
		// if(!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)){
		// 	throw new Error(`!new RegExp('^'+Tempus.REGEXPoFiSO8601FULLdATEfORMAT_ZERO+'$').test(this.time)`)
		// }
	}

	/**
	 * 形如'YYYY-MM-DDTHH:mm:ss.SSSZ'。用中時區。
	 */
	private _time:string
	;public get time(){return this._time;};

	public static toISO8601(tempus:Tempus){
		return tempus.time
	}

	private static toRelyObj(tempus:Tempus){
		return Tempus.rely(tempus.time)
	}

	public static format(tempus:Tempus, format=Tempus.ISO8601FULLdATEfORMAT){
		return Tempus.rely(tempus.time).format(format)
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

}