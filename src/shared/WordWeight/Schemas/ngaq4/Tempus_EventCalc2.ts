import { I_ChangeRecord, I_WordWeight } from "@shared/interfaces/I_WordWeight"
import type { 
	I_WordForCalcWeight
	,I_Tempus_Event
} from "@shared/interfaces/WordIf"
import Tempus from "@shared/Tempus"

export type Word_t = I_WordForCalcWeight
//import type { N2S } from "@shared/tools/Sros"
import { Sros } from "@shared/tools/Sros"
import { TempusEventRecord } from "./ChangeRecord"
import { LearnBelong } from "@shared/model/word/NgaqRows"
import * as Le from '@shared/linkedEvent'
import { $ } from "@shared/Common"
type ChangeRecord = TempusEventRecord
const sros = Sros.new()
const s = sros.short
type N2S = number
class InMills{
	readonly SEC = 1000
	readonly MIN = 1000*60
	readonly HOUR = this.MIN * 60
	readonly DAY = this.HOUR * 24
	readonly WEEK = this.DAY * 7
}
const inMills = new InMills()

class Param{
	static new(){
		const o = new this()
		return o
	}
	/** 加ˡ事件ᵗ權重 */
	addWeightDefault = 0xffffff
	addWeight = [0x1, 0x7ff, 0xffff, 0xfffff]
	/** ˣ削弱ᵗ分母 */
	debuffNumerator = 36*inMills.DAY
	base = 20
	finalAddBonusDenominator = inMills.DAY*300
}
const param = new Param()

class Cnter{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Cnter.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return Cnter}
	nunc = Tempus.new()
	weight = s.n(1.1)
	curPos = -1
	/** 匪預計 */
	cnt_add = 0
	/** 匪預計 */
	cnt_rmb = 0
	/** 匪預計 */
	cnt_fgt = 0
	/** 末個加事件之後之rmb數 匪預計 */
	cnt_validRmb = 0
	finalAddEventPos = 0
	records: ChangeRecord[] = []

}


