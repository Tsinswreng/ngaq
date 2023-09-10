import SingleWord2 from "@shared/SingleWord2"
import Tempus from "@shared/Tempus";
import { WordEvent } from "shared/SingleWord2";


export default class WordB{

	constructor(private _fw:SingleWord2) {

	}

	/**
	 * father word 原 單詞對象。此處取組合洏舍繼承。
	 */
	;public get fw(){return this._fw;};

	private _priority: number = 0
	;public get priority(){return this._priority;};

	//private _date_eventMap


	public calcPrio(){
		return 0
	}

	public static getEventSymbols(){

	}

	public static calcPrio(){

	}

}

class Procedure{

}

class Priority{



	public static calcPrio0(wb:WordB){
		const nunc = new Tempus()
		let prio0 = 0
		const dateToEventObjs = SingleWord2.getSortedDateToEventObjs(wb.fw)
		for(const dateToEvent of dateToEventObjs){
			switch (dateToEvent.v){
				case WordEvent.ADD:
					;break;
				case WordEvent.RMB:;break;
				case WordEvent.FGT:;break
				default: throw new Error('default');
			}
		}

		function add(prio0){
			
		}

	}
	
	/**
	 * 由時間跨度(毫秒)算時間ᵗ權重
	 * @param dateDif 
	 * @returns 
	 */
	public static getDateWeight(dateDif:number/* , denominator:number=60 */):number{
		let result = (1/25)*Math.pow(dateDif, 1/2)
		if(result <= 1){
			result = 1.01;
		}
		return result;
	}
}