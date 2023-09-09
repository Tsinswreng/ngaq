import dayjs, { Dayjs } from "dayjs"

/* export interface ITempus{
	static rely: any
} */


export default class Tempus{
	
	public static readonly rely = dayjs
	public static ISO8601FULLdATEfORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
	public static REGEXPoFiSO8601FULLdATEfORMAT_ZERO = '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z'

	public constructor(date?:string, format?:string){
		this._tempus = JSON.stringify(Tempus.rely(date, format))
	}
	//private _tempus: dayjs.Dayjs = dayjs()
	private _tempus:string

	//;public get tempus(){return this._tempus;};

	/* public format(f=Tempus.ISO8601FULLdATEfORMAT){
		return this.tempus.format(f)
	} */

	public toISO8601(){
		//return JSON.stringify(this._tempus)
		return this._tempus
	}

	

}