class ForOne{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof ForOne.new>){
		const z = this
		z.word = args[0]
		z._precount()
		return z
	}

	static new(word: Word_t){
		const z = new this()
		z.__init__(word)
		return z
	}

	addRecord(rec:ChangeRecord){
		const z = this
		z.cnter.records.push(rec)
	}

	_assignFinalAddPos(){
		const z = this
		const tempus__event_s = z.word.tempus_event_s
		for(let i = tempus__event_s.length -1; i >= 0; i--){
			const tempus_event = tempus__event_s[i]
			if(tempus_event.event === LearnBelong.add){
				z.cnter.finalAddEventPos = i
				break
			}
		}
	}

	/** @runOnInit */
	_precount(){
		const z = this
		z._assignFinalAddPos()
	}

	static run(word:Word_t){
		const z = this.new(word)
		z.run()
		z.word.weight = z.cnter.weight
		return z.cnter
	}

	run(){
		const z = this
		const word = z.word
		const cnter = z.cnter
		const tempus__event_s = word.tempus_event_s
		for(let i = 0; i < tempus__event_s.length; i++){
			cnter.curPos ++
			const tempus_event = tempus__event_s[i]
			switch(tempus_event.event){
				case LearnBelong.add:
					z.handle_add()
				break;
				case LearnBelong.rmb:
					z.handle_rmb()
				break;
				case LearnBelong.fgt:
					z.handle_fgt()
				break;
				default:
			}
			if(i === tempus__event_s.length-1){
				z.handleFinal()
			}
		}
	}

	//get This(){return ForOne}
	word:Word_t
	cnter = Cnter.new()

	handle_add(){
		const z = this
		z.cnter.cnt_add++
		const tempus_event = z.word.tempus_event_s[z.cnter.curPos]
		z.cnter.cnt_validRmb = 0
		let weight0 = param.addWeight[z.cnter.cnt_add-1]??param.addWeightDefault
		let weight = weight0
		let finalAddBonus:N2S|undef
		if(z.cnter.curPos === z.cnter.finalAddEventPos){
			finalAddBonus = z.calcFinalAddBonus()
			weight = s.m(weight, finalAddBonus)
		}
		z.cnter.weight = s.m(z.cnter.weight, weight) // *= weight
		const rec = TempusEventRecord.new1(
			tempus_event
			,z.cnter.weight
			,weight0
		)
		rec.reason.finalAddBonus = finalAddBonus
		z.addRecord(rec)
	}

	handle_rmb(){
		const z = this
		z.cnter.cnt_rmb++
		const tempus_event = z.getCurEvent()
		let weight0 = z.calcTimeWeightForCur()
		let debuff:N2S|undef

		//TOFIX 蠹:finalAddEventPos之前者亦有debuff
		if(//若有debuff
			z.cnter.curPos >= z.cnter.finalAddEventPos
			&& z.getFinalEvent().event === LearnBelong.rmb
		){
			debuff = z.calcDebuff()
			let weight = s.m(weight0, debuff)
			z.cnter.weight = s.d(z.cnter.weight, weight)

		}else{
			z.cnter.weight = s.d(z.cnter.weight, weight0)
		}
		const rec = TempusEventRecord.new1(tempus_event, z.cnter.weight, weight0, debuff)
		z.addRecord(rec)
	}


	handle_fgt(){
		const z = this
		z.cnter.cnt_fgt++
		const prev = z.getPrevEvent()
		let weight0:N2S
		if(prev.event === LearnBelong.add){
			weight0 = s.n(1.01)
		}else{
			weight0 = z.calcTimeWeightForCur()
			weight0 = s.m(weight0, z.cnter.cnt_add) //curPos之後之cnt_add不算
			weight0 = s.d(weight0, 10)
		}
		z.cnter.weight = s.m(z.cnter.weight, weight0)
		const rec = TempusEventRecord.new1(z.getCurEvent(), z.cnter.weight, weight0)
		z.addRecord(rec)
	}

	handleFinal(){

	}

	getCurEvent(){
		const z = this
		return z.word.tempus_event_s[z.cnter.curPos]
	}

	getPrevEvent(){
		const z = this
		const ans = z.word.tempus_event_s[z.cnter.curPos-1]
		if(ans == void 0){
			throw new Error("last is void") // 首個事件必潙add
		}
		return ans
	}

	getFinalEvent(){
		const z = this
		const ans = z.word.tempus_event_s.at(-1)
		if(ans == void 0){
			throw new Error("final event is void") // 首個事件必潙add
		}
		return ans
	}

	getFinalAddEvent(){
		const z = this
		const ans = z.word.tempus_event_s.at(z.cnter.finalAddEventPos)
		if(ans == void 0){
			throw new Error("fianl add event is void") // 首個事件必潙add
		}
		return ans
	}

	getNunc(){
		const z = this
		return z.cnter.nunc
	}


	curDiffPrev_mills(){
		const z = this
		const cur = z.getCurEvent()
		const prev = z.getPrevEvent()
		const ans = Tempus.diff_mills(
			cur.tempus, prev.tempus
		)
		if(ans < 0){
			throw new Error("ans < 0")
		}
		return s.n(ans)
	}

	nuncDiffFinalAdd(){
		const z = this
		const finalAdd = z.getFinalAddEvent()
		const ans = Tempus.diff_mills(
			z.cnter.nunc, finalAdd.tempus
		)
		if(ans < 0){
			throw new Error("ans < 0")
		}
		return s.n(ans)
	}

	calcFinalAddBonus(){
		const z = this
		const nuncDiffFinalAdd = z.nuncDiffFinalAdd()
		//console.log(nuncDiffFinalAdd)//t 0
		let ans = s.n(nuncDiffFinalAdd)
		ans = s.d(param.finalAddBonusDenominator, ans) // 30天後過期
		const learnedTimes = z.word.tempus_event_s.length
		ans = s.d(ans ,s.m(learnedTimes, 1)) // 已學習次數越多 加成越少
		if(s.c(ans, 0) <= 1 ){
			ans = s.n(1)
		}
		return ans
	}

	

	/**
	 * @pure
	 * @param mills 
	 * @returns 
	 */
	calcTimeWeight(mills:N2S){
		let ans = s.n(mills)
		ans = s.d(ans ,1000)
		ans = sros.pow(ans, 1/4)
		if(s.c(ans, 1) < 0){
			ans = s.n(1.01)
		}
		return ans
	}

	calcTimeWeightForCur(){
		const z = this
		return z.calcTimeWeight(
			z.curDiffPrev_mills()
		)
	}

	/**
	 * 含finalAddBonus
	 */
	calcDebuff(){
		const z = this
		let ans = s.n(1)
		const diff = Tempus.diff_mills(
			z.getNunc(), z.getCurEvent().tempus
		)
		let debuffNumerator = param.debuffNumerator
		if(diff < inMills.HOUR*12){
			debuffNumerator = s.m(debuffNumerator, 100)
		}
		ans = s.d(
			debuffNumerator
			,s.s(diff, inMills.MIN*100) // 冀 剛憶得之詞 于100分鍾內不複出
		)
		ans = sros.absolute(ans)
		if(s.c(ans, 0) <= 1){
			ans = s.n(1)
		}
		return ans
	}

	/**
	 * 末ʹ事件潙加旹 算加成
	 * 其日期距今ʹ期 越短 則加成越大、即他ʹ況ˋ同旹、ʃ被加ʹ期更近 之詞ˋ更優先
	 */
	calcBonusWhenFinalIsAdd(){
		const z = this
		const mills = Tempus.diff_mills(z.getNunc(), z.getCurEvent().tempus)
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


export class Tempus_EventCalc implements I_WordWeight<Word_t>{

	static new(){
		return new this()
	}

	Run(words: Word_t[]): Task<Word_t[]> {
		const z = this
		for(const w of words){
			const cnter = ForOne.run(w)
			z.wordId__changeRec.set(w.id, cnter.records)
		}
		words.sort((b,a)=>s.c($(a.weight), $(b.weight)))
		return Promise.resolve(words)
	}
	wordId__changeRec: Map<string, I_ChangeRecord[]> = new Map()
	paramOpt?: kvobj<string, any> | undefined
	setArg(key: string, v: any): boolean {
		return true
	}

}
