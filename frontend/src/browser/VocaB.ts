//23.06.04-0010
//v2.0.3
/*縮寫:
	cur	current
	rmb	remember
	fgt	forget
*
* */


/*待做:{
多語混學
設時限、逾時不點記得ˡ按鈕則算不記得
示上個詞旹示權重ᵗ變
跳轉
複習()秒內所忘
今天記得ᵗ詞ˋ今日內再現ᵗ權重ˋ宜降。
跳過當前ᵗ詞
日期對單詞事件疑似每操作一次就排序一次
詞ˇ管理 如由id查詞
23.06.05-2153 {按鈕阻塞}
23.06.05-2145 {
	讓用戶篩選權重 如權重小於某者則不示 添ᵗ次ˋ不足兩次者則不示
	配置 隨機數加成ᵗ力度
	然則、權重ˉ屬性ˋ可助于學近期ʸ添ᵗ新詞、自ᵈ大增ᵣ隨機數以潙權重ᵗ加成、㕥亂ˢ原ᵗ權重則可助于複習。
}
[23.06.15-1309,]{按˪憶或忘之按鈕後則示其權重ᵗ變ᵗ量}
}
}
*/
//import * as $ from 'jquery';
//import axios from "axios";
/*
import {response} from "express";
import {data} from "jquery";
*/
//const moment = require('moment')
//import {cssNumber} from "jquery";



declare var moment: any; //即momentjs 但是我還不會導包
type lingType = ''|'eng'|'jap'|'lat' //沒用的東西

enum WordEvent{
	ADD=0,
	REMEMBER=1,
	FORGET=-1
}



interface Date_wordEvent{
	date: number,
	wordEvent: WordEvent
}




export class Procedure {
	private _date_wordEvent?:Date_wordEvent; //最好別在後面寫問號洏昰寫清Date_wordEvent | undefined、不然用idea生成ᵗgetter 和 setter 有謬
	private _eventDurationOfLastToThis?: number //單位ˋ秒、從當前ᵗ事件ᵗ日期 至 前個ᐪ  非後個!
	private _dateWeight?:number
	private _durationOfLastRmbEventToNow?:number
	private _dateDebuff?:number
	private _befPrio?:number //變ᵗ前ᵗ優先度
	private _aftPrio:number = 1//變ᵗ後ᵗ優先度
	private _randomBonus:number = 0;
	
	public constructor() {
	}
	
	
	get date_wordEvent():Date_wordEvent | undefined{
		return this._date_wordEvent;
	}
	
	set date_wordEvent(value: Date_wordEvent | undefined) {
		this._date_wordEvent = value;
	}
	
	get eventDurationOfLastToThis(): number | undefined{
		return this._eventDurationOfLastToThis;
	}
	
	set eventDurationOfLastToThis(value: number | undefined) {
		this._eventDurationOfLastToThis = value;
	}
	
	get dateWeight(): number | undefined{
		return this._dateWeight;
	}
	
	set dateWeight(value: number | undefined) {
		this._dateWeight = value;
	}
	
	get durationOfLastRmbEventToNow(): number | undefined {
		return this._durationOfLastRmbEventToNow;
	}
	
	set durationOfLastRmbEventToNow(value: number | undefined) {
		this._durationOfLastRmbEventToNow = value;
	}
	
	get dateDebuff(): number | undefined {
		return this._dateDebuff;
	}
	
	set dateDebuff(value: number | undefined) {
		this._dateDebuff = value;
	}
	
	get befPrio(): number | undefined{
		return this._befPrio;
	}
	
	set befPrio(value: number | undefined) {
		this._befPrio = value;
	}
	
	get aftPrio(): number {
		return this._aftPrio;
	}
	
	set aftPrio(value: number) {
		this._aftPrio = value;
	}
	
	get randomBonus(): number {
		return this._randomBonus;
	}
	
	set randomBonus(value: number) {
		this._randomBonus = value;
	}
}

export class Priority{
	private _word:SingleWordB|undefined;  //不寫|undefined就可能無限遞歸調用
	private _priority_num:number|undefined; //終ᵗ權重
	private _prio0:number|undefined //初權重
	private static _numerator:number = 3600 //分子  23.06.05-1130默認值改爲3600*24 [23.06.10-2342,]{改潙3600}
	private static _defaultAddWeight:number = 200; //23.06.05-1158默認值改爲100 //[23.06.13-1047,]{改爲靜態}
	public static deemAsRememberedPrio0:number = Priority._defaultAddWeight // [23.06.15-2203,]{當初權重低於斯量旹則視作既誌。}
	private _addWeight:number = 1
	private _randomRange_max:number = 0
	private _bonus:number|undefined
	private _dateThen:number = 0; // 當時ᵗ日期時間
	
	/*private _randomBuff:number = -1//棄用˪
	private _prio1:number = -1 //棄用˪
	private _dateDifs:number[] = []//棄用˪
	private _dateWeights:number[] = []//棄用˪*/
	private _procedure: Procedure[] = []
	
	
	get bonus():number|undefined{
		return this._bonus;
	}
	
	private set bonus(value: number|undefined) {
		this._bonus = value;
	}
	
	public get defaultAddWeight(): number {
		return Priority._defaultAddWeight;
	}
	
	public set defaultAddWeight(value: number) {
		Priority._defaultAddWeight = value;
	}
	
	get priority_num(): number|undefined {
		return this._priority_num;
	}
	
	set priority_num(value: number|undefined) {
		this._priority_num = value;
	}
	
	get dateThen(): number {
		return this._dateThen;
	}
	
	set dateThen(value: number) {
		this._dateThen = value;
	}
	
	get procedure(): Procedure[] {
		return this._procedure;
	}
	
	set procedure(value: Procedure[]) {
		this._procedure = value;
	}
	
	get word(): SingleWordB|undefined {
		return this._word;
	}
	
	set word(value: SingleWordB|undefined) {
		if(value){
			/*let sub = JSON.parse(JSON.stringify(value))
			delete sub.priorityObj
			this._word = sub;*/
			this._word = value
		}else{
			throw new Error('往set裏傳undefined')
		}
		
	}
	
	get numerator(): number {
		return Priority._numerator;
	}
	
