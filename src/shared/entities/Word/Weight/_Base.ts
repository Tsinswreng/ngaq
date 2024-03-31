import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { MemorizeWord } from "../MemorizeWord"
//import { weightLib as L } from "./_lib"
import * as L from "./_lib"
import { InstanceType_ } from "@shared/Type"

const sros = L.Sros.Sros.new()
const s = sros.short
const Tempus_Event = L.Word.Tempus_Event
type Tempus_Event = InstanceType_<typeof Tempus_Event>
const WordEvent = L.Word.WordEvent
type WordEvent = L.Word.WordEvent
//type WordEvent = InstanceType_<typeof WordEvent>
const Tempus = L.Tempus
type Tempus = InstanceType_<typeof L.Tempus>
type N2S = L.Sros.N2S
type Word = L.Word.Word
const $n = L.Sros.Sros.toNumber.bind(L.Sros.Sros)
const last = L.Ut.lastOf
//type Statistics = InstanceType_<typeof WordWeight.Statistics>
class Record{
	
	static new(tempus__event:Tempus_Event, after:N2S, dateWeight?:N2S, debuff?:N2S){
		const o = new this()
		o.after = after
		o.tempus = tempus__event.tempus
		o.event = tempus__event.event
		o.dateWeight = dateWeight
		o.debuff = debuff
		return o
	}

	after:N2S
	tempus:Tempus
	event: WordEvent
	dateWeight?:N2S
	debuff?:N2S

	static push<K,VEle>(map:Map<K,VEle[]>, k:K, ele:VEle){
		L.Ut.key__arrMapPush(map, k, ele)
	}
}



class DefaultOpt{
	static new(){
		const o = new this()
		return o
	}
	addWeight = 0xF
	debuffNumerator = 1000*3600*24*90
	base = 20
}

class Statistics{
	static new(){
		const o = new this()
		return o
	}
	weight = s.n(0)
	curPos = 0 //當前ʃ処ˋ第幾個事件
	nunc = Tempus.new()
	cnt_add = 0
	cnt_rmb = 0
	cnt_validRmb = 0 //憶ᵗ次、若遇加ˡ事件則置零
	finalAddEventPos = 0
	records:Record[] = []
}



export class WordWeight implements I_WordWeight{

	protected constructor(){

	}

	static new(prop?:{}){
		const o = new this()
		return o
	}

	readonly This = WordWeight

	protected _word__changeRecord:Map<Word, Record[]> = new Map()
	get word__changeRecord(){return this._word__changeRecord}

	/** 關閉計算過程記錄旹 改此方法 */
	addChangeRecord(word:Word, changeRecord:Record){
		const z = this
		Record.push(z.word__changeRecord, word, changeRecord)
	}

	static get Statistics(){
		return Statistics
	}

	static readonly defaultOpt = DefaultOpt.new()

	static get Handle3Events(){
		class Handle3Events{
			static new(prop:{
				_ww:WordWeight
				,_tempus__event:Tempus_Event
				,_statistics:Statistics
			}){
				const o = new this()
				Object.assign(o, prop)
				return o
			}

			readonly This = Handle3Events
			_mw:MemorizeWord
			_ww:WordWeight
			_statistics:Statistics
			_tempus__event:Tempus_Event
			static defaultOpt = WordWeight.defaultOpt

			addRecord(record:Record){
				const z = this
				// z._ww.addChangeRecord(z._mw.word,record)
				z._statistics.records.push(record)
			}
			
			handleAdd(){
				const z = this
				const st = z._statistics
				st.cnt_add++
				st.cnt_validRmb = 0 //reset
				st.weight = s.m(
					st.weight, z.This.defaultOpt.addWeight
				)
				const rec = Record.new(z._tempus__event, st.weight)
				z.addRecord(rec)
			}
			handleRmb(){
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
					weight_ = z._ww.getTimeWeightOfEvent(lastRec.tempus, z._tempus__event.tempus)
					weight_ = s.d(
						weight_, z._mw.word.times_add
					)
					if(s.c(weight_, 0)<=1){
						weight_ = s.n(1.01)
					}
				}
				const rec = Record.new(z._tempus__event, st.weight)
				if(st.curPos >= st.finalAddEventPos && last(z._mw.date__event).event === WordEvent.RMB ){
					let nowDiffThen = Tempus.diff_mills(st.nunc, z._tempus__event.tempus)
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
					st.weight = $n( s.d(st.weight, debuff) )
					rec.debuff = debuff
					rec.after = st.weight
				}
				z.addRecord(rec)
			}

		}
		return Handle3Events
	}

	run(mWords:MemorizeWord[]) {
		
	}

	calc0(mWord:MemorizeWord){
		const z = this
		const st = z.This.Statistics.new()
		st.finalAddEventPos = z.This.finalAddEventPos(mWord.date__event)

	}

	handleAdd(st:Statistics, tempus__event:Tempus_Event){
		const z = this
		st.cnt_add++
		st.cnt_validRmb = 0 //reset
		st.weight = s.m(
			st.weight, z.This.defaultOpt.addWeight
		)
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

/* 

_metadata表增一字段、id潙0、以存總ᵗ默認ᵗ權重算法。
其創ʴᵗ時即建元數據表之時。

表ʸ存ᵗ權重算法代碼ˋ用json
從數數據表中取出特定表ᵗ權重算法類
支持導入他ᵗ表ᵗ權重算法類、然後改參數。

*/