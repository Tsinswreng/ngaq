
import { Sros, UN} from '@shared/Sros';
//import SingleWord2, { Tempus_Event, WordEvent } from './SingleWord2';
import { SingleWord2, Tempus_Event, WordEvent } from "@shared/entities/Word/Word";
import Tempus from '@shared/Tempus'
import { lastOf, lodashMerge } from '@shared/Ut';

Sros.extendNumberMethods()
const sros = Sros.new()
const $n = Sros.toNumber
const s = sros.short

/**
 * 㕥錄權重ˇ算ᵗ程
 */
class ChangeRecord{

	//public constructor()
	//public constructor(_tempus_event:Tempus_Event, after:number)

	public constructor(props:{
		_tempus_event:Tempus_Event, _after:UN, _weight:UN, _debuff?:UN
	}){
		//this._tempus_event = _.cloneDeep(_tempus_event)
		Object.assign(this, props)
	}

	private _tempus_event:Tempus_Event = void 0 as any // 姑ᵈ賦ᵗ初值、實則㕥構造函數創對象則此字段不應潙空
	;public get tempus_event(){return this._tempus_event;};;public set tempus_event(v){this._tempus_event=v;};

	/**
	 * 歷ᵣ當前ᵗ_tempus_event後 權重變後ᵗ量
	 */
	private _after:UN = 0 
	;public get after(){return this._after;};;public set after(v){this._after=v;};

	private _weight:UN = -1
	;public get weight(){return this._weight;};;public set weight(v){this._weight=v;};

	private _debuff?:UN
	;public get debuff(){return this._debuff;};;public set debuff(v){this._debuff=v;};

}

/**
 * 背單詞旹 出詞ᵗ權重
 */
export class WordPriority{

	//static sros = Sros.new<Sros_number>({number:'number'})

	protected constructor(){}

	static new(){
		return new this()
	}

	static newChild(){
		return new this()
	}


	/**
	 * 用new Function動態生成函數。
	 * 可用於自定義Priority子類
	 * @param code js代碼
	 * @returns 
	 */
	static custom_js<R=WordPriority>(code:string){
		const dependencyObj = {
			Sros:Sros
			,ChangeRecord:ChangeRecord
			,Tempus:Tempus
			,Priority:WordPriority
			,WordEvent:WordEvent
		}
		const dependencyMap = new Map(Object.entries(dependencyObj));
		const keys = dependencyMap.keys()
		const values = dependencyMap.values()
		
		const f = new Function(
			...keys
			,code
		)
		return () => {
			return f(...values) as R
		}
		
	}

	public static defaultConfig = {
		//默認ᵗ 添ᵗ權重
		addWeight : 0xF, //依現珩ᵗ算法、此太大則致times_add==1之詞ˋ湮
		//
		debuffNumerator : 1000*3600*24*90
		//
		,base: 20
	}

	protected _config:typeof WordPriority.defaultConfig = WordPriority.defaultConfig
	;public get config(){return this._config;};//<疑>{不顯式標明get方法ᵗ返ˡ值ᵗ類型、則其返ˡ值ᵗ類型ˋ自動被推斷潙類型芝同於set方法ᵗ入參ᵗ類型者}
	public setConfig(v:Partial<typeof WordPriority.defaultConfig>){
		this._config=lodashMerge({}, WordPriority.defaultConfig, v);
	}
	
	// ;public set config(v:Partial<typeof Priority.defaultConfig>){
	// 	//this._config=_.merge({}, Priority.defaultConfig, v);
	// 	this._config=lodashMerge({}, Priority.defaultConfig, v);
	// };

	protected _changeRecord:ChangeRecord[] = []
	get changeRecord(){return this._changeRecord;}; 
	set changeRecord(v){this._changeRecord=v;};

	protected _procedure:Function[] = [] //
	get procedure(){return this._procedure}

	/**
	 * 初權重
	 * @see lastOf(this.procedures)?.after??-1
	 */
	public get prio0num(){return lastOf(this.changeRecord)?.after??-1}

	// public solo_calcPrio0(neoTempus_eventMap:Tempus_Event){

	// 	let procedures:Procedure[] = this.procedures

	// 	const 此事件至上一事件間ᵗ時ˋ隔ᵗ毫秒ˇ取 = (curTempus:Tempus)=>{
	// 		let lastProcedure = lastOf(procedures)
	// 		Tempus.diff_mills(curTempus, lastProcedure.tempus_event.tempus)
	// 	}


	// 	const add = ()=>{
	// 		// if(WordEvent.ADD === lastOf(procedures).event){
	// 		// 	return
	// 		// }
	// 		//neoProcedure.after *= this.config.addWeight
	// 	}
	// 	const rmb = ()=>{

	// 	}