	set numerator(value: number) {
		Priority._numerator = value;
	}

	static get numerator(): number {
		return Priority._numerator;
	}
	
	static set numerator(value: number) {
		Priority._numerator = value;
	}
	
	get addWeight(): number {
		return this._addWeight;
	}
	
	set addWeight(value: number) {
		this._addWeight = value;
	}
	
	get prio0(): number|undefined {
		if(!this._prio0){
			//this.assignPrio0()
			this.calcPrio0() //[23.06.16-2054,]
		}
		return this._prio0;
	}
	
	private set prio0(value: number|undefined) {
		this._prio0 = value;
	}
	
	get randomRange_max(): number {
		return this._randomRange_max;
	}
	
	set randomRange_max(value: number) {
		this._randomRange_max = value;
	}
	
	
	
	constructor() {
	
	}


	/**
	 * [23.06.16-2048,]
	 * v23.06.21-1531
	 * @param priorityObj 
	 * @param date_allEventObjs 
	 * @returns 
	 */

	//[23.06.22-0930,]<待叶>{判斷原procedure中昰否含ᵣ傳入ᵗdate、㕥防複計。}
	public calcPrio0(priorityObj:Priority=this, date_allEventObjs?:Date_wordEvent[]){
		//判空
		if(!priorityObj.word){throw new Error('!priorityObj.word')}
		if(!date_allEventObjs){date_allEventObjs = priorityObj.word.date_allEventObjs}
		//if(!date_allEventObjs){throw new Error('!date_allEventObjs')}
/* 
		//<除重>
		//[23.06.22-1127,]<可優化>{可試ˣ避ᵣˌ重複ᵈ建ᵣset}
		//把已有ᵗ日期 添進集合裏
		let tempSet:Set<number> = new Set();
		for(let i = 0; i < priorityObj.word.date_allEventObjs.length; i++){
			tempSet.add(priorityObj.word.date_allEventObjs[i].date)
		}
		//console.log(tempSet)//t
		//let temp_date_allEventObjs = new Array(date_allEventObjs) 不能如是複製數組、否則返回二維數組?
		//let temp_date_allEventObjs = date_allEventObjs.slice()
		let temp_date_allEventObjs:Date_wordEvent[] = []
		for(let i = 0; i < date_allEventObjs.length; i++){
			if(tempSet.has(date_allEventObjs[i].date)){

			}else{
				temp_date_allEventObjs.push(date_allEventObjs[i])
			}
		}
		date_allEventObjs = temp_date_allEventObjs
		//console.log(date_allEventObjs)//t
		//</除重>
 */
		//獲取當時的時間
		const timeNow:number = parseInt(moment().format('YYYYMMDDHHmmss'))
		
		priorityObj.dateThen = timeNow;
		//priorityObj._prio0 = 1; //[,23.06.20-2101]
		priorityObj._prio0??=1 
		
		let addEvent_cnt = 0; //計數
		let tempProcedure:Procedure
		//先 專門處理添加事件
		for(let j = 0; j < date_allEventObjs.length; j++){ 
			if(date_allEventObjs[j].wordEvent !== WordEvent.ADD)
				{continue}

			tempProcedure = new Procedure();
			tempProcedure.date_wordEvent = date_allEventObjs[j]
			addEvent_cnt++;
			tempProcedure.befPrio = priorityObj._prio0;
			//[23.06.15-2114,]{第三次複加之後、重複且連續ᵗ加ˡ事件ᵘ、減其增ᵗ權。昔斯司詞程序未造成旹、不能以ᶦ複習單詞、故會有詞芝連續複添ᵗ次ˋ甚多者、權亦益增。程序未成 不能複習之故也。今程序既成、若及時ᵈ複習、則每詞ᵗ權ˋ皆不應極端。}
			if(addEvent_cnt >= 3 && date_allEventObjs[j-1] && date_allEventObjs[j-1].wordEvent === WordEvent.ADD){
				priorityObj._prio0 *= 2 //priorityObj.defaultAddWeight;
			}else{
				priorityObj._prio0 *= priorityObj.defaultAddWeight;
			}
			tempProcedure.aftPrio = priorityObj._prio0;
			priorityObj.procedure.push(tempProcedure)
		}//加ˡ事件ˇᵗ處理ˋ終˪。

		//若一個單詞ᵗ添ᵗ次ˋ不止一次、且從未複習過、則益增其權重、以達的芝優先背新詞
		if(addEvent_cnt === date_allEventObjs.length && addEvent_cnt >= 2){
			priorityObj._prio0 += Math.pow(priorityObj._prio0, addEvent_cnt) //[23.06.07-2320,]
			return;//直接return 不處理憶與忘ˉ事件 節約ᵣ時
		}

		// 再處理 憶與忘 ˉ事件
		for(let j = 0; j< date_allEventObjs.length; j++){
			tempProcedure = new Procedure()
			let cur_date__wordEvent = date_allEventObjs[j]
			tempProcedure.date_wordEvent = date_allEventObjs[j]
			let eventDurationOfLastToThis = 1.1 //若初值取一則取對數後得零
			let dateWeight = 1.1 //改于 23.06.07-1005

			//上一個日期-事件 ˉ對象
			let lastDate_eventObj = priorityObj.procedure[priorityObj.procedure.length-1].date_wordEvent

			//<算dateWeight>
			if(
				//若上一個單詞事件不昰加
				lastDate_eventObj?.wordEvent !== WordEvent.ADD
				//date_allEventObjs[j] && date_allEventObjs[j-1] &&
				//date_allEventObjs[j-1].wordEvent !== WordEvent.ADD//此處當不慮添ˉ事件 否則 例如有一詞、其複添ᵗ次ˋ潙2、然添ᵗ期ᵗ去今皆稍遠、復習旹初見ᶦ旹若能誌則其頻會大降、日後則見者稀也。非所冀也。故算dateDif旹當不慮添ᵗ期
			)//第一個事件必昰加、故第一次循環旹恆進不去下ᵗ分支
			{//!若初調此函數之後再調此函數旹只傳入了一個事件 則無j-1矣。
				eventDurationOfLastToThis = VocaB.兩日期所差秒數YYYYMMDDHHmmss(date_allEventObjs[j].date, lastDate_eventObj?.date!)
				if(eventDurationOfLastToThis < 0){
					throw new Error('後ᵗ時間日期ˋ減ᵣ前ᐪ不應得負數')
				}
				dateWeight = Priority.getDateWeight(eventDurationOfLastToThis) //或許此處可不寫死ᵈ、洏使用戶配置 函數芝把dataDif轉成dateWeight者。
				if(dateWeight < 1){//實ᵈ處理後ᵗ dateWeight ˋ必大於一
					dateWeight = 1.1
					console.log(this)
					console.log('因dateWeight<1、已被修正至1.1')
				}
			}
			//</算dateWeight>


			if(cur_date__wordEvent.wordEvent === WordEvent.ADD){
				//啥也不做
			}


			else if(cur_date__wordEvent.wordEvent === WordEvent.REMEMBER){
				tempProcedure.befPrio = priorityObj._prio0
				let durationOfLastRmbEventToNow = VocaB.兩日期所差秒數YYYYMMDDHHmmss(timeNow, cur_date__wordEvent.date)
				//降低在secs秒內憶ᵗ詞ˋ再現ᵗ率 初設secs潙 3600*8 即六(應潙八)小時 然則憶ᵗ詞ˋ六小時內ʸ複現ᵗ率ˋ降、且越近則降ˋ越多
				let debuff = priorityObj.getDebuff(durationOfLastRmbEventToNow)
				if(dateWeight >=2){
					priorityObj._prio0 = priorityObj._prio0/(dateWeight/2)/debuff //待改:除以二ˋ既未錄入procedure 亦 寫死的ᵉ
					//<待叶>{若一詞 連續亻嘰次皆能被憶、且時間ᵗ誇度ˋ達ᵣ亻嘰久、則濾ᶦ不示。}
				}else{
					priorityObj._prio0 = (priorityObj._prio0/1.1)/debuff
				}
				tempProcedure.aftPrio = priorityObj._prio0
				tempProcedure.dateWeight = dateWeight; //此dateWeight昰未處理ᐪ 未除以2 之事
				tempProcedure.eventDurationOfLastToThis = eventDurationOfLastToThis
				tempProcedure.dateDebuff = debuff
				tempProcedure.durationOfLastRmbEventToNow = durationOfLastRmbEventToNow
				priorityObj.procedure.push(tempProcedure)
			}
			
			
			else if(cur_date__wordEvent.wordEvent === WordEvent.FORGET) {
				tempProcedure.befPrio = priorityObj._prio0
				priorityObj._prio0 *= dateWeight
				tempProcedure.aftPrio = priorityObj._prio0
				tempProcedure.dateWeight = dateWeight;
				tempProcedure.eventDurationOfLastToThis = eventDurationOfLastToThis
				//無 debuff之類
				priorityObj.procedure.push(tempProcedure)
			}
		}
	}

