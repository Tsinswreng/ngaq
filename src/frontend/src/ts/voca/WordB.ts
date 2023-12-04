import SingleWord2 from "@shared/SingleWord2"
import Tempus from "@shared/Tempus";
import { WordEvent, Priority } from "@shared/SingleWord2";
import { lastOf, $a } from "@shared/Ut";

//459 323 127 88 126
/**/
export default class WordB{

	constructor(private _fw:SingleWord2) {
		
	}


	/**
	 * father word 原 單詞對象。此處取組合洏舍繼承。
	 */
	;public get fw(){return this._fw;};

	/**
	 * 出詞權重對象
	 */
	private _priority: Priority = Priority.newChild()
	;public get priority(){return this._priority;};

	/**
	 * 升序ᵗ 日期對事件 ˉ對象
	 */
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

	public static toWordB(sws:SingleWord2[]){
		return sws.map((e)=>{return new WordB(e)})
	}

	/**
	 * 背單詞 終後新增ᵗ日期與事件ˇ併入舊ᵗ數組
	 */
	public mergeDates(){
		const handle = (dates:Tempus[], toMerged:Tempus[])=>{
			dates.push(...toMerged); toMerged.length = 0
		}
		handle(this.fw.dates_rmb, this.neoDates_rmb)
		handle(this.fw.dates_fgt, this.neoDates_fgt)


	}

	/**
	 * 算ᵣ初權重
	 */
	public calcPrio(){
		this.priority.calcPrio0(this.fw)
	}
//✅🟢🥵😡🐸😍🥰😋😊

	/**
	 * 符號化ˢ @see sortedTempus_eventInsts ᵗ單詞事件
	 * @param add 
	 * @param rmb 
	 * @param fgt 
	 * @returns 
	 */
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

	public getEventSymbolCnt(add='😋',rmb='✅',fgt='❌'){
		const cntObj = this.countWordEvents()
		//let result = `${add}*${cntObj.add} `+`${rmb}*${cntObj.rmb} `+`${fgt}*${cntObj.fgt}`
		let result = cntObj.add+':'+cntObj.rmb+':'+cntObj.fgt
		return result
	}

	/**
	 * 取 三事件ᵗ數
	 * @returns 
	 */
	public countWordEvents(){
		const dateToEventObjs = this.sortedTempus_eventInsts
		const result = {
			add:0,rmb:0,fgt:0
		}
		for(const obj of dateToEventObjs){
			switch (obj.event){
				case WordEvent.ADD: result.add++;break;
				case WordEvent.RMB: result.rmb++;break;
				case WordEvent.FGT: result.fgt++;break;
			}
		}
		return result
	}



	/**
	 * 簡化ˢ日期ᵗ示 如YYMMDD
	 * @param tempus 
	 */
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

	/**
	 * 取ᵣ詞ˇ背ᵗ簡化後ᵗ日期芝末者
	 * @param wb 
	 * @returns 
	 */
	public static getLastRvwDate_simplified(wb:WordB){
		return WordB.getSimplifiedDate(lastOf(wb.sortedTempus_eventInsts).tempus)
	}public getLastRvwDate(){
		return WordB.getLastRvwDate_simplified(this)
	}


	/**
	 * 取 簡化後之添ᵗ日期
	 * @param wb 
	 * @returns 
	 */
	public static style_getAddDates(wb:WordB){
		return WordB.getSimplifiedDate(wb.fw.dates_add)
	}public style_getAddDates(){
		return WordB.style_getAddDates(this)
	}

	/**
	 * 取ᵣ字串數組ᵗ最長者
	 * @param strArr 
	 * @returns 
	 */
	public static longest(strArr:string[]):string|undefined{
		//nna(strArr)
		if(strArr.length === 0){return void 0}
		let max = strArr[0]
		for(const s of strArr){
			if(s.length > max.length){max = s}
		}
		return max
	}

	/**
	 * 取ᵣ格式化˪ᵗ詞義。詞義數組擇其最長者、其連續ᵗ換行符ᵘ、只取其末者、餘者ˇ皆換作'\\n'
	 */
	public get formattedMean(){
		let mean = this.fw.mean
		let longest = WordB.longest(mean)
		let r = longest??''
		//r = r.replace(/\r\n/gm,'\n')
		//r = r.replace(/\n{2,}/gm, '\\n\n')
		r=r.replace(/([^\n])\n([^\n])/g, '$1\r$2')
		r=r.replace(/(\n+)(\n)/g, '$1\r')
		r=r.replace(/\n/g, '\\n')
		r=r.replace(/\r/g, '\n')
		//console.log(r)//t
		//console.log(114514)
		return r
	}


}
