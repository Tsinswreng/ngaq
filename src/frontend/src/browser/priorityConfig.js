"use strict";
/*[23.06.16-2254,]<待叶>{讓用戶定義專門針對三種事件之加成。然後用戶可藉此 專ᵈ複習事件相對ᵈ少之詞。
試添分段ˉ功能。如事件數越多旹則debuff ᵗ分母ˋ越大。
增 背公式 之功能。
}

*/
const lodash = require('lodash');
//[23.06.20-1932,]
class Filter {
}
class DeemAsRemembered {
    constructor() {
        //public minPrio0:number = new PriorityConfig().addWeight; 
        this.minPrio0 = PriorityConfig.defaultAddWeight;
        this.consecutiveRmbTimes = 16;
        this.addWeight = 3;
        this.fgtWeight = 2;
        this.rmbWeight = 1;
        this.rate = 1; //必要條件: 憶ˡ事件*其權重 /(加與忘ᐪ) > rate ?
        this.rmbTimeDif = 10 * 24 * 3600;
    }
}
class PriorityConfig {
    constructor() {
        this.deemAsRemembered = new DeemAsRemembered();
        this.addWeight = PriorityConfig.defaultAddWeight;
        this.max_randomBonus = 0;
        this.debuffNumerator = 3600 * 8;
    }
    static parseJson(json) {
        const defaultConfig = new PriorityConfig();
        let merge = lodash.merge({}, defaultConfig, JSON.parse(json));
        return merge;
    }
}
PriorityConfig.defaultAddWeight = 100;
function test20230617104651() {
    const fs = require('fs');
    let fileOut = fs.readFileSync('D:\\_\\mmf\\PROGRAM\\_Cak\\voca\\src\\browser\\priorityConfig.json', 'utf-8');
    //console.log(fileOut)
    //let instance = PriorityConfig.parse(fileOut)
    //console.log(instance)
    /*
    
        let p = new PriorityConfig();
        let s = JSON.stringify(p)
    
        let dflt_str = `{"deemAsRemembered":{"minPrio0":100,"consecutiveRmbTimes":16,"addWeight":3,"fgtWeight":2,"rmbWeight":1,"rate":1,"rmbTimeDif":864000},"addWeight":100,"max_randomBonus":0,"debuffNumerator":28800}`
        let my_str = `{ 	"deemAsRemembered": { 		"minPrio0": 101, 		"consecutiveRmbTimes": 10 	}, 	"addWeight": 99, 	"max_randomBonus": 0, 	"debuffNumerator": 28800 }`
        //let merge = {...JSON.parse(dflt_str),...JSON.parse(my_str)}
        //let merge = {...JSON.parse(my_str),...JSON.parse(dflt_str)}
        let merge = lodash.merge({},JSON.parse(dflt_str), JSON.parse(my_str))
        console.log(merge);
        
        //console.log(s) */
    let myConfig = PriorityConfig.parseJson(fileOut);
    console.log(myConfig);
}
test20230617104651();