	public addBonus(bonus:number):void{
		this.priority_num = this.prio0! + bonus;
		this.bonus = bonus
	}

	/*
	* 23.06.03-2244 由時間跨度(秒)算時間ᵗ權重
	* */
	public static getDateWeight(dateDif:number/* , denominator:number=60 */):number{
		//let out = Math.log2((dateDif/denominator)+1)+1
		//let out = Math.ceil( Math.log2((dateDif/denominator)+1)+1 ) //改于 23.06.07-1003
		//let out = Math.floor( Math.log2((dateDif/denominator)+1)+1 ) //[23.06.09-0928,]
		//let out = Math.log2((dateDif/denominator)) //[23.06.09-1240,23.06.15-1250] [23.06.15-1254,]{原算法ˋ隔24小時 與 隔72小時 結果ᵗ差ᵗ不大。故改用 開平方 㕥代 取對數}
		let out = (1/25)*Math.pow(dateDif, 1/2)
		if(out <= 1){
			out = 1.01;
		}
		return out;
	}

	public getDebuff(durationOfLastRmbEventToNow:number):number{
		//憶ˡ事件ᵗ次ˋ愈多則分母愈大
		if(!this.word){throw new Error('!this.word')}
		let date_allEventObjs = this.word.date_allEventObjs
		//console.log(date_allEventObjs)//t
		if(date_allEventObjs[date_allEventObjs.length-1].wordEvent === WordEvent.REMEMBER){ //要求末ᵗ事件潙 憶 旹纔有debuff
			//let numerator = this.word.date_allEventObjs.length*this.numerator*2
			let numerator = this.numerator //[23.06.13-1056,]
			//let debuff = Math.floor((numerator/durationOfLastRmbEventToNow) + 1)
			let debuff = (numerator/durationOfLastRmbEventToNow) + 1//[23.06.15-1805,]
			/* console.log('debuff');//t
			console.log(debuff);
			if(isNaN(debuff) || !isFinite(debuff)){
				
				throw new Error('debuff is not a number')
			} */
			return debuff >=1? debuff : 1
		}else{
			return 1;
		}
	}
	
}


export class SingleWordB{
	//id:number;//唯一標識
	//public ling:lingType
	private _ling:string = ''
	private _id:number = -1
	private _wordShape:string = ''
	private _fullComments:string[] = []
	private _addedTimes:number = -1
	private _addedDates:string[] = []
	private _rvwDates:string[] = []
	private _datesFormats:string[] = ['%y.%m.%d-%H%M'] //似未用上
	private _rvwTimes:number = -1
	private _rmbTimes:number = -1
	private _rmbDates:string[] = []
	private _fgtTimes:number = -1
	private _fgtDates:string[] = []
	private _priority_num:number = 1
	private _priorityObj:Priority = new Priority();
	/*private _date_allEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_addEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_rmbEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_fgtEventObjs:{date:number, wordEvent:WordEvent}[]*/
	
	private _date_allEventObjs:Date_wordEvent[] = []
	private _date_allEventMap:Map<number, WordEvent> = new Map();
	private _date_addEventObjs:Date_wordEvent[] = []
	private _date_rmbEventObjs:Date_wordEvent[] = []
	private _date_fgtEventObjs:Date_wordEvent[] = []
	

/* 	public get date_allEventMap(){
		if(this._date_allEventMap.size === this.date_addEventObjs.length){
			return this._date_allEventMap
		}else{
			for(let i = this.date_addEventObjs.length-1; i>=0 ;i--){
				this._date_allEventMap
			}
		}
		
	} */

