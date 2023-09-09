//import _ from 'lodash';
//export type { IVocaRow } from 'backend/VocaSqlite';
//import "reflect-metadata"
//import moment, { Moment } from 'moment';
import Tempus from '@shared/Tempus';
import { union } from '@shared/Ut';
const Ut = {
	union : union
};
/**
 * 㕥約束數據庫中的行
 */
export interface IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
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

export enum WordEvent{
	ADD=0,
	RMB=1,
	FGT=-1
}

export default class SingleWord2{

	/* public constructor(props:Partial<SingleWord2>&{ling:string, wordShape:string, mean:string[]}){
		Object.assign(this,props)
	} */

	/* public constructor(props:Required<SingleWord2>){
		Object.assign(this,props)
	} */

	/**
	 * 此構造函數用于從txt單詞源表創建單詞對象、故無rmb、fgt之屬。
	 * @param props 
	 */
	public constructor(props:{
		id?:number,
		ling:string,
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
		this._ling=props.ling
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
	 * 語言、當與表名一致
	 */
	private _ling:string
	;public get ling(){return this._ling;};

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
	 * 
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
	public _dates_rmb:Tempus[]=[]
	;public get dates_rmb(){return this._dates_rmb;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	/**
	 * forget
	 */
	public _dates_fgt:Tempus[] = []
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
	 * 把SingWord2單詞對象數組轉成IVocaRow對象數組
	 * @param sw 
	 * @returns 
	 */
	public static fieldStringfy(sw:SingleWord2):IVocaRow
	public static fieldStringfy(sw:SingleWord2[]):IVocaRow[]

	public static fieldStringfy(sw:SingleWord2|SingleWord2[]){
		if(Array.isArray(sw)){
			const r:IVocaRow[] = []
			for(const e of sw){
				const p = this.soloFieldStringfy(e)
				r.push(p)
			}
			return r
		}else{
			return this.soloFieldStringfy(sw)
		}

	}

	/**
	 * 把SingWord2單詞對象轉成IVocaRow對象
	 * @param sw 
	 * @returns 
	 */
	private static soloFieldStringfy(sw:SingleWord2):IVocaRow{
		let result:IVocaRow = {
			id:sw.id,
			ling:sw.ling,
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
		return result

		function stringfyDateArr(dates:Tempus[]){
			let strArr:string[] = []
			for(const d of dates){
				let t = d.toISO8601()
				strArr.push(t)
			}
			return JSON.stringify(strArr)
		}

	}

	public toRowObj(){
		return SingleWord2.soloFieldStringfy(this)
	}

	/**
	 * 把IVocaRow單詞對象數組轉成SingWord2對象數組
	 * @param obj 
	 * @returns 
	 */
	public static parse(obj:IVocaRow):SingleWord2
	public static parse(obj:IVocaRow[]):SingleWord2[]

	public static parse(obj:IVocaRow|IVocaRow[]){
		if(Array.isArray(obj)){
			const r:SingleWord2[] = []
			for(const e of obj){
				const p = this.soloParse(e)
				r.push(p)
			}
			return r
		}else{
			return this.soloParse(obj)
		}

	}

	/**
	 * 把IVocaRow單詞對象轉成SingWord2對象
	 * @param obj 
	 */
	private static soloParse(obj:IVocaRow){
		let sw:SingleWord2
		try{
			sw = new SingleWord2({
				id:obj.id,
				wordShape:obj.wordShape,
				pronounce: JSON.parse(obj.pronounce),
				mean:JSON.parse(obj.mean),
				annotation:JSON.parse(obj.annotation),
				tag:JSON.parse(obj.tag) as string[],
				ling:obj.ling,
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
		if(w1.ling!==w2.ling){
			console.error(w1);console.error(w2)
			throw new Error(`w1.ling!==w2.ling`)
		}
		let o = new SingleWord2({
			id:w1.id,
			ling:w1.ling,
			wordShape:w1.wordShape,
			mean:Ut.union(w1.mean, w2.mean),
			annotation:Ut.union(w1.annotation, w2.annotation),
			tag:Ut.union(w1.tag, w2.tag),
			dates_add:Ut.union(w1.dates_add, w2.dates_add),
			dates_rmb:Ut.union(w1.dates_rmb, w2.dates_rmb),
			dates_fgt:Ut.union(w1.dates_fgt, w2.dates_fgt),
		})
		return o
	}

	/**
	 * 用JSON.stringfy()比較兩IVocaRow是否相同
	 * @param row1 
	 * @param row2 
	 * @returns 
	 */
	public static isWordsEqual(row1: IVocaRow, row2:IVocaRow):boolean
	public static isWordsEqual(row1: SingleWord2, row2:SingleWord2):boolean

	public static isWordsEqual(row1: IVocaRow|SingleWord2, row2:IVocaRow|SingleWord2){
		return JSON.stringify(row1) === JSON.stringify(row2)
	}

	public static is_properSetOf_(w1:SingleWord2, w2:SingleWord2){
		
	}

	public static getSortedDateToEventsMap(sw:SingleWord2){

	}

	/* public static getDateToEventMap(dates:string[], event:WordEvent){
		const dateFormat='YYYY.MM.DD-HH:mm:ss.SSS'
		const moments:Moment[] = []
		for(const d of dates){
			const m = moment(d, dateFormat);
			moments.push(m)
		}

		const map = new Map<string, WordEvent>()
		
	} */

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


}