//@deprecated

/*[23.06.16-2254,]<待叶>{讓用戶定義專門針對三種事件之加成。然後用戶可藉此 專ᵈ複習事件相對ᵈ少之詞。
試添分段ˉ功能。如事件數越多旹則debuff ᵗ分母ˋ越大。
增 背公式 之功能。
}

*/

const lodash = require('lodash')

//[23.06.20-1932,]
class Filter{
	//用map數組
	// 各事件ᵗ數ᵗ上下界, 權重ᵗ上下界 ...
}

class DeemAsRemembered{
	//public minPrio0:number = new PriorityConfig().addWeight; 
	public minPrio0:number = PriorityConfig.defaultAddWeight
	public consecutiveRmbTimes:number = 16
	public addWeight:number = 3
	public fgtWeight:number = 2
	public rmbWeight:number = 1
	public rate:number = 1 //必要條件: 憶ˡ事件*其權重 /(加與忘ᐪ) > rate ?
	public rmbTimeDif:number = 10*24*3600
	constructor(){
		
	}

}

class PriorityConfig{
	public deemAsRemembered:DeemAsRemembered = new DeemAsRemembered();
	public static defaultAddWeight:number = 100
	public addWeight:number = PriorityConfig.defaultAddWeight;
	public max_randomBonus:number = 0
	public debuffNumerator:number = 3600*8
	constructor(){}
	
	public static parseJson(json:string){
		const defaultConfig = new PriorityConfig();
		let merge = lodash.merge({}, defaultConfig, JSON.parse(json))
		return merge as PriorityConfig;
	}
}

