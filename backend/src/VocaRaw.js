"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//23.05.03-1311
const fs = __importStar(require("fs"));
const mysql = __importStar(require("mysql"));
// import {Connection} from 'mysql2'
// import mysql2 from 'mysql2';
const mysql2 = require('mysql2');
const moment = require('moment');
const lodash = require('lodash');
const path = require('path');
const xml2js = require('xml2js');
const root_1 = __importDefault(require("../../root"));
const util = require('util');
//import * as xml2js from 'xml2js';
/*TODO{

完善根據不同ᵗ日期格式ⁿ讀文件之功能
待改:類中ᵗ初錄旹ᵗ日期與格式ˇᵗ存ˋ宜用鍵值對
待改:數據庫中ᵗ日期格式ˋ宜統一用20230507111301 %Y%m%d%H%M%S
常ᵈ自動ᵈ備份表
配置文件
新建一數據庫、㕥錄用戶ᵗ行爲
 } */
class SingleWord {
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
    get addedDates() {
        return this._addedDates;
    }
    set addedDates(value) {
        this._addedDates = value;
    }
    get datesFormats() {
        return this._datesFormats;
    }
    set datesFormats(value) {
        this._datesFormats = value;
    }
    get addedDates_datesFormats() {
        return this._addedDates_datesFormats;
    }
    set addedDates_datesFormats(value) {
        this._addedDates_datesFormats = value;
    }
    get addedTimes() {
        return this._addedTimes;
    }
    set addedTimes(value) {
        this._addedTimes = value;
    }
    constructor() {
        this._ling = '';
        this._id = -1;
        this._wordShape = '';
        this._fullComments = []; //無論有無重複添加皆置其義焉
        this._addedDates = [];
        this._datesFormats = ['%y.%m.%d-%H%M']; // 默認如23.04.28-2141
        this._addedDates_datesFormats = new Map();
        this._addedTimes = -1; //即取釋義數組ᵗ長、不當取日期數組ᵗ長
    }
}
class VocaRaw {
    get xmlSrc() {
        return this._xmlSrc;
    }
    set xmlSrc(value) {
        this._xmlSrc = value;
    }
    get dbUserName() {
        return this._dbUserName;
    }
    set dbUserName(value) {
        this._dbUserName = value;
    }
    get dbPassword() {
        return this._dbPassword;
    }
    set dbPassword(value) {
        this._dbPassword = value;
    }
    get alreadyAdded() {
        return this._alreadyAdded;
    }
    set alreadyAdded(value) {
        this._alreadyAdded = value;
    }
    get ling() {
        return this._ling;
    }
    set ling(value) {
        this._ling = value;
    }
    get dbName() {
        return this._dbName;
    }
    set dbName(value) {
        this._dbName = value;
    }
    get tableName() {
        return this._tableName;
    }
    set tableName(value) {
        this._tableName = value;
    }
    get srcFilePath() {
        return this._srcFilePath;
    }
    set srcFilePath(value) {
        this._srcFilePath = value;
    }
    get wordShape_fullComment() {
        return this._wordShape_fullComment;
    }
    set wordShape_fullComment(value) {
        this._wordShape_fullComment = value;
    }
    get wordShape_fullCommentMap() {
        return this._wordShape_fullCommentMap;
    }
    set wordShape_fullCommentMap(value) {
        this._wordShape_fullCommentMap = value;
    }
    get wordShape_addedDatesMap() {
        return this._wordShape_addedDatesMap;
    }
    set wordShape_addedDatesMap(value) {
        this._wordShape_addedDatesMap = value;
    }
    get wordShape_datesFormats() {
        return this._wordShape_datesFormats;
    }
    set wordShape_datesFormats(value) {
        this._wordShape_datesFormats = value;
    }
    get wordShape_freq() {
        return this._wordShape_freq;
    }
    set wordShape_freq(value) {
        this._wordShape_freq = value;
    }
    get srcStr() {
        return this._srcStr;
    }
    set srcStr(value) {
        this._srcStr = value;
    }
    get singleWords() {
        return this._singleWords;
    }
    set singleWords(value) {
        this._singleWords = value;
    }
    get wordUnits() {
        return this._wordUnits;
    }
    set wordUnits(value) {
        this._wordUnits = value;
    }
    constructor() {
        this._xmlSrc = '';
        this._dbUserName = 'root';
        this._dbPassword = 'admin';
        this._alreadyAdded = false;
        this._ling = '';
        this._dbName = 'voca';
        this._tableName = '';
        this._srcFilePath = '';
        this._wordShape_fullComment = {};
        this._srcStr = '';
        this._wordUnits = [];
        this._singleWords = [];
        this._wordShape_fullCommentMap = new Map();
        this._wordShape_addedDatesMap = new Map();
        this._wordShape_datesFormats = new Map();
        this._wordShape_freq = [];
        /* if(srcFilePath!==null && srcFilePath!==''){
            this.init();
        } */
    }
    init() {
        this._srcStr = VocaRaw.readFileSync(this._srcFilePath);
        if (!VocaRaw.括號匹配檢查(this.srcStr)) {
            throw new Error("源詞表中括號不匹配");
        }
        this._srcStr = this._srcStr.replace(/\r\n/g, '\n');
        this._srcStr = VocaRaw.addNewLinesAroundBraces(this._srcStr);
        /* this.srcStr = this.srcStr.replace(/\[/g,'〖');
        this.srcStr = this.srcStr.replace(/\]/g,'〗'); */
        this._srcStr = VocaRaw._ᵗ音標中括號ˇ轉換潙_(this._srcStr, '〖', '〗');
        this._srcStr = VocaRaw.處理詞塊ᵗ中括號(this._srcStr); //雙重中括號前後添空行
        //this.srcStr = VocaRaw.removeEmptyLinesInBrackets(this.srcStr);
        this._srcStr = VocaRaw.轉義ᵣ中括號ʸᵗ空行(this._srcStr);
        //this._srcStr = this._srcStr.replace(/[\[\]]/g,'');//刪中括號
        //console.log(this._srcStr)//t
        this._srcStr = this._srcStr.replace(/\[{2}/g, ''); //刪二重ᵗ左中括號
        this._srcStr = this._srcStr.replace(/\]{2}/g, ''); //刪二重ᵗ右中括號
        this._srcStr = this._srcStr.replace(/〖/g, '['); //把原ᵗ音標中括號還原
        this._srcStr = this._srcStr.replace(/〗/g, ']'); //把原ᵗ音標中括號還原
        //console.log(this._srcStr)//t
        this._srcStr = this._srcStr.replace(/([\r\n]){3,}/g, '$1$1'); //刪ᵣ多餘ᵗ空行
        //console.log(this._srcStr)//t
        this._wordUnits = this.取詞ᵗ單元及附日期(this._srcStr);
        //console.log(this.wordUnits)//t
        this.convertDateFormat(); //蔿this.wordUnits 把如23.05.07-1142者改成如20230507114200者
        //console.log(this.wordUnits)
        this.getContentOfMaps();
        this.getSingleWordsFromMap_();
    }
    setSrcFilePath(srcFilePath) {
        this._srcFilePath = srcFilePath;
        this.init();
    }
    getSrcFilePath() {
        return this._srcFilePath;
    }
    getContentOfMaps() {
        var _a, _b, _c;
        for (let i = 0; i < this._wordUnits.length; i++) {
            /*if(this.wordUnits[i].wordShape.match(/.*back someone up.*!/g)){
                console.log(this.wordUnits[i])//t
            }*/
            if (this._wordShape_fullCommentMap.has(this._wordUnits[i].wordShape)) {
                let fullCommentArr = (_a = this._wordShape_fullCommentMap.get(this._wordUnits[i].wordShape)) !== null && _a !== void 0 ? _a : []; //空值合并运算符 ??。如果回的值是 undefined，则会使用空数组代替。
                let addedDatesArr = (_b = this._wordShape_addedDatesMap.get(this._wordUnits[i].wordShape)) !== null && _b !== void 0 ? _b : [];
                let datesFormatsArr = (_c = this._wordShape_datesFormats.get(this._wordUnits[i].wordShape)) !== null && _c !== void 0 ? _c : [];
                fullCommentArr.push(this._wordUnits[i].fullComment);
                addedDatesArr.push(this._wordUnits[i].date);
                datesFormatsArr.push(this._wordUnits[i].dateFormat);
                this._wordShape_fullCommentMap.set(this._wordUnits[i].wordShape, fullCommentArr);
                this._wordShape_addedDatesMap.set(this._wordUnits[i].wordShape, addedDatesArr); //!!蜮 添加日期對不上該日期ʃ對ᵗ整ˡ釋
            }
            else {
                let fullCommentArr = [this._wordUnits[i].fullComment];
                let addedDatesArr = [this._wordUnits[i].date];
                let datesFormatsArr = [this._wordUnits[i].dateFormat];
                this._wordShape_fullCommentMap.set(this._wordUnits[i].wordShape, fullCommentArr);
                this._wordShape_addedDatesMap.set(this._wordUnits[i].wordShape, addedDatesArr);
                this._wordShape_datesFormats.set(this._wordUnits[i].wordShape, datesFormatsArr);
            }
        }
        //按加ᵗ次排序
    }
    getSingleWordsFromMap_() {
        for (let [key, value] of this._wordShape_fullCommentMap.entries()) {
            let tempToPush = new SingleWord();
            tempToPush.wordShape = key;
            tempToPush.fullComments = value;
            this._singleWords.push(tempToPush);
        }
        for (let i = 0; i < this._singleWords.length; i++) {
            let currentWordShape = this._singleWords[i].wordShape;
            let currentAddedDates = this._wordShape_addedDatesMap.get(currentWordShape);
            let currentDatesFormats = this._wordShape_datesFormats.get(currentWordShape);
            this._singleWords[i].addedDates = currentAddedDates !== null && currentAddedDates !== void 0 ? currentAddedDates : [];
            this._singleWords[i].addedTimes = this._singleWords[i].fullComments.length;
            this._singleWords[i].datesFormats = currentDatesFormats !== null && currentDatesFormats !== void 0 ? currentDatesFormats : [];
        }
    }
    取詞ᵗ單元及附日期(str, dateFormat) {
        if (!dateFormat) {
            dateFormat = '%y.%m.%d-%H%M';
        }
        else {
            //TODO
        }
        str = str.trim();
        //console.log(str)//t
        let wordUnits = [];
        const dateRegStr = '\\d\\d\\.\\d\\d.\\d\\d-\\d{4}'; //ʃ配ᵗ日期格式如23.04.27-1903
        //console.log(dateRegStr)//t
        const unitReg = new RegExp(dateRegStr + '[\\s]*\\{(.*?)\\}', 'gs'); //用于配日期加一對大括號
        const matches = str.match(unitReg);
        if (matches) {
            matches.forEach((match) => {
                let addedDate;
                let dateMatch = match.match(new RegExp('^(\\s)*' + dateRegStr)); //直接用match.match(new RegExp('^'+dateRegStr))則不能通編譯
                try {
                    if (dateMatch && dateMatch[0] !== null) {
                        addedDate = dateMatch[0].trim();
                    }
                    else {
                        throw new Error('match.match(new RegExp(\'^\'+dateRegStr))[0])');
                    }
                }
                catch (e) {
                    console.error(e);
                }
                let newMatch = match.replace(/.*\{(.*)\}.*/gs, '$1'); //只取大括號內ᵗ物
                newMatch = newMatch.trim();
                /*console.log('<newMatch>')
                console.log(newMatch)//t
                console.log('</newMatch>')
                console.log('<addedDate>')
                console.log(addedDate)
                console.log('</addedDate>')
                console.log('---------------')//t*/
                //console.log(newMatch);
                let unitStrArr = newMatch.split(/[\r\n]{2}/); //以空行分隔
                for (let i = 0; i < unitStrArr.length; i++) {
                    //console.log(unitStrArr[i])
                    /*if(unitStrArr[i].match(/.*中々\/なかなか.*!/g)){//t
                        console.log(unitStrArr[i])
                        console.log(addedDate)
                    }*/
                    unitStrArr[i] = unitStrArr[i].trim();
                    if (unitStrArr[i].match(new RegExp(dateRegStr))) {
                    }
                    else if (unitStrArr[i].match(/[\{\}]/)) {
                    }
                    else {
                        let tempWordUnit = unitStrArr[i].trim();
                        let tempWordShape = tempWordUnit.replace(/^([^\r\n]*?)[\r\n](.*)/gs, '$1');
                        let tempFullComment = tempWordUnit.replace(tempWordShape, '');
                        tempFullComment = tempFullComment.replace(/\\n/g, '\n');
                        tempFullComment = tempFullComment.trim();
                        /*if(tempFullComment === ''){//t
                            console.log(tempWordUnit)
                            console.log(tempWordShape)
                            console.log(tempFullComment)
                            console.log(unitStrArr[i])
                        }*/
                        let tempToPush = {
                            date: addedDate === null || addedDate === void 0 ? void 0 : addedDate.trim(),
                            dateFormat: dateFormat === null || dateFormat === void 0 ? void 0 : dateFormat.trim(),
                            wordUnit: tempWordUnit === null || tempWordUnit === void 0 ? void 0 : tempWordUnit.trim(),
                            wordShape: tempWordShape === null || tempWordShape === void 0 ? void 0 : tempWordShape.trim(),
                            fullComment: tempFullComment === null || tempFullComment === void 0 ? void 0 : tempFullComment.trim()
                        };
                        /*if(tempToPush.wordShape === '苛め'){
                            console.log(tempToPush)//t
                        }*/
                        if (tempToPush.fullComment === '') {
                            console.error('<tempToPush>');
                            console.error(tempToPush);
                            console.error('</tempToPush>');
                            throw new Error(`fullComment不應潙空、請檢查源詞表\n` + tempToPush.wordShape + '\n' + tempToPush.date);
                        }
                        wordUnits.push(tempToPush);
                    }
                }
            });
        }
        return wordUnits;
    }
    convertDateFormat() {
        for (let i = 0; i < this._wordUnits.length; i++) {
            //console.log(this.wordUnits[i])
            let oldDate = this._wordUnits[i].date;
            let oldDateFormat = this._wordUnits[i].dateFormat;
            let newDate;
            let newDateFormat;
            if (oldDateFormat === '%y.%m.%d-%H%M') {
                oldDate = '20' + oldDate + '00'; //23.05.07-1137 改成 2023.05.07-113700
                newDate = oldDate.replace(/-/g, '').replace(/\./g, '');
                newDateFormat = '%Y%m%d%H%M%S';
            }
            else {
                throw new Error('尚未支持');
            }
            this._wordUnits[i].dateFormat = newDateFormat;
            this._wordUnits[i].date = newDate;
        }
    }
    /**
    * 把單詞從txt加進數據庫裏
    *
    */
    addSingleWordsToDb(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            this.init(); //23.05.28-2030 this.init() 被從set srcStr() 移到此處。
            let 此輪ʸ加ᵗ詞 = [];
            let 此輪ʸ加ᵗ詞之一 = new SingleWord();
            if (filePath) {
                this.srcFilePath = filePath;
            }
            if (!this.srcFilePath) {
                throw new Error('未曾設置文件路徑');
            }
            const db = this.getDbConnection();
            let recordsLength; //未用
            console.log(`SELECT COUNT(*) as count FROM ${this._tableName}`);
            let sql = `SELECT COUNT(*) as count FROM ${this._tableName}`;
            db.query(sql, (err, outerResult) => {
                if (err) {
                    console.log(sql);
                    throw err;
                }
                recordsLength = outerResult[0].count; //未用
                const wordShapeCol = 'wordShape';
                /*獲取數據庫中既存ᵗ記錄ᵗ長度、遍歷單詞對象數組、檢ᵣ當前ᵗ詞ᵗ詞形ˇ是否已含于數據庫
            若否則加入、*/
                for (let i = 0; i < this._singleWords.length; i++) { //遍歷所有單詞數組
                    let currentWordShape = this._singleWords[i].wordShape;
                    if (currentWordShape === '' || currentWordShape.match(/^[\\s]+$/)) { //不加空白
                        throw new Error("wordShape潙空白");
                        //continue;
                    }
                    // 坑:SELECT * FROM jap WHERE wordShape = '傾げる' 會返回「傾げる」和「傾ける」、當用SELECT * FROM jap WHERE wordShape REGEXP '^傾げる$'
                    // 坑:先轉義正則表達式中ᵗ特殊字符
                    // 坑:轉義完後還要再對反斜槓轉義一次 其 終ᵗ形ˋ當如java中雙引號中ᵗ正則表達式ᵗ形
                    // let escaped = lodash.escapeRegExp(currentWordShape)
                    // escaped = escaped.replace(/\\/g, '\\\\'); //把每個反斜槓都轉成兩個反斜槓
                    //const qrySql = `SELECT *FROM ${this._tableName} WHERE BINARY wordShape REGEXP '^{escaped}$'` //[23.06.26-2145,]{BINARY㕥辨大小寫}
                    const qrySql = `SELECT *FROM ${this._tableName} WHERE BINARY wordShape = ?`; //[23.06.26-2205,]<坑>{REGEXP '^exposé$'查不到exposé}
                    //db.query(`SELECT * FROM ${this.tableName} WHERE ${wordShapeCol} = ?`, [currentWordShape], (error, results, fields)=>{
                    db.query(qrySql, currentWordShape, (error, results, fields) => {
                        if (error) {
                            console.error(qrySql);
                            console.error(error);
                            return;
                        }
                        if (results.length > 0) { //即當前ᵗ單詞ᵗ詞形ˋ在˪數據庫ʸ。
                            //console.log(results.length);:1
                            //console.log(result);:[ RowDataPacket { count: 620 } ]
                            if (results.length !== 1) { //數據庫中不許詞形重複、results.length當等于一
                                console.log(results);
                                console.log(currentWordShape);
                                throw new Error('如何獲取當前行號');
                            }
                            let fullCommentsSetFromDb = new Set(JSON.parse(results[0].fullComments));
                            let fullCommentsSetHere = new Set(this._singleWords[i].fullComments);
                            let addedDatesSetFromDb = new Set(JSON.parse(results[0].addedDates));
                            let addedDatesSetHere = new Set(this._singleWords[i].addedDates);
                            //檢查昰否重複添加 詞形與全ᵗ釋與日期皆同則視ᵣ複加ᵉ。
                            { //後纔念 直ᵈ取差集ⁿᶦˇ加入數庫即可、前ᵗ判斷ˋ徒增勞也。
                                //let newFullComments = results[0].fullComments.concat(this.singleWords[i].fullComments);//["したしい", "したしい"]したしい,したしい
                                let fullCommentsSetToInsertIn = VocaRaw.differenceSetAMinusSetB(fullCommentsSetHere, fullCommentsSetFromDb); //取我ᐪ與彼ᐪ之差集、然後拼接
                                let addedDatesSetToInsertIn = VocaRaw.differenceSetAMinusSetB(addedDatesSetHere, addedDatesSetFromDb); //當每次加ᵗ詞ᵗ全釋ˋ皆同旹、集合ᵗ差集ˋ空, 故不宜用全釋義數組ᵗ長 作添加ᵗ次洏宜用日期數組ᵗ長
                                if (fullCommentsSetToInsertIn.size === 0 && addedDatesSetToInsertIn.size === 0) {
                                    //continue;for循環裏調用了回調函數、其內不能再寫continue
                                    return;
                                }
                                //console.log(fullCommentsSetToInsertIn)//t
                                let newFullComments = VocaRaw.jsonConcatArr(results[0].fullComments, [...fullCommentsSetToInsertIn]); //勿 直ᵈ拼接、當拼接差集
                                let newAddedDates = VocaRaw.jsonConcatArr(results[0].addedDates, [...addedDatesSetToInsertIn]);
                                //let newAddedTimes = JSON.parse(results[0].addedDates).length + this.singleWords[i].addedDates.length;叵㢓算 否則次數可能會變潙2*n +1
                                //let newAddedTimes = JSON.parse(results[0].addedDates).length + this.singleWords[i].addedDates.length - 各單詞ˇ重添ᵗ次[i];
                                let newAddedTimes = JSON.parse(newAddedDates).length;
                                //于dataGrip、表格中ᵗ\nˋ實ᵈ昰一反斜槓ˉ字符與一字符ˉn、洏控制檯中ᵗ\n則昰換行符 不只換行符、若不用寫法芝含佔位符者則所有特殊字符皆需手動轉義、故直ᵈ把反斜槓ᵗ量ˇ倍增即可。下ʸᵗ初添ᵗ代碼ˋ鈣會自動轉義。
                                let upDateSql = `UPDATE ${this._tableName} SET
								fullComments = ?,
								addedDates = ?,
								addedTimes = ?
								WHERE id = ?
						`;
                                const values = [newFullComments, newAddedDates, newAddedTimes, results[0].id];
                                此輪ʸ加ᵗ詞之一 = new SingleWord();
                                此輪ʸ加ᵗ詞之一.wordShape = currentWordShape;
                                此輪ʸ加ᵗ詞之一.addedTimes = newAddedTimes;
                                此輪ʸ加ᵗ詞.push(此輪ʸ加ᵗ詞之一);
                                db.query(upDateSql, values, (err) => {
                                    console.error(upDateSql);
                                    console.error(err);
                                });
                            }
                        }
                        else { //以下潙初添
                            const addSql = `INSERT INTO ${this._tableName}
						(wordShape, fullComments, addedDates, addedTimes, datesFormats, reviewedDates, rememberedDates, forgottenDates) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                            let valuesToAdd = [
                                //i+recordsLength,
                                this._singleWords[i].wordShape,
                                JSON.stringify(this._singleWords[i].fullComments),
                                JSON.stringify(this._singleWords[i].addedDates),
                                JSON.stringify(this._singleWords[i].addedTimes),
                                JSON.stringify(this._singleWords[i].datesFormats),
                                '[]',
                                '[]',
                                '[]'
                            ];
                            此輪ʸ加ᵗ詞之一 = new SingleWord();
                            此輪ʸ加ᵗ詞之一.wordShape = currentWordShape;
                            此輪ʸ加ᵗ詞之一.addedTimes = 1;
                            此輪ʸ加ᵗ詞.push(此輪ʸ加ᵗ詞之一);
                            db.query(addSql, valuesToAdd, (err, result) => {
                                if (err)
                                    throw err;
                                //console.log('插入成功');
                            });
                        }
                    }); //end 從數據庫中尋當前單詞
                } //endfor
            });
            this._alreadyAdded = true; //!!㢓處理恐不妥
            //db.end();
            //23.06.10-2306
            return new Promise((resolve, reject) => {
                resolve(此輪ʸ加ᵗ詞);
                console.log('<此輪ʸ加ᵗ詞>');
                console.log(此輪ʸ加ᵗ詞);
                console.log('</此輪ʸ加ᵗ詞>');
                console.log('<此輪ʸ加ᵗ詞.length>');
                console.log(此輪ʸ加ᵗ詞.length);
                console.log('</此輪ʸ加ᵗ詞.length>');
                console.log('done');
            }); //不效
        });
    }
    /* 	public getAllRecordsFromDb(){
            const db = this.getDbObj();
            let sql = `SELECT * FROM ${this.tableName}`
            let outcome:any[];
            db.query(sql, (err, results)=>{
                if(err){
                    console.log(err)
                }
                outcome = results;
                return results;
            })
        } */
    printAllRecords() {
        const db = this.getDbConnection();
        db.query(`SELECT * FROM ${this._tableName}`, (error, results, fields) => {
            console.log(results); //RowDataPacket
            //console.log(results['600']['wordShape'])
            //return results//蜮不效
        });
    }
    /*
    * 在數據庫中同步ᵈ創建ᵣ新ᵗ單詞表
    * */
    creatTableSync(tableName) {
        if (!tableName) {
            tableName = this._tableName;
        }
        let db2 = this.getDbObj2(); //ER_BLOB_CANT_HAVE_DEFAULT: BLOB, TEXT, GEOMETRY or JSON column 'wordShape' can't have a default value
        const creatSql = `CREATE TABLE IF NOT EXISTS ${tableName} (
			id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
			wordShape longtext ,
			fullComments JSON ,
			addedTimes INT DEFAULT 0,
			addedDates JSON ,
			reviewedDates JSON ,
			datesFormats JSON ,
			reviewedTimes INT DEFAULT 0,
			rememberedTimes INT DEFAULT 0,
			rememberedDates JSON ,
			forgottenTimes INT DEFAULT 0,
			forgottenDates JSON
		)`;
        console.log(creatSql);
        db2.query(creatSql, (err, result) => {
            if (err)
                throw err;
        });
        db2.end();
    }
    dropTableSync(tableName) {
        if (!tableName) {
            tableName = this._tableName;
        }
        const db2 = this.getDbObj2();
        const deleteSql = `DROP TABLE IF EXISTS ${tableName}`;
        db2.query(deleteSql, (err, result) => {
            if (err)
                throw err;
            console.log(deleteSql); //此句常不執行、婼使數據庫ᵗ操作ˋ終後執行此語句? 待叶:{}
        });
    }
    resetTable() {
        //console.log(2)
        this.dropTableSync();
        //console.log(3)
        this.creatTableSync();
        //console.log(4)
    }
    /*
    * 獲取ᵣ數據庫ᵗ連接ˡ對象
    * */
    getDbConnection() {
        let db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'voca',
            insecureAuth: true
        });
        db.connect((err) => {
            if (err)
                throw err;
            console.log('數據庫連接成功');
        });
        return db;
    }
    static getDbObj(dbName) {
        if (!dbName) {
            dbName = 'voca';
        }
        let db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: dbName,
            insecureAuth: true
        });
        db.connect((err) => {
            if (err)
                throw err;
            console.log('數據庫連接成功');
        });
        return db;
    }
    getDbObj2() {
        const db2 = mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'voca',
            insecureAuth: true
        });
        db2.connect((err) => {
            if (err)
                throw err;
            console.log('數據庫連接成功');
        });
        return db2;
    }
    /*public getAllSingleWords(){
        const db2 = this.getDbObj2()
        return VocaRaw.getAllRecordsFromDb(db2, this.dbName, this.tableName);
    }*/
    clearDbTekTable(dbName, tableName) {
        if (!dbName) {
            dbName = this._dbName;
        }
        if (!tableName) {
            tableName = this._tableName;
        }
        const sql = `DELETE FROM ${tableName};`;
        const db = this.getDbConnection();
        /* db.connect((err)=>{
            if (err) {
                console.error('failed '+err.stack);
                return;
            }}); */
        db.query(sql, (err) => {
            console.log(sql);
        });
        db.end();
    }
    getAllSingleWordsSync() {
        const db = this.getDbConnection();
        //[23.06.15-0942,]
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM ${this._tableName}`, (error, results, fields) => {
                //console.log(results)//RowDataPacket
                //console.log(results['600']['wordShape'])
                //return results//蜮不效
                resolve(results);
            });
        });
    }
    backupTable() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dateNow = moment().format('YYYYMMDDHHmmss');
                const newTableName = this.tableName + dateNow;
                const db = this.getDbConnection();
                //let backupSql = `CREATE TABLE ${this._tableName+dateNow} AS SELECT *FROM ${this._tableName};`
                let backupSql = `CREATE TABLE ${newTableName} LIKE ${this.tableName};`;
                let step2 = `INSERT INTO ${newTableName} SELECT * FROM ${this.tableName};`;
                yield new Promise((resolve2, reject2) => {
                    db.query(backupSql, (err, result) => {
                        if (err)
                            throw err;
                        resolve2(); //欲不傳參 則Promise之尖括號內當寫void
                    });
                });
                yield new Promise((resolve2, reject2) => {
                    db.query(step2, (err, result) => {
                        if (err)
                            throw err;
                    });
                    resolve2();
                });
                let out = newTableName + '複製成功';
                resolve(out);
            }
            catch (error) {
                reject(error);
            }
        }));
    }
    static getObjsByConfig() {
        let xmlSrc = fs.readFileSync(VocaRaw.configFilePath);
        let parser = new xml2js.Parser();
        let xmlObj;
        parser.parseString(xmlSrc, (err, result) => {
            if (err) {
                throw err;
            }
            xmlObj = result;
        });
        if (!xmlObj) {
            throw new Error('xml解析失敗');
        }
        let vocaObjs = [];
        for (let i = 0; i < xmlObj.root.lings[0].ling.length; i++) {
            let curLing = xmlObj.root.lings[0].ling[i]; //<待優化>{有無法芝不需逐屬性ʰ賦值}
            vocaObjs[i] = new VocaRaw();
            vocaObjs[i].dbUserName = xmlObj.root.dbUserName[0];
            vocaObjs[i].dbPassword = xmlObj.root.dbPassword[0];
            vocaObjs[i].dbName = xmlObj.root.dbName[0];
            vocaObjs[i].ling = curLing.lingName[0];
            vocaObjs[i].tableName = curLing.tableName[0];
            vocaObjs[i].srcFilePath = root_1.default.rootDir + curLing.srcFilePath[0]; //[23.06.26-1014,]
        }
        return vocaObjs;
    }
    static updateDb(dataToReturn) {
        const db = VocaRaw.getDbObj();
        for (let i = 0; i < dataToReturn.length; i++) {
            /*let updateSql =
                `UPDATE ${dataToReturn[i].ling} SET
            rememberedDates='${JSON.stringify(dataToReturn[i].rememberedDates)}',
            forgottenDates='${JSON.stringify(dataToReturn[i].forgottenDates)}'
             WHERE id=${dataToReturn[i].id}
             `*/
            let updateSql = `UPDATE ${dataToReturn[i].ling} SET rememberedDates= ?, forgottenDates= ? WHERE id=?`;
            let values = [JSON.stringify(dataToReturn[i].rememberedDates), JSON.stringify(dataToReturn[i].forgottenDates), dataToReturn[i].id];
            console.log(updateSql);
            console.log(values);
            db.query(updateSql, values, (err) => {
                if (err) {
                    console.error(updateSql);
                    console.error(values);
                    throw err;
                }
            });
        }
    }
    /*static async getAllRecordsFromDb(db2:Connection, database: string, table: string){
        const sql = `SELECT * FROM ${database} ${table}`
        return new Promise((resolve, reject)=>{
            db2.query(sql, (err, result)=>{
                console.log(result)
            })
        })
    }*/
    /*	public static initVal<T>(val: T){
            if(val === undefined || val === null){
                if(T === 'number'){
                    val = 0;
                }else if(typeof T === 'string'){
                    val = ''
                }else if(typeof T === 'boolean'){
                    val = false
                }else if(typeof T === 'object'){
                    val = {}
                }
            }
            return val
        }*/
    static _ᵗ音標中括號ˇ轉換潙_(str, leftReplace, rightReplace) {
        let ipa = `\\(\\)\'\\.: 	ǃ⁽₍⁾₎꜌˩˩˩˩˩˨˩˩˧˩˩˦˩˩˥˩˨˩˨˩˩˨˨˩˨˧˩˨˦˩˨˥˩˧˩˧˩˩˧˨˩˧˧˩˧˦˩˧˥˩˦˩˦˩˩˦˨˩˦˧˩˦˦˩˦˥˩˥˩˥˩˩˥˨˩˥˧˩˥˦˩˥˥꜋˨˩˨˩˩˨˩˨˨˩˧˨˩˦˨˩˥˨˨˨˩˨˨˨˨˧˨˨˦˨˨˥˨˧˨˧˩˨˧˨˨˧˧˨˧˦˨˧˥˨˦˨˦˩˨˦˨˨˦˧˨˦˦˨˦˥˨˥˨˥˩˨˥˨˨˥˧˨˥˦˨˥˥꜊˧˩˧˩˩˧˩˨˧˩˧˧˩˦˧˩˥˧˨˧˨˩˧˨˨˧˨˧˧˨˦˧˨˥˧˧˧˩˧˧˨˧˧˧˧˦˧˧˥˧˦˧˦˩˧˦˨˧˦˧˧˦˦˧˦˥˧˥˧˥˩˧˥˨˧˥˧˧˥˦˧˥˥꜉˦˩˦˩˩˦˩˨˦˩˧˦˩˦˦˩˥˦˨˦˨˩˦˨˨˦˨˧˦˨˦˦˨˥˦˧˦˧˩˦˧˨˦˧˧˦˧˦˦˧˥˦˦˦˩˦˦˨˦˦˧˦˦˦˦˥˦˥˦˥˩˦˥˨˦˥˧˦˥˦˦˥˥꜈˥˩˥˩˩˥˩˨˥˩˧˥˩˦˥˩˥˥˨˥˨˩˥˨˨˥˨˧˥˨˦˥˨˥˥˧˥˧˩˥˧˨˥˧˧˥˧˦˥˧˥˥˦˥˦˩˥˦˨˥˦˧˥˦˦˥˦˥˥˥˥˩˥˥˨˥˥˧˥˥˦˥˥θ∅︀⁰₀¹₁²₂³₃⁴₄⁵₅⁶₆̚⁷̚₇⁸₈⁹₉ˑːʔʡʢɁˀʕˁˤᴴᴸ꜑꜖꜖꜖꜖꜖꜕꜖꜖꜔꜖꜖꜓꜖꜖꜒꜖꜕꜖꜕꜖꜖꜕꜕꜖꜕꜔꜖꜕꜓꜖꜕꜒꜖꜔꜖꜔꜖꜖꜔꜕꜖꜔꜔꜖꜔꜓꜖꜔꜒꜖꜓꜖꜓꜖꜖꜓꜕꜖꜓꜔꜖꜓꜓꜖꜓꜒꜖꜒꜖꜒꜖꜖꜒꜕꜖꜒꜔꜖꜒꜓꜖꜒꜒꜐꜕꜖꜕꜖꜖꜕꜖꜕꜕꜖꜔꜕꜖꜓꜕꜖꜒꜕꜕꜕꜖꜕꜕꜕꜕꜔꜕꜕꜓꜕꜕꜒꜕꜔꜕꜔꜖꜕꜔꜕꜕꜔꜔꜕꜔꜓꜕꜔꜒꜕꜓꜕꜓꜖꜕꜓꜕꜕꜓꜔꜕꜓꜓꜕꜓꜒꜕꜒꜕꜒꜖꜕꜒꜕꜕꜒꜔꜕꜒꜓꜕꜒꜒꜏꜔꜖꜔꜖꜖꜔꜖꜕꜔꜖꜔꜔꜖꜓꜔꜖꜒꜔꜕꜔꜕꜖꜔꜕꜕꜔꜕꜔꜔꜕꜓꜔꜕꜒꜔꜔꜔꜖꜔꜔꜕꜔꜔꜔꜔꜓꜔꜔꜒꜔꜓꜔꜓꜖꜔꜓꜕꜔꜓꜔꜔꜓꜓꜔꜓꜒꜔꜒꜔꜒꜖꜔꜒꜕꜔꜒꜔꜔꜒꜓꜔꜒꜒꜎꜓꜖꜓꜖꜖꜓꜖꜕꜓꜖꜔꜓꜖꜓꜓꜖꜒꜓꜕꜓꜕꜖꜓꜕꜕꜓꜕꜔꜓꜕꜓꜓꜕꜒꜓꜔꜓꜔꜖꜓꜔꜕꜓꜔꜔꜓꜔꜓꜓꜔꜒꜓꜓꜓꜖꜓꜓꜕꜓꜓꜔꜓꜓꜓꜓꜒꜓꜒꜓꜒꜖꜓꜒꜕꜓꜒꜔꜓꜒꜓꜓꜒꜒꜍꜒꜖꜒꜖꜖꜒꜖꜕꜒꜖꜔꜒꜖꜓꜒꜖꜒꜒꜕꜒꜕꜖꜒꜕꜕꜒꜕꜔꜒꜕꜓꜒꜕꜒꜒꜔꜒꜔꜖꜒꜔꜕꜒꜔꜔꜒꜔꜓꜒꜔꜒꜒꜓꜒꜓꜖꜒꜓꜕꜒꜓꜔꜒꜓꜓꜒꜓꜒꜒꜒꜒꜖꜒꜒꜕꜒꜒꜔꜒꜒꜓꜒꜒ʭaɑᴀᴬɒᶛɶᵅɐᵄæᵆᵃbɞʙʚɓcçʗ꜁꜅꜇꜃ɔᵓƈɕ꜀꜄꜆꜂dđðᶞɗȡᵈɖᶑdzʣdʑʥdʐ ꭦdʒ ʤeəᵊɚɛᴇᴱᵋɜᶟɝᵉɚɘf̜̹̟̱̲̣̤̘͇̙̺̻̪̯̩̄̇̈́̋̀̏͆̂̍͜͡˖⁻·˙ˊː˂˃ˋ˄ˌ˔˕˚˞˅ˈ̡̝̞̼̰̥̬̫̩͈̃ʩ̢͊̊̆̽̍̃ɡɠgɢʛhħɥᶣɦɧʱʜʰiɨᶤïɿɪᶦʅⁱʅjɟʄᶡʄʝᶨʲkʞƙlɬȴʟᶫˡɭᶩʪʫɮɫmɯɰᶭᵚɱᵐnŋᵑȵɲɴᶮⁿɳᶯoɵᶱʘøɸᶲœꟹᵒɷp꜌˩꜋˨꜊˧꜉˦꜈˥ƥ꜑꜖꜐꜕꜏꜔꜎꜓꜍꜒qʠrɹɺʴɻʵɼʳɾʀʁʶɽsˢʂᶳʃᶴttɕ ʨʇƭȶᵗʈts ʦtʂ ꭧtʃ ʧuʉᶶᵘʊᶷvʌᶺⱱᵛɤʋᶹɣˠwʍʷʬxˣχᵡyʎʸʯʮʏzʑᶽᶻʐᶼʒᶾǀǂǁ`;
        let reg = new RegExp('(\\[)([' + ipa + ']+)(\\])', 'g');
        //console.log(reg.source)//t
        //console.log(leftReplace+'$2'+rightReplace)//t
        str = str.replace(reg, leftReplace + '$2' + rightReplace);
        return str;
    }
    static _isProperSubsetOf_(a, b) {
        if (a.size >= b.size) {
            return false;
        }
        for (const item of a) {
            if (!b.has(item)) {
                return false;
            }
        }
        // 判断 a 是否是 b 的真子集
        return true;
    }
    static arraysEqual(a, b) {
        // Check if the arrays have the same length
        if (a.length !== b.length) {
            return false;
        }
        // Use Array.prototype.every() to compare each element
        /* return a.every((element, index) => {
          return element === b[index];
        }); */
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }
    static differenceSetAMinusSetB(setA, setB) {
        const diff = new Set();
        for (const item of setA) {
            if (!setB.has(item)) {
                diff.add(item);
            }
        }
        return diff;
    }
    static jsonConcatArr(jsonStr, arr) {
        return JSON.stringify(JSON.parse(jsonStr).concat(arr));
    }
    static addNewLinesAroundBraces(str) {
        return str.replace(/([{}])/g, "\n$1\n");
    }
    static 處理詞塊ᵗ中括號(str) {
        str = str.replace(/^(\s)*(\[{2})/g, '\n$2\n');
        str = str.replace(/(\]{2})(\s)*$/g, '\n$2\n');
        //return str.replace(/([\[\]])/g, "\n$1\n");
        return str;
    }
    static readFileSync(filePath) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return fileData;
    }
    static removeEmptyLinesInBrackets(str) {
        const regex = /\[[^\]]*\]/g; //[^\]]* 匹配零个或多个非右方括号字符
        const matches = str.match(regex); //将 str 中所有匹配到的方括号内的文本都存储在 matches 变量中。
        if (matches) { //matches昰數組芝配到ᵗ字符串ˋʃ組成者。
            matches.forEach((match) => {
                const newMatch = match.replace(/[\r\n]{2,}/g, '\n');
                str = str.replace(match, newMatch);
            });
        }
        return str;
    }
    static 轉義ᵣ中括號ʸᵗ空行(str) {
        //const regex = /\[[^\]]*\]/g;//[^\]]* 匹配零个或多个非右方括号字符
        const regex = /\[{2}.*?\]{2}/gs;
        const matches = str.match(regex); //将 str 中所有匹配到的方括号内的文本都存储在 matches 变量中。
        if (matches) { //matches昰數組芝配到ᵗ字符串ˋʃ組成者。
            matches.forEach((match) => {
                /*if(match.match(/.*苛め.*!/g)){
                    console.log(match)//t
                }*/
                let newMatch = match.replace(/\\/g, '\\\\');
                newMatch = newMatch.replace(/[\r\n]{2,}/g, '\\n\n');
                str = str.replace(match, newMatch);
            });
        }
        return str;
    }
    /*	public static 轉義regExp元字符(str:string):string{
            let outcome = str.replace(/\(/g,'\\(');
        }*/
    static forEach_doFn_(obj, fn) {
    }
    /* public async 除重(){
        const db = this.getDbConnection()
        // let duplicateResult;
        // const sql = `SELECT wordShape, COUNT(*) as count
        // FROM ${this.tableName}
        // GROUP BY wordShape
        // HAVING COUNT(*) > 1;`
        // await db.query(sql, (err, result)=>{
        // 	console.log('<result>')
        // 	console.log(result)
        // 	console.log('</result>')
        // 	duplicateResult = result
        // })
        // for(let i = 0; i < duplicateResult.length; i++){
        // 	console.log(duplicateResult.id)
        // }
        let duplicateResult:SingleWord[]|undefined
        const sql = `SELECT * FROM ${this.tableName}`
        await new Promise<void>((resolve, reject)=>{
            db.query(sql, (err, result)=>{
                if(err){throw err}
                //console.log('<result>')
                console.log(result.length)
                //console.log('</result>')
                //console.log(result[0]) //worked
                duplicateResult = result;
                resolve() //不寫此則續ᵈ待
            })
        })
        if(!duplicateResult){
            throw new Error()
        }
        //duplicateResult = <SingleWord[]>duplicateResult as SingleWord[]
        //console.log(duplicateResult[0])
        //console.log(114514)
        let mladhs = new Set<string>() //無重
        let dhs_idToSingleWord = new Map<number, SingleWord>()//重
        let dhs_idToTimes = new Map<number, number>()
        for(let i = 0; i<duplicateResult.length; i++){
            //console.log(duplicateResult[i].wordShape)
            if(mladhs.has(duplicateResult[i].wordShape)){
                let originId = duplicateResult[i].id
                duplicateResult[i].id = -1
                dhs_idToSingleWord.set(originId, duplicateResult[i])
            }else{
                mladhs.add(duplicateResult[i].wordShape)
            }
        }
        //console.log(mladhs)
        console.log(dhs_idToSingleWord.size)
        let 全同者M = new Map<string, number[]>();
        let 有異者 = new Map<string, number[]>();
        for(let [id,v] of dhs_idToSingleWord){
            if(全同者M.has(JSON.stringify(v))){
                
            }else{
                
            }
            全同者M.set(JSON.stringify(v), id)

        }
    } */
    /*public static matchOrNot(str:string, ...target:string){ //
        for(let i = 0; i < target.length; i++){
            if(target[i].length !== 2){ //未考慮utf-16
                throw new Error("傳入之target不合法、target中ᵗ每個元素皆應昰兩字符")
            }
        }
        let targetsL:string[] = []
        let targetsR:string[] = []
        for(let i = 0; i < target.length; i++){
            targetsL[i] = target[i].charAt(0)
            targetsR[i] = target[i].charAt(1)
        }
        let stacks:string[][] = [[]]
        let regexStr:string = ''
        for(let i = 0; i < target.length; i++){
        
        }
        const regex =
        const regexL = /(\{|\})/g
        //const regexR = /\]/g
        const matchesL = target.match(regexL)
        //const matchesR = str.match(regexR)
        if(!matchesL){
            throw new Error("沒配上")
        }
        const stack:string[] = []
        for(let i = 0; i < matchesL.length; i ++){
            console.log(matchesL[i])
            if(matchesL[i] === '{'){
                stack.push('{')
            }
            else if(matchesL[i] === '}'){
                stack.pop()
            }
        }
        return stack.length === 0;
    }*/ //待叶
    //[23.06.27-1802,]
    查重() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getDbConnection();
            let columnNames = [];
            let columnNames_str = '';
            let 表名除id_str = '';
            yield new Promise((resolve, reject) => {
                db.query(`SHOW COLUMNS FROM ${this.tableName};`, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    //console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        //console.log(result[i].Field)
                        columnNames.push(result[i].Field);
                    }
                    for (let i = 0; i < columnNames.length; i++) {
                        columnNames_str += columnNames[i];
                        columnNames_str += ',';
                        if (columnNames[i] !== 'id') {
                            表名除id_str += columnNames[i];
                            表名除id_str += ',';
                        }
                    }
                    columnNames_str = columnNames_str.replace(/,$/g, ''); //刪ᵣ末ᵗ逗號
                    表名除id_str = 表名除id_str.replace(/,$/g, ''); //刪ᵣ末ᵗ逗號
                    resolve();
                });
            });
            //console.log(columnNames_str)
            //console.log(表名除id_str)
            const 查重sql = `
			SELECT ${表名除id_str}, COUNT(*) as count, GROUP_CONCAT(id) AS duplicate_ids
			FROM ${this.tableName}
			GROUP BY ${表名除id_str}
			HAVING count > 1;
		`;
            const 查重2sql = `
		SELECT wordShape, COUNT(*) as count
		FROM ${this.tableName}
		GROUP BY wordShape
		HAVING count > 1;`; //
            //查重與查重2之果ˋ皆728
            //console.log(查重sql)
            let 詞_重複ᵗid = new Map(); //key放ᵣ整個詞芝除id再轉json後者、value放id數組。
            yield new Promise((resolve, reject) => {
                db.query(查重2sql, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    //console.log(result)
                    for (let i = 0; i < result.length; i++) {
                        let 原id = result[i].id;
                        result[i].id = null;
                        if (typeof (result[i].duplicate_ids) === 'string') {
                            let idArr = result[i].duplicate_ids.split(',').map(Number);
                            //console.log(idArr)
                            if (詞_重複ᵗid.has(JSON.stringify(result[i]))) {
                                throw new Error();
                            }
                            else {
                                詞_重複ᵗid.set(JSON.stringify(result[i]), idArr);
                            }
                        }
                    }
                    resolve();
                    //console.log(詞_重複ᵗid)
                });
            });
            //console.log(詞_重複ᵗid)
            return 詞_重複ᵗid;
        });
    }
    //[23.06.27-1803,]
    刪重(詞_重複ᵗid) {
        const db = this.getDbConnection();
        let 要被刪的id = [];
        for (let [k, v] of 詞_重複ᵗid) {
            //使id數組按升序排序
            v.sort((a, b) => {
                return a - b;
            });
            let tempIdArr = v.slice();
            tempIdArr.shift();
            要被刪的id = 要被刪的id.concat(tempIdArr);
        }
        //console.log(要被刪的id)
        const sql = `DELETEnonono  FROM ${this.tableName} WHERE id = ?`;
        for (let i = 0; i < 要被刪的id.length; i++) {
            db.query(sql, 要被刪的id[i], (err, result) => {
                if (err) {
                    throw err;
                }
                //console.log(result)
            });
        }
    }
    //[23.06.27-1846,]
    第三步() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this.getDbConnection();
            const queryAsync = util.promisify(db.query).bind(db);
            const 查重2sql = `
		SELECT wordShape, COUNT(*) as count, GROUP_CONCAT(id) AS duplicate_ids,
		GROUP_CONCAT(rememberedDates) AS rememberedDates, GROUP_CONCAT(forgottenTimes) AS forgottenDates
		FROM ${this.tableName}
		GROUP BY wordShape
		HAVING count > 1;`;
            let 要被刪的id = [];
            let allIdArr = [];
            yield new Promise((resolve, reject) => {
                db.query(查重2sql, (err, result) => {
                    //console.log(result)
                    for (let i = 0; i < result.length; i++) {
                        if (typeof (result[i].duplicate_ids) === 'string') {
                        }
                        let tempIdArr = [];
                        tempIdArr = result[i].duplicate_ids.split(',').map(Number);
                        allIdArr = allIdArr.concat(tempIdArr);
                    }
                    resolve();
                });
            });
            //console.log(allIdArr)
            const qry = `SELECT * FROM ${this.tableName} WHERE id = ?`;
            for (let i = 0; i < allIdArr.length; i++) {
                yield new Promise((resolve, reject) => {
                    db.query(qry, allIdArr[i], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        for (let j = 0; j < result.length; j++) {
                            //console.log(result[j].rememberedDates + '\t' + result[j].forgottenDates)
                            if (result[j].rememberedDates == '[]' && result[j].forgottenDates == '[]') {
                                //console.log(result[j].id)
                                要被刪的id.push(result[j].id);
                            }
                        }
                        resolve();
                    });
                });
            }
            //console.log(要被刪的id)
            const deleteSql = `DELETE FROM ${this.tableName} WHERE id = ?`;
            for (let i = 0; i < 要被刪的id.length; i++) {
                db.query(deleteSql, 要被刪的id[i], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    //console.log(result)
                });
            }
            /* 		for (let i = 0; i < allIdArr.length; i++) {
                        await new Promise<void>(async (resolve, reject) => {
                          try {
                            const result = await queryAsync(qry, allIdArr[i]);
                      
                            for (let j = 0; j < result.length; j++) {
                              if (result[j].rememberedDates == '[]' && result[j].forgottenDates == '[]') {
                                要被刪的id.push(result[j].id);
                              }
                            }
                      
                            resolve();
                          } catch (err) {
                            reject(err);
                          }
                        });
                      }
                      console.log(要被刪的id) */
        });
    }
    //目前只能檢查大括號與雙重中括號昰否配對、宜封裝成通用ᵗ函數
    static 括號匹配檢查(str) {
        let regex = /(\{|\}|\[{2}|\]{2})/g;
        const matches = str.match(regex);
        if (!matches || matches.length === 0) {
            return true;
        }
        //stacks[0]㕥存大括號、stacks[1]㕥存雙重中括號
        let stacks = new Array(2);
        //stacks.forEach((e)=>{e = []}) //传递的回调函数无法直接修改数组元素本身。
        for (let i = 0; i < stacks.length; i++) {
            stacks[i] = [];
        }
        for (let i = 0; i < matches.length; i++) {
            if (matches[i] === '{') {
                stacks[0].push('{');
            }
            else if (matches[i] === '}') {
                stacks[0].pop();
            }
            else if (matches[i] === '[[') {
                stacks[1].push('[[');
            }
            else if (matches[i] === ']]') {
                stacks[1].pop();
            }
        }
        return stacks[0].length === 0 && stacks[1].length === 0;
    }
}
//public static readonly configFilePath:string = path.resolve(process.cwd())+ '/config.xml'
VocaRaw.configFilePath = root_1.default.rootDir + '/config.xml';
exports.default = VocaRaw;
function main() {
    let eng = new VocaRaw();
    eng.srcFilePath = 'D:\\#\\mmf\\英語\\誧補錄入db.txt';
    eng.tableName = 'eng';
    //eng.dropTableSync()
    eng.creatTableSync();
    //eng.resetTable()
    eng.addSingleWordsToDb();
    //console.log(eng.wordUnits)
    //console.log(vocaRaw.singleWords.length);
    //vocaRaw.creatTable(vocaRaw.tableName);
    //vocaRaw.clearDbTekTable(vocaRaw.dbName, vocaRaw.tableName);
    //vocaRaw.addSingleWordsToDb();
    //jap.getAllSingleWordsSync()
}
//main();
