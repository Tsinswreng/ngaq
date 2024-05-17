//<@delete>
import * as _ENV from '@shared/WordWeight/weightEnv'
//type import
import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { InstanceType_ } from "@shared/Type"
//</@delete>
/* 
自定義權重算法ʹ例
載入旹、程序ˋ自動 添 依賴(即 L)、勿手動ᵈ褈添
肰寫碼旹、若[不寫 import * as L from "./_lib"]則{報錯且不利代碼提示}
遂定: <@ｄｅｌｅｔｅ></@ｄｅｌｅｔｅ> 中ʹ字串ˋ 載入旹 被刪(改半角)
(正則暴力替換、不慮 配對否。)
整個文件作潙一個函數、new Function('L', code)
需return 一對象 芝叶I_WordWeightˉ 接口者
*/


const sros = _ENV.Sros_.Sros.new()
const s = sros.short
const Tempus_Event = _ENV.Word_.Tempus_Event
type Tempus_Event = InstanceType_<typeof Tempus_Event>
const WordEvent = _ENV.Word_.WordEvent
type WordEvent = _ENV.Word_.WordEvent
//type WordEvent = InstanceType_<typeof WordEvent>
const Tempus = _ENV.Tempus
type Tempus = InstanceType_<typeof _ENV.Tempus>
type N2S = _ENV.Sros_.N2S
const Word = _ENV.Word_.Word
type Word = InstanceType_<typeof Word>
const $n = _ENV.Sros_.Sros.toNumber.bind(_ENV.Sros_.Sros)
const last = _ENV.Ut.lastOf
const SvcWord = _ENV.SvcWord
type SvcWord = InstanceType_<typeof _ENV.SvcWord>

const ChangeRecord = _ENV.ChangeRecord
type ChangeRecord =_ENV.ChangeRecord

const Base = _ENV.BaseWeight
type Base = _ENV.BaseWeight
//type Statistics = InstanceType_<typ

//___________________________________________________



/**
 * 默認權參數等
 */
class DefaultOpt{
	static new(){
		const o = new this()
		return o
	}
	/** 加ˡ事件ᵗ權重 */
	addWeight = 0xF
	/** ˣ削弱ᵗ分母 */
	debuffNumerator = 99999*1000*3600*24*90
	base = 20
}

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



class WordWeight extends Base implements I_WordWeight{

	protected constructor(){
		super()
	}

	static new(prop?:{}){
		const o = new this()
		return o
	}

	readonly This = WordWeight

	protected _word__changeRecord:Map<Word, ChangeRecord[]> = new Map()
	get word__changeRecord(){return this._word__changeRecord}
 
	// protected _changeRecord:_ENV.ChangeRecord[] = []
	// get changeRecord(){return this._changeRecord}
	// set changeRecord(v){this._changeRecord = v}

	protected _paramOpt = this.This.defaultOpt
	get paramOpt(){return this._paramOpt}
	set paramOpt(v){
		//this._paramOpt = v
	}

