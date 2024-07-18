
//type import
import type { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import type { InstanceType_ } from "@shared/Type"
import type { 
	I_Tempus_Event
	, I_Tempus_EventWord
}
from '@shared/interfaces/ngaqWeightWord/Tempus_eventWord'
import { LearnBelong } from '@shared/dbRow/NgaqRows'
import { TempusEventRecord } from "./ChangeRecord"
//import { ChangeRecord } from "@shared/WordWeight/ChangeRecord"
//import { TempusEventRecord } from "@shared/WordWeight/ChangeRecord"

import Tempus from "@shared/Tempus"
import { N2S } from "@shared/Sros"
import { Sros } from "@shared/Sros"
import { $ } from "@shared/Common"
import {key__arrMapPush} from '@shared/tools/key__arrMapPush'
/**
 * 模塊ʹ返值。賦于__return._、㕥適new Function加載
 */
declare const __return:{_:any}
const sros = Sros.new()
const s = sros.short
const $n = Sros.toNumber.bind(Sros)


function $last<T>(arr:T[]){
	return $(arr.at(-1))
}


const WordEvent = LearnBelong
type WordEvent = typeof WordEvent


//___________________________________________________


class InMills{
	readonly SEC = 1000
	readonly MIN = 1000*60
	readonly HOUR = this.MIN * 60
	readonly DAY = this.HOUR * 24
	readonly WEEK = this.DAY * 7
}
const inMills = new InMills()



/**
 * 默認權參數等
 */
class DefaultOpt{
	static new(){
		const o = new this()
		return o
	}
	/** 加ˡ事件ᵗ權重 */
	addWeightDefault = 0xfff
	addWeight = [0x1, 0x1ff, 0x7f0, 0xff0]
	/** ˣ削弱ᵗ分母 */
	debuffNumerator = 599999*1000*3600*24*90
	base = 20
}

type ChangeRecord = TempusEventRecord

/** 權重ˇ算ᵗ程中ᵗ統計 */
class Statistics{
/* 	static new_deprecated(){
		const o = new this()
		return o
	} */
	static new(finalAddEventPos:int){
		const o = new this()
		o.__init__(finalAddEventPos)
		return o
	}
	protected __init__(...param:Parameters<typeof Statistics.new>){
		const o = this
		o.finalAddEventPos = param[0]
	}
	weight = s.n(1.1)
	/**
	 * 當前ʃ処ˋ第幾個事件
	 * 統一在handleOne中 先自增、緣初值潙負一
	 */
	curPos = -1
	/** 今ᵗ時刻 */
	nunc = Tempus.new()
	/** 加ˡ事件ᵗ數 */
	cnt_add = 0
	cnt_rmb = 0
	/** 憶ᵗ次、若遇加ˡ事件則置零 */
	cnt_validRmb = 0 
	finalAddEventPos = 0
	records:ChangeRecord[] = []
}

type Word_t = I_Tempus_EventWord

class WordWeight implements I_WordWeight<Word_t>{

	protected constructor(){
		
	}
	
	static new(prop?:{}){
		const o = new this()
		return o
	}

	readonly This = WordWeight

	protected _wordId__changeRec = new Map<str, ChangeRecord[]>()
	get wordId__changeRec(){return this._wordId__changeRec}
	protected set wordId__changeRec(v){this._wordId__changeRec = v}
	

	protected _paramOpt = this.This.defaultOpt
	get paramOpt(){return this._paramOpt}
	set paramOpt(v){
		//this._paramOpt = v
	}

	setParam(key: string, v: any): boolean {
		return false
	}

	addChangeRecords(id:str, changeRecords:ChangeRecord[]){
		const z = this
		for(const r of changeRecords){
			key__arrMapPush(z.wordId__changeRec, id, r)
		}
	}

	static get Statistics(){
		return Statistics
	}

	static readonly defaultOpt = DefaultOpt.new()

	static get Handle3Events(){
		/** 處理單個單詞ᵗ單個Tempus_Event實例 */
		class Handle3Events{
			static new(prop:{
				_ww:WordWeight
				//,_tempus__event:Tempus_Event
				,_statistics:Statistics
				,_mw:Word_t
			}){
				const o = new this()
				o.__init__(prop)
				return o
			}

			protected __init__(...prop:Parameters<typeof Handle3Events.new>){
				const o = this
				Object.assign(o, ...prop)
				return o
			}

			readonly This = Handle3Events
			_mw:Word_t
			_ww:WordWeight
			_statistics:Statistics
			_cur_tempus__event:I_Tempus_Event
			static defaultOpt = WordWeight.defaultOpt

			addRecord(record:ChangeRecord){
				const z = this
				// z._ww.addChangeRecord(z._mw.word,record)
				//console.log(record)//t
				z._statistics.records.push(record)
			}

			handleAll(tempus_events:I_Tempus_Event[]){
				const z = this
				for(const t_e of tempus_events){
					z._cur_tempus__event = t_e
					z.handleOne()
				}
				z.extraHandleFinalEvent()
				return z._statistics
			}

			protected handleOne(){
				const z = this
				z._statistics.curPos ++
				const WE = WordEvent
				switch (z._cur_tempus__event.event){
					case WE.add:
						return z.handle_add()
					break;
					case WE.rmb:
						return z.handle_rmb()
					break;
					case WE.fgt:
						return z.handle_fgt()
					break;
					default:
						throw new Error(`unexpected default in switch-case`)
				}
			}
			
			protected handle_add(){
				const z = this
				const st = z._statistics
				st.cnt_add++ //加ˡ事件ᵗ計數ˇ加一
				st.cnt_validRmb = 0 //有效ᵗ憶ˡ事件ˋ逢加事件則置0
				const addWeight = z.This.defaultOpt.addWeight[st.curPos]??z.This.defaultOpt.addWeightDefault
				st.weight = s.m(
					st.weight, addWeight
				) // *= 默認加ˡ權重
				//錄ᵣ此輪迭代ʸ權重ᵗ變
				const rec = TempusEventRecord.new1(
					z._cur_tempus__event
					, st.weight
					, addWeight
				)
				// if(z._mw.word.wordShape === 'disguise'){
				// 	console.log(rec)//t+
				// }
				z.addRecord(rec)
				return st
			}

			protected handle_rmb(){
				const z = this
				const st = z._statistics
				st.cnt_rmb++
				st.cnt_validRmb++
				let weight_ = s.n(1.1)
				const lastRec = $last(z._statistics.records) as TempusEventRecord
				if(lastRec == void 0){
					throw new Error('last changeRecord is undef')
				}else if(WordEvent.add === lastRec.event){ //若上個事件潙 添
					st.weight = $n( s.d(st.weight, 1.1) ) //自除以1.1
				}else{
					weight_ = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._cur_tempus__event.tempus)
					weight_ = s.d(
						//weight_, z._mw.word.times_add
						weight_, $(z._mw.event__times.get(WordEvent.add), '')
					)
					if(s.c(weight_, 0)<=1){
						weight_ = s.n(1.01)
					}
				}
				const rec = TempusEventRecord.new1(z._cur_tempus__event, st.weight)
				// if(z._mw.word.wordShape === 'disguise'){ //t
				// 	console.log(st.curPos, st.finalAddEventPos, last(z._mw.date__event).event)
				// }

				// 算 debuff
				if(st.curPos >= st.finalAddEventPos && $last(z._mw.tempus_event_s).event === WordEvent.rmb ){
					//console.log(1)//t
					let nowDiffThen = Tempus.diff_mills(st.nunc, z._cur_tempus__event.tempus)
					let debuff = z._ww.getDebuff(
						s.m(
							nowDiffThen
							, sros.pow(
								//s.a(z.This.defaultOpt.base, z._mw.word.times_add)
								s.a( z.This.defaultOpt.base, $( z._mw.event__times.get(WordEvent.add) ) )
								,st.cnt_add
							)
						),
						s.m(
							z.This.defaultOpt.debuffNumerator
							,st.cnt_rmb
							,weight_
						),
						weight_
					)
					//console.log(st.weight)//t
					st.weight = $n( s.d(st.weight, debuff) )
					rec.reason.dateWeight = weight_
					rec.reason.debuff = debuff
					rec.after = st.weight
				}
				z.addRecord(rec)
				return st
			}

			protected handle_fgt(){
				const z = this
				const lastRec = $last(z._statistics.records) as TempusEventRecord
				let weight = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._cur_tempus__event.tempus)
				const st = z._statistics
				if(st.cnt_add >= 3){
					weight = s.m(
						weight
						,st.cnt_add
					)
				}
				if( s.c(weight, 1.5) < 0 ){
					weight = s.n(1.5)
				}
				st.weight = s.m( st.weight, weight )
				const rec = TempusEventRecord.new1(z._cur_tempus__event, st.weight)
				z.addRecord(rec)
				return st
			}

			protected extraHandleFinalEvent(){
				const z = this
				const curEv = z._cur_tempus__event.event
				const thatTime = z._cur_tempus__event.tempus
				const nunc = Tempus.new()
				const diffMills = Tempus.diff_mills(nunc, thatTime)
				if(curEv === WordEvent.add){
					const bonus = z._ww.calcLastAddBonus(diffMills)
					z._statistics.weight = s.m(
						z._statistics.weight, bonus
					)
					const rec = TempusEventRecord.new1(
						z._cur_tempus__event
						, z._statistics.weight
					)
					rec.reason.comment = 'extraHandleFinalEvent'
					z.addRecord(rec)
				}
			}
		}
		return Handle3Events
	}

	// checkIsResort(words:SvcWord3[]){

	// }

	async run0(mWords:Word_t[]) {
		const z = this
		
		for(let i = 0; i < mWords.length; i++){
			const uWord = mWords[i]
			// // 若已有匪權重 且未背過 則跳過 㕥應resort
			// if(
			// 	uWord.weight != void 0 
			// 	&& uWord.weight !== 0
			// 	&& uWord.status.memorize == void 0
			// ){
			// 	continue
			// }
			z.calc0(uWord)
			//uWord.weight = 114514 //t
			//z.calcTags(uWord)
		}
		mWords.sort((b,a)=>s.c(a.weight, b.weight))
		//console.log(z.word__changeRecord)//t *
		return mWords
	}

	async run(mWords:Word_t[]) {
		const z = this
		//mWords = z.filter(mWords)
		mWords = await z.run0(mWords)
		//mWords = await z.filterByTbl(mWords)
		//mWords = z.shuffer(mWords)
		return mWords
	}

	// shuffer(words:Word_t[]){
	// 	return _ENV.algo.getShuffle(
	// 		words, 8, 
	// 		Math.floor(words.length / 8)
	// 	)
	// }

	// /**
	//  * 英日英日英日英日拉
	//  * @param words 
	//  */
	// filterByTbl(
	// 	words:SvcWord[] // 權重高者在前
	// ){
	// 	const $ = _ENV.Ut.$
	// 	words = words.slice()
	// 	words = words.reverse() // 此後 權重高者在末
	// 	//按表名分類
	// 	const tbl__words = new Map<string, SvcWord[]>()
	// 	for(const w of words){
	// 		const tbl = (w.word.textWord.belong)
	// 		const habere = tbl__words.get(tbl)
	// 		if( habere == void 0 ){
	// 			tbl__words.set(tbl, [w])
	// 		}else{
	// 			habere.push(w)
	// 			tbl__words.set(tbl, habere)
	// 		}
	// 	}

	// 	const ans = [] as SvcWord[]
	// 	// const eng = $(tbl__words.get('english'))
	// 	// const jap = $(tbl__words.get('japanese'))
	// 	// const latin = $(tbl__words.get('latin'))
	// 	const eng = tbl__words.get('english')
	// 	const jap = tbl__words.get('japanese')
	// 	const latin = tbl__words.get('latin')
	// 	const italian = tbl__words.get('italian')
	// 	if(eng == void 0 || jap == void 0 || latin == void 0 || italian == void 0){
	// 		console.warn(`eng == void 0 || jap == void 0 || latin == void 0 || italian == void 0`)
	// 		return words
	// 	}
	// 	let i = 0
	// 	function engFn(){
	// 		const e = eng.pop()
	// 		if(e == void 0){
	// 			return
	// 		}
	// 		ans.push(e);i++
	// 	}
	// 	function japFn(){
	// 		const e = jap.pop()
	// 		if(e == void 0){
	// 			return
	// 		}
	// 		ans.push(e);i++
	// 	}
	// 	function latinFn(){
	// 		const e = latin.pop()
	// 		if(e == void 0){
	// 			return
	// 		}
	// 		ans.push(e);i++
	// 	}
	// 	function italianFn(){
	// 		const e = italian.pop()
	// 		if(e == void 0){
	// 			return
	// 		}
	// 		ans.push(e);i++
	// 	}
	// 	for(; i < words.length;){
	// 		engFn();japFn();
	// 		engFn();japFn();
	// 		engFn();japFn();
	// 		engFn();japFn();
	// 		latinFn();
	// 		italianFn();
	// 		//engFn()
	// 	}
	// 	return ans
	// }

	// filter(words:Word_t[]){
	// 	//return words
	// 	return words
	// 	// const z = this
	// 	// const ans = [] as SvcWord[]
	// 	// for(let i = 0; i < words.length; i++){
	// 	// 	const w = words[i]
	// 	// 	const tag = w.word.propertys
	// 	// 	// if(tag.includes('跨文化')){
	// 	// 	// 	ans.push(w)
	// 	// 	// }
	// 	// }
	// 	// return ans
	// }

	// /** 
	//  * 據 標籤 與 註釋 算權重
	//  * 使有(特定)標籤或註釋者 權重更高
	//  */
	// calcTags(word:SvcWord){
	// 	const z = this
	// 	if(word.word.tag.length > 0 || word.word.annotation.length > 0){
	// 		word.weight = s.m(
	// 			word.weight, 10
	// 		)
	// 		const rec = ChangeRecord.new(word.weight, 'tag_or_annotation')
	// 		ChangeRecord.push(z.wordId__changeRec, word.id, rec)
	// 	}
	// 	return word
	// }


	// calcTags(words:SvcWord3[]){
	// 	const z = this
	// 	function one(word:SvcWord3){
	// 		if(word.word.tag.length > 0 || word.word.annotation.length > 0){
	// 			word.weight = s.m(
	// 				word.weight, 10
	// 			)
	// 			const rec = ChangeRecord.new(word.weight, 'tag_or_annotation')
	// 			ChangeRecord.push(z.word__changeRecord, word.word, rec)
	// 		}
	// 	}
	// 	words.map(e=>one(e))
	// 	return words
	// }

	calc0(mWord:Word_t){
		const z = this
		const finalAddEventPos = z.This.finalAddEventPos(mWord.tempus_event_s)
		const st = z.This.Statistics.new(finalAddEventPos)
		const Handle3Events = z.This.Handle3Events
		const h3 = Handle3Events.new({
			_ww: z
			//,_tempus__event: mWord.date__event[0]
			,_statistics: st
			,_mw: mWord
		})
		// for(const tempus__event of mWord.date__event){
		// 	h3._cur_tempus__event = tempus__event
		// 	const st = h3.handleOne()
		// 	console.log(st.records.length)//t
		// }
		const ans = h3.handleAll(mWord.tempus_event_s)
		mWord.weight = ans.weight
		z.addChangeRecords(mWord.id, ans.records)
		
		// mWord.weight = h3._statistics.weight
		// z.addChangeRecords(mWord.word, h3._statistics.records)
		//t
		// if(mWord.word.wordShape === 'disguise'){
		// 	console.log(ans.records)//t *
		// }
	}

	/**
	 * 尋ᵣ末個 加ˡ事件
	 * @param tempus__event 
	 * @returns 
	 */
	static finalAddEventPos(tempus__event:I_Tempus_Event[]){
		let ans = 0
		for(let i = tempus__event.length-1; i>=0; i--){
			if(tempus__event[i].event === WordEvent.add){
				ans = i;
				break
			}
		}
		return ans
	}

	//TODO
	extraHandleFinalEvent(){

	}

	/**
	 * 算 事件ᵗ權重
	 * @param lastEventTempus 上個事件
	 * @param curEventTempus 當前事件
	 * @returns 
	 */
	getTimeWeightOfEvent(lastEventTempus:Tempus, curEventTempus:Tempus){
		const z = this
		let timeDiff = Tempus.diff_mills(curEventTempus, lastEventTempus)
		if(timeDiff <=0){throw new Error(`timeDiff <=0`)}
		return z.getTimeWeightByMillS(
			$n( s.d(timeDiff,1000) )
		)
	}

	/**
	 * 由時間跨度(毫秒)算時間ᵗ權重
	 * @param dateDif 
	 * @returns 
	 */
	getTimeWeightByMillS(dateDif:N2S){
		let ans = s.n(dateDif)
		ans = sros.pow(ans, 1/4) //1/2
		ans = s.d(ans, 1) //100
		if( s.c(ans,1) < 0 ){
			ans = s.n(1.01)
		}
		return $n(ans)
	}

	/**
	 * 憶ˡ事件 ᵗ 額外ᵗ效
	 */
	getDebuff(mills:number, numerator:number, weight=s.n(1)){
		let debuff = s.d(
			numerator
			,mills.sub(1000*60*360) // 100 min
		).add(1)  .mul(weight)
		debuff = sros.absolute(debuff)
		return $n(debuff)
	}

	/**
	 * 末ʹ事件潙加旹 算加成
	 * 其日期距今ʹ期 越短 則加成越大、即他ʹ況ˋ同旹、ʃ被加ʹ期更近 之詞ˋ更優先
	 */
	calcLastAddBonus(mills:num){
		let ans = s.d(
			s.m( inMills.DAY,30 )
			,mills
		)
		if( s.c(ans,1)<0 ){
			ans = s.n(1)
		}
		return ans
	}
}

__return._ = WordWeight.new()