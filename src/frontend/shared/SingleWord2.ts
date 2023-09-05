import Ut from '@shared/Ut';
//import _ from 'lodash';
//export type { IVocaRow } from 'backend/VocaSqlite';
//import "reflect-metadata"
//import moment from 'moment';

/**
 * 㕥約束數據庫中的行
 */
export interface IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	mean:string
	annotation:string //
	tag:string
	times_add:number
	dates_add:string
	times_rmb:number
	dates_rmb:string
	times_fgt:number
	dates_fgt:string
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
		mean:string[],
		tag:string[],
		annotation:string[],
		dates_add:string[]
	}){
		this._id=props.id
		this._ling=props.ling
		this._wordShape=props.wordShape
		this._mean=props.mean.slice()
		this._annotation=props.annotation.slice()
		this._tag=props.tag
		this._dates_add=props.dates_add.slice()
	}

	private _ling:string
	;public get ling(){return this._ling;};

	private _id?:number
	;public get id(){return this._id;};

	private _wordShape:string=''
	;public get wordShape(){return this._wordShape;};

	private _mean:string[] = []
	;public get mean(){return this._mean;};

	/**
	 * 用戶手動畀單詞加之註、在源txt詞表中用<<>>括着ᵗ部。
	 */
	private _annotation:string[] = []
	;public get annotation(){return this._annotation;};

	private _tag:string[] = []
	;public get tag(){return this._tag;};

	/**
	 * add, rmb, fgt 的dates統一用number數組來存、格式如YYYYMMDDHHmmssSSS
	 */
	private _dates_add:string[] = []
	;public get dates_add(){return this._dates_add;};

	;public get times_add(){
		return this.dates_add.length;
	}

	private _dates_rmb:string[]=[]
	;public get dates_rmb(){return this._dates_rmb;};;public set dates_rmb(v){this._dates_rmb=v;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	private _dates_fgt:string[] = []
	;public get dates_fgt(){return this._dates_fgt;};;public set dates_fgt(v){this._dates_fgt=v;};

	public get times_fgt(){
		return this.dates_fgt.length
	}

	/**
	 * 把SingWord2單詞對象數組轉成IVocaRow對象數組
	 * @param sw 
	 * @returns 
	 */
	public static fieldStringfy(sw:SingleWord2[]){
		const r:IVocaRow[] = []
		for(const e of sw){
			const p = this.soloFieldStringfy(e)
			r.push(p)
		}
		return r
	}

	/**
	 * 把SingWord2單詞對象轉成IVocaRow對象
	 * @param sw 
	 * @returns 
	 */
	public static soloFieldStringfy(sw:SingleWord2):IVocaRow{
		let result:IVocaRow = {
			id:sw.id,
			ling:sw.ling,
			wordShape:sw.wordShape,
			mean:JSON.stringify(sw.mean),
			annotation:JSON.stringify(sw.annotation),
			tag: JSON.stringify(sw.tag),
			dates_add:JSON.stringify(sw.dates_add),
			times_add:sw.times_add,
			dates_rmb:JSON.stringify(sw.dates_rmb),
			times_rmb:sw.times_rmb,
			dates_fgt:JSON.stringify(sw.dates_fgt),
			times_fgt:sw.times_fgt
		}
		return result
	}

	public toRowObj(){
		return SingleWord2.soloFieldStringfy(this)
	}

	/**
	 * 把IVocaRow單詞對象數組轉成SingWord2對象數組
	 * @param obj 
	 * @returns 
	 */
	public static parse(obj:IVocaRow[]){
		const r:SingleWord2[] = []
		for(const e of obj){
			const p = this.soloParse(e)
			r.push(p)
		}
		return r
	}

	/**
	 * 把IVocaRow單詞對象轉成SingWord2對象
	 * @param obj 
	 */
	public static soloParse(obj:IVocaRow){
		let sw:SingleWord2
		try{
			sw = new SingleWord2({
				id:obj.id,
				wordShape:obj.wordShape,
				mean:JSON.parse(obj.mean),
				annotation:JSON.parse(obj.annotation),
				tag:JSON.parse(obj.tag) as string[],
				ling:obj.ling,
				dates_add:JSON.parse(obj.dates_add) as string[]
			})
			sw.dates_rmb = JSON.parse(obj.dates_rmb) as string[]
			sw.dates_fgt = JSON.parse(obj.dates_fgt) as string[]
			return sw
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
			dates_add:Ut.union(w1.dates_add, w2.dates_add)
		})
		o.dates_rmb=Ut.union(w1.dates_rmb, w2.dates_rmb)
		o.dates_fgt=Ut.union(w1.dates_fgt, w2.dates_fgt)
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