	/* public set date_allEventMap(v){
		this._date_allEventMap = v
	} */

	get priorityObj(): Priority {
		return this._priorityObj;
	}
	
	/* set priorityObj(value: Priority) {
		this._priorityObj = value;
	} */
	
	get ling(): string {
		return this._ling;
	}
	
	set ling(value: string) {
		this._ling = value;
	}
	
	get id(): number {
		return this._id;
	}
	
	set id(value: number) {
		this._id = value;
	}
	
	get wordShape(): string {
		return this._wordShape;
	}
	
	set wordShape(value: string) {
		this._wordShape = value;
	}
	
	get fullComments(): string[] {
		return this._fullComments;
	}
	
	set fullComments(value: string[]) {
		this._fullComments = value;
	}
	
	get addedTimes(): number {
		return this._addedDates.length;
	}
	
	private set addedTimes(value: number) {
		this._addedTimes = value;
	}
	
	get addedDates(): string[] {
		return this._addedDates;
	}
	
	set addedDates(value: string[]) {
		this._addedDates = value;
		this._addedTimes = this._addedDates.length
	}
	
	private get rvwDates(): string[] {
		return this._rvwDates;
	}
	
	private set rvwDates(value: string[]) {
		this._rvwDates = value;
		this.rvwTimes = this._rvwDates.length
	}
	
	get datesFormats(): string[] {
		return this._datesFormats;
	}
	
	set datesFormats(value: string[]) {
		this._datesFormats = value;
	}
	
	private get rvwTimes(): number {
		return this._rvwTimes;
	}
	
	private set rvwTimes(value: number) {
		this._rvwTimes = value;
	}
	
	get rmbTimes(): number {
		return this._rvwDates.length;
	}
	
	private set rmbTimes(value: number) {
		this._rmbTimes = value;
	}
	
	get rmbDates(): string[] {
		return this._rmbDates;
	}
	
	set rmbDates(value: string[]) {
		this._rmbDates = value;
	}
	
	get fgtTimes(): number {
		return this._fgtDates.length;
	}
	
	private set fgtTimes(value: number) {
		this._fgtTimes = value;
	}
	
	get fgtDates(): string[] {
		return this._fgtDates;
	}
	
	set fgtDates(value: string[]) {
		this._fgtDates = value;
	}
	
	get priority_num(): number|undefined {
		//return this._priority_num;
		return this.priorityObj.priority_num
	}
	
	/* set priority_num(value: number) {
		this.priorityObj.priority_num = value;
	} */
	
	get date_allEventObjs(): { date: number; wordEvent: WordEvent }[] {
		return this._date_allEventObjs;
	}
	
	set date_allEventObjs(value: { date: number; wordEvent: WordEvent }[]) {
		this._date_allEventObjs = value;
	}
	
	get date_addEventObjs(): { date: number; wordEvent: WordEvent }[] {
		//return this._date_addEventObjs;
		if(this._date_allEventObjs && this._date_addEventObjs && this._date_rmbEventObjs && this._date_fgtEventObjs){
			return this._date_allEventObjs
		}else{
			this.assignDate_eventObjs()
			return this._date_allEventObjs
		}
	}
	
	set date_addEventObjs(value: { date: number; wordEvent: WordEvent }[]) {
		this._date_addEventObjs = value;
	}
	
	get date_rmbEventObjs(): { date: number; wordEvent: WordEvent }[] {
		return this._date_rmbEventObjs;
	}
	
	set date_rmbEventObjs(value: { date: number; wordEvent: WordEvent }[]) {
		this._date_rmbEventObjs = value;
	}
	
	get date_fgtEventObjs(): { date: number; wordEvent: WordEvent }[] {
		return this._date_fgtEventObjs;
	}
	
	set date_fgtEventObjs(value: { date: number; wordEvent: WordEvent }[]) {
		this._date_fgtEventObjs = value;
	}
	
	
	
	public constructor() {
		
		this.assignDate_eventObjs()
	}
	
	public assignDate_eventObjs(){
		this._date_allEventObjs = []
		this._date_addEventObjs = []
		this._date_rmbEventObjs = []
		this._date_fgtEventObjs = [] //可改:有點佔內存、日期可慮只存一份
		for(let i = 0; i < this._addedDates.length; i++){
			this._date_allEventObjs.push({
				date:parseInt(this._addedDates[i]),
				wordEvent:WordEvent.ADD
			})
			
			this._date_addEventObjs.push({
				date:parseInt(this._addedDates[i]),
				wordEvent:WordEvent.ADD
			})
			
		}
		for(let i = 0; i < this._rmbDates.length; i++){
			this._date_allEventObjs.push({
				date:parseInt(this._rmbDates[i]),
				wordEvent:WordEvent.REMEMBER
			})
			
			this._date_rmbEventObjs.push({
				date:parseInt(this._rmbDates[i]),
				wordEvent:WordEvent.REMEMBER
			})
		}
		for(let i = 0; i < this._fgtDates.length; i++){
			this._date_allEventObjs.push({
				date:parseInt(this._fgtDates[i]),
				wordEvent:WordEvent.FORGET
			})
			
			this._date_fgtEventObjs.push({
				date:parseInt(this._fgtDates[i]),
				wordEvent:WordEvent.FORGET
			})
		}
		
		this._date_allEventObjs.sort((a, b)=>{
			return a.date - b.date
		})
	}


	public 取ᵣ可視化事件(add:string, remember:string, forget:string){
		
		this.assignDate_eventObjs()
		
		let outcome = ''
		for(let i = 0; i < this._date_allEventObjs.length; i++){
			if(this._date_allEventObjs[i].wordEvent === WordEvent.ADD){
				outcome += add
			}else if(this._date_allEventObjs[i].wordEvent === WordEvent.REMEMBER){
				outcome += remember
			}else if(this._date_allEventObjs[i].wordEvent === WordEvent.FORGET){
				outcome += forget
			}else {
				throw new Error('未知wordEvent')
			}
		}
		return outcome
	}
}

