//23.06.04-0010
//v2.0.3
/*縮寫:
	cur	current
	rmb	remember
	fgt	forget
*
* */

/*待做:{
顯示下個單詞旹一併ᵈ示ᵣ佢ˇ錄入旹ᵗ諸日期
點擊記得與否旹錄其時
單詞優先級算法{
	慮ᵗ因素{
		添入旹ᵗ時
		復習旹ᵗ時
		現ᵗ次
		忘ᵗ次
		憶ᵗ次
	}
	單詞加權隨機排序算法{
	}
需一鍵值對、鍵潙日期、值潙記得與否之(真抑假)、然後前端ʸ示ᶦ。
每詞ˋ數據庫ʸ皆當有唯一ᵗ標識、從前端把更新後ᵗ數據發回服務器、ʃ需ˋ唯返回其 新增ᵗ記與忘ᵗ次、及其旹ᵗ時、然後由後端附ᵣ訊ˇ數據庫ʰ
多語混學
對日期排序
獲取當前時間日期並格式化潙字符串
前端ʸ詞ˇ示旹保留中括號中ᵗ空行
設時限、逾時不點記得ˡ按鈕則算不記得
示上個詞旹示權重ᵗ變
跳轉
複習()秒內所忘
今天記得ᵗ詞ˋ今日內再現ᵗ權重ˋ宜降。
跳過當前ᵗ詞
日期對單詞事件疑似每操作一次就排序一次
詞ˇ管理 如由id查詞
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

class Procedure {
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

class Priority{
	private _word:SingleWordB|undefined;  //不寫|undefined就可能無限遞歸調用
	private _priority:number = 1; //終ᵗ權重
	private _prio0:number|undefined //初權重
	private _numerator:number = 3600*24 //分子  23.06.05-1130默認值改爲3600*24
	private _defaultAddWeight:number = 100; //23.06.05-1158默認值改爲100
	private _addWeight:number = 1
	private _randomRange_max:number = 0
	private _bonus:number = 0;
	private _dateThen:number = 0; // 當時ᵗ日期時間
	/*private _randomBuff:number = -1//棄用˪
	private _prio1:number = -1 //棄用˪
	private _dateDifs:number[] = []//棄用˪
	private _dateWeights:number[] = []//棄用˪*/
	private _procedure: Procedure[] = []
	
	
	get bonus(): number {
		return this._bonus;
	}
	
	private set bonus(value: number) {
		this._bonus = value;
	}
	
	get defaultAddWeight(): number {
		return this._defaultAddWeight;
	}
	
	set defaultAddWeight(value: number) {
		this._defaultAddWeight = value;
	}
	
	get priority(): number {
		return this._priority;
	}
	
	set priority(value: number) {
		this._priority = value;
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
		return this._numerator;
	}
	
	set numerator(value: number) {
		this._numerator = value;
	}
	
	get addWeight(): number {
		return this._addWeight;
	}
	
	set addWeight(value: number) {
		this._addWeight = value;
	}
	
	get prio0(): number|undefined {
		if(!this._prio0){
			this.assignPrio0()
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
	
	public assignPrio0(){
		if(this.word === undefined){
			throw new Error('this.word === undefined')
		}
		
		const timeNow:number = parseInt(moment().format('YYYYMMDDHHmmss'))
		this.dateThen = timeNow;
		this._prio0 = 1;
		
		let addEvent_cnt = 0; //計數
		for(let j = 0; j < this.word.date_allEventObjs.length; j++){ //先 專門處理添加事件
			this.procedure[j] = new Procedure(); //已初始化焉、後ʸ勿複初始化
			let cur_date__wordEvent = this.word.date_allEventObjs[j]
			this.procedure[j].date_wordEvent = cur_date__wordEvent
			if(cur_date__wordEvent.wordEvent === WordEvent.ADD){
				addEvent_cnt++;
				this.procedure[j].befPrio = this._prio0;
				this._prio0 *= this.defaultAddWeight;
				this.procedure[j].aftPrio = this._prio0;
			}
			
		}
		
		if(addEvent_cnt === this.word.date_allEventObjs.length){
			//若一個單詞ᵗ添ᵗ次ˋ不止一次、且從未複習過、則益增其權重、以達的芝優先背新詞
			if(addEvent_cnt >= 2){
				//this._prio0 *= Math.pow(this.defaultAddWeight, addEvent_cnt)
				this._prio0 *= Math.pow(10, addEvent_cnt) //改於23.06.05-1203
			}
			return;//直接return 不處理憶與忘ˉ事件 節約ᵣ時
		}
		
		for(let j = 0; j< this.word.date_allEventObjs.length; j++){// 再處理 憶與忘 ˉ事件
			/*if(this.word.wordShape === 'fabric'){
				console.log(this)
				console.log(this._prio0)//t
				console.log(j)
			}*/
			let cur_date__wordEvent = this.word.date_allEventObjs[j]
			let eventDurationOfLastToThis = 2 //若初值取一則取對數後得零
			let dateWeight = 2
			if(
				this.word.date_allEventObjs[j] && this.word.date_allEventObjs[j-1] &&
				this.word.date_allEventObjs[j-1].wordEvent !== WordEvent.ADD//此處當不慮添ˉ事件 否則 例如有一詞、其複添ᵗ次ˋ潙2、然添ᵗ期ᵗ去今皆稍遠、復習旹初見ᶦ旹若能誌則其頻會大降、日後則見者稀也。非所冀也。故算dateDif旹當不慮添ᵗ期
			)//第一個事件必昰加、故第一次循環旹恆進不去下ᵗ分支
			{
				eventDurationOfLastToThis = VocaB.兩日期所差秒數YYYYMMDDHHmmss(this.word.date_allEventObjs[j].date, this.word.date_allEventObjs[j-1].date)
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
			if(cur_date__wordEvent.wordEvent === WordEvent.ADD){
				//啥也不做 直接到下輪循環 同時也防止procedure[j]變抹掉重設
				//console.log(this.procedure[j])//t
			}else if(cur_date__wordEvent.wordEvent === WordEvent.REMEMBER){
				
				/*if(this.procedure[j-1]){
					this.procedure[j].befPrio = this.procedure[j-1].aftPrio
				}else{
					this.procedure[j].befPrio = this._prio0
				}*/
				this.procedure[j].befPrio = this._prio0
				let durationOfLastRmbEventToNow = VocaB.兩日期所差秒數YYYYMMDDHHmmss(timeNow, cur_date__wordEvent.date)
				let debuff = (this.numerator/durationOfLastRmbEventToNow) + 1//降低在secs秒內憶ᵗ詞ˋ再現ᵗ率 初設secs潙 3600*8 即六(應潙八)小時 然則憶ᵗ詞ˋ六小時內ʸ複現ᵗ率ˋ降、且越近則降ˋ越多
				if(dateWeight >=2){
					this._prio0 = this._prio0/(dateWeight/2)/debuff //待改:除以二ˋ既未錄入procedure 亦 寫死的ᵉ
				}else{
					this._prio0 = (this._prio0/1.1)/debuff
				}
				
				this.procedure[j].aftPrio = this._prio0
				this.procedure[j].dateWeight = dateWeight; //此dateWeight昰未處理ᐪ 未除以2 之事
				this.procedure[j].eventDurationOfLastToThis = eventDurationOfLastToThis
				this.procedure[j].dateDebuff = debuff
				this.procedure[j].durationOfLastRmbEventToNow = durationOfLastRmbEventToNow
			}else if(cur_date__wordEvent.wordEvent === WordEvent.FORGET) {
				this.procedure[j].befPrio = this._prio0
				this._prio0 *= dateWeight
				this.procedure[j].aftPrio = this._prio0
				this.procedure[j].dateWeight = dateWeight;
				this.procedure[j].eventDurationOfLastToThis = eventDurationOfLastToThis
				//無 debuff之類
			}
				
			
		}
		
		/*for(let i = 0; i < this.procedure.length; i++){
			if(this.procedure[i].date_wordEvent === undefined){
				console.log('i = '+i)
				console.error(this._word)
				console.error(this.procedure[i])
				throw new Error('this.procedure[i].date_wordEvent === undefined')
			}
		}*/
		
	}
	
	public addBonus(bonus:number){
		this.priority = this.prio0! + bonus;
		this.bonus = bonus
	}
	
	/*
	* 23.06.03-2244 由時間跨度(秒)算時間ᵗ權重
	* */
	public static getDateWeight(dateDif:number, denominator:number=60):number{
		let out = Math.log2((dateDif/denominator)+1)+1
		return out;
	}
	
}

class SingleWordB{
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
	private _priority:number = 1
	private _priorityObj:Priority = new Priority();
	/*private _date_allEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_addEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_rmbEventObjs:{date:number, wordEvent:WordEvent}[]
	private _date_fgtEventObjs:{date:number, wordEvent:WordEvent}[]*/
	
	private _date_allEventObjs:Date_wordEvent[] = []
	private _date_addEventObjs:Date_wordEvent[] = []
	private _date_rmbEventObjs:Date_wordEvent[] = []
	private _date_fgtEventObjs:Date_wordEvent[] = []
	
	
	get priorityObj(): Priority {
		return this._priorityObj;
	}
	
	set priorityObj(value: Priority) {
		this._priorityObj = value;
	}
	
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
	
	get priority(): number {
		return this._priority;
	}
	
	set priority(value: number) {
		this._priority = value;
	}
	
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
		/*this._ling = ''
		this._id = -1;
		this._wordShape = '';
		this._fullComments = [];
		this._addedTimes = -1;
		this._rvwTimes = -1;
		this._rmbTimes = -1;
		this._rmbDates = [];
		this._fgtTimes = -1;
		this._fgtDates = [];
		this._addedDates = [];
		//this.datesFormats = '%Y_%m_%d_%H%M%S';
		this._datesFormats = ['%y.%m.%d-%H%M']
		this._rvwDates = [];
		this._priority = 1;
		this._date_allEventObjs = []
	
		this._date_addEventObjs = []
		this._date_rmbEventObjs = []
		this._date_fgtEventObjs = []*/
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
		//console.log(this.date_eventObjs)
		this._date_allEventObjs.sort((a, b)=>{
			return a.date - b.date
		})
	}
	public 取ᵣ可視化事件(add:string, remember:string, forget:string){
		//console.log(this)//t
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
			//console.log(outcome)//t
		}
		//console.log(this.date_eventObjs)//t
		return outcome
	}
}

