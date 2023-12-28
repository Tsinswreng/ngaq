import Tempus from '@shared/Tempus';
import WordB from './WordB';
import SingleWord2, { IVocaRow, WordEvent } from '@shared/SingleWord2';
import { $, $a, getShuffle, lastOf, measurePromiseTime } from '@shared/Ut';
import VocaClient from '@ts/voca/VocaClient';
import { Priority } from 'shared/SingleWord2';
import _ from 'lodash';
import { Sros } from '@shared/Sros';
const sros = Sros.new()
const s = sros.short
const l = console

/**
 * 既複習ᵗ詞
 */
class ReviewedWords{

	public constructor(){}

	/**
	 * id對既憶ᵗ單詞 之映射
	 */
	// private _rmb_idToWordsMap:Map<number, WordB> = new Map()
	// get rmb_idToWordsMap(){return this._rmb_idToWordsMap;};

	private _rmb_table_id__word:Map<string, WordB> = new Map()
	get rmb_table_id__word(){return this._rmb_table_id__word}

	/**
	 * id對既忘ᵗ單詞 之映射
	 */
	// private _fgt_idToWordsMap:Map<number, WordB> = new Map()
	// get fgt_idToWordsMap(){return this._fgt_idToWordsMap;};
	private _fgt_table_id__word:Map<string, WordB> = new Map()
	get fgt_table_id__word(){return this._fgt_table_id__word}


	public merge(){
		return new Map([...this.rmb_table_id__word, ...this.fgt_table_id__word])
	}
}

/**
 * 㕥理ᵣˌ詞ˇ背ᵗ程ʸᵗ理則
 */
export default class Recite{

	private static _instance:Recite;

	public static getInstance(){
		if(this._instance === undefined){
			this._instance = new Recite()
		}
		return this._instance;
	}

	private constructor (){}

	/**
	 * 新背ᵗ詞ˋ改後是否已保存
	 */
	private _isSaved:boolean = true
	;public get isSaved(){return this._isSaved;};;public set isSaved(v){this._isSaved=v;};

	
	private _allWordsToLearn:WordB[] = []
	;public get allWordsToLearn(){return this._allWordsToLearn;};

	/**
	 * 鍵:`${表名}${id}` 如 'english551'
	 */
	private _table_id__word:Map<string, WordB> = new Map()
	get table_id__word(){return this._table_id__word}

	

	// private _id__posInWordsArr:Map<number, number> = new Map()
	// get id__posInWordsArr(){return this._id__posInWordsArr}

	//private _allIdToWordsMap:Map<number, WordB> = new Map()
	//;public get allIdToWordsMap(){return this._allIdToWordsMap;};

	/**
	 * current word
	 */
	// private _curWord?:WordB
	// ;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _rvwObj = new ReviewedWords()
	;public get rvwObj(){return this._rvwObj;};

	/**
	 * 重置(測試)
	 * @deprecated
	 */
	public static reset(){
		//<待改>{lodash之merge會忽略undefined、洏余需ˌundefiend值ˋˋ亦可覆蓋ᵣ。}
		_.merge(Recite._instance, new Recite())
	}
	/**
	 * @deprecated
	 */
	public reset(){
		Recite.reset()
	}

	public static restart(){
		const o = C.getInstance()
	}

	public restart(prioConfig:Partial<typeof Priority.defaultConfig>){
		this.flushAllWordsToLearn(prioConfig)
		this._rvwObj = new ReviewedWords()
	}


	public flushAllWordsToLearn(prioConfig:Partial<typeof Priority.defaultConfig>){
		const id__reviewedWord = this.rvwObj.merge()
		// const id__index = C.genMap<number,WordB>(this.allWordsToLearn, 'id')
		// //console.log(id__reviewedWord)//t
		// const neoWordsToLearn:WordB[] = []
		// for(const [id, word] of id__reviewedWord){
		// 	word.mergeDates()
		// 	const oldWord = $(id__index.get(id))
		// 	const mergedSw = SingleWord2.intersect(oldWord.fw, word.fw)
		// 	const mergedWb = new WordB(mergedSw)
		// 	mergedWb.calcPrio()
		// 	neoWordsToLearn.push(mergedWb)
		// }

		//英語表的id=551和日語表的id=551 不是同一個詞、故會合並失敗
		for(let i = 0; i < this.allWordsToLearn.length; i++){
			const u = this.allWordsToLearn[i]
			const id = $(u.fw.id)
			const gotV:WordB|undefined = id__reviewedWord.get( C.tableId(u) )
			if(gotV === void 0){continue}
			//console.log(u.priority.prio0num)//t
			// console.log(u.fw.wordShape, u.fw.id) //simeru
			// console.log(gotV.fw.wordShape, gotV.fw.id) //mane
			
			const neoSw = SingleWord2.intersect(u.fw, gotV.fw)
			gotV.fw = neoSw
			//this.allWordsToLearn[i].fw = gotV.fw
			Object.assign(u.fw, gotV.fw)
			Object.assign(u, gotV)
			Object.assign(u, new WordB(u.fw))
			//this.allWordsToLearn[i] = gotV
			u.mergeDates()
			//debugger
			u.priority.setConfig(prioConfig)
			//console.log(u.priority.config)//t
			u.calcPrio()//傳參config?

			//console.log(u.priority.prio0num)//t
		}
	}

