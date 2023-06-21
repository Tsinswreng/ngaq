"use strict";
//23.06.04-0010
//v2.0.3
/*縮寫:
    cur	current
    rmb	remember
    fgt	forget
*
* */
var WordEvent;
(function (WordEvent) {
    WordEvent[WordEvent["ADD"] = 0] = "ADD";
    WordEvent[WordEvent["REMEMBER"] = 1] = "REMEMBER";
    WordEvent[WordEvent["FORGET"] = -1] = "FORGET";
})(WordEvent || (WordEvent = {}));
class Procedure {
    constructor() {
        this._aftPrio = 1; //變ᵗ後ᵗ優先度
        this._randomBonus = 0;
    }
    get date_wordEvent() {
        return this._date_wordEvent;
    }
    set date_wordEvent(value) {
        this._date_wordEvent = value;
    }
    get eventDurationOfLastToThis() {
        return this._eventDurationOfLastToThis;
    }
    set eventDurationOfLastToThis(value) {
        this._eventDurationOfLastToThis = value;
    }
    get dateWeight() {
        return this._dateWeight;
    }
    set dateWeight(value) {
        this._dateWeight = value;
    }
    get durationOfLastRmbEventToNow() {
        return this._durationOfLastRmbEventToNow;
    }
    set durationOfLastRmbEventToNow(value) {
        this._durationOfLastRmbEventToNow = value;
    }
    get dateDebuff() {
        return this._dateDebuff;
    }
    set dateDebuff(value) {
        this._dateDebuff = value;
    }
    get befPrio() {
        return this._befPrio;
    }
    set befPrio(value) {
        this._befPrio = value;
    }
    get aftPrio() {
        return this._aftPrio;
    }
    set aftPrio(value) {
        this._aftPrio = value;
    }
    get randomBonus() {
        return this._randomBonus;
    }
    set randomBonus(value) {
        this._randomBonus = value;
    }
}
class Priority {
    get bonus() {
        return this._bonus;
    }
    set bonus(value) {
        this._bonus = value;
    }
    get defaultAddWeight() {
        return Priority._defaultAddWeight;
    }
    set defaultAddWeight(value) {
        Priority._defaultAddWeight = value;
    }
    get priority_num() {
        return this._priority_num;
    }
    set priority_num(value) {
        this._priority_num = value;
    }
    get dateThen() {
        return this._dateThen;
    }
    set dateThen(value) {
        this._dateThen = value;
    }
    get procedure() {
        return this._procedure;
    }
    set procedure(value) {
        this._procedure = value;
    }
    get word() {
        return this._word;
    }
    set word(value) {
        if (value) {
            /*let sub = JSON.parse(JSON.stringify(value))
            delete sub.priorityObj
            this._word = sub;*/
            this._word = value;
        }
        else {
            throw new Error('往set裏傳undefined');
        }
    }
    get numerator() {
        return Priority._numerator;
    }
    set numerator(value) {
        Priority._numerator = value;
    }
    static get numerator() {
        return Priority._numerator;
    }
    static set numerator(value) {
        Priority._numerator = value;
    }
    get addWeight() {
        return this._addWeight;
    }
    set addWeight(value) {
        this._addWeight = value;
    }
    get prio0() {
        if (!this._prio0) {
            //this.assignPrio0()
            this.calcPrio0(); //[23.06.16-2054,]
        }
        return this._prio0;
    }
    set prio0(value) {
        this._prio0 = value;
    }
    get randomRange_max() {
        return this._randomRange_max;
    }
    set randomRange_max(value) {
        this._randomRange_max = value;
    }
    constructor() {
        this._addWeight = 1;
        this._randomRange_max = 0;
        this._dateThen = 0; // 當時ᵗ日期時間
        /*private _randomBuff:number = -1//棄用˪
        private _prio1:number = -1 //棄用˪
        private _dateDifs:number[] = []//棄用˪
        private _dateWeights:number[] = []//棄用˪*/
        this._procedure = [];
    }
    /**
     * [23.06.16-2048,]
     * v23.06.21-1531
     * @param priorityObj
     * @param date_allEventObjs
     * @returns
     */
    calcPrio0(priorityObj = this, date_allEventObjs) {
        var _a, _b;
        //判空
        if (!date_allEventObjs) {
            date_allEventObjs = (_a = this.word) === null || _a === void 0 ? void 0 : _a.date_allEventObjs;
        }
        if (!date_allEventObjs) {
            throw new Error('!date_allEventObjs');
        }
        //獲取當時的時間
        const timeNow = parseInt(moment().format('YYYYMMDDHHmmss'));
        priorityObj.dateThen = timeNow;
        //priorityObj._prio0 = 1; //[,23.06.20-2101]
        (_b = priorityObj._prio0) !== null && _b !== void 0 ? _b : (priorityObj._prio0 = 1);
        let addEvent_cnt = 0; //計數
        let tempProcedure;
        //先 專門處理添加事件
        for (let j = 0; j < date_allEventObjs.length; j++) {
            if (date_allEventObjs[j].wordEvent !== WordEvent.ADD) {
                continue;
            }
            tempProcedure = new Procedure();
            tempProcedure.date_wordEvent = date_allEventObjs[j];
            addEvent_cnt++;
            tempProcedure.befPrio = priorityObj._prio0;
            //[23.06.15-2114,]{第三次複加之後、重複且連續ᵗ加ˡ事件ᵘ、減其增ᵗ權。昔斯司詞程序未造成旹、不能以ᶦ複習單詞、故會有詞芝連續複添ᵗ次ˋ甚多者、權亦益增。程序未成 不能複習之故也。今程序既成、若及時ᵈ複習、則每詞ᵗ權ˋ皆不應極端。}
            if (addEvent_cnt >= 3 && date_allEventObjs[j - 1] && date_allEventObjs[j - 1].wordEvent === WordEvent.ADD) {
                priorityObj._prio0 *= 2; //priorityObj.defaultAddWeight;
            }
            else {
                priorityObj._prio0 *= priorityObj.defaultAddWeight;
            }
            tempProcedure.aftPrio = priorityObj._prio0;
            priorityObj.procedure.push(tempProcedure);
        } //加ˡ事件ˇᵗ處理ˋ終˪。
        //若一個單詞ᵗ添ᵗ次ˋ不止一次、且從未複習過、則益增其權重、以達的芝優先背新詞
        if (addEvent_cnt === date_allEventObjs.length && addEvent_cnt >= 2) {
            priorityObj._prio0 += Math.pow(priorityObj._prio0, addEvent_cnt); //[23.06.07-2320,]
            return; //直接return 不處理憶與忘ˉ事件 節約ᵣ時
        }
        // 再處理 憶與忘 ˉ事件
        for (let j = 0; j < date_allEventObjs.length; j++) {
            tempProcedure = new Procedure();
            let cur_date__wordEvent = date_allEventObjs[j];
            tempProcedure.date_wordEvent = date_allEventObjs[j];
            let eventDurationOfLastToThis = 1.1; //若初值取一則取對數後得零
            let dateWeight = 1.1; //改于 23.06.07-1005
            //上一個日期-事件 ˉ對象
            let lastDate_eventObj = priorityObj.procedure[priorityObj.procedure.length - 1].date_wordEvent;
            //<算dateWeight>
            if (
            //若上一個單詞事件不昰加
            (lastDate_eventObj === null || lastDate_eventObj === void 0 ? void 0 : lastDate_eventObj.wordEvent) !== WordEvent.ADD
            //date_allEventObjs[j] && date_allEventObjs[j-1] &&
            //date_allEventObjs[j-1].wordEvent !== WordEvent.ADD//此處當不慮添ˉ事件 否則 例如有一詞、其複添ᵗ次ˋ潙2、然添ᵗ期ᵗ去今皆稍遠、復習旹初見ᶦ旹若能誌則其頻會大降、日後則見者稀也。非所冀也。故算dateDif旹當不慮添ᵗ期
            ) //第一個事件必昰加、故第一次循環旹恆進不去下ᵗ分支
             { //!若初調此函數之後再調此函數旹只傳入了一個事件 則無j-1矣。
                eventDurationOfLastToThis = VocaB.兩日期所差秒數YYYYMMDDHHmmss(date_allEventObjs[j].date, lastDate_eventObj === null || lastDate_eventObj === void 0 ? void 0 : lastDate_eventObj.date);
                if (eventDurationOfLastToThis < 0) {
                    throw new Error('後ᵗ時間日期ˋ減ᵣ前ᐪ不應得負數');
                }
                dateWeight = Priority.getDateWeight(eventDurationOfLastToThis); //或許此處可不寫死ᵈ、洏使用戶配置 函數芝把dataDif轉成dateWeight者。
                if (dateWeight < 1) { //實ᵈ處理後ᵗ dateWeight ˋ必大於一
                    dateWeight = 1.1;
                    console.log(this);
                    console.log('因dateWeight<1、已被修正至1.1');
                }
            }
            //</算dateWeight>
            if (cur_date__wordEvent.wordEvent === WordEvent.ADD) {
                //啥也不做
            }
            else if (cur_date__wordEvent.wordEvent === WordEvent.REMEMBER) {
                tempProcedure.befPrio = priorityObj._prio0;
                let durationOfLastRmbEventToNow = VocaB.兩日期所差秒數YYYYMMDDHHmmss(timeNow, cur_date__wordEvent.date);
                //降低在secs秒內憶ᵗ詞ˋ再現ᵗ率 初設secs潙 3600*8 即六(應潙八)小時 然則憶ᵗ詞ˋ六小時內ʸ複現ᵗ率ˋ降、且越近則降ˋ越多
                let debuff = priorityObj.getDebuff(durationOfLastRmbEventToNow);
                if (dateWeight >= 2) {
                    priorityObj._prio0 = priorityObj._prio0 / (dateWeight / 2) / debuff; //待改:除以二ˋ既未錄入procedure 亦 寫死的ᵉ
                    //<待叶>{若一詞 連續亻嘰次皆能被憶、且時間ᵗ誇度ˋ達ᵣ亻嘰久、則濾ᶦ不示。}
                }
                else {
                    priorityObj._prio0 = (priorityObj._prio0 / 1.1) / debuff;
                }
                tempProcedure.aftPrio = priorityObj._prio0;
                tempProcedure.dateWeight = dateWeight; //此dateWeight昰未處理ᐪ 未除以2 之事
                tempProcedure.eventDurationOfLastToThis = eventDurationOfLastToThis;
                tempProcedure.dateDebuff = debuff;
                tempProcedure.durationOfLastRmbEventToNow = durationOfLastRmbEventToNow;
                priorityObj.procedure.push(tempProcedure);
            }
            else if (cur_date__wordEvent.wordEvent === WordEvent.FORGET) {
                tempProcedure.befPrio = priorityObj._prio0;
                priorityObj._prio0 *= dateWeight;
                tempProcedure.aftPrio = priorityObj._prio0;
                tempProcedure.dateWeight = dateWeight;
                tempProcedure.eventDurationOfLastToThis = eventDurationOfLastToThis;
                //無 debuff之類
                priorityObj.procedure.push(tempProcedure);
            }
        }
    }
    addBonus(bonus) {
        this.priority_num = this.prio0 + bonus;
        this.bonus = bonus;
    }
    /*
    * 23.06.03-2244 由時間跨度(秒)算時間ᵗ權重
    * */
    static getDateWeight(dateDif /* , denominator:number=60 */) {
        //let out = Math.log2((dateDif/denominator)+1)+1
        //let out = Math.ceil( Math.log2((dateDif/denominator)+1)+1 ) //改于 23.06.07-1003
        //let out = Math.floor( Math.log2((dateDif/denominator)+1)+1 ) //[23.06.09-0928,]
        //let out = Math.log2((dateDif/denominator)) //[23.06.09-1240,23.06.15-1250] [23.06.15-1254,]{原算法ˋ隔24小時 與 隔72小時 結果ᵗ差ᵗ不大。故改用 開平方 㕥代 取對數}
        let out = (1 / 25) * Math.pow(dateDif, 1 / 2);
        if (out <= 1) {
            out = 1.01;
        }
        return out;
    }
    getDebuff(durationOfLastRmbEventToNow) {
        //憶ˡ事件ᵗ次ˋ愈多則分母愈大
        if (!this.word) {
            throw new Error('!this.word');
        }
        let date_allEventObjs = this.word.date_allEventObjs;
        //console.log(date_allEventObjs)//t
        if (date_allEventObjs[date_allEventObjs.length - 1].wordEvent === WordEvent.REMEMBER) { //要求末ᵗ事件潙 憶 旹纔有debuff
            //let numerator = this.word.date_allEventObjs.length*this.numerator*2
            let numerator = this.numerator; //[23.06.13-1056,]
            //let debuff = Math.floor((numerator/durationOfLastRmbEventToNow) + 1)
            let debuff = (numerator / durationOfLastRmbEventToNow) + 1; //[23.06.15-1805,]
            /* console.log('debuff');//t
            console.log(debuff);
            if(isNaN(debuff) || !isFinite(debuff)){
                
                throw new Error('debuff is not a number')
            } */
            return debuff >= 1 ? debuff : 1;
        }
        else {
            return 1;
        }
    }
}
Priority._numerator = 3600; //分子  23.06.05-1130默認值改爲3600*24 [23.06.10-2342,]{改潙3600}
Priority._defaultAddWeight = 200; //23.06.05-1158默認值改爲100 //[23.06.13-1047,]{改爲靜態}
Priority.deemAsRememberedPrio0 = Priority._defaultAddWeight; // [23.06.15-2203,]{當初權重低於斯量旹則視作既誌。}
class SingleWordB {
    get priorityObj() {
        return this._priorityObj;
    }
    set priorityObj(value) {
        this._priorityObj = value;
    }
    get ling() {
        return this._ling;
    }
    set ling(value) {
        this._ling = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get wordShape() {
        return this._wordShape;
    }
    set wordShape(value) {
        this._wordShape = value;
    }
    get fullComments() {
        return this._fullComments;
    }
    set fullComments(value) {
        this._fullComments = value;
    }
    get addedTimes() {
        return this._addedDates.length;
    }
    set addedTimes(value) {
        this._addedTimes = value;
    }
    get addedDates() {
        return this._addedDates;
    }
    set addedDates(value) {
        this._addedDates = value;
        this._addedTimes = this._addedDates.length;
    }
    get rvwDates() {
        return this._rvwDates;
    }
    set rvwDates(value) {
        this._rvwDates = value;
        this.rvwTimes = this._rvwDates.length;
    }
    get datesFormats() {
        return this._datesFormats;
    }
    set datesFormats(value) {
        this._datesFormats = value;
    }
    get rvwTimes() {
        return this._rvwTimes;
    }
    set rvwTimes(value) {
        this._rvwTimes = value;
    }
    get rmbTimes() {
        return this._rvwDates.length;
    }
    set rmbTimes(value) {
        this._rmbTimes = value;
    }
    get rmbDates() {
        return this._rmbDates;
    }
    set rmbDates(value) {
        this._rmbDates = value;
    }
    get fgtTimes() {
        return this._fgtDates.length;
    }
    set fgtTimes(value) {
        this._fgtTimes = value;
    }
    get fgtDates() {
        return this._fgtDates;
    }
    set fgtDates(value) {
        this._fgtDates = value;
    }
    get priority_num() {
        //return this._priority_num;
        return this.priorityObj.priority_num;
    }
    /* set priority_num(value: number) {
        this.priorityObj.priority_num = value;
    } */
    get date_allEventObjs() {
        return this._date_allEventObjs;
    }
    set date_allEventObjs(value) {
        this._date_allEventObjs = value;
    }
    get date_addEventObjs() {
        //return this._date_addEventObjs;
        if (this._date_allEventObjs && this._date_addEventObjs && this._date_rmbEventObjs && this._date_fgtEventObjs) {
            return this._date_allEventObjs;
        }
        else {
            this.assignDate_eventObjs();
            return this._date_allEventObjs;
        }
    }
    set date_addEventObjs(value) {
        this._date_addEventObjs = value;
    }
    get date_rmbEventObjs() {
        return this._date_rmbEventObjs;
    }
    set date_rmbEventObjs(value) {
        this._date_rmbEventObjs = value;
    }
    get date_fgtEventObjs() {
        return this._date_fgtEventObjs;
    }
    set date_fgtEventObjs(value) {
        this._date_fgtEventObjs = value;
    }
    constructor() {
        //id:number;//唯一標識
        //public ling:lingType
        this._ling = '';
        this._id = -1;
        this._wordShape = '';
        this._fullComments = [];
        this._addedTimes = -1;
        this._addedDates = [];
        this._rvwDates = [];
        this._datesFormats = ['%y.%m.%d-%H%M']; //似未用上
        this._rvwTimes = -1;
        this._rmbTimes = -1;
        this._rmbDates = [];
        this._fgtTimes = -1;
        this._fgtDates = [];
        this._priority_num = 1;
        this._priorityObj = new Priority();
        /*private _date_allEventObjs:{date:number, wordEvent:WordEvent}[]
        private _date_addEventObjs:{date:number, wordEvent:WordEvent}[]
        private _date_rmbEventObjs:{date:number, wordEvent:WordEvent}[]
        private _date_fgtEventObjs:{date:number, wordEvent:WordEvent}[]*/
        this._date_allEventObjs = [];
        this._date_addEventObjs = [];
        this._date_rmbEventObjs = [];
        this._date_fgtEventObjs = [];
        this.assignDate_eventObjs();
    }
    assignDate_eventObjs() {
        this._date_allEventObjs = [];
        this._date_addEventObjs = [];
        this._date_rmbEventObjs = [];
        this._date_fgtEventObjs = []; //可改:有點佔內存、日期可慮只存一份
        for (let i = 0; i < this._addedDates.length; i++) {
            this._date_allEventObjs.push({
                date: parseInt(this._addedDates[i]),
                wordEvent: WordEvent.ADD
            });
            this._date_addEventObjs.push({
                date: parseInt(this._addedDates[i]),
                wordEvent: WordEvent.ADD
            });
        }
        for (let i = 0; i < this._rmbDates.length; i++) {
            this._date_allEventObjs.push({
                date: parseInt(this._rmbDates[i]),
                wordEvent: WordEvent.REMEMBER
            });
            this._date_rmbEventObjs.push({
                date: parseInt(this._rmbDates[i]),
                wordEvent: WordEvent.REMEMBER
            });
        }
        for (let i = 0; i < this._fgtDates.length; i++) {
            this._date_allEventObjs.push({
                date: parseInt(this._fgtDates[i]),
                wordEvent: WordEvent.FORGET
            });
            this._date_fgtEventObjs.push({
                date: parseInt(this._fgtDates[i]),
                wordEvent: WordEvent.FORGET
            });
        }
        this._date_allEventObjs.sort((a, b) => {
            return a.date - b.date;
        });
    }
    取ᵣ可視化事件(add, remember, forget) {
        this.assignDate_eventObjs();
        let outcome = '';
        for (let i = 0; i < this._date_allEventObjs.length; i++) {
            if (this._date_allEventObjs[i].wordEvent === WordEvent.ADD) {
                outcome += add;
            }
            else if (this._date_allEventObjs[i].wordEvent === WordEvent.REMEMBER) {
                outcome += remember;
            }
            else if (this._date_allEventObjs[i].wordEvent === WordEvent.FORGET) {
                outcome += forget;
            }
            else {
                throw new Error('未知wordEvent');
            }
        }
        return outcome;
    }
}
class VocaB {
    get ling() {
        return this._ling;
    }
    set ling(value) {
        this._ling = value;
    }
    get allWords() {
        return this._allWords;
    }
    set allWords(value) {
        this.setAllWords(value);
    }
    get id_wordMap() {
        return this._id_wordMap;
    }
    set id_wordMap(value) {
        this._id_wordMap = value;
    }
    get wordsToLearn() {
        return this._wordsToLearn;
    }
    set wordsToLearn(value) {
        this.setWordsToLearn(value);
    }
    get idsOfWordsToLearn() {
        return this._idsOfWordsToLearn;
    }
    set idsOfWordsToLearn(value) {
    }
    get idsOfCurRvwWords() {
        return this._idsOfCurRvwWords;
    }
    set idsOfCurRvwWords(value) {
        this._idsOfCurRvwWords = value;
    }
    get idsOfCurRemWords() {
        return this._idsOfCurRemWords;
    }
    set idsOfCurRemWords(value) {
        this._idsOfCurRemWords = value;
    }
    get idsOfCurFgtWords() {
        return this._idsOfCurFgtWords;
    }
    set idsOfCurFgtWords(value) {
        this._idsOfCurFgtWords = value;
    }
    get curSingleWord() {
        return this._curSingleWord;
    }
    set curSingleWord(value) {
        this._curSingleWord = value;
    }
    get currentIndex() {
        return this._currentIndex;
    }
    set currentIndex(value) {
        this._currentIndex = value;
        this.curSingleWord = this.allWords[this.currentIndex];
    }
    get wordAreaId() {
        return this._wordAreaId;
    }
    set wordAreaId(value) {
        this._wordAreaId = value;
    }
    get lastWordInfoDivId() {
        return this._lastWordInfoDivId;
    }
    set lastWordInfoDivId(value) {
        this._lastWordInfoDivId = value;
    }
    get curWordInfoId() {
        return this._curWordInfoId;
    }
    set curWordInfoId(value) {
        this._curWordInfoId = value;
    }
    constructor() {
        this._ling = '';
        this._wordsToLearn = [];
        this._allWords = [];
        this._curSingleWord = new SingleWordB();
        this._id_wordMap = new Map();
        /*this.curReviewedWords = []
        this.curRememberedWords = []
        this.curForgottenWords = []*/
        this._idsOfWordsToLearn = [];
        this._idsOfCurRvwWords = [];
        this._idsOfCurRemWords = [];
        this._idsOfCurFgtWords = [];
        this._currentIndex = 0;
        this._wordAreaId = 'word';
        this._lastWordInfoDivId = 'lastWordInfo';
        this._curWordInfoId = 'curWordInfo';
    }
    /**
     * [23.06.11-1047,]
     * v23.06.15-2216
     * 濾除ᵣ詞芝只有一個事件者 及 [被視爲已記得的]單詞
     */
    filtWordsToLearn(ws) {
        //<待改>{不宜只用權重㕥篩詞、憶ᵗ事件ᵗ量ᵘ亦宜有要求。}
        ws = this.filtAlreadyRememberedWords(ws);
        let filtedWords = [];
        for (let i = 0; i < ws.length; i++) {
            if (ws[i].date_addEventObjs.length >= 2) {
                filtedWords.push(ws[i]);
            }
        }
        return filtedWords;
    }
    /**
     * [23.06.15-2213]{
     * 濾除[被視爲已記得的]單詞}
     * @param ws
     * @returns
     */
    filtAlreadyRememberedWords(ws) {
        let filtedWords = [];
        for (let i = 0; i < ws.length; i++) {
            //ws[i].priorityObj.assignPrio0()
            if (ws[i].priorityObj.prio0 < Priority.deemAsRememberedPrio0) {
            }
            else {
                filtedWords.push(ws[i]);
            }
        }
        return filtedWords;
    }
    /**
     *
     * @param wordsToLearn
     * @param fn_ui 負責界面交互之函數
     */
    startToShow(wordsToLearn, randomBonusArr) {
        //let randomIndex = Math.floor(Math.random() * (this.words.length))//第一個單詞完全由隨機數決定
        /* if(!wordsToLearn){
            wordsToLearn = this._allWords
        } */
        /* if(!randomBonusArr){

        } */
        this.assignPriority(); //[23.06.15-2237,]<可改進>{assignPriority()調了兩次、宜試避免重複算權重}
        this.wordsToLearn = this.filtWordsToLearn(wordsToLearn);
        //console.log(wordsToLearn)//t
        //this.assignPriority(randomBonusArr) //
        if (randomBonusArr) {
            this.addRandomArrAsBonus(randomBonusArr);
        }
        //this.addRandomBonus()
        this.wordsToLearn.sort((a, b) => {
            return b.priority_num - a.priority_num;
        });
        this._currentIndex = 0;
        if (this._curSingleWord.wordShape === '') {
            this._curSingleWord = this.wordsToLearn[this._currentIndex];
        }
        //fn_ui(this)
        //console.log(this.curSingleWord)//t
        /*for(let i = 0; i < this.words.length; i++){//t
            console.log(this.words[i].wordShape)
            console.log(this.words[i].priority)
        }*/
    }
    setAllWords(words) {
        this._allWords = words;
        this._id_wordMap = new Map();
        for (let i = 0; i < this._allWords.length; i++) {
            this._id_wordMap.set(this._allWords[i].id, this._allWords[i]);
        }
        if (this._wordsToLearn.length === 0) {
            this.setWordsToLearn(this._allWords);
        }
    }
    setWordsToLearn(ws) {
        this._wordsToLearn = ws;
        this._idsOfWordsToLearn = [];
        for (let i = 0; i < this._wordsToLearn.length; i++) {
            this._idsOfWordsToLearn[i] = this._wordsToLearn[i].id;
            this._wordsToLearn[i].assignDate_eventObjs();
        }
    }
    setWordsToLearnByIds(ids) {
        let wordsToLearn = this.getWordsByIds(ids);
        this.setWordsToLearn(wordsToLearn);
    }
    addRandomBonus(min, max) {
        let rand = VocaB.generateRandomNumbers(this.wordsToLearn.length, min, max);
        /* for(let i = 0; i < this.wordsToLearn.length; i++){
            this.wordsToLearn[i].priorityObj.addBonus(rand[i]);
        } [,23.06.17-1910,]*/
        this.addRandomArrAsBonus(rand);
    }
    /**
     * [23.06.17-1910,]
     * @param arr
     */
    addRandomArrAsBonus(arr) {
        for (let i = 0; i < arr.length; i++) {
            this.wordsToLearn[i].priorityObj.addBonus(arr[i]);
        }
    }
    //[23.06.20-1934,]{能否合爲一個函數}
    rmbEvent(vocaBObj) {
        let dateNow = moment().format('YYYYMMDDHHmmss'); //坑:ss大寫後似成毫秒 20230507162355
        console.log(dateNow);
        //console.log(currentWord)
        let temp_date__event = {
            date: parseInt(dateNow),
            wordEvent: WordEvent.REMEMBER
        };
        //把剛變化之權重輸出
        vocaBObj.curSingleWord.priorityObj.calcPrio0(vocaBObj.curSingleWord.priorityObj, [temp_date__event]);
        console.log(vocaBObj.curSingleWord.priorityObj.procedure);
        console.log(vocaBObj.curSingleWord.priorityObj.prio0);
        //alert(vocaBObj.curSingleWord.priorityObj)//t
        //vocaBObj.curSingleWord.rmbDates.push(dateNow)
        vocaBObj.curSingleWord.date_allEventObjs.push({ date: parseInt(dateNow), wordEvent: WordEvent.REMEMBER });
        vocaBObj.idsOfCurRemWords.push(vocaBObj.curSingleWord.id);
        vocaBObj.idsOfCurRvwWords.push(vocaBObj.curSingleWord.id);
        //showNext();
    }
    fgtEvent(vocaBObj) {
        let dateNow = moment().format('YYYYMMDDHHmmss'); //坑:ss大寫後似成毫秒 20230507162355
        console.log(dateNow);
        //console.log(currentWord)
        let temp_date__event = {
            date: parseInt(dateNow),
            wordEvent: WordEvent.FORGET
        };
        console.log('111'); //t
        console.log(vocaBObj.curSingleWord.priorityObj); //t
        vocaBObj.curSingleWord.priorityObj.calcPrio0(vocaBObj.curSingleWord.priorityObj, [temp_date__event]);
        console.log(vocaBObj.curSingleWord.priorityObj.procedure);
        console.log(vocaBObj.curSingleWord.priorityObj.prio0);
        //vocaBObj.curSingleWord.fgtDates.push(dateNow)
        vocaBObj.curSingleWord.date_allEventObjs.push({ date: parseInt(dateNow), wordEvent: WordEvent.FORGET });
        vocaBObj.idsOfCurFgtWords.push(vocaBObj.curSingleWord.id);
        vocaBObj.idsOfCurRvwWords.push(vocaBObj.curSingleWord.id);
        //showNext();
        //fn_showNext();
    }
    //[23.06.11-1616,]
    showNext(vocaBObj) {
        //let nextIndex = Math.floor(Math.random() * (this.words.length))
        let nextIndex = vocaBObj.currentIndex + 1;
        console.log('nextIndex=' + nextIndex); //t
        if (nextIndex >= vocaBObj.idsOfWordsToLearn.length || nextIndex < 0) {
            nextIndex = 0;
            console.log('nextIndex被重設潙0');
            alert('nextIndex被重設潙0');
        }
        vocaBObj.currentIndex = nextIndex;
        console.log('currentIndex=' + vocaBObj.currentIndex);
        vocaBObj.curSingleWord = vocaBObj.wordsToLearn[nextIndex];
    }
    /* public getChangeOfPrio0(priorityObj:Priority, new_word_event:WordEvent):Procedure{
        if(!priorityObj.prio0){
            priorityObj.assignPrio0()
        }

        throw new Error()
    } */
    assignWordsToLearnToCurForgottenWords() {
        this.setWordsToLearn(this.getWordsByIds(this._idsOfCurFgtWords));
    }
    reviewForgottenWords( /* ui_fn_startToShow:(...a:any)=>void=()=>{} */) {
        let forgottenWordsIds = [...this._idsOfCurFgtWords];
        this.resetCur();
        this._idsOfCurFgtWords = forgottenWordsIds;
        this.setWordsToLearnByIds(this._idsOfCurFgtWords);
        this.assignWordsToLearnToCurForgottenWords();
        this.assignPriority();
        this._currentIndex = -1;
        //console.log(this._wordsToLearn)//t
        //this.startToShow(this._wordsToLearn, )this.ui_startToShow
        this._idsOfCurFgtWords = []; // 此項要在最後重置 否則愈積愈多
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
    resetCur() {
        //this.idsOfWordsToLearn = []
        this._idsOfCurRvwWords = [];
        this._idsOfCurRemWords = [];
        this._idsOfCurFgtWords = [];
        this._curSingleWord = new SingleWordB();
        this._currentIndex = 0;
        //復習所忘前先重設此
    }
    saveToServ() {
        const tempPwd = $('#tempPwd').val();
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
        let temp = this.getWordsByIds(this.idsOfCurRvwWords);
        VocaB.saveToServ(temp);
        this.idsOfCurRvwWords = []; //每提交則清空 防止重複提交
    }
    getWordsByIds(ids) {
        let outcomes = [];
        for (let i = 0; i < ids.length; i++) {
            let t;
            if ((t = this._id_wordMap.get(ids[i])) !== undefined) {
                outcomes.push(t);
            }
            else {
                console.log(this._id_wordMap);
                throw new Error('該id未對應word id=' + ids[i]);
            }
        }
        return outcomes;
    }
    static simplifyDateFormat(date) {
        return date.replace(/^(\d{4})(\d{2})(\d{2})(.*)$/g, '$2.$3');
    }
    static simplifyDateArrFormat(dateArr) {
        let outcome = new Array(dateArr.length);
        for (let i = 0; i < dateArr.length; i++) {
            outcome[i] = VocaB.simplifyDateFormat(dateArr[i]);
        }
        return outcome;
    }
    static saveToServ(reviewed) {
        let dataToReturn = new Array(reviewed.length); //.fill({id: 0, rememberedDates: [], forgottenDates: []}) //坑:注意寫法 用fill似有繆 最後都變成一樣的了
        //console.log(dataToReturn)//t
        for (let i = 0; i < reviewed.length; i++) {
            dataToReturn[i] = { ling: "", id: 0, rememberedDates: [], forgottenDates: [] };
            let curReviewedWord = reviewed[i];
            //console.log(curReviewedWord)//t
            dataToReturn[i].ling = curReviewedWord.ling;
            dataToReturn[i].id = curReviewedWord.id;
            dataToReturn[i].rememberedDates = curReviewedWord.rmbDates;
            dataToReturn[i].forgottenDates = curReviewedWord.fgtDates;
            //console.log(dataToReturn)//t
        }
        console.log(dataToReturn); //t
        const xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:1919/post', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            }
            else {
                console.log('請求錯誤');
            }
        };
        xhr.send(JSON.stringify(dataToReturn));
    }
    assignPriority(randomBonusArr) {
        // [23.06.09-1655]刪除了被註釋掉的舊版實現
        for (let i = 0; i < this.allWords.length; i++) {
            this.allWords[i].priorityObj.word = this.allWords[i];
            //this.allWords[i].priorityObj.assignPrio0();
            this.allWords[i].priorityObj.calcPrio0();
        }
        let aver = 0;
        for (let i = 0; i < this.allWords.length; i++) {
            aver += this.allWords[i].priorityObj.prio0;
        }
        aver /= this.allWords.length;
        console.log('平均初權重:' + aver);
        /* */
        if (!randomBonusArr) {
            randomBonusArr = new Array(this.allWords.length);
            randomBonusArr.fill(0);
            //let randoms:number[] = VocaB.generateRandomNumbers(this._allWords.length, 0, aver/8)
            //randomBonusArr.fill(1)
            //randomBonusArr = randoms
        }
        for (let i = 0; i < this.allWords.length; i++) {
            this.allWords[i].priorityObj.randomRange_max = aver / 8;
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
    static matchOrNot(str, ...target) {
        // [["{}"], ["[]"], ["()"]]
        for (let i = 0; i < target.length; i++) {
            if (target[i].length !== 2) {
                throw new Error("參數不正確、第二維中");
            }
        }
        let stacks = [];
        return '';
    }
    static 取字符串數組中長度最大者(strArr) {
        let indexOfMax = 0;
        for (let i = 1; i < strArr.length; i++) {
            if (strArr[i].length > strArr[i - 1].length) {
                indexOfMax = i;
            }
        }
        return strArr[indexOfMax];
    }
    /**
     * v23.06.15-2252
     * @param n 個數
     * @param bottom
     * @param top
     * @returns
     */
    static generateRandomNumbers(n, bottom, top) {
        /* bottom*=10000
        top*=10000 [,23.06.15-2238]*/
        const result = [];
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
    static median(arr) {
        const sortedArr = [...arr].sort((a, b) => a - b);
        const midIndex = Math.floor(sortedArr.length / 2);
        if (sortedArr.length % 2 === 0) {
            return (sortedArr[midIndex - 1] + sortedArr[midIndex]) / 2;
        }
        else {
            return sortedArr[midIndex];
        }
    }
    static 取逆轉義ᵗstrArr(strArr) {
        //let outcome:string[] = [...strArr]勿㢓複製字符串數組、否則每個字符皆成數組中一元素
        //一個字符串也是一個長度潙一ᵗ字符串數組?
        let outcome = '';
        for (let i = 0; i < strArr.length; i++) {
            let temp = '';
            temp = strArr[i].replace(/\\n/g, '\n');
            temp = temp.replace(/\\t/g, '\t');
            outcome += temp;
            //outcome+=(strArr[i].replace(/\\n/g,'\n').replace(/\\t/g,'\t'))
        }
        return outcome;
    }
    static 取逆轉義ᵗstr(strArr) {
        //let outcome:string[] = [...strArr]勿㢓複製字符串數組、否則每個字符皆成數組中一元素
        //一個字符串也是一個長度潙一ᵗ字符串數組?
        let outcome = strArr.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        return outcome;
    }
    static 兩日期所差秒數YYYYMMDDHHmmss(late, early) {
        const lateDate = moment(late, 'YYYYMMDDHHmmss');
        const earlyDate = moment(early, 'YYYYMMDDHHmmss');
        return moment.duration(lateDate.diff(earlyDate)).asSeconds();
    }
    testAjax(val) {
        console.log("发送的请求数据大小为：" + JSON.stringify(val).length + " 字节");
        const xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:1919/post', true);
        xhr.setRequestHeader('Content-type', 'application/json');
        //響應處理函數
        xhr.onload = () => {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            }
            else {
                console.log('請求錯誤');
            }
        };
        xhr.send(val);
    }
    /*
    public testAxios(val:any){
        axios.post('http://localhost:1919/post', val)
            .then(response=>{
                console.log(response.data)
            })
    }
    */
    static getXmlHttpObj() {
    }
}
