import Tempus from '@shared/Tempus';
import WordB from './WordB';
import SingleWord2, { IVocaRow, WordEvent } from '@shared/SingleWord2';
import { $ } from '@shared/Ut';
import Log from '@shared/Log';
import VocaClient from '@ts/voca/VocaClient';
const l = new Log()

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

	private static instance:Recite;

	public static getInstance(){
		if(this.instance === undefined){
			this.instance = new Recite()
		}
		return this.instance;
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
	 * 使諸詞各算權重
	 * @param wbs 
	 */
	// public calcAllPrio(wbs:WordB[]=this.allWordsToLearn){
	// 	for(let i = 0; i < wbs.length; i++){
	// 		wbs[i].calcPrio()
	// 	}
	// }


	/**
	 * times_add >= 2之詞ˇ篩
	 * @param sws 
	 * @returns 
	 */
	public filterByAddTimes(){
		this._allWordsToLearn = this._allWordsToLearn.filter(wb=>wb.fw.times_add>=2)
	}

	/**
	 * 由路徑從服務器取詞
	 * @param path 
	 */
	public async fetchAndStoreWords(path:string){
		let sws = await VocaClient.fetchWords(path)
		this.allWordsToLearn.push(...WordB.toWordB($(sws)))
	}

	/**
	 * 使諸詞各算權重並降序ᵈ排
	 * @param wbs 
	 */
	public static calcAndDescSortPriority(wbs:WordB[]){
		for(const w of wbs){
			if(w.priority.procedures.length === 0){
				w.calcPrio()
			}
		}
		wbs.sort((b,a)=>{return a.priority.prio0num - b.priority.prio0num})
	}public calcAndDescSortPriority(){
		Recite.calcAndDescSortPriority(this.allWordsToLearn)
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
		const nunc = new Tempus()

		const rmb = ()=>{
			wb.neoDates_rmb.push(nunc)
			this.rvwObj.rmb_idToWordsMap.set($(wb.fw.id), wb)
			
		}
		const fgt = ()=>{
			wb.neoDates_fgt.push(nunc)
			this.rvwObj.fgt_idToWordsMap.set($(wb.fw.id), wb)
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

	public async saveWords(){
		const rows:IVocaRow[] = this.getToSavedWords().map((e)=>{return SingleWord2.fieldStringfy(e.fw)})
		let res = await VocaClient.saveWords(rows)//.then((d)=>{l.log(d); this.isSaved = true})
		this.isSaved = true
		l.log(`l.log(res)`)
		l.log(res)
		
		
	}

}