	/**
	 * 篩詞、加ᵗ次ˋ不止一次 或 有 註釋 之詞ˇ留、餘者ˇ去。
	 * @param sws 
	 * @returns 
	 */
	public filter(){
		this._allWordsToLearn = this._allWordsToLearn.filter(wb=>{
			return wb.fw.times_add>=2||wb.fw.annotation.length>0||wb.fw.tag.length>0
		})
	}

	/**
	 * 由路徑從服務器取詞
	 * @param path 
	 * @deprecated
	 */
	public async fetchAndStoreWords_deprecated(path:string){
		let [time, sws] = await measurePromiseTime(VocaClient.fetchWords(path))
		console.log(`後端ᙆ取詞之耗時: `+time)
		//let sws = await VocaClient.fetchWords(path)
		this.allWordsToLearn.push(...WordB.toWordB($(sws)))
		this.table_id__word.clear()

		this.allWordsToLearn.map(e=>{
			this.table_id__word.set(
				e.fw.table+$(e.fw.id)
				, e
			)
		})
	}

	/***
	 * 添@see SingleWord2[]  作待背之詞
	 */
	public addWordsToLearn_SingleWord2(sws:SingleWord2[]){
		this.allWordsToLearn.push(...WordB.toWordB($(sws)))
	}

	/**
	 * 添@see wordB[]  作待背之詞
	 * @param wbs 
	 */
	public addWordsToLearn_WordB(inp:WordB[]){
		this.allWordsToLearn.push(...inp)
	}

	public static calcAndDescSortPriority(wbs:WordB[],config?:Partial<typeof Priority.defaultConfig>){
		//wbs.map(e=>console.log(e.priority.prio0num))//t
		for(const w of wbs){
			if(w.priority.changeRecord.length === 0){
				//w.priority.config.debuffNumerator = 
				if(config !== void 0){w.priority.setConfig(config) }
				w.calcPrio()
			}
		}
		wbs.sort((b,a)=>{return s.s(a.priority.prio0num , b.priority.prio0num)})
	}public calcAndDescSortPriority(config?:Partial<typeof Priority.defaultConfig>){
		Recite.calcAndDescSortPriority(this.allWordsToLearn, config)
	}

	public descSortByPrio(){
		this.allWordsToLearn.sort((b,a)=>{return s.s(a.priority.prio0num , b.priority.prio0num)})
	}

	/**
	 * 依 末次複習ᵗ期 排序
	 * @param wb 
	 */
	public static sortBylastRvwDate(wb:WordB[]){
		const nunc = Tempus.new()
		function lastTempus(w:WordB){return lastOf(w.sortedTempus_eventInsts).tempus}
		//function millsToNow(t:Tempus){return Tempus.diff_mills(nunc, t)}
		
		wb.sort((a,b)=>{
			return Tempus.diff_mills(lastTempus(a), lastTempus(b))
		})
	}public sortBylastRvwDate(){
		return Recite.sortBylastRvwDate(this.allWordsToLearn)
	}

	/**
	 * 依憶ᵗ次 排序。若同則加ᵗ次ˋ多者在前、若又同則忘ᵗ次ˋ多者在前。
	 * @param wb 
	 */
	public static sortByRmb(wb:WordB[]){
		function add(w:WordB){return w.fw.times_add}
		function rmb(w:WordB){return w.fw.times_rmb}
		function fgt(w:WordB){return w.fw.times_fgt}
		
		wb.sort((a,b)=>{
			const rmbDiff = rmb(a)-rmb(b)
			const addDiff = add(b)-add(a)
			const fgtDiff = fgt(b)-fgt(a)
			if(rmbDiff !== 0){return rmbDiff}
			else if(addDiff !== 0){return addDiff}
			else{return fgtDiff}
		})
	}public sortByRmb(){
		Recite.sortByRmb(this.allWordsToLearn)
	}
	// public async start(path:string){
	// 	//const client = VocaClient.getInstance()
	// 	let sws = await VocaClient.fetchWords(path)
	// 	sws = this.filter($(sws))
	// 	let wbs = $(sws).map((e)=>{return new WordB(e)})
		
