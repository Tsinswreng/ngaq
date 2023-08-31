require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import Ut from 'Ut';
import { Database } from 'sqlite3';
import * as Tp from 'Type'
import Sqlite from 'db/Sqlite';
import _ from 'lodash';
import { SingleWord } from './VocaRaw';
import "reflect-metadata"
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
		annotation:string[],
		dates_add:number[]
		//......
	}){
		this._id=props.id
		this._ling=props.ling
		this._wordShape=props.wordShape
		this.mean=props.mean.slice()
		this.annotation=props.annotation.slice()
		this.dates_add=props.dates_add.slice()
	}

	private _ling:string
	;public get ling(){return this._ling;};

	private _id?:number
	;public get id(){return this._id;};

	private _wordShape:string=''
	;public get wordShape(){return this._wordShape;};

	private _mean:string[] = []
	;public get mean(){return this._mean;};;public set mean(v){this._mean=v;};

	/**
	 * 用戶手動畀單詞加之註、在源txt詞表中用<<>>括着ᵗ部。
	 */
	private _annotation:string[] = []
	;public get annotation(){return this._annotation;};;public set annotation(v){this._annotation=v;};

	/**
	 * add, rmb, fgt 的dates統一用number數組來存、格式如YYYYMMDDHHmmssSSS
	 */
	private _dates_add:number[] = []
	;public get dates_add(){return this._dates_add;};;public set dates_add(v){this._dates_add=v;};

	;public get times_add(){
		return this.dates_add.length;
	}

	public _dates_rmb:number[]=[]
	;public get dates_rmb(){return this._dates_rmb;};;public set dates_rmb(v){this._dates_rmb=v;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	public _dates_fgt:number[] = []
	;public get dates_fgt(){return this._dates_fgt;};;public set dates_fgt(v){this._dates_fgt=v;};

	public get times_fgt(){
		return this.dates_fgt.length
	}

	/**
	 * 把SingWord2單詞對象數組轉成Tp.IVocaRow對象數組
	 * @param sw 
	 * @returns 
	 */
	public static fieldStringfy(sw:SingleWord2[]){
		const r:Tp.IVocaRow[] = []
		for(const e of sw){
			const p = this.soloFieldStringfy(e)
			r.push(p)
		}
		return r
	}

	/**
	 * 把SingWord2單詞對象轉成Tp.IVocaRow對象
	 * @param sw 
	 * @returns 
	 */
	public static soloFieldStringfy(sw:SingleWord2):Tp.IVocaRow{
		let result:Tp.IVocaRow = {
			id:sw.id,
			ling:sw.ling,
			wordShape:sw.wordShape,
			mean:JSON.stringify(sw.mean),
			annotation:JSON.stringify(sw.annotation),
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
	 * 把Tp.IVocaRow單詞對象數組轉成SingWord2對象數組
	 * @param obj 
	 * @returns 
	 */
	public static parse(obj:Tp.IVocaRow[]){
		const r:SingleWord2[] = []
		for(const e of obj){
			const p = this.soloParse(e)
			r.push(p)
		}
		return r
	}

	/**
	 * 把Tp.IVocaRow單詞對象轉成SingWord2對象
	 * @param obj 
	 */
	public static soloParse(obj:Tp.IVocaRow){
		let sw:SingleWord2
		try{
			sw = new SingleWord2({
				id:obj.id,
				wordShape:obj.wordShape,
				mean:JSON.parse(obj.mean),
				annotation:JSON.parse(obj.annotation),
				ling:obj.ling,
				dates_add:Ut.parseJsonNumArr(obj.dates_add)
			})
			sw.dates_rmb = Ut.parseJsonNumArr(obj.dates_rmb)
			sw.dates_fgt = Ut.parseJsonNumArr(obj.dates_fgt)
			return sw
		}catch(e){
			console.error(`console.error(obj)`);console.error(obj);console.error(`/console.error(obj)`)
			console.error(`console.error(e)`);console.error(e);console.error(`/console.error(e)`)
		}
		throw new Error()
		
	}

	//public static updateFojo(){}

	/**
	 * 把SingleWord1實例轉成SingleWord2實例
	 * @param s1 
	 */
	public static convertInst(s1:SingleWord){
		/* let s2 = new SingleWord2({
			ling:s1.ling
			id:s1.id
			wordS
		}) */
	}

	/**
	 * 舊對象轉新對象
	 * @param objs 
	 * @returns 
	 */
	public static parseOldObj(objs:Tp.Old_IVocaRow[]){

		let lingMap = new Map([
			['eng', 'english'],
			['jap', 'japanese'],
		])

		const r:Tp.IVocaRow[]=[]
		for(const e of objs){
			const t = parseOne(e)
			r.push(t)
		}
		return r

		function parseOne(obj:Tp.Old_IVocaRow){
			let neo:Tp.IVocaRow = {
				id:obj.id,
				ling:Ut.nng(lingMap.get(obj.ling)),
				wordShape:obj.wordShape,
				mean:JSON.stringify(obj.fullComments),
				annotation:'[]',
				dates_add: convertDate(obj.addedDates), //<待改>{}
				dates_rmb: convertDate(obj.rememberedDates), 
				dates_fgt: convertDate(obj.forgottenDates),
				times_add: obj.addedTimes,
				times_rmb: obj.rememberedTimes,
				times_fgt: obj.forgottenTimes
			}
			/* dates_add: '20230410205700,20210602000000000',
  dates_rmb: '20230508172108,20230517083331,20230611132803000',
  dates_fgt: '000',*/
			return neo
		}

		

		//YYYYMMDDHHmmss 字串數組 轉 JSON格式ᵗ YYYYMMDDHHmmssSSS 數字數組
		function convertDate(old:string[]){
			//let neo = Ut.convertDateFormat(old, 'YYYYMMDDHHmmss', 'YYYYMMDDHHmmssSSS')
			//return JSON.stringify(neo)
			let neo:string[] = []
			for(const e of old){
				let n = parseInt(e)
				n *= 1000
				neo.push(n+'')
			}
			return JSON.stringify(neo)
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
			dates_add:Ut.union(w1.dates_add, w2.dates_add)
		})
		o.dates_rmb=Ut.union(w1.dates_rmb, w2.dates_rmb)
		o.dates_fgt=Ut.union(w1.dates_fgt, w2.dates_fgt)
		return o
	}

/* 
	public static intersectTwoWord(w1:Tp.IVocaRow, w2:Tp.IVocaRow){
		let c = Tp.VocaTableColumnName
		function unionStringfiedArr<T>(s1:string, s2:string){
			let arr1:T[] = JSON.parse(s1)
			let arr2:T[] = JSON.parse(s2)
			return JSON.stringify(Ut.union(arr1, arr2))
		}
		function batchKeys(w1:Tp.IVocaRow,w2:Tp.IVocaRow,keys:string[]){
			let obj:Tp.IVocaRow = JSON.parse(JSON.stringify(w1))
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
		//待改:唯與數據庫存取詞旹 用Tp.IVocaRowˉ接口、処理單詞旹皆當用SingleWord2對象
	}
 */
	//public static 


}