import SingleWord2 from "@shared/SingleWord2"
import Tempus from "@shared/Tempus";
import { WordEvent, Priority } from "@shared/SingleWord2";
import { lastOf } from "@shared/Ut";


/**/
export default class WordB{

	constructor(private _fw:SingleWord2) {

	}

	/**
	 * father word 原 單詞對象。此處取組合洏舍繼承。
	 */
	;public get fw(){return this._fw;};

	private _priority: Priority = new Priority()
	;public get priority(){return this._priority;};


	private _sortedTempus_eventInsts = SingleWord2.getSortedDateToEventObjs(this.fw)
	;public get sortedTempus_eventInsts(){return this._sortedTempus_eventInsts;};

	/**
	 * 背單詞旹此詞ˋ在ᵗ序
	 */
	private _appearNo?:number
	;public get appearNo(){return this._appearNo;};;public set appearNo(v){this._appearNo=v;};

	/**
	 * 詞ˇ背ᵗ程中 遇事件旹新錄ᵗ日期。 安全起見 不直ᵈ加于原ᵗ詞ᵗ對象ᵗ日期。
	 */
	private _neoDates_rmb:Tempus[] = []
	;public get neoDates_rmb(){return this._neoDates_rmb;};

	private _neoDates_fgt:Tempus[] = []
	;public get neoDates_fgt(){return this._neoDates_fgt;};;public set neoDates_fgt(v){this._neoDates_fgt=v;};

	public mergeDates(){
		const handle = (dates:Tempus[], toMerged:Tempus[])=>{
			dates.push(...toMerged); toMerged.length = 0
		}
		handle(this.fw.dates_rmb, this.neoDates_rmb)
		handle(this.fw.dates_fgt, this.neoDates_fgt)


	}

	public calcPrio(){
		this.priority.calcPrio0(this.fw)
	}
//✅🟢🥵😡🐸😍🥰😋😊
	public getEventSymbols(add='😋',rmb='✅',fgt='❌'){
		const dateToEventObjs = this.sortedTempus_eventInsts
		let result = ''
		for(const obj of dateToEventObjs){
			switch (obj.event){
				case WordEvent.ADD: result+=add;break;
				case WordEvent.RMB: result+=rmb;break;
				case WordEvent.FGT: result+=fgt;break;
			}
		}
		return result
	}

	public static getSimplifiedDate(tempus:Tempus):string
	public static getSimplifiedDate(tempus:Tempus[]):string[]
	
	public static getSimplifiedDate(tempus:Tempus|Tempus[]){
		if(Array.isArray(tempus)){
			return tempus.map((e)=>{return f(e)})
		}else{
			return f(tempus)
		}

		function f(t:Tempus){
			return Tempus.format(t, 'YYMMDD')
		}
	}


	public static getLastRvwDate_simplified(wb:WordB){
		return WordB.getSimplifiedDate(lastOf(wb.sortedTempus_eventInsts).tempus)
	}public getLastRvwDate(){
		return WordB.getLastRvwDate_simplified(this)
	}

	public static getAddDates(wb:WordB){
		return WordB.getSimplifiedDate(wb.fw.dates_add)
	}public getAddDates(){
		return WordB.getAddDates(this)
	}




}
