//import _ from 'lodash';
//export type { IVocaRow } from 'backend/VocaSqlite';
//import "reflect-metadata"
import Tempus from '@shared/Tempus';
import { $, div, lastOf, mapToObjArr, mul, simpleUnion } from '@shared/Ut';
//import _, { last } from 'lodash';
import Log from '@shared/Log'
import _ from 'lodash';

const l = new Log()
const Ut = {
	union : simpleUnion
};
/**
 * 㕥約束數據庫中的行
 */
export interface IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	table:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	pronounce:string
	mean:string
	annotation:string //
	tag:string
	times_add:number
	dates_add:string
	times_rmb:number
	dates_rmb:string
	times_fgt:number
	dates_fgt:string
	source:string
}

/* export class IVocaRow{
	public constructor(
		public ling:string //數據庫中本無此字段、㕥存表名。
		,public wordShape:string
		,public pronounce:string
		,public mean:string
		,public annotation:string //
		,public tag:string
		,public times_add:number
		,public dates_add:string
		,public times_rmb:number
		,public dates_rmb:string
		,public times_fgt:number
		,public dates_fgt:string
		,public source:string
		,public id?:number //從數據庫中取數據時id必不潙空
	){}
} */


/**
 * 單詞事件枚舉
 */
export enum WordEvent{
	ADD=0, // add
	RMB=1, // remember
	FGT=-1	// forget
}

export default class SingleWord2{

	/* public constructor(props:Partial<SingleWord2>&{ling:string, wordShape:string, mean:string[]}){
		Object.assign(this,props)
	} */

	/* public constructor(props:Required<SingleWord2>){
		Object.assign(this,props)
	} */

	/**
	 * 空例
	 */
	public static readonly example = new SingleWord2({
		table:'', wordShape: '', mean:[],dates_add:[]
	})

	/**
	 * 
	 * @param props 
	 */
	public constructor(props:{
		id?:number,
		table:string,
		wordShape:string,
		pronounce?:string[],
		mean:string[],
		tag?:string[],
		annotation?:string[],
		dates_add:Tempus[] 
		dates_rmb?:Tempus[]
		dates_fgt?:Tempus[]
		source?:string[]
	}){
		this._id=props.id
		this._table=props.table
		this._wordShape=props.wordShape
		this._pronounce = props.pronounce?.slice()??[]
		this._mean=props.mean.slice()
		this._annotation=props.annotation?.slice()??[]
		this._tag=props.tag?.slice()??[]
		this._dates_add=props.dates_add.slice()
		this._dates_rmb = props.dates_rmb?.slice()??[]
		this._dates_fgt = props.dates_fgt?.slice()??[]
		this._source = props.source?.slice()??[]
	}


	/**
	 * 所屬ᵗ表
	 */
	private _table:string = ''
	;public get table(){return this._table;};

	private _id?:number
	;public get id(){return this._id;};

	/**
	 * 詞形
	 */
	private _wordShape:string=''
	;public get wordShape(){return this._wordShape;};

	/**
	 * 意
	 */
	private _mean:string[] = []
	;public get mean(){return this._mean;};

	/**
	 * 音
	 */
	private _pronounce:string[] = []
	;public get pronounce(){return this._pronounce;};

	/**
	 * 用戶手動畀單詞加之註、在源txt詞表中用<<>>括着ᵗ部。
	 */
	private _annotation:string[] = []
	;public get annotation(){return this._annotation;};

	/**
	 * 標籤。用戶ˋ定ᶦ。可潙四六級詞之屬。
	 */
	private _tag:string[] = []
	;public get tag(){return this._tag;};

	/**
	 * 添ᵗ日期
	 */
	private _dates_add:Tempus[] = []
	;public get dates_add(){return this._dates_add;};

	/**
	 * 添ᵗ次
	 */
	;public get times_add(){
		return this.dates_add.length;
	}

