import Tempus from '@shared/Tempus';
import WordB from './WordB';
import SingleWord2, { IVocaRow, WordEvent } from '@shared/SingleWord2';
import { $, $a, getShuffle, lastOf, measurePromiseTime } from '@shared/Ut';
import VocaClient from '@ts/voca/VocaClient';
import { Priority } from 'shared/SingleWord2';
import _ from 'lodash';
const l = console

/**
 * 既複習ᵗ詞
 */
class ReviewedWords{

	public constructor(){}

	/**
	 * id對既憶ᵗ單詞 之映射
	 */
	private _rmb_idToWordsMap:Map<number, WordB> = new Map()
	;public get rmb_idToWordsMap(){return this._rmb_idToWordsMap;};

	/**
	 * id對既忘ᵗ單詞 之映射
	 */
	private _fgt_idToWordsMap:Map<number, WordB> = new Map()
	;public get fgt_idToWordsMap(){return this._fgt_idToWordsMap;};


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

	//private _allIdToWordsMap:Map<number, WordB> = new Map()
	//;public get allIdToWordsMap(){return this._allIdToWordsMap;};

	/**
	 * current word
	 */
	private _curWord?:WordB
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _rvwObj = new ReviewedWords()
	;public get rvwObj(){return this._rvwObj;};

	/**
	 * 重置(測試)
	 */
	public static reset(){
		//<待改>{lodash之merge會忽略undefined、洏余需ˌundefiend值ˋˋ亦可覆蓋ᵣ。}
		_.merge(Recite._instance, new Recite())
	}public reset(){
		Recite.reset()
	}

	/**
	 * 篩詞、加ᵗ次ˋ不止一次 或 有 註釋 之詞ˇ留、餘者ˇ去。
	 * @param sws 
	 * @returns 
	 */
	public filter(){
		this._allWordsToLearn = this._allWordsToLearn.filter(wb=>wb.fw.times_add>=2||wb.fw.annotation.length>0)
	}

	/**
	 * 由路徑從服務器取詞
	 * @param path 
	 * @deprecated
	 */
	public async fetchAndStoreWords(path:string){
		let [time, sws] = await measurePromiseTime(VocaClient.fetchWords(path))
		console.log(`後端ᙆ取詞之耗時: `+time)
		//let sws = await VocaClient.fetchWords(path)
		this.allWordsToLearn.push(...WordB.toWordB($(sws)))
	}

	/***
	 * 添加待背之詞
	 */
	public addWordsToLearn(sws:SingleWord2[]){
		this.allWordsToLearn.push(...WordB.toWordB($(sws)))
	}

	/**
	 * 使諸詞各算權重並降序ᵈ排
	 * @param wbs 
	 */
	public static calcAndDescSortPriority(wbs:WordB[],config?:Partial<typeof Priority.defaultConfig>){
		//wbs.map(e=>console.log(e.priority.prio0num))//t
		for(const w of wbs){
			if(w.priority.changeRecord.length === 0){
				//w.priority.config.debuffNumerator = 
				if(config !== void 0){w.priority.setConfig(config) }
				w.calcPrio()
			}
		}
		wbs.sort((b,a)=>{return a.priority.prio0num - b.priority.prio0num})
	}public calcAndDescSortPriority(config?:Partial<typeof Priority.defaultConfig>){
		Recite.calcAndDescSortPriority(this.allWordsToLearn, config)
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
			this.rvwObj.rmb_idToWordsMap.set($(wb.fw.id), wb)
			//console.log('rmb:')
			//console.log(wb.fw.wordShape)//
		}
		const fgt = ()=>{
			wb.neoDates_fgt.push(nunc)
			this.rvwObj.fgt_idToWordsMap.set($(wb.fw.id), wb)
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
		let rmbWord = this.rvwObj.rmb_idToWordsMap.get($(wb.fw.id))
		let fgtWord = this.rvwObj.fgt_idToWordsMap.get($(wb.fw.id))
		if(rmbWord!==void 0 && fgtWord!==void 0){
			//return
			throw new Error()
		}

		if(rmbWord!==void 0){
			$(  rmbWord.neoDates_rmb.pop()  )
			this.rvwObj.rmb_idToWordsMap.delete($(rmbWord.fw.id))
		}else if(fgtWord!==undefined){
			$(  fgtWord.neoDates_fgt.pop()  )
			this.rvwObj.fgt_idToWordsMap.delete($(fgtWord.fw.id))
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
		let rvwWords:WordB[] = Array.from(this.rvwObj.rmb_idToWordsMap.values())
		rvwWords.push(  ...Array.from(this.rvwObj.fgt_idToWordsMap.values())  )
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

}

