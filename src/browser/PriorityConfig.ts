


class PriorityConfig{
	public max_randomBonus:number = 0
	public debuffNumerator:number = 3600
	public consecutiveRmbTimes:number = 16
	public addWeight:number = 3
	public fgtWeight:number = 2
	public rmbWeight:number = 1
	public rate:number = 1 //必要條件: 憶ˡ事件*其權重 /(加與忘ᐪ) > rate
	public rmbTimeDif:number = 10*24*3600
}