	/**
	 * remember
	 */
	private _dates_rmb:Tempus[]=[]
	;public get dates_rmb(){return this._dates_rmb;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	/**
	 * forget
	 */
	private _dates_fgt:Tempus[] = []
	;public get dates_fgt(){return this._dates_fgt;};

	public get times_fgt(){
		return this.dates_fgt.length
	}

	/**
	 * ʃᙆ添。可潙書名等。
	 */
	private _source:string[] = []
	;public get source(){return this._source;};

	/**
	 * 把SingWord2單詞對象轉成IVocaRow對象
	 * @param sw 
	 * @param ignoredKeys 忽略之字段
	 */
	public static fieldStringfy(sw:SingleWord2, ignoredKeys?:string[]):IVocaRow
	public static fieldStringfy(sw:SingleWord2[], ignoredKeys?:string[]):IVocaRow[]

	public static fieldStringfy(sw:SingleWord2|SingleWord2[]){
		if(Array.isArray(sw)){
			const r:IVocaRow[] = []
			for(const e of sw){
				const p = soloFieldStringfy(e)
				r.push(p)
			}
			return r
		}else{
			return soloFieldStringfy(sw)
		}

		function soloFieldStringfy(sw:SingleWord2, ignoredKeys?:string[]):IVocaRow{
			let result:IVocaRow = {
				id:sw.id,
				table:sw.table,
				wordShape:sw.wordShape,
				pronounce: JSON.stringify(sw.pronounce),
				mean:JSON.stringify(sw.mean),
				annotation:JSON.stringify(sw.annotation),
				tag: JSON.stringify(sw.tag),
				dates_add:stringfyDateArr(sw.dates_add),
				times_add:sw.times_add,
				dates_rmb:stringfyDateArr(sw.dates_rmb),
				times_rmb:sw.times_rmb,
				dates_fgt:stringfyDateArr(sw.dates_fgt),
				times_fgt:sw.times_fgt,
				source: JSON.stringify(sw.source)
			}
			if(ignoredKeys !== void 0){
				for(const k of ignoredKeys){
					delete result[k]
				}
			}
			return result
	
			function stringfyDateArr(dates:Tempus[]){
				let strArr:string[] = []
				for(const d of dates){
					let t = Tempus.toISO8601(d)
					strArr.push(t)
				}
				return JSON.stringify(strArr)
			}
	
		}

	}

	// public toRowObj(){
	// 	return SingleWord2.fieldStringfy(this)
	// }

	/**
	 * 把IVocaRow單詞對象轉成SingWord2對象
	 * @param obj 
	 * @returns 
	 */
	public static parse(obj:IVocaRow):SingleWord2
	public static parse(obj:IVocaRow[]):SingleWord2[]

	public static parse(obj:IVocaRow|IVocaRow[]){
		if(Array.isArray(obj)){
			const r:SingleWord2[] = []
			for(const e of obj){
				const p = soloParse(e)
				r.push(p)
			}
			return r
		}else{
			return soloParse(obj)
		}

		function soloParse(obj:IVocaRow){
			let sw:SingleWord2
			try{
				sw = new SingleWord2({
					id:obj.id,
					wordShape:obj.wordShape,
					pronounce: JSON.parse(obj.pronounce),
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
					let strArr = JSON.parse(datesStr)
					const dates:Tempus[] = []
					for(const s of strArr){
						let d = new Tempus(s)
						dates.push(d)
					}
					return dates
				}
	
			}catch(e){
				console.error(`console.error(obj)`);console.error(obj);console.error(`/console.error(obj)`)
				console.error(`console.error(e)`);console.error(e);console.error(`/console.error(e)`)
			}
			throw new Error()
			
		}

	}


	/**
	 * 複製對象
	 * @param o 
	 */
	public static clone(o:SingleWord2):SingleWord2
	public static clone(o:IVocaRow):IVocaRow
	public static clone(o:SingleWord2|IVocaRow){
		if(o instanceof SingleWord2){
			return SingleWord2.parse(SingleWord2.fieldStringfy(o))
		}else{
			return SingleWord2.fieldStringfy(SingleWord2.parse(o))
		}
	}


	/**
	 * 合併兩個同詞形之單詞對象、id取前者。
	 * @param w1 
	 * @param w2 
	 * @returns 
	 */
	public static intersect(w1:SingleWord2, w2:SingleWord2){
		if(w1.wordShape!==w2.wordShape){
			console.error(w1);console.error(w2)
			throw new Error(`w1.wordShape !== w2.wordShape`)
		}
		if(w1.table!==w2.table){
			console.error(w1);console.error(w2)
			throw new Error(`w1.ling!==w2.ling`)
		}
		let o = new SingleWord2({
			id:w1.id,
			table:w1.table,
			wordShape:w1.wordShape,
			mean:Ut.union(w1.mean, w2.mean),
			annotation:Ut.union(w1.annotation, w2.annotation),
			tag:Ut.union(w1.tag, w2.tag),
			dates_add:tempusUnion(w1.dates_add, w2.dates_add),
			dates_rmb:tempusUnion(w1.dates_rmb, w2.dates_rmb),
			dates_fgt:tempusUnion(w1.dates_fgt, w2.dates_fgt),
		})
		return o

		function tempusUnion(a:Tempus[], b:Tempus[]){
			const aStrArr = a.map(e=>e.time)
			const bStrArr = b.map(e=>e.time)
			const uni = Ut.union(aStrArr, bStrArr)
			return uni.map(e=>new Tempus(e))
		}
	}

	/**
	 * 批量合併單詞數組
	 * @param ws 
	 * @returns 
	 */
	public static merge(ws:SingleWord2[]){
		let map = new Map<string, SingleWord2>()
		for(const neoWord of ws){
			let old = map.get(neoWord.wordShape)
			if(old !== void 0){
				let united = SingleWord2.intersect(old,neoWord)
				map.set(united.wordShape, united)
			}else{
				map.set(neoWord.wordShape, neoWord)
			}
		}
		return Array.from(map.values())
	}

	/**
	 * 複製成IVocaRow並刪id後 用JSON.stringfy()比較兩IVocaRow是否相同
	 * @param row1 
	 * @param row2 
	 * @param ignoredKeys 忽略之字段
	 */
	public static isWordsEqual(row1: IVocaRow, row2:IVocaRow, ignoredKeys?:string[]):boolean
	public static isWordsEqual(row1: SingleWord2, row2:SingleWord2,ignoredKeys?:string[]):boolean

	public static isWordsEqual(row1: IVocaRow|SingleWord2, row2:IVocaRow|SingleWord2, ignoredKeys?:string[]){
		let c1:IVocaRow
		let c2:IVocaRow
		if(row1 instanceof SingleWord2){
			c1 = SingleWord2.fieldStringfy(row1)
			c2 = SingleWord2.fieldStringfy(row2 as SingleWord2)
		}else{
			c1 = this.clone(row1)
			c2 = this.clone(row2 as IVocaRow)
		}
		if(ignoredKeys !== void 0){
			for(const k of ignoredKeys){
				//console.log(k)//t
				delete (c1)[k]
				delete (c2)[k]
			}
			
		}

		return JSON.stringify(c1) === JSON.stringify(c2)
	}




	/**
	 * 
	 * @param sws 依table對SingleWord2數組分類
	 * @returns 
	 */
	public static classify(sws:SingleWord2[]){
		const tableToWordsMap = new Map<string, SingleWord2[]>()
		for(const wordToAdd of sws){
			const innerWords = tableToWordsMap.get(wordToAdd.table)
			if(innerWords === void 0){
				tableToWordsMap.set(wordToAdd.table, [wordToAdd])
			}else{
				innerWords.push(wordToAdd)
				tableToWordsMap.set(wordToAdd.table, innerWords)
			}
		}
		return tableToWordsMap
	}

	// public static is_properSetOf_(w1:SingleWord2, w2:SingleWord2){
		
	// }

	/**
	 * 對 日期-事件 依日期 排序。
	 * @param sw 
	 * @returns 
	 */
	public static getSortedDateToEventObjs(sw:SingleWord2): Tempus_Event[]{
		const addMap = SingleWord2.getDateToEventMap(sw.dates_add, WordEvent.ADD)
		const rmbMap = SingleWord2.getDateToEventMap(sw.dates_rmb, WordEvent.RMB)
		const fgtMap = SingleWord2.getDateToEventMap(sw.dates_fgt, WordEvent.FGT)
		const merged = new Map([...addMap, ...rmbMap, ...fgtMap])
		//let mapObj = mapToObjArr(merged)
		let mapObj:Tempus_Event[] = []
		for(const [k,v] of merged){
			let unus = new Tempus_Event(k,v)
			mapObj.push(unus)
		}
		mapObj.sort((a,b)=>{return Tempus.diff_mills(a.tempus,b.tempus)})
		return mapObj
	}

	/**
	 * 取日期對事件之映射
	 * @param dates 
	 * @param event 
	 * @returns 
	 */
	public static getDateToEventMap(dates:Tempus[], event:WordEvent){
		const map = new Map<Tempus, WordEvent>()
		for(const d of dates){
			map.set(d,event)
		}
		return map
	}


/* 
	public static intersectTwoWord(w1:IVocaRow, w2:IVocaRow){
		let c = VocaTableColumnName
		function unionStringfiedArr<T>(s1:string, s2:string){
			let arr1:T[] = JSON.parse(s1)
			let arr2:T[] = JSON.parse(s2)
			return JSON.stringify(Ut.union(arr1, arr2))
		}
		function batchKeys(w1:IVocaRow,w2:IVocaRow,keys:string[]){
			let obj:IVocaRow = JSON.parse(JSON.stringify(w1))
			for(const k of keys){
				obj[k]=unionStringfiedArr(w1[k], w2[k])
			}
			return obj
		}
		if(w1.wordShape !== w2.wordShape){
			console.error(w1);console.error(w2)
			throw new Error(`w1.wordShape !== w2.wordShape`)
		}
		batchKeys(w1, w2, [c.mean, c.dates_add, c.dates_rmb, c.dates_fgt])
		//待改:唯與數據庫存取詞旹 用IVocaRowˉ接口、処理單詞旹皆當用SingleWord2對象
	}
 */
	//public static 

	/**
	 * 根據事件ⁿ珩函數數組
	 * @param event 
	 * @param fn 
	 */
	public static switchEvent(event:WordEvent, fn:(Function|undefined)[]){
		switch (event){
			case WordEvent.ADD:$(fn[0])();break;
			case WordEvent.RMB:$(fn[1])();break;
			case WordEvent.FGT:$(fn[2])();break
			default: throw new Error('default');
		}
	}

}

/**
 * 日期對事件
 */
class Tempus_Event{
	public constructor(public tempus:Tempus, public event:WordEvent){

	}
}

/**
 * 㕥錄權重ˇ算ᵗ程
 */
class Procedure{

	//public constructor()
	//public constructor(_tempus_event:Tempus_Event, after:number)

	public constructor(props:{
		_tempus_event:Tempus_Event, _after:number, _weight:number, _debuff?:number
	}){
		//this._tempus_event = _.cloneDeep(_tempus_event)
		Object.assign(this, props)
	}

	private _tempus_event:Tempus_Event = void 0 as any // 姑ᵈ賦ᵗ初值、實則㕥構造函數創對象則此字段不應潙空
	;public get tempus_event(){return this._tempus_event;};;public set tempus_event(v){this._tempus_event=v;};

	/**
	 * 歷ᵣ當前ᵗ_tempus_event後 權重變後ᵗ量
	 */
	private _after:number = 0 
	;public get after(){return this._after;};;public set after(v){this._after=v;};

	private _weight:number = -1
	;public get weight(){return this._weight;};;public set weight(v){this._weight=v;};

	private _debuff?:number
	;public get debuff(){return this._debuff;};;public set debuff(v){this._debuff=v;};

}

/**
 * 背單詞旹 出詞ᵗ權重
 */
export class Priority{

	public static defaultConfig = {
		//默認ᵗ 添ᵗ權重
		addWeight : 0x100, 
		//
		debuffNumerator : 1000*3600*24*90
	}

	private _config:typeof Priority.defaultConfig = Priority.defaultConfig
	;public get config():typeof Priority.defaultConfig{return this._config;};//<疑>{不顯式標明get方法ᵗ返ˡ值ᵗ類型、則其返ˡ值ᵗ類型ˋ自動被推斷潙類型芝同於set方法ᵗ入參ᵗ類型者}

	;public set config(v:Partial<typeof Priority.defaultConfig>){
		this._config=_.merge({}, Priority.defaultConfig, v);
	};

	private _procedures:Procedure[] = []
	;public get procedures(){return this._procedures;};;public set procedures(v){this._procedures=v;};

	/**
	 * 初權重
	 * @see lastOf(this.procedures)?.after??-1
	 */
	public get prio0num(){return lastOf(this.procedures)?.after??-1}

	// public solo_calcPrio0(neoTempus_eventMap:Tempus_Event){

	// 	let procedures:Procedure[] = this.procedures

	// 	const 此事件至上一事件間ᵗ時ˋ隔ᵗ毫秒ˇ取 = (curTempus:Tempus)=>{
	// 		let lastProcedure = lastOf(procedures)
	// 		Tempus.diff_mills(curTempus, lastProcedure.tempus_event.tempus)
	// 	}


	// 	const add = ()=>{
	// 		// if(WordEvent.ADD === lastOf(procedures).event){
	// 		// 	return
	// 		// }
	// 		//neoProcedure.after *= this.config.addWeight
	// 	}
	// 	const rmb = ()=>{

	// 	}

	// }

	/**
	 * 蔿 @see SingleWord2 對象算初權重
	 * @param {SingleWord2} sw 
	 */
	public calcPrio0(sw:SingleWord2){
		this.procedures = this.getPrio0Procedures(sw)
	}

	/**
	 * 蔿 @see SingleWord2 對象算並返@see Procedures 對象數組
	 * @param {SingleWord2} sw 
	 * @returns 
	 */
	public getPrio0Procedures(sw:SingleWord2){
		
		const nunc = new Tempus()
		let procedures:Procedure[] = []
		let lastProcedure = lastOf(procedures)
		let add_cnt = 0
		let prio0 = 1

		const add = (tempus_event:Tempus_Event)=>{
			lastProcedure = lastOf(procedures)
			add_cnt++
			prio0 = mul(prio0, this.config.addWeight) 
			let unusProcedure = new Procedure({_tempus_event: tempus_event, _after:prio0, _weight: this.config.addWeight})
			procedures.push(unusProcedure)
		}
		/**
		 * @see rmb
		 * @name rmb
		 * @param tempus_event 
		 */
		const rmb = (tempus_event:Tempus_Event)=>{
			lastProcedure = lastOf(procedures)
			let weight = 1.1
			if(lastProcedure===void 0){l.warn(`lastProcedure===void 0`)} // 每單詞ᵗ首個 WordEvent 
			else if(	WordEvent.ADD === lastProcedure?.tempus_event.event	){
				prio0 = div(prio0,1.1)
				
			}else{
				let innerWeight = getWeight(lastProcedure.tempus_event, tempus_event)
				//prio0 /= (weight/2)
				prio0 = div(prio0, div(innerWeight,2))
				weight = innerWeight
			}
			let nowDiffThen = Tempus.diff_mills(nunc, tempus_event.tempus)
			let debuff = Priority.getDebuff(nowDiffThen, this.config.debuffNumerator)
			if(lastOf(dateToEventObjs).event !== WordEvent.RMB){debuff=1}
			//prio0 /= debuff
			prio0 = div(prio0, debuff)
			// console.log(debuff)//t
			// console.log('final')
			// console.log(this.config.debuffNumerator)//t
			let unusProcedure = new Procedure({_tempus_event: tempus_event, _after:prio0, _weight:innerHeight, _debuff:debuff})
			procedures.push(unusProcedure)
		}

		const fgt = (tempus_event:Tempus_Event)=>{
			lastProcedure = lastOf(procedures)
			let weight = getWeight(lastProcedure.tempus_event, tempus_event)
			//prio0 /= weight
			prio0 = mul(prio0, weight) 
			let unusProcedure = new Procedure({_tempus_event: tempus_event, _after:prio0, _weight:weight})
			procedures.push(unusProcedure)
		}

		const dateToEventObjs = SingleWord2.getSortedDateToEventObjs(sw)

		for(let i = 0; i < dateToEventObjs.length; i++){
			const dateToEvent = dateToEventObjs[i]
			// console.log(i)
			// console.log(`console.log(dateToEvent)`)
			// console.log(dateToEvent)//t
			// console.log(`console.log(procedures)`)
			// console.log(procedures)//t
			// console.log(`console.log(lastProcedure)`)
			// console.log(lastProcedure)//t
			// //console.log(procedures[procedures.length-1])
			// console.log(`console.log(lastOf(procedures))`)
			// console.log(lastOf(procedures))
			
			switch (dateToEvent.event){
				case WordEvent.ADD: add(dateToEvent);break;
				case WordEvent.RMB: rmb(dateToEvent);break;
				case WordEvent.FGT: fgt(dateToEvent);break
				default: throw new Error('default');
			}
		}

		function getWeight(lastTempus_event:Tempus_Event, curTempus_event:Tempus_Event){
			let timeDiff = Tempus.diff_mills(curTempus_event.tempus, lastTempus_event.tempus)
			if(timeDiff <=0){throw new Error(`timeDiff <=0`)}
			return Priority.getDateWeight(div(timeDiff,1000))
		}

		//if(procedures.length >=2){console.log(procedures)}//t

		return procedures
		
	}

	
	
	/**
	 * 由時間跨度(毫秒)算時間ᵗ權重
	 * @param dateDif 
	 * @returns 
	 */
	public static getDateWeight(dateDif:number):number{
		let result = (1/25)*Math.pow(dateDif, 1/2)
		if(result <= 1){
			result = 1.01;
		}
		return result;
	}

	public static getDebuff(mills:number, numerator:number){
		let debuff = (numerator/mills) + 1
		return debuff
	}


}