class VocaB{
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
	
	public startToShow(wordsToLearn?:SingleWordB[]){
		//let randomIndex = Math.floor(Math.random() * (this.words.length))//第一個單詞完全由隨機數決定
		if(!wordsToLearn){
			wordsToLearn = this._allWords
		}
		this.assignPriority()
		wordsToLearn.sort((a, b)=>{
			return b.priority - a.priority
		})
		this._currentIndex = 0
		if(this._curSingleWord.wordShape === ''){
			this._curSingleWord = wordsToLearn[this._currentIndex]
		}
		//console.log(this.curSingleWord)//t
		$('#'+this._wordAreaId).text(this._curSingleWord.wordShape)
		this.showCurWordInfoRight()
		/*for(let i = 0; i < this.words.length; i++){//t
			console.log(this.words[i].wordShape)
			console.log(this.words[i].priority)
		}*/
	}
	
	public showCurWordInfoRight(){
		$('#wordShape').text(this._curSingleWord.wordShape)
		$('#wordId').text(this._curSingleWord.id)
		$('#ling').text(this._curSingleWord.ling)
		$('#wordEvent').text(this._curSingleWord.取ᵣ可視化事件('●','■','□') as string)
		$('#priority').text(this._curSingleWord.priority)
		$('#addedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.addedDates)))
		$('#addedTimes').text(this._curSingleWord.addedTimes)
		$('#rememberedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.rmbDates)))
		$('#rememberedTimes').text(this._curSingleWord.rmbTimes)
		$('#forgottenDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.fgtDates)))
		$('#forgottenTimes').text(this._curSingleWord.fgtTimes)
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

	public rememberedEvent(){
		//currentWord之功能未叶
		let dateNow:string = moment().format('YYYYMMDDHHmmss')//坑:ss大寫後似成毫秒 20230507162355
		console.log(dateNow)
		//console.log(this.currentWord)
		this._curSingleWord.rmbDates.push(dateNow)
		this._curSingleWord.date_allEventObjs.push({date:parseInt(dateNow), wordEvent:WordEvent.REMEMBER})
		//this.curSingleWord.reviewedTimes++; //無需手動++ 因用get方法取次數旹自動返回日期數組ᵗ長
		//this.curSingleWord.rememberedTimes++;
		//reviewed.allWords.push(this.curSingleWord)
		//this.curRememberedWords.push(this.curSingleWord)
		//this.curReviewedWords.push(this.curSingleWord)
		this._idsOfCurRemWords.push(this._curSingleWord.id)
		this._idsOfCurRvwWords.push(this._curSingleWord.id)
		this.showNext();
		
	}
	
	public forgotEvent(){
		let dateNow:string = moment().format('YYYYMMDDHHmmss')//坑:ss大寫後似成毫秒 20230507162355
		console.log(dateNow)
		//console.log(this.currentWord)
		this._curSingleWord.fgtDates.push(dateNow)
		this._curSingleWord.date_allEventObjs.push({date:parseInt(dateNow), wordEvent:WordEvent.FORGET})
		//this.curSingleWord.reviewedTimes++;
		//this.curSingleWord.forgottenTimes++;
		//reviewed.allWords.push(this.curSingleWord)
		//this.curForgottenWords.push(this.curSingleWord)
		//this.curReviewedWords.push(this.curSingleWord)
		this._idsOfCurRvwWords.push(this._curSingleWord.id)
		this._idsOfCurFgtWords.push(this._curSingleWord.id)
		this.showNext();
	}

	public showNext(){
		
		$('#'+this._lastWordInfoDivId).text(this._curSingleWord.wordShape+
			 "\n"+VocaB.取逆轉義ᵗstr(VocaB.取字符串數組中長度最大者(this._curSingleWord.fullComments)));//TODO:示釋義數組旹每元素間增空行
		
		
		$('#last_wordShape').text(this._curSingleWord.wordShape)
		$('#last_wordId').text(this._curSingleWord.id)
		$('#last_ling').text(this._curSingleWord.ling)
		$('#last_wordEvent').text(this._curSingleWord.取ᵣ可視化事件('●','■','□') as string) //此步蜮甚耗時ⁿ致塞
		$('#last_priority').text(this._curSingleWord.priority)
		$('#last_addedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.addedDates)))
		$('#last_addedTimes').text(this._curSingleWord.addedTimes)
		$('#last_rememberedDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.rmbDates)))
		$('#last_rememberedTimes').text(this._curSingleWord.rmbTimes)
		$('#last_forgottenDates').text(JSON.stringify(VocaB.simplifyDateArrFormat(this._curSingleWord.fgtDates)))
		$('#last_forgottenTimes').text(this._curSingleWord.fgtTimes)
		$('#score').text(this._idsOfCurRemWords.length+':'+this._idsOfCurFgtWords.length)
		
		//let nextIndex = Math.floor(Math.random() * (this.words.length))
		let nextIndex = this._currentIndex+1
		console.log('nextIndex='+nextIndex)//t
		if(nextIndex >= this._idsOfWordsToLearn.length || nextIndex <0){
			nextIndex = 0
			console.log('nextIndex被重設潙0')
			alert('nextIndex被重設潙0')
		}
		//console.log(nextIndex);
		this._currentIndex = nextIndex;
		console.log('currentIndex='+this._currentIndex)
		this._curSingleWord = this._wordsToLearn[nextIndex];
		$('#'+this._wordAreaId).text(this._curSingleWord.wordShape);
		//console.log(this.currentWord);
		this.showCurWordInfoRight()
	}
	
	
	
	public showWordInfoAtBottom(){
		console.dir(this.curSingleWord)
		console.dir(this.curSingleWord.priorityObj)
		console.dir(this.curSingleWord.priorityObj.procedure)
		$('#'+this._lastWordInfoDivId).text(this._curSingleWord.wordShape+
			"\n"+VocaB.取逆轉義ᵗstr(VocaB.取字符串數組中長度最大者(this._curSingleWord.fullComments) ));
	}
	
	public assignWordsToLearnToCurForgottenWords(){
		this.setWordsToLearn(this.getWordsByIds(this._idsOfCurFgtWords))
	}
	
	public reviewForgottenWords(){ //待改:只一次有效
		let forgottenWordsIds:number[] = [...this._idsOfCurFgtWords]
		this.resetCur()
		this._idsOfCurFgtWords = forgottenWordsIds
		this.setWordsToLearnByIds(this._idsOfCurFgtWords)
		this.assignWordsToLearnToCurForgottenWords()
		this.assignPriority()
		this._currentIndex = -1
		console.log(this._wordsToLearn)//t
		this.startToShow(this._wordsToLearn)
		this._idsOfCurFgtWords = []// 此項要在最後重置 否則愈積愈多
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
	
	public assignPriority(){
		//每憶或忘則優先度ˋ比例ᵈ增減
		/*
		每憶則*(1-0.01)
		每忘則*(1+0.1)
		每複錄則*(1+0.2)
		然後、對所有ᵗ優先度取平均數 設潙p、取0到p之間ᵗ隨機數數組、各ᵈ加到各詞ᵗ原ᵗ優先度、遂得終ᵗ優先度
		待叶:時間相隔越久則變ᵗ權重越高
		今日內憶ᵗ詞ˋ今日內ʸᵗ複現ˋ當少
		*/
		/*let prio0:number[] = [this.allWords.length]
		const MILL = 1000000*/
		
		/*
		for(let i = 0; i < this.allWords.length; i++){
			prio0[i] = 1
			//let t = this.allWords[i].addedTimes*3 + this.allWords[i].forgottenTimes*2 - this.allWords[i].rememberedTimes//棄用
			//let wordEvents:string = this.allWords[i].取ᵣ可視化事件('a','r','f')
			let date_eventObj = this.allWords[i].date_allEventObjs
			for(let j = 0; j < date_eventObj.length; j++){//兩日期相減 絕對值大於1000000則隔˪日
				if(j<=0){
					if(date_eventObj[j].wordEvent === WordEvent.ADD){
						prio0[i] *= (1+0.2)
					}else{
						console.log(this.allWords[i])
						throw new Error('第一個單詞事件非添加 循環中當i='+i)
					}
				}
					else
				{
					//let dateDif = date_eventObj[j].date-date_eventObj[j-1].date //後ᵗ日期減前ᵗ日期
					let dateDif = VocaB.兩日期所差秒數YYYYMMDDHHmmss(date_eventObj[j].date, date_eventObj[j-1].date)
					//宜用同類事件ᵗ日期相減//太瑣、不用也無妨
					if(date_eventObj[j].wordEvent === WordEvent.ADD){
						let dateDifOfSameEvent = 10;
						if(this.allWords[i].date_addEventObjs[j-1] && this.allWords[i].date_addEventObjs[j]){
							//dateDifOfSameEvent = this.allWords[i].date_addEventObjs[j] - this.allWords[i].date_addEventObjs[j-1]//不要直接減數字ₐ日期、宜調包㕥計兩日期ᵗ隔ᵗ時
							//不考慮add之況
						}
						prio0[i] *= 100
					}else if(date_eventObj[j].wordEvent === WordEvent.REMEMBER){
						let dateDifOfSameEvent = 10;
						if(this.allWords[i].date_rmbEventObjs[j-1] && this.allWords[i].date_rmbEventObjs[j]){
							console.log(this.allWords[i].date_rmbEventObjs)//t
							console.log(this.allWords[i].date_rmbEventObjs[j-1].date)//t
							console.log(this.allWords[i].date_rmbEventObjs[j].date)//t
							dateDifOfSameEvent = VocaB.兩日期所差秒數YYYYMMDDHHmmss(this.allWords[i].date_rmbEventObjs[j].date, this.allWords[i].date_rmbEventObjs[j-1].date)
						}
						console.log(Math.log2(dateDif))//t
						prio0[i] *= (1-0.09)*Math.log2(dateDif) //待改:縱憶猶使增
						
					}else if(date_eventObj[j].wordEvent === WordEvent.FORGET){
						let dateDifOfSameEvent = 10;
						if(this.allWords[i].date_fgtEventObjs[j-1] && this.allWords[i].date_fgtEventObjs[j]){
							dateDifOfSameEvent = VocaB.兩日期所差秒數YYYYMMDDHHmmss(this.allWords[i].date_fgtEventObjs[j].date, this.allWords[i].date_fgtEventObjs[j-1].date)
						}
						prio0[i] *= (1+0.1)*Math.log2(dateDif) //待叶:畫出函數圖像
					}
				}
				
				
				
				/!*if(wordEvents.charAt(j) === 'a'){
					prio0[i] *= (1+0.2)
				}else if(wordEvents.charAt(j) === 'r'){
					prio0[i] *= (1-0.01)
				}else if(wordEvents.charAt(j) === 'f'){
					prio0[i] *= (1+0.1)
				}*!/
			}
		}
		*/
		
		//-------
		
		/*
		const timeNow:number = parseInt(moment().format('YYYYMMDDHHmmss'))
		let prio0:number[] = []
		const MILL = 1000000
		let secs = 3600*12 //分子
		let defaultAddWeight = 80
		
		for(let i = 0; i < this._allWords.length; i ++){
			prio0[i] = 1;
			let date_allEventObjs = this._allWords[i].date_allEventObjs
			for(let j = 0; j < date_allEventObjs.length; j++){
				if(date_allEventObjs[j].wordEvent === WordEvent.ADD){//add事件與憶,忘 ˉ事件分ᵈ理
					prio0[i]*= defaultAddWeight
				}
			}
		}
		
		for(let i = 0; i < this._allWords.length; i++){
			
			let date_allEventObjs = this._allWords[i].date_allEventObjs
			for(let j = 0; j < date_allEventObjs.length; j++){
				let dateDif = 2 //若初值取一則取對數後得零
				let dateWeight = 2
				if(date_allEventObjs[j] && date_allEventObjs[j-1] && date_allEventObjs[j-1].wordEvent !== WordEvent.ADD){//此處當不慮添ˉ事件 否則 例如有一詞、其複添ᵗ次ˋ潙2、然添ᵗ期ᵗ去今皆稍遠、復習旹初見ᶦ旹若能誌則其頻會大降、日後則見者稀也。非所冀也。故算dateDif旹當不慮添ᵗ期
					dateDif = VocaB.兩日期所差秒數YYYYMMDDHHmmss(date_allEventObjs[j].date, date_allEventObjs[j-1].date)
					if(dateDif < 0){
						console.log(date_allEventObjs)
						console.log('date_allEventObjs[j].date')
						console.log(date_allEventObjs[j].date)
						console.log('date_allEventObjs[j-1].date')
						console.log(date_allEventObjs[j-1].date)
						throw new Error('後ᵗ時間日期ˋ減ᵣ前ᐪ不應得負數')
					}
					dateWeight = Math.log2(dateDif)
				}
				
				if(date_allEventObjs[j].wordEvent === WordEvent.ADD){
					//prio0[i] *= defaultAddWeight
					//不處理
					
				}else if(date_allEventObjs[j].wordEvent === WordEvent.REMEMBER){
					let durationOfLastRmbEventToNow = VocaB.兩日期所差秒數YYYYMMDDHHmmss(timeNow, date_allEventObjs[j].date)
					let debuff = (secs/durationOfLastRmbEventToNow)+1 //降低在secs秒內憶ᵗ詞ˋ再現ᵗ率 初設secs潙 3600*6 即六小時 然則憶ᵗ詞ˋ六小時內ʸ複現ᵗ率ˋ降、且越近則降ˋ越多
					prio0[i] = (dateWeight>=2)? (prio0[i]/(dateWeight/2))/debuff : (prio0[i]/1.1)/debuff
					
				}else if(date_allEventObjs[j].wordEvent === WordEvent.FORGET){
					prio0[i] *= dateWeight
				}
			}
		}
		
		
		
		console.log('prio0:')
		console.log(prio0)
		let aver = 0;
		for(let j = 0; j < prio0.length; j++){
			aver += prio0[j]
		}
		aver = aver/this._allWords.length
		console.log('平均初權重:'+aver)
		let median = VocaB.median(prio0)
		console.log('初權重中位數:'+median)
		let randoms:number[] = VocaB.generateRandomNumbers(this._allWords.length, 0, aver/8)
		//console.log(randoms)
		let prio1:number[] = new Array(this._allWords.length)
		for(let i = 0; i < this._allWords.length; i++){
			prio1[i] = prio0[i] + randoms[i]
			this._allWords[i].priority = prio1[i]
		}
	*/
		
		for(let i = 0; i < this.allWords.length; i++){
			this.allWords[i].priorityObj.word = this.allWords[i]
			this.allWords[i].priorityObj.assignPrio0();
		}
		
		let aver:number = 0;
		for(let i = 0; i < this.allWords.length; i++){
			aver += this.allWords[i].priorityObj.prio0!
		}
		
		aver /= this.allWords.length;
		console.log('平均初權重:'+aver)
		let randoms:number[] = VocaB.generateRandomNumbers(this._allWords.length, 0, aver/8)
		for(let i = 0; i < this.allWords.length; i++){
			this.allWords[i].priorityObj.randomRange_max = aver/8
			this.allWords[i].priorityObj.addBonus(randoms[i]);
			this.allWords[i].priority = this.allWords[i].priorityObj.priority
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
	
	public static generateRandomNumbers(n:number, a:number, b:number) {
		a*=10000
		b*=10000
		const result:number[] = [];
		for (let i = 0; i < n; i++) {
			let randomNumber = Math.floor(Math.random() * (b - a + 1) + a);
			randomNumber/=10000
			result.push(randomNumber);
		}
		return result;
	}
	
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
	}
	
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


function testPostData(url:any, obj:any){
	
	window.fetch(url, {
		method : 'POST',
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(obj),
	})
		 .then((response:any)=>{
			 console.log('數據發送成功', response);
		 })
		 .catch((err:any)=>{
			 console.log('出錯', err);
		 })
}

function testPostBtn(){
	testPostData('http://localhost:1919', vocaB.allWords);
}


let vocaB = new VocaB();
let newTestWords:SingleWordB[] = []

let testSingleWord = new SingleWordB()
/*function testGetDataBtn(){
	fetch('/eng')
	.then(response => response.json())
	.then(data => { //後端ˋ數據ˇjsonᵉ包裝ⁿ前端ʰ傳、前端ˋ得ᶦ後不需手動parse?
		console.log(data);
		// 在这里处理从服务器返回的数据
		let dataObj = data
		for(let i = 0; i < dataObj.length; i++){
			let temp = new SingleWordB();
			temp.wordShape = dataObj[i].wordShape
			temp.fullComments = JSON.parse(dataObj[i].fullComments)
			temp.addedDates = JSON.parse(dataObj[i].addedDates)
			temp.datesFormats = JSON.parse(dataObj[i].datesFormats)
			temp.addedTimes = dataObj[i].addedTimes
			temp.rememberedDates = dataObj[i].rememberedDates
			temp.reviewedTimes = dataObj[i].rememberedTimes
			// console.log(temp.rememberedTimes)
			temp.forgottenDates = dataObj[i].forgottenDates
			temp.forgottenTimes = dataObj[i].forgottenTimes
			
			newTestWords.push(temp)
			//newTestWords.push(dataObj[i])
		}
		vocaB.setWords(newTestWords)
	});
}*/

const eng = new VocaB()
const jap = new VocaB()
const lat = new VocaB()
let reviewed = new VocaB()
let 此次所忘 = new VocaB()
//前幾個ˇ皆未用及

let ling = new VocaB()
function main(){

}

function assignWordsFromServ(){
	let gotVal:string = $('input[name="ling"]:checked').val() as string;
	console.log(gotVal)
	ling = new VocaB()
	ling.ling = gotVal;
	let url:string = '/'+gotVal
	fetch(url)
		.then(response=>response.json())
		.then(data=>{
			let dataObj = data
			for(let i = 0; i < dataObj.length; i++){
				let temp = new SingleWordB();
				temp.ling = gotVal??'';
				temp.id = dataObj[i].id
				temp.wordShape = dataObj[i].wordShape
				temp.fullComments = JSON.parse(dataObj[i].fullComments)//坑:  忘记用JSON.parse 直接把字符串赋给类型为字符串数组的变量 ts编译器居然没发现, , ,
				temp.addedDates = JSON.parse(dataObj[i].addedDates)
				temp.datesFormats = JSON.parse(dataObj[i].datesFormats)
				//temp.addedTimes = dataObj[i].addedTimes
				temp.rmbDates = JSON.parse(dataObj[i].rememberedDates)
				//temp.rmbTimes = dataObj[i].rememberedTimes
				//temp.reviewedTimes = dataObj[i].reviewedTimes
				temp.fgtDates = JSON.parse(dataObj[i].forgottenDates)
				//temp.fgtTimes = dataObj[i].forgottenTimes
				newTestWords.push(temp)
				//newTestWords.push(dataObj[i])
			}
			ling.setAllWords(newTestWords)
			//ling.setWordsToLearn(newTestWords)
			
			vocaB = ling
			console.log(ling)
		})
}


