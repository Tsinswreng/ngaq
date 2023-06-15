"use strict";
class PriorityConfig {
    constructor() {
        this.max_randomBonus = 0;
        this.debuffNumerator = 3600;
        this.consecutiveRmbTimes = 16;
        this.addWeight = 3;
        this.fgtWeight = 2;
        this.rmbWeight = 1;
        this.rate = 1; //必要條件: 憶ˡ事件*其權重 /(加與忘ᐪ) > rate
        this.rmbTimeDif = 10 * 24 * 3600;
    }
}
