"use strict";
/*
public assignPrio0已廢棄(){
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
            //[23.06.15-2114,]{第三次複加之後、重複且連續ᵗ加ˡ事件ᵘ、減其增ᵗ權。昔斯司詞程序未造成旹、不能以ᶦ複習單詞、故會有詞芝連續複添ᵗ次ˋ甚多者、權亦益增。程序未成 不能複習之故也。今程序既成、若及時ᵈ複習、則每詞ᵗ權ˋ皆不應極端。}
            if(addEvent_cnt >= 3 && this.word.date_allEventObjs[j-1].wordEvent === WordEvent.ADD){
                this.procedure[j].befPrio = this._prio0;
                this._prio0 *= 2 //this.defaultAddWeight;
                this.procedure[j].aftPrio = this._prio0;
            }else{
                this.procedure[j].befPrio = this._prio0;
                this._prio0 *= this.defaultAddWeight;
                this.procedure[j].aftPrio = this._prio0;
            }
            
        }
        
    }

    if(addEvent_cnt === this.word.date_allEventObjs.length){
        //若一個單詞ᵗ添ᵗ次ˋ不止一次、且從未複習過、則益增其權重、以達的芝優先背新詞
        if(addEvent_cnt >= 2){
            //this._prio0 *= Math.pow(this.defaultAddWeight, addEvent_cnt)
            //this._prio0 *= Math.pow(10, addEvent_cnt) //改於23.06.05-1203
            //this._prio0 *= addEvent_cnt*addEvent_cnt / [23.06.07-2319,]
            this._prio0 += Math.pow(this._prio0, addEvent_cnt) //[23.06.07-2320,]
            //this.priority_num = this.prio0!
        }
        return;//直接return 不處理憶與忘ˉ事件 節約ᵣ時
    }
    
    for(let j = 0; j< this.word.date_allEventObjs.length; j++){// 再處理 憶與忘 ˉ事件
        let cur_date__wordEvent = this.word.date_allEventObjs[j]
        let eventDurationOfLastToThis = 1.1 //若初值取一則取對數後得零
        let dateWeight = 1.1 //改于 23.06.07-1005
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
            
            // if(this.procedure[j-1]){
            // 	this.procedure[j].befPrio = this.procedure[j-1].aftPrio
            // }else{
            // 	this.procedure[j].befPrio = this._prio0
            // }
            this.procedure[j].befPrio = this._prio0
            let durationOfLastRmbEventToNow = VocaB.兩日期所差秒數YYYYMMDDHHmmss(timeNow, cur_date__wordEvent.date)
            //降低在secs秒內憶ᵗ詞ˋ再現ᵗ率 初設secs潙 3600*8 即六(應潙八)小時 然則憶ᵗ詞ˋ六小時內ʸ複現ᵗ率ˋ降、且越近則降ˋ越多
            //let debuff = (this.numerator/durationOfLastRmbEventToNow) + 1 //[,23.06.09-0941]
            
            //let debuff = Math.floor((this.numerator/durationOfLastRmbEventToNow) + 1) //[23.06.09-0941,23.06.11-0002]
            let debuff = this.getDebuff(durationOfLastRmbEventToNow)
            if(dateWeight >=2){
                this._prio0 = this._prio0/(dateWeight/4)/debuff //待改:除以二ˋ既未錄入procedure 亦 寫死的ᵉ
                //[23.06.14-1632,]改成 除以四
                //<待叶>{若一詞 連續亻嘰次皆能被憶、且時間ᵗ誇度ˋ達ᵣ亻嘰久、則濾ᶦ不示。}
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
    //this.priority_num = this.prio0!
    
    // for(let i = 0; i < this.procedure.length; i++){
    // 	if(this.procedure[i].date_wordEvent === undefined){
    // 		console.log('i = '+i)
    // 		console.error(this._word)
    // 		console.error(this.procedure[i])
    // 		throw new Error('this.procedure[i].date_wordEvent === undefined')
    // 	}
    // }
    
}

*/ 
