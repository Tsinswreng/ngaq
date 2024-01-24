//import _ from 'lodash';
//export type { IVocaRow } from 'backend/VocaSqlite';
//import "reflect-metadata"
import Tempus from '@shared/Tempus';
import { $, compileTs, lastOf, lodashMerge, simpleUnion } from '@shared/Ut';
//import _, { last } from 'lodash';
import _ from 'lodash';

//const sros = Sros.new<Sros_number>()
// const sros = Sros.new({})
// const $n = sros.createNumber.bind(sros)


const Ut = {
	union : simpleUnion
};


/**
 * 單詞表中每列的列名。蔿 保持統一 和 方便改名 、sql語句中通過此類中的列名常量間接訪問類名而非直接用寫死的字符串字面量
 * 畀表增字段: 改VocaTableColumnName, 改IVocaRow, 改SingleWord2字段, 改SingleWord2構造器, 改 創表之sql函數, 改 parse與stringfy, VocaRaw2ʸ改getWordInWordUnit, 改ᵣ既存ᵗ表, 同步 shared
 */

/**
 * 㕥約束數據庫ᵗ表中ᵗ行
 * 原ᵗ VocaTableColumnName 與 IVocaRow皆由此代。
 */
export class VocaDbTable{
	public static readonly id='id'
	public static readonly wordShape='wordShape'
	public static readonly variant = 'variant'
	public static readonly pronounce='pronounce'
	public static readonly mean='mean'
	public static readonly annotation='annotation'
	public static readonly tag='tag'
	public static readonly times_add='times_add'
	public static readonly dates_add='dates_add'
	public static readonly times_rmb='times_rmb'
	public static readonly dates_rmb='dates_rmb'
	public static readonly times_fgt='times_fgt'
	public static readonly dates_fgt='dates_fgt'
	public static readonly table='table' //此字段ˋ實ˋ不存。
	public static readonly source='source'
	/**
	 * 私有構造器。若需創對象則:
	 * const o : ClassName = {在此逐個字段賦值} 不推薦
	 */
	private constructor(
		public table:string //數據庫中本無此字段、㕥存表名。
		,public wordShape:string
		//,public variant:string
		,public pronounce:string
		,public mean:string
		,public annotation:string //
		,public tag:string
		,public times_add:number|string
		,public dates_add:string
		,public times_rmb:number|string
		,public dates_rmb:string
		,public times_fgt:number|string
		,public dates_fgt:string
		,public source:string
		,public id?:number|string //從數據庫中取數據時id必不潙空
	){}
}


export type IVocaRow = VocaDbTable



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
		variant?:string[],
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
		this._variant=props.variant?.slice()??[]
		this._pronounce = props.pronounce?.slice()??[]
		this._mean=props.mean.slice()
		this._annotation=props.annotation?.slice()??[]
		this._tag=props.tag?.slice()??[]
		this._dates_add=props.dates_add.slice()
		this._dates_rmb = props.dates_rmb?.slice()??[]
		this._dates_fgt = props.dates_fgt?.slice()??[]
		this._source = props.source?.slice()??[]
	}

	// public static new(props:Parameters<SingleWord2>){
	// 	return new this()
	// }


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
	 * 變形
	 * 始于2024-01-13T10:48:35.000+08:00
	 */
	protected _variant:string[] = []
	get variant(){return this._variant}

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
	public static toDbObj(sw:SingleWord2, ignoredKeys?:string[]):IVocaRow
	public static toDbObj(sw:SingleWord2[], ignoredKeys?:string[]):IVocaRow[]

	public static toDbObj(sw:SingleWord2|SingleWord2[]){
		if(Array.isArray(sw)){
			return sw.map(e=>soloFieldStringfy(e))
		}else{
			return soloFieldStringfy(sw)
		}

		function soloFieldStringfy(sw:SingleWord2, ignoredKeys?:string[]):IVocaRow{
			const sf = JSON.stringify
			let result:IVocaRow = {
				id:sw.id,
				table:sw.table,
				wordShape:sw.wordShape
				//variant: sf(sw._variant)
				,pronounce: sf(sw.pronounce),
				mean:JSON.stringify(sw.mean),
				annotation:sf(sw.annotation),
				tag: sf(sw.tag),
				dates_add:stringfyDateArr(sw.dates_add),
				times_add:sw.times_add,
				dates_rmb:stringfyDateArr(sw.dates_rmb),
				times_rmb:sw.times_rmb,
				dates_fgt:stringfyDateArr(sw.dates_fgt),
				times_fgt:sw.times_fgt,
				source: sf(sw.source)
			}
			if(ignoredKeys !== void 0){
				for(const k of ignoredKeys){
					delete result[k]
				}
			}
			return result
	
			function stringfyDateArr(dates:Tempus[]){
				let strArr:string[] = dates.map(e=>Tempus.toISO8601(e))
				// for(const d of dates){
				// 	let t = Tempus.toISO8601(d)
				// 	strArr.push(t)
				// }
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
	public static toJsObj(obj:IVocaRow):SingleWord2
	public static toJsObj(obj:IVocaRow[]):SingleWord2[]

	public static toJsObj(obj:IVocaRow|IVocaRow[]){
		if(Array.isArray(obj)){
			return obj.map(e=>soloParse(e))
		}else{
			return soloParse(obj)
		}

		function soloParse(obj:IVocaRow){
			const num = (n:number|string|undefined)=>{
				if(typeof n === 'string'){
					return parseFloat(n)
				}
				return n
			}
			let sw:SingleWord2
			try{
				const ps = JSON.parse
				sw = new SingleWord2({
					id:num(obj.id)
					,wordShape:obj.wordShape
					//,variant: ps(obj.variant)
					,pronounce: JSON.parse(obj.pronounce),
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
					let strArr:string[] = JSON.parse(datesStr)
					if(!Array.isArray(strArr)){
						throw new TypeError(`!Array.isArray(strArr)`)
					}
					return strArr.map(e=>Tempus.new(e))
				}
	
			}catch(e){
				console.error(`console.error(obj)`);console.error(obj);console.error(`/console.error(obj)`)
				console.error(`console.error(e)`);console.error(e);console.error(`/console.error(e)`)
			}
			throw new Error() //怎麼寫在外面
			
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
			return SingleWord2.toJsObj(SingleWord2.toDbObj(o))
		}else{
			return SingleWord2.toDbObj(SingleWord2.toJsObj(o))
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
			const aStrArr = a.map(e=>e.iso)
			const bStrArr = b.map(e=>e.iso)
			const uni = Ut.union(aStrArr, bStrArr)
			return uni.map(e=>Tempus.new(e))
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
			c1 = SingleWord2.toDbObj(row1)
			c2 = SingleWord2.toDbObj(row2 as SingleWord2)
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
			//let unus = Tempus.new_Event(k,v)
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
export class Tempus_Event{
	public constructor(public tempus:Tempus, public event:WordEvent){

	}
}

import { WordPriority } from '@shared/WordPriority';
export{WordPriority as Priority}