	// }

	/**
	 * 蔿 @see SingleWord2 對象算初權重
	 * @param {SingleWord2} sw 
	 */
	public calcPrio0(sw:SingleWord2){
		this.changeRecord = this.getPrio0Procedures(sw)
	}

	/**
	 * 蔿 @see SingleWord2 對象算並返@see Procedures 對象數組
	 * @param {SingleWord2} sw 
	 * @returns 
	 */
	public getPrio0Procedures(sw: SingleWord2){
		const self = this
		const nunc = Tempus.new()
		const dateToEventObjs = SingleWord2.getSortedDateToEventObjs(sw)
		let changeRecord:ChangeRecord[] = []
		let lastProcedure = lastOf(changeRecord)
		let add_cnt = 0
		let prio0 = s.n(1)
		let cnt_rmb = 0;
		let validRmbCnt = 0 //憶ᵗ次、若遇加ˡ事件則置零

		let finalAddEventOrder = 0
		for(let i = dateToEventObjs.length-1; i>=0; i--){
			if(dateToEventObjs[i].event === WordEvent.ADD){
				finalAddEventOrder = i;
				break
			}
		}

		const add = (tempus_event:Tempus_Event, i:number)=>{
			lastProcedure = lastOf(changeRecord)
			add_cnt++
			validRmbCnt = 0 //reset
			//prio0 = $n( s.m(prio0, this.config.addWeight) )
			prio0 = $n( prio0.mul(this.config.addWeight) )
			let unusProcedure = new ChangeRecord({_tempus_event: tempus_event, _after:prio0, _weight: this.config.addWeight})
			changeRecord.push(unusProcedure)
		}
		/**
		 * @see rmb
		 * @name rmb
		 * @param tempus_event 
		 */
		const rmb = (tempus_event:Tempus_Event, i:number)=>{
			lastProcedure = lastOf(changeRecord)
			cnt_rmb++
			validRmbCnt++
			let weight = s.n(1.1)
			if(lastProcedure===void 0){console.warn(`lastProcedure===void 0`)} // 每單詞ᵗ首個 WordEvent 當必潙加
			else if(	WordEvent.ADD === lastProcedure?.tempus_event.event	){
				prio0 = $n( s.d(prio0,1.1) )
				
			}else{
				weight = getWeight(lastProcedure.tempus_event, tempus_event)
				//prio0 /= (weight/2)
				//prio0 = $n( s.d(prio0, s.d(innerWeight,2)) )
				//weight = s.d(weight, 2)
				weight = s.d(
					weight
					, sw.times_add
				)
				if(s.c(weight,0)<=1){
					weight = s.n(1.01)
				}
				//weight = weight
			}
			
			const unusProcedure = new ChangeRecord({_tempus_event: tempus_event, _after:prio0, _weight:weight, _debuff:1})
			if(i<finalAddEventOrder){

				//return //加ˡ事件ᵗ前ᵗ憶ˡ事件ˋ皆不得有debuff
			
			}else if( lastOf(dateToEventObjs).event !== WordEvent.RMB ){

			}
			else{

				let nowDiffThen = Tempus.diff_mills(nunc, tempus_event.tempus)
				let debuff = s.n(1)
				//let debuff = self.getDebuff(nowDiffThen, this.config.debuffNumerator*cnt_rmb, weight)
				// let debuff = self.getDebuff(
				// 	s.m(
				// 		nowDiffThen
				// 		, sros.pow(
				// 			this.config.base
				// 			//10
				// 			, add_cnt
				// 		)// 加ᵗ次ˋ越多、憶ᵗ事件ᵗdebuff越弱
				// 	)
				// 	, this.config.debuffNumerator*cnt_rmb, weight
				// )
				
				// let debuff = self.getDebuff(
				// 	nowDiffThen. mul ( this.config.base.add(sw.times_add). pow (add_cnt) )
				// 	, this.config.debuffNumerator*cnt_rmb, weight
				// )
				debuff = self.getDebuff(
					nowDiffThen. mul ( this.config.base.add(sw.times_add). pow (add_cnt) )
					,this.config.debuffNumerator*cnt_rmb
					,weight
				)
				//if(lastOf(dateToEventObjs).event !== WordEvent.RMB){debuff=1} 斯句已前置
				//prio0 /= debuff
				//prio0 = $n( div(prio0, debuff*cnt_rmb) ) //[2023-10-30T23:38:58.000+08:00]{*cnt_rmb可使 詞芝憶ᵗ次ˋ多者更靠後、無論其忘ᵗ次。}
				prio0 = $n( s.d(prio0, debuff) )
				unusProcedure.debuff = debuff
				unusProcedure.after = prio0
			}
			
			changeRecord.push(unusProcedure)
		}

		const fgt = (tempus_event:Tempus_Event, i:number)=>{
			lastProcedure = lastOf(changeRecord)
			let weight = getWeight(lastProcedure.tempus_event, tempus_event)
			if(sw.times_add>=3){
				weight = weight.mul(sw.times_add)
			}
			if( s.c(weight, 1.5)<0 ){weight = s.n(1.5)}//修正
			//prio0 /= weight
			prio0 = $n( s.m(prio0, weight) ) 
			let unusProcedure = new ChangeRecord({_tempus_event: tempus_event, _after:prio0, _weight:weight})
			changeRecord.push(unusProcedure)
		}



		for(let i = 0; i < dateToEventObjs.length; i++){
			const dateToEvent = dateToEventObjs[i]
			switch (dateToEvent.event){
				case WordEvent.ADD: add(dateToEvent, i);break;
				case WordEvent.RMB: rmb(dateToEvent, i);break;
				case WordEvent.FGT: fgt(dateToEvent, i);break
				default: throw new Error('default');
			}


		}
		//若末ᵗ事件潙添則再乘一次加ˡ權重
		if(lastOf(dateToEventObjs).event===WordEvent.ADD){
			//procedures[procedures.length-1].after *= this.config.addWeight
			changeRecord[changeRecord.length-1].after = 
			changeRecord[changeRecord.length-1].after.mul(this.config.addWeight)
			// s.m(
			// 	procedures[procedures.length-1].after
			// 	,this.config.addWeight
			// )

			//console.log(procedures[procedures.length-1].after)//t
		}
		//若該詞有註則增權重、乘以加ˡ權重之半
		if(sw.annotation.length>0 || sw.tag.length>0){
			//procedures[procedures.length-1].after *= (this.config.addWeight/2)
			changeRecord[changeRecord.length-1].after = 
			s.d(
				changeRecord[changeRecord.length-1].after.mul(this.config.addWeight),
				2
			)
			// s.m(
			// 	procedures[procedures.length-1].after
			// 	,s.d(
			// 		this.config.addWeight
			// 		,2
			// 	)
			// )
		}

		function getWeight(lastTempus_event:Tempus_Event, curTempus_event:Tempus_Event){
			let timeDiff = Tempus.diff_mills(curTempus_event.tempus, lastTempus_event.tempus)
			if(timeDiff <=0){throw new Error(`timeDiff <=0`)}
			return self.getDateWeight(
				$n( s.d(timeDiff,1000) )
			)
		}

		//if(procedures.length >=2){console.log(procedures)}//t
		return changeRecord
		
		
	}

	
	
