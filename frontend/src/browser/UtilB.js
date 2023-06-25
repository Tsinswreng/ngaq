"use strict";
/**
 * 工具類、用于放靜態方法
 */
class UtilB {
    constructor() { }
    static isRemembered(word, opt = {
        consecutiveTimes: 10, //連續記得的次數
    }) {
        throw new Error("Method not implemented.");
    }
    /**
     * [23.06.16-1656,]
     * @param bef
     * @param post
     * @returns
     */
    static numDiff(bef, post) {
        return (post - bef) / bef;
    }
}
