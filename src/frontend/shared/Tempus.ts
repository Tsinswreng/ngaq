import dayjs, { Dayjs } from "dayjs"

/* export interface ITempus{
	static rely: any
} */

export default class Tempus{
	
	public static readonly rely = dayjs
	public static ISO8601FULLdATEfORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
	public static REGEXPoFiSO8601FULLdATEfORMAT_ZERO = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'

	public constructor(date?:string, format?:string){
		this._time = JSON.parse(JSON.stringify(Tempus.rely(date, format))) //<坑>{若 外ʸ不套JSON.parse() 則會多一對雙引號}
	}
	//private _tempus: dayjs.Dayjs = dayjs()
	private _time:string
	;public get time(){return this._time;};

	/* public format(f=Tempus.ISO8601FULLdATEfORMAT){
		return this.tempus.format(f)
	} */

	public static toISO8601(tempus:Tempus){
		//return JSON.stringify(this._tempus)
		return tempus.time
	}

	

}