	// 	this.calcAllPrio(wbs)
	// 	//l.warn(wbs)//t
	// 	wbs.sort((a,b)=>{return b.priority.prio0num - a.priority.prio0num})
	// 	this.allWordsToLearn.length = 0
	// 	this.allWordsToLearn.push(...wbs)
	// 	//this.isSaved = false
	// 	//console.log(`console.log(this.isSaved)`)
	// 	//console.log(this.isSaved)//t
	// }

	/**
	 * 觸發單詞事件
	 * @param wb 
	 * @param event 
	 */
	public trigger(wb:WordB, event:WordEvent){
		//console.log(`console.log(event)`)
		//console.log(event)//t
		this.isSaved = false
		const nunc = Tempus.new()

		const rmb = ()=>{
			wb.neoDates_rmb.push(nunc)
			this.rvwObj.rmb_table_id__word.set( C.tableId(wb), wb )
			//console.log('rmb:')
			//console.log(wb.fw.wordShape)//
		}
		const fgt = ()=>{
			wb.neoDates_fgt.push(nunc)
			this.rvwObj.fgt_table_id__word.set( C.tableId(wb), wb )
			//console.log('fgt:')
			//console.log(wb.fw.wordShape)//
		}
		
		const funs:Function[] = [()=>{}, rmb, fgt]

		SingleWord2.switchEvent(event, funs)
		//console.log(`console.log(this.rvwObj.rmb_idToWordsMap)`)
		//console.log(this.rvwObj.rmb_idToWordsMap)//t
	}

	/**
	 * 撤銷一單詞ᵗ新增ᵗ單詞事件
	 * @param wb 
	 * @returns 
	 */
	public undo(wb:WordB){
		
		console.log(`undo:`)
		console.log(wb.fw.wordShape)//t
		let rmbWord = this.rvwObj.rmb_table_id__word.get( C.tableId(wb) )
		let fgtWord = this.rvwObj.fgt_table_id__word.get( C.tableId(wb) )
		if(rmbWord!==void 0 && fgtWord!==void 0){
			//return
			throw new Error()
		}

		if(rmbWord!==void 0){
			$(  rmbWord.neoDates_rmb.pop()  )
			this.rvwObj.rmb_table_id__word.delete( C.tableId(rmbWord) )
		}else if(fgtWord!==undefined){
			$(  fgtWord.neoDates_fgt.pop()  )
			this.rvwObj.fgt_table_id__word.delete( C.tableId(fgtWord) )
		}else{
			//throw new Error()
			l.warn('rmbWord 與 fgtWord 皆空');return
		}
		l.log('操作成功')
	}

	/**
	 * get all reviewed words
	 * @returns 
	 */
	public getAllRvwWords(){
		let rvwWords:WordB[] = Array.from(this.rvwObj.rmb_table_id__word.values())
		rvwWords.push(  ...Array.from(this.rvwObj.fgt_table_id__word.values())  )
		return rvwWords
	}

	private getToSavedWords(){
		let rvwWords:WordB[] = this.getAllRvwWords()
		for(let i = 0; i < rvwWords.length; i++){
			rvwWords[i].mergeDates()
		}
		return rvwWords
	}

	public mergeSelfWords(){
		// const ws = Array.from(this.rvwObj.rmb_idToWordsMap.values())
		// ws.push(...Array.from(this.rvwObj.fgt_idToWordsMap.values()))
		for(let i = 0; i < this.allWordsToLearn.length; i++){
			this.allWordsToLearn[i].mergeDates()
			this.allWordsToLearn[i] = new WordB(this.allWordsToLearn[i].fw) //<坑>{若只併日期則wordB中尚有他ᵗ屬性ˋ不隨ᶦ更新、故需重新創對象}
		}
		//console.log(ws)//t
	}

	public async saveWords(){
		const rows:IVocaRow[] = this.getToSavedWords().map((e)=>{return SingleWord2.toDbObj(e.fw)})
		let res = await VocaClient.saveWords(rows)//.then((d)=>{l.log(d); this.isSaved = true})
		this.isSaved = true
		l.log(`l.log(res)`)
		l.log(res)
	}

	/**
	 * 打亂
	 * @param everyN 
	 * @see getShuffle
	 */
	public shuffleWords(everyN=8){
		//console.log(this.allWordsToLearn.length)//t
		this._allWordsToLearn = getShuffle($a(this.allWordsToLearn), everyN, this.allWordsToLearn.length/everyN)
	}


	public static genMap<K,V>(obj:V[], key:string){
		const ans = new Map<K,V>()
		for(const u of obj){
			ans.set(
				u[key]
				,u
			)
		}
		return ans
	}
	
	public static tableId(wordB:WordB){
		return wordB.fw.table+$(wordB.fw.id)
	}

}

const C = Recite
type C = Recite