	/**
	 * 由時間跨度(毫秒)算時間ᵗ權重
	 * @param dateDif 
	 * @returns 
	 */
	public getDateWeight(dateDif:UN){
		let ans = s.n(dateDif)
		ans = sros.pow(ans, 1/4) //1/2
		ans = s.d(ans, 1) //100
		if( s.c(ans,1) < 0 ){
			ans = s.n(1.01)
		}
		return $n(ans)
		// let result = (1/100)*Math.pow(dateDif, 1/2)
		// if(result <= 1){
		// 	result = 1.01;
		// }
		// return $n(result)
	}

	public getDebuff(mills:number, numerator:number, weight=s.n(1)){
		//let debuff = (numerator/mills) + 1
		//let debuff = s.n(numerator)
		// debuff = s.d(debuff, mills)
		// debuff = s.a(debuff, 1)
		// debuff = s.m(debuff, weight)
		let debuff = s.d(
			numerator
			,mills.sub(1000*60*360) // 100 min
		).add(1)  .mul(weight)
		debuff = sros.absolute(debuff)

		// if( s.c(debuff,1)<0 ){
		// 	//debuff=s.n(1)
		// }
		return $n(debuff)
	}

	
}





/**
 * 自定義算法權重類: 先用定義Priority類之子類
 * 然後直接修改父類(即Priority)之newChild 靜態方法、使之返回子類實例
 * 最後返回自定義的子類
 * @returns 
 */
const f = ()=>{
	const Cl = class SubPriority extends WordPriority{
	
		protected constructor(){
			super()
		}
	
		public static override new(){
			// const o = new this() //如是則創父類之實例?
			const o = new SubPriority()
			console.log(o.prio0num)
			console.log(this)
			console.log(o instanceof WordPriority, o instanceof SubPriority)
			return o
		}
		override get prio0num(){return 100}

		override calcPrio0(sw: SingleWord2): void {
			//super._changeRecord = []//Class field '_changeRecord' defined by the parent class is not accessible in the child class via super.
			this._changeRecord = []
			sw=sw
		}
	
	}
	WordPriority.newChild = Cl.new
	console.log(Tempus.new())
	return Cl
	
}