export default class VocaB{
	private _ling:string
	private _allWords:SingleWordB[]; // 會不會存了兩份SingleWord?
	private _id_wordMap:Map<number, SingleWordB>
	
	private _wordsToLearn:SingleWordB[]
	//public curReviewedWords:SingleWordB[]
	//public curRememberedWords:SingleWordB[]
	//public curForgottenWords:SingleWordB[]
	
	private _idsOfWordsToLearn:number[]
	private _idsOfCurRvwWords:number[]
	private _idsOfCurRemWords:number[]
	private _idsOfCurFgtWords:number[]
	
	private _curSingleWord:SingleWordB;
	private _currentIndex:number;
	private _wordAreaId:string;
	private _lastWordInfoDivId:string;
	private _curWordInfoId:string
	
	
	get ling(): string {
		return this._ling;
	}
	
	set ling(value: string) {
		this._ling = value;
	}
	
	get allWords(): SingleWordB[] {
		return this._allWords;
	}
	
	set allWords(value: SingleWordB[]) {
		this.setAllWords(value)
	}
	
	get id_wordMap(): Map<number, SingleWordB> {
		return this._id_wordMap;
	}
	
	private set id_wordMap(value: Map<number, SingleWordB>) {
		this._id_wordMap = value;
	}
	
	get wordsToLearn(): SingleWordB[] {
		return this._wordsToLearn;
	}
	
	set wordsToLearn(value: SingleWordB[]) {
		this.setWordsToLearn(value)
	}
	
	get idsOfWordsToLearn(): number[] {
		return this._idsOfWordsToLearn;
	}
	
	private set idsOfWordsToLearn(value: number[]) {
	}
	
	get idsOfCurRvwWords(): number[] {
		return this._idsOfCurRvwWords;
	}
	
	private set idsOfCurRvwWords(value: number[]) {
		this._idsOfCurRvwWords = value;
	}
	
	get idsOfCurRemWords(): number[] {
		return this._idsOfCurRemWords;
	}
	
	private set idsOfCurRemWords(value: number[]) {
		this._idsOfCurRemWords = value;
	}
	
	get idsOfCurFgtWords(): number[] {
		return this._idsOfCurFgtWords;
	}
	
	private set idsOfCurFgtWords(value: number[]) {
		this._idsOfCurFgtWords = value;
	}
	
	get curSingleWord(): SingleWordB {
		return this._curSingleWord;
	}
	
	set curSingleWord(value: SingleWordB) {
		this._curSingleWord = value;
	}
	
	get currentIndex(): number {
		return this._currentIndex;
	}
	
	set currentIndex(value: number) {
		this._currentIndex = value;
		this.curSingleWord = this.allWords[this.currentIndex]
	}
	
	get wordAreaId(): string {
		return this._wordAreaId;
	}
	
	set wordAreaId(value: string) {
		this._wordAreaId = value;
	}
	
	get lastWordInfoDivId(): string {
		return this._lastWordInfoDivId;
	}
	
	set lastWordInfoDivId(value: string) {
		this._lastWordInfoDivId = value;
	}
	
	get curWordInfoId(): string {
		return this._curWordInfoId;
	}
	
	set curWordInfoId(value: string) {
		this._curWordInfoId = value;
	}
	
	public constructor() {
		this._ling = ''
		this._wordsToLearn = []
		this._allWords =[];
		this._curSingleWord = new SingleWordB();
		this._id_wordMap = new Map<number, SingleWordB>()
		
		/*this.curReviewedWords = []
		this.curRememberedWords = []
		this.curForgottenWords = []*/
	
		this._idsOfWordsToLearn = []
		this._idsOfCurRvwWords = []
		this._idsOfCurRemWords = []
		this._idsOfCurFgtWords = []
		
		this._currentIndex = 0;
		this._wordAreaId = 'word';
		this._lastWordInfoDivId = 'lastWordInfo';
		this._curWordInfoId = 'curWordInfo'
	}


	/**
	 * [23.06.11-1047,]
	 * v23.06.15-2216
	 * 濾除ᵣ詞芝只有一個事件者 及 [被視爲已記得的]單詞
	 */
	public filtWordsToLearn(ws:SingleWordB[]):SingleWordB[]{
		//<待改>{不宜只用權重㕥篩詞、憶ᵗ事件ᵗ量ᵘ亦宜有要求。}
		//ws = this.filtAlreadyRememberedWords(ws)[,23.06.21-2017]
		let filtedWords:SingleWordB[] = [];
		for(let i = 0; i < ws.length; i++){
			if(ws[i].date_addEventObjs.length >= 2){
				filtedWords.push(ws[i])
			}
		}
		return filtedWords
	}

/**
 * [23.06.15-2213]{
 * 濾除[被視爲已記得的]單詞}
 * @param ws 
 * @returns 
 */
	public filtAlreadyRememberedWords(ws:SingleWordB[]):SingleWordB[]{
		let filtedWords:SingleWordB[] = [];
		
		for(let i = 0; i < ws.length; i++){
			//ws[i].priorityObj.assignPrio0()
			if(ws[i].priorityObj.prio0! < Priority.deemAsRememberedPrio0){

			}else {
				filtedWords.push(ws[i])
			}
		}
		return filtedWords
	}

	

	
	
	/**
	 * 
	 * @param wordsToLearn 
	 * @param fn_ui 負責界面交互之函數
	 */
	public startToShow(wordsToLearn:SingleWordB[], randomBonusArr?:number[]):void{
		//let randomIndex = Math.floor(Math.random() * (this.words.length))//第一個單詞完全由隨機數決定
		/* if(!wordsToLearn){
			wordsToLearn = this._allWords
		} */
		/* if(!randomBonusArr){

		} */
		this.assignPriority()//[23.06.15-2237,]<可改進>{assignPriority()調了兩次、宜試避免重複算權重}
		this.wordsToLearn = this.filtWordsToLearn(wordsToLearn)
		//console.log(wordsToLearn)//t
		//this.assignPriority(randomBonusArr) //
		if(randomBonusArr){this.addRandomArrAsBonus(randomBonusArr)}
		
		//this.addRandomBonus()
		
		this.wordsToLearn.sort((a, b)=>{
			return b.priority_num! - a.priority_num! 
		})
		this._currentIndex = 0
		if(this._curSingleWord.wordShape === ''){
			this._curSingleWord = this.wordsToLearn[this._currentIndex]
		}
		//fn_ui(this)
		//console.log(this.curSingleWord)//t
		
		/*for(let i = 0; i < this.words.length; i++){//t
			console.log(this.words[i].wordShape)
			console.log(this.words[i].priority)
		}*/
	}

	public setAllWords(words:SingleWordB[]){
		this._allWords = words;
		this._id_wordMap = new Map<number, SingleWordB>()
		for(let i = 0 ; i < this._allWords.length; i++){
			this._id_wordMap.set(this._allWords[i].id, this._allWords[i])
		}
		if(this._wordsToLearn.length === 0){
			this.setWordsToLearn(this._allWords)
		}
	}
	
	public setWordsToLearn(ws:SingleWordB[]){
		this._wordsToLearn = ws
		this._idsOfWordsToLearn = []
		for(let i = 0; i < this._wordsToLearn.length; i++){
			this._idsOfWordsToLearn[i] = this._wordsToLearn[i].id
			this._wordsToLearn[i].assignDate_eventObjs()
		}
	}
	
	public setWordsToLearnByIds(ids:number[]){
		let wordsToLearn:SingleWordB[] = this.getWordsByIds(ids)
		this.setWordsToLearn(wordsToLearn)
		
	}

	public addRandomBonus(min:number, max:number):void{
		let rand:number[] = VocaB.generateRandomNumbers(this.wordsToLearn.length, min, max);
		/* for(let i = 0; i < this.wordsToLearn.length; i++){
			this.wordsToLearn[i].priorityObj.addBonus(rand[i]);
		} [,23.06.17-1910,]*/
		this.addRandomArrAsBonus(rand)
	}

	/**
	 * [23.06.17-1910,]
	 * @param arr 
	 */
	public addRandomArrAsBonus(arr:number[]):void{
		for(let i = 0; i < arr.length; i++){
			this.wordsToLearn[i].priorityObj.addBonus(arr[i])
		}
	}

	//[23.06.20-1934,]{能否合爲一個函數}

	public rmbEvent(vocaBObj:VocaB){
		
		let dateNow:string = moment().format('YYYYMMDDHHmmss')//坑:ss大寫後似成毫秒 20230507162355
		console.log(dateNow)
		//console.log(currentWord)
		let temp_date__event:Date_wordEvent = 
		{
			date:parseInt(dateNow),
			wordEvent:WordEvent.REMEMBER
		}
		//把剛變化之權重輸出
		vocaBObj.curSingleWord.priorityObj.calcPrio0(vocaBObj.curSingleWord.priorityObj, [temp_date__event])
		console.log(vocaBObj.curSingleWord.priorityObj.procedure)
		console.log(vocaBObj.curSingleWord.priorityObj.prio0)
		//alert(vocaBObj.curSingleWord.priorityObj)//t
		vocaBObj.curSingleWord.rmbDates.push(dateNow)
		vocaBObj.curSingleWord.date_allEventObjs.push({date:parseInt(dateNow), wordEvent:WordEvent.REMEMBER})
		vocaBObj.idsOfCurRemWords.push(vocaBObj.curSingleWord.id)
		vocaBObj.idsOfCurRvwWords.push(vocaBObj.curSingleWord.id)
		
		//showNext();
	}
	
	public fgtEvent(vocaBObj:VocaB){
		let dateNow:string = moment().format('YYYYMMDDHHmmss')//坑:ss大寫後似成毫秒 20230507162355
		console.log(dateNow)
		//console.log(currentWord)
		let temp_date__event:Date_wordEvent = 
		{
			date:parseInt(dateNow),
			wordEvent:WordEvent.FORGET
		}
		//console.log('111')//t
		//console.log(vocaBObj.curSingleWord.priorityObj)//t
		vocaBObj.curSingleWord.priorityObj.calcPrio0(vocaBObj.curSingleWord.priorityObj, [temp_date__event])
		console.log(vocaBObj.curSingleWord.priorityObj.procedure)
		console.log(vocaBObj.curSingleWord.priorityObj.prio0)
		vocaBObj.curSingleWord.fgtDates.push(dateNow)
		vocaBObj.curSingleWord.date_allEventObjs.push({date:parseInt(dateNow), wordEvent:WordEvent.FORGET})
		vocaBObj.idsOfCurFgtWords.push(vocaBObj.curSingleWord.id)
		vocaBObj.idsOfCurRvwWords.push(vocaBObj.curSingleWord.id)
		
		
		//showNext();
		//fn_showNext();
	}

	//[23.06.11-1616,]
	public showNext(vocaBObj){
		
		//let nextIndex = Math.floor(Math.random() * (this.words.length))
		let nextIndex = vocaBObj.currentIndex+1
		console.log('nextIndex='+nextIndex)//t
		if(nextIndex >= vocaBObj.idsOfWordsToLearn.length || nextIndex <0){
			nextIndex = 0
			console.log('nextIndex被重設潙0')
			alert('nextIndex被重設潙0')
		}

		vocaBObj.currentIndex = nextIndex;
		console.log('currentIndex='+vocaBObj.currentIndex)
		vocaBObj.curSingleWord = vocaBObj.wordsToLearn[nextIndex];
		
	}

	/* public getChangeOfPrio0(priorityObj:Priority, new_word_event:WordEvent):Procedure{
		if(!priorityObj.prio0){
			priorityObj.assignPrio0()
		}

		throw new Error()
	} */

	public assignWordsToLearnToCurForgottenWords(){
		this.setWordsToLearn(this.getWordsByIds(this._idsOfCurFgtWords))
	}
	
	public reviewForgottenWords(/* ui_fn_startToShow:(...a:any)=>void=()=>{} */){
		let forgottenWordsIds:number[] = [...this._idsOfCurFgtWords]
		this.resetCur()
		this._idsOfCurFgtWords = forgottenWordsIds
		this.setWordsToLearnByIds(this._idsOfCurFgtWords)
		this.assignWordsToLearnToCurForgottenWords()
		this.assignPriority()
		this._currentIndex = -1
		//console.log(this._wordsToLearn)//t
		//this.startToShow(this._wordsToLearn, )this.ui_startToShow
		this._idsOfCurFgtWords = []// 此項要在最後重置 否則愈積愈多
		//ui_fn_startToShow()
		
		//this.showNext()
	}
	
	/*public assignWordsFromServ(url?:string):void{
		if(!url){
			url = $('input[name="ling"]:checked').val() as string;
		}
		fetch(url)
			.then(response=>response.json())
			.then(data=>{
				let dataObj = data
				for(let i = 0; i < dataObj.length; i++){
					let temp = new SingleWordB();
					temp.ling = url??'';
					temp.wordShape = dataObj[i].wordShape
					temp.fullComments = JSON.parse(dataObj[i].fullComments)
					temp.addedDates = JSON.parse(dataObj[i].addedDates)
					temp.datesFormats = JSON.parse(dataObj[i].datesFormats)
					temp.addedTimes = dataObj[i].addedTimes
					temp.rememberedDates = dataObj[i].rememberedDates
					temp.reviewedTimes = dataObj[i].rememberedTimes
					temp.forgottenDates = dataObj[i].forgottenDates
					temp.forgottenTimes = dataObj[i].forgottenTimes
					console.log(temp)
					newTestWords.push(temp)
					//newTestWords.push(dataObj[i])
					// if(i === 5){// 待刪:先試5個先
					// 	break
					// }
				}
				this.setWords(newTestWords)
			})
	}*/
	
	public resetCur(){
		//this.idsOfWordsToLearn = []
		this._idsOfCurRvwWords = []
		this._idsOfCurRemWords = []
		this._idsOfCurFgtWords = []
		this._curSingleWord = new SingleWordB()
		this._currentIndex = 0
		//復習所忘前先重設此
	}
	
	public saveToServ(){
		const tempPwd = $('#tempPwd').val()
		
		/*
		const xhr = new XMLHttpRequest();
		xhr.open("POST", 'http://localhost:1919/logIn', true)
		xhr.setRequestHeader('Content-type','application/json');
		xhr.onload = ()=>{
			if(xhr.status === 200){
				console.log(xhr.responseText)
			}else{
				console.log('請求錯誤')
			}
		}
		xhr.send(tempPwd)
		*/
		
		
		
		
		
		let temp:SingleWordB[] = this.getWordsByIds(this.idsOfCurRvwWords)
		VocaB.saveToServ(temp)
		this.idsOfCurRvwWords = []//每提交則清空 防止重複提交
		
		
	}
	
	public getWordsByIds(ids:number[]){
		let outcomes:SingleWordB[] = []
		for(let i = 0; i < ids.length; i++){
			let t;
			if((t = this._id_wordMap.get(ids[i]))!==undefined){
				outcomes.push(t)
			}else {
				console.log(this._id_wordMap)
				throw new Error('該id未對應word id='+ids[i])
			}
		}
		return outcomes
	}
	
	public static simplifyDateFormat(date:string):string{
		return date.replace(/^(\d{4})(\d{2})(\d{2})(.*)$/g, '$2.$3')
	}
	
	public static simplifyDateArrFormat(dateArr:string[]):string[]{
		let outcome:string[] = new Array(dateArr.length)
		for (let i = 0; i < dateArr.length; i++){
			outcome[i] = VocaB.simplifyDateFormat(dateArr[i])
		}
		return outcome
	}
	
	public static saveToServ(reviewed:SingleWordB[]){
		let dataToReturn:{
			ling:string
			id:number,
			rememberedDates:string[]
			forgottenDates:string[]
		}[] = new Array(reviewed.length)//.fill({id: 0, rememberedDates: [], forgottenDates: []}) //坑:注意寫法 用fill似有繆 最後都變成一樣的了
		//console.log(dataToReturn)//t
		for(let i = 0; i < reviewed.length; i++){
			dataToReturn[i] = {ling:"", id:0,rememberedDates:[], forgottenDates:[]}
			let curReviewedWord = reviewed[i]
			//console.log(curReviewedWord)//t
			dataToReturn[i].ling = curReviewedWord.ling
			dataToReturn[i].id = curReviewedWord.id
			dataToReturn[i].rememberedDates = curReviewedWord.rmbDates
			dataToReturn[i].forgottenDates = curReviewedWord.fgtDates
			//console.log(dataToReturn)//t
		}
		console.log(dataToReturn)//t
		const xhr = new XMLHttpRequest();
		xhr.open("POST", 'http://localhost:1919/post', true)
		xhr.setRequestHeader('Content-type','application/json');
		xhr.onload = ()=>{
			if(xhr.status === 200){
				console.log(xhr.responseText)
			}else{
				console.log('請求錯誤')
			}
		}
		xhr.send(JSON.stringify(dataToReturn))
	}
	
	public assignPriority(randomBonusArr?:number[]){
		
		// [23.06.09-1655]刪除了被註釋掉的舊版實現
		
		for(let i = 0; i < this.allWords.length; i++){
			this.allWords[i].priorityObj.word = this.allWords[i]
			//this.allWords[i].priorityObj.assignPrio0();
			this.allWords[i].priorityObj.calcPrio0()
		}
		
		let aver:number = 0;
		for(let i = 0; i < this.allWords.length; i++){
			aver += this.allWords[i].priorityObj.prio0!
		}
		
		aver /= this.allWords.length;
		console.log('平均初權重:'+aver)

		/* */
		if(!randomBonusArr){
			randomBonusArr = new Array(this.allWords.length)
			randomBonusArr.fill(0)
			//let randoms:number[] = VocaB.generateRandomNumbers(this._allWords.length, 0, aver/8)
			//randomBonusArr.fill(1)
			//randomBonusArr = randoms
		}

		
		for(let i = 0; i < this.allWords.length; i++){
			this.allWords[i].priorityObj.randomRange_max = aver/8
			this.allWords[i].priorityObj.addBonus(randomBonusArr[i]);
			//this.allWords[i].priority_num = this.allWords[i].priorityObj.priority_num
			//this.allWords[i].priorityObj.priority_num = this.allWords[i].priorityObj.priority_num //[23.06.12-1048,]
		} 
		
	}
	
	
	
	/*public static assignWordsWithReviewForgottenWords(vocaBObj:VocaB):void{
		let newObj = new VocaB()
		newObj.curReviewedWords = vocaBObj.curForgottenWords
		vocaBObj = newObj //
	}*/
	
	/*public static 取字符串數組中長度最大者(strArr:string[]):string{
		let indexes:number[] = new Array(strArr.length)
		for(let i = 0; i < strArr.length; i++){
			indexes[i] = strArr[i].length
		}
		
		indexes.sort((a,b)=>{
			return b - a
		})
		return strArr[indexes[0]]
	}*/
	
	public static matchOrNot(str:string, ...target:string[][]):string{
		// [["{}"], ["[]"], ["()"]]
		for(let i = 0; i < target.length; i ++){
			if(target[i].length !== 2){
				throw new Error("參數不正確、第二維中")
			}
		}
		let stacks:string[][] = [];
		return ''
	}
	
	
	public static 取字符串數組中長度最大者(strArr:string[]):string{
		let indexOfMax:number=0
		for(let i = 1; i < strArr.length; i++){
			if(strArr[i].length > strArr[i-1].length){
				indexOfMax = i
			}
		}
		return strArr[indexOfMax]
	}
	
	/**
	 * v23.06.15-2252
	 * @param n 個數
	 * @param bottom 
	 * @param top 
	 * @returns 
	 */
	public static generateRandomNumbers(n:number, bottom:number, top:number) {
		/* bottom*=10000
		top*=10000 [,23.06.15-2238]*/ 
		const result:number[] = [];
		/* for (let i = 0; i < n; i++) {
			let randomNumber = Math.floor(Math.random() * (top - bottom + 1) + bottom);
			//randomNumber/=10000
			result.push(randomNumber);
		} */
		for (let i = 0; i < n; i++) {
			const randomValue = Math.random() * (top - bottom) + bottom;
			result.push(randomValue);
		}
		//console.log(result);//t
		
		return result;
	}
	/* 
	public static putArrInTableInDiv(divId:string, arr:string[], tableId?:string, tableClass?:string, trIdPrefix?:string, trClass?:string,tdIdPrefix?:string, tdClass?:string, btnIdPrefix?:string, btnClass?:string){
		if(!tableId) tableId = 'tableId'
		if(!tableClass) tableClass = 'tableClass'
		if(!trIdPrefix) trIdPrefix = 'trIdPrefix'
		if(!trClass) trClass = 'trClass'
		if(!tdIdPrefix) tdIdPrefix = 'tdIdPrefix'
		if(!tdClass) tdClass = 'tdClass'
		if(!btnIdPrefix) btnIdPrefix = 'btnIdPrefix'
		if(!btnClass) btnClass = 'btnClass'
		let tableB:string = `<table id="${tableId}" class="${tableClass}">`
		let tableE:string = `</table>`
		let outcome:string = '';
		outcome += tableB
		for(let i = 0; i < arr.length; i ++){
			let trB = `<tr id="${trIdPrefix+i}" class="${trClass}">`
			let tdB = `<td id="${tdIdPrefix+i}" class="${tdClass}">`
			let btnB = `<button id="${btnIdPrefix+i}" class="${btnClass}">`
			let trE = `</tr>`
			let tdE = `</td>`
			let btnE = `</button>`
			let singleUnit = trB + tdB + btnB + arr[i] + btnE + tdE + trB;
			outcome += singleUnit
		}
		return outcome
	} */
	
	public static median(arr:number[]) {
		const sortedArr = [...arr].sort((a, b) => a - b);
		const midIndex = Math.floor(sortedArr.length / 2);
		
		if (sortedArr.length % 2 === 0) {
			return (sortedArr[midIndex - 1] + sortedArr[midIndex]) / 2;
		} else {
			return sortedArr[midIndex];
		}
	}
	
	public static 取逆轉義ᵗstrArr(strArr:string[]):string{
		//let outcome:string[] = [...strArr]勿㢓複製字符串數組、否則每個字符皆成數組中一元素
		//一個字符串也是一個長度潙一ᵗ字符串數組?
		let outcome=''
		for(let i = 0; i < strArr.length; i++){
			let temp = ''
			temp = strArr[i].replace(/\\n/g,'\n')
			temp = temp.replace(/\\t/g,'\t')
			outcome+=temp
			//outcome+=(strArr[i].replace(/\\n/g,'\n').replace(/\\t/g,'\t'))
		}
		return outcome
	}
	
	public static 取逆轉義ᵗstr(strArr:string):string{
		//let outcome:string[] = [...strArr]勿㢓複製字符串數組、否則每個字符皆成數組中一元素
		//一個字符串也是一個長度潙一ᵗ字符串數組?
		let outcome = strArr.replace(/\\n/g,'\n').replace(/\\t/g,'\t')
		return outcome
	}
	
	public static 兩日期所差秒數YYYYMMDDHHmmss(late:number, early:number) :number{
		const lateDate = moment(late, 'YYYYMMDDHHmmss')
		const earlyDate = moment(early, 'YYYYMMDDHHmmss')
		return moment.duration(lateDate.diff(earlyDate)).asSeconds()
	}
	
	
	
	public testAjax(val:any){
		console.log("发送的请求数据大小为：" + JSON.stringify(val).length + " 字节");
		const xhr = new XMLHttpRequest();
		xhr.open("POST", 'http://localhost:1919/post', true)
		xhr.setRequestHeader('Content-type','application/json');
		
		//響應處理函數
		xhr.onload = ()=>{
			if(xhr.status === 200){
				console.log(xhr.responseText)
			}else{
				console.log('請求錯誤')
			}
		}
		xhr.send(val)
	}
	/*
	public testAxios(val:any){
		axios.post('http://localhost:1919/post', val)
			.then(response=>{
				console.log(response.data)
			})
	}
	*/
	public static getXmlHttpObj(){
	
	}

}