	addChangeRecords(word:Word, changeRecords:ChangeRecord[]){
		const z = this
		for(const r of changeRecords){
			ChangeRecord.push(z.word__changeRecord, word, r)
		}
		// let dʼʹ = 1
		// let ˊ = 3
		
		// let ˮ = 4
		// let ʼʽ·ˆˇˈˉˊˋːˤˌ
		// let 

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
				,_mw:SvcWord
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
			_mw:SvcWord
			_ww:WordWeight
			_statistics:Statistics
			_cur_tempus__event:Tempus_Event
			static defaultOpt = WordWeight.defaultOpt

			addRecord(record:ChangeRecord){
				const z = this
				// z._ww.addChangeRecord(z._mw.word,record)
				//console.log(record)//t
				z._statistics.records.push(record)
			}

			handleAll(tempus_events:Tempus_Event[]){
				const z = this
				for(const t_e of tempus_events){
					z._cur_tempus__event = t_e
					z.handleOne()
				}
				return z._statistics
			}

			protected handleOne(){
				const z = this
				z._statistics.curPos ++
				const WE = WordEvent
				switch (z._cur_tempus__event.event){
					case WE.ADD:
						return z.handle_add()
					break;
					case WE.RMB:
						return z.handle_rmb()
					break;
					case WE.FGT:
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
				st.weight = s.m(
					st.weight, z.This.defaultOpt.addWeight
				) // *= 默認加ˡ權重
				//錄ᵣ此輪迭代ʸ權重ᵗ變
				const rec = ChangeRecord.new1(
					z._cur_tempus__event
					, st.weight
					, z._ww.paramOpt.addWeight
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
				const lastRec = last(z._statistics.records)
				if(lastRec == void 0){
					throw new Error('last changeRecord is undef')
				}else if(WordEvent.ADD === lastRec.event){ //若上個事件潙 添
					st.weight = $n( s.d(st.weight, 1.1) ) //自除以1.1
				}else{
					weight_ = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._cur_tempus__event.tempus)
					weight_ = s.d(
						weight_, z._mw.word.times_add
					)
					if(s.c(weight_, 0)<=1){
						weight_ = s.n(1.01)
					}
				}
				const rec = ChangeRecord.new1(z._cur_tempus__event, st.weight)
				// if(z._mw.word.wordShape === 'disguise'){ //t
				// 	console.log(st.curPos, st.finalAddEventPos, last(z._mw.date__event).event)
				// }
				if(st.curPos >= st.finalAddEventPos && last(z._mw.date__event).event === WordEvent.RMB ){
					//console.log(1)//t
					let nowDiffThen = Tempus.diff_mills(st.nunc, z._cur_tempus__event.tempus)
					let debuff = z._ww.getDebuff(
						s.m(
							nowDiffThen
							, sros.pow(
								s.a(z.This.defaultOpt.base, z._mw.word.times_add)
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
					rec.dateWeight = weight_
					rec.debuff = debuff
					rec.after = st.weight

				}
				z.addRecord(rec)
				return st
			}

			protected handle_fgt(){
				const z = this
				const lastRec = last(z._statistics.records)
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
				const rec = ChangeRecord.new1(z._cur_tempus__event, st.weight)
				z.addRecord(rec)
				return st
			}
		}
		return Handle3Events
	}

	// checkIsResort(words:SvcWord[]){

	// }

	async run0(mWords:SvcWord[]) {
		const z = this
		
		for(let i = 0; i < mWords.length; i++){
			const uWord = mWords[i]
			// 若已有匪權重 且未背過 則跳過 㕥應resort
			if(
				uWord.weight != void 0 
				&& uWord.weight !== 0
				&& uWord.status.memorize == void 0
			){
				continue
			}
			z.calc0(uWord)
			//uWord.weight = 114514 //t
		}
		mWords.sort((b,a)=>s.c(a.weight, b.weight))
		//console.log(z.word__changeRecord)//t *
		return mWords
	}

	async run(mWords:SvcWord[]) {
		const z = this
		mWords = z.filter(mWords)
		mWords = await z.run0(mWords)
		mWords = await z.filterByTbl(mWords)
		mWords = z.shuffer(mWords)
		return mWords
	}

	shuffer(words:SvcWord[]){
		return _ENV.algo.getShuffle(
			words, 8, 
			Math.floor(words.length / 8)
		)
	}

	/**
	 * 英日英日英日英日拉
	 * @param words 
	 */
	filterByTbl(
		words:SvcWord[] // 權重高者在前
	){
		const $ = _ENV.Ut.$
		words = words.slice()
		words = words.reverse() // 此後 權重高者在末
		//按表名分類
		const tbl__words = new Map<string, SvcWord[]>()
		for(const w of words){
			const tbl = (w.word.table)
			const habere = tbl__words.get(tbl)
			if( habere == void 0 ){
				tbl__words.set(tbl, [w])
			}else{
				habere.push(w)
				tbl__words.set(tbl, habere)
			}
		}

		const ans = [] as SvcWord[]
		const eng = $(tbl__words.get('english'))
		const jap = $(tbl__words.get('japanese'))
		const latin = $(tbl__words.get('latin'))
		let i = 0
		function engFn(){
			const e = eng.pop()
			if(e == void 0){
				return
			}
			ans.push(e);i++
		}
		function japFn(){
			const e = jap.pop()
			if(e == void 0){
				return
			}
			ans.push(e);i++
		}
		function latinFn(){
			const e = latin.pop()
			if(e == void 0){
				return
			}
			ans.push(e);i++
		}
		for(; i < words.length;){
			engFn();japFn();
			engFn();japFn();
			engFn();japFn();
			engFn();japFn();
			latinFn();
		}
		return ans
	}

	filter(words:SvcWord[]){
		const z = this
		const ans = [] as SvcWord[]
		for(const w of words){
			// if(w.word.times_add===1){
			// 	ans.push(w)
			// }
			ans.push(w)
		}
		return ans
	}

	calc0(mWord:SvcWord){
		const z = this
		const finalAddEventPos = z.This.finalAddEventPos(mWord.date__event)
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
		const ans = h3.handleAll(mWord.date__event)
		mWord.weight = ans.weight
		z.addChangeRecords(mWord.word, ans.records)
		
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
	static finalAddEventPos(tempus__event:Tempus_Event[]){
		let ans = 0
		for(let i = tempus__event.length-1; i>=0; i--){
			if(tempus__event[i].event === WordEvent.ADD){
				ans = i;
				break
			}
		}
		return ans
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
}

//throw new Error()
//@ts-ignore
return WordWeight.new()