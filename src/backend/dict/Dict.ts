//const sqlite3 = require("sqlite3").verbose();
require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import 'module-alias/register';
import { Database } from 'sqlite3';
import * as sqlite3Temp from 'sqlite3'
const sqlite3 = sqlite3Temp.verbose()
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
//import 'module-alias/register';
//import Txt from '../../../shared/Txt';
import Txt from "@shared/Txt"
import {RegexReplacePair} from '@shared/Ut';
import * as Tp from '@shared/Type'
import {Duplication,DictDbRow,DictRawConfig, cn} from '@shared/Type'
import SqliteTableInfo from "@shared/db/Sqlite"
import * as DictType from '@shared/Type'
import _, { sum } from 'lodash';
import moment from 'moment'
import Sqlite from '@shared/db/Sqlite';
// import { transpose, nng ,YYYYMMDDHHmmssSSS, YYYYMMDDHHmmss, printArr} from '@shared/Ut';
// const Ut = {
// 	transpose:transpose,
// 	nng:nng,
// 	YYYYMMDDHHmmss:YYYYMMDDHHmmss,
// 	YYYYMMDDHHmmssSSS,
// 	printArr,
// }
import * as Ut from '@shared/Ut'
//const Txt = require('../../../my_modules/Txt')
//const Txt = require("@my_modules/Txt")
//const Txt = require('Txt')

/**
 * 音節
 */
// class Syllable{
// 	protected _whole?:string //整個音節
// 	protected _phoneme?:string[] //音素
// 	protected _fragments?:string[] //片段
// }

/**
 * 最小對立對
 */
export class MinimalPairUtil{
	constructor(props?:Partial<Kanji>) {
		if(props){Object.assign(this, props)}
	}
	/**
	 * pair的每個元素都是一對最小對立對、第二維長度皆是2 如pair[1][0].code 潙'ta'、pair[1][1].code 潙'tʰa'
	 */
	private _pairs:MinimalPairUtil[] = []
	;public get pairs(){return this._pairs;};
	;public set pairs(v){this._pairs=v;};

	
	/**
	 * 蔿 諸 最小對立對 算 字頻之和
	 * @param db 
	 * @param table 
	 * @param pairs 諸 最小對立對
	 * @returns 長度潙二的 數組。 第一個元素是諸最小對立對中包含第一個音位的字的字頻之和、第二個同理。
	 */
	public static async sumFreq(db:Database, table:string ,pairs:Tp.MinimalPair[]){
		//let result:number[] = [0,0] //左,右
		let left:number[][] = []
		let right:number[][] = []
		let sql = `SELECT ${cn.freq} FROM '${table}' WHERE id=?`
		for(let i = 0; i < pairs.length; i++){
			let unusLeft:number[] = await objTo2DArr(pairs[i].ids1)
			let unusRight:number[] = await objTo2DArr(pairs[i].ids2)
			left.push(unusLeft)
			right.push(unusRight)
		}

		async function objTo2DArr(numArr:number[]){
			let r = await Sqlite.transaction<{freq:number}>(db, sql, numArr)
			let arr:number[] = []
			for(let i = 0; i < r.length; i++){
				arr.push(r[i].freq) 
			}
			return arr
		}
		
		function sum2DArr(para:number[][]) {
			//console.log(para)
			let sum = 0
			for(let i = 0; i < para.length; i++){
				for(let j = 0; j < para[i].length; j++){
					sum += para[i][j]
					//console.log(sum)
				}
			}
			return sum
		}
		//console.log(sum2DArr(left))
		return [sum2DArr(left), sum2DArr(right)]
	}


	/**
	 * 算字頻之和。考慮除重。
	 * @param pairs 
	 * @param side 0對應左邊的音位、1對應右邊的音位。不填則返回左右的和。
	 * @returns 
	 */
	public static sumFreq_deprecated(pairs:DictDbRow[][], side?:0|1){
		console.log(`console.log(pairs.length)`)//t
		console.log(pairs.length)
		function sumFreqOfOneSide(pairs:DictDbRow[][], side:0|1){
			let tr = Ut.transpose(pairs)
			let sum = 0;
			//let rows = tr[side]
			let rows = _.uniqWith(tr[side], _.isEqual);
			for(let i = 0; i < rows.length; i++){
				sum+=rows[i].freq??0
			}
			return sum
		}
		if(side){
			return sumFreqOfOneSide(pairs, side)
		}else{
			return sumFreqOfOneSide(pairs, 0) + sumFreqOfOneSide(pairs, 1)
		}
	}

	/**
	 * 把MinimalPair[] 類型的最小對立對 數組 轉成 DictDbRow[][]類型的。
	 */
	//public static async toPairsOfDbRows(db:Database, table:string, pairs:Tp.MinimalPair[]){
	//	let result:DictDbRow[][] = []
	//	let sql = `SELECT * FROM '${table}' WHERE id=?`
	//	for(let i = 0; i < pairs.length; i++){
	//		let leftRows = await DictDb.transaction<DictDbRow>(db, sql, pairs[i].ids1)
	//		let rightRows = await DictDb.transaction<DictDbRow>(db, sql, pairs[i].ids2)
	//		//result.push([leftRows, rightRows])
	//	}
	//}

	public static filterComplementary(pairs:Tp.MultiMinimalPairs[]){
		let result:string[] = []
		for(const p of pairs){
			if(p.proportion[0] === -1){
				result.push(...p.pair)
			}
		}
	}

	

}

export class Kanji{
	public kanji?:string
	public syllable = new ChieneseSyllable()
	constructor(props?:Partial<Kanji>) {
		if(props){Object.assign(this, props)}
	}
}

export class ChieneseSyllable{
	public whole?:string
	public onset?:string
	public medial?:string
	public vowel?:string
	public coda?:string
	public tone?:string
	public p2?:string //r+主元音
	public p3?:string //韻尾+聲調


	public get combined():string|undefined{
		return this.onset!+this.combined_p2+this.combined_p3
	}

	public get combined_p2():string|undefined{
		return this.medial! + this.vowel!
	}
	public get combined_p3():string|undefined{
		return this.coda! + this.tone!
	}

	constructor(props?:Partial<ChieneseSyllable>) {
		if(props){Object.assign(this, props)}
	}
}

/**
 * 音節內的片段
 */
// class FragmentSyllable{
// 	protected _whole?:string //整個片段
// 	protected _phoneme?:string[] //音素
// }

/**
 * 漢字
 */
// class Kanji{
// 	private _glyph?:string //字形
// 	private _pronounce?:string //碼
// 	private _freq?:string //出現頻率
// }

export class Dict{
	public constructor(props:Partial<Dict>){Object.assign(this, props)}

	public static readonly L_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
	
	private _rawObj:DictRaw = new DictRaw({})
	;public get rawObj(){return this._rawObj;};
	;public set rawObj(v){this._rawObj=v;};

	private _name:string = ''
	public get name(){return this._name}
	public set name(v){
		this._name = v
		this._rawObj.name = this.name
		this._dbObj.tableName = this.name
	}

	private _dbObj:DictDb = new DictDb({dbName:this.name})
	public get dbObj(){
		return this._dbObj
	}

	private _重碼頻數?:number
	public get 重碼頻數(){return this._重碼頻數;}
	
	private _無重複漢字數?:number
	public get 無重複漢字數(){return this._無重複漢字數}

	private _無重複音節數?:number
	public get 無重複音節數(){return this._無重複音節數}

	private _字頻總和?:number
	public get 字頻總和(){return this._字頻總和}

	private _加頻重碼率?:number
	public get 加頻重碼率(){return this._加頻重碼率}

	private _pronounceArr:string[] = []
	;public get pronounceArr(){
		return this._pronounceArr;
	};
	;public set pronounceArr(v){this._pronounceArr=v;};

	private _kanjis:Kanji[] = []
	;public get kanjis(){return this._kanjis;};
	;public set kanjis(v){this._kanjis=v;};


	//
	public static getSimpleHead(name:string){
		const dateNow:string = moment().format('YYYYMMDDHHmmssSSS')
		let head = 
`
#${dateNow}
# Rime dictionary
# encoding: utf-8
---
name: ${name}
version: ""
sort: by_weight
use_preset_vocabulary: true
...
`
		return head
	}


	public getUpdatedKanjis(validBody=this.rawObj.validBody, pronounceArr=this.pronounceArr){

		let kanjis:Kanji[] = []
		let tr = Ut.transpose(validBody)
		if(pronounceArr.length !== tr[0].length){throw new Error('pronounceArr.length !== tr[0].length')}
		for(let i = 0; i < pronounceArr.length; i++){
			let syllable = new ChieneseSyllable({whole:pronounceArr[i]})
			let kanji = new Kanji({kanji:tr[0][i], syllable: syllable})
			this.kanjis.push(kanji)
		}
		return kanjis
	}

	public get_pronounceArr(validBody=this.rawObj.validBody){
		return Ut.transpose(validBody, '')[1]
	}

	public assign_pronounceArr(){
		this.pronounceArr = this.get_pronounceArr()
	}

	/**
	 * 
	 * @param min 若填則不慮字頻小於此者
	 */
	public async get_重碼頻數(min?:number){
		let objs
		if(min === undefined){
			objs = await DictDb.get重碼頻數(this.dbObj.db, this.name)
			
		}else{
			let tempTable = 'temp'+Ut.YYYYMMDDHHmmss()
			await Sqlite.copyTable(this.dbObj.db, tempTable, this.name)
			await Dict.篩頻(this.dbObj.db, tempTable, min)
			objs = await DictDb.get重碼頻數(this.dbObj.db, tempTable)
			await Sqlite.dropTable(this.dbObj.db, tempTable)
		}
		let sum = 0
		for(let i = 0; i < objs.length; i++){
			sum += objs[i].freq_of_homo
		}
		return sum
	}

	public async get_字頻總和(min?:number){
		if(min===undefined){
			return await Sqlite.getSum(this.dbObj.db, this.name, DictType.cn.freq)
		}else{
			let tempTable = 'temp'+Ut.YYYYMMDDHHmmss()
			await Sqlite.copyTable(this.dbObj.db, tempTable, this.name)
			await Dict.篩頻(this.dbObj.db, tempTable, min)
			let r = await Sqlite.getSum(this.dbObj.db, tempTable, DictType.cn.freq)
			await Sqlite.dropTable(this.dbObj.db, tempTable)
			return r
		}
		
	}

	/**
	 * 臨時用
	 * @param db 
	 * @param table 
	 * @param min 
	 * @returns 
	 */
	public static 篩頻(db:Database, table:string, min:number){
		let sql = `DELETE FROM '${table}' WHERE ${cn.freq}<${min}`
		return Sqlite.all(db, sql)
	}


	public async assign_重碼頻數(min?:number){
		this._重碼頻數 = await this.get_重碼頻數(min)
	}

	public preprocess(replacePair:RegexReplacePair[], pronounceArr=this.pronounceArr){
		//pronounceArr = Util.serialReplace(pronounceArr, replacePair) 如是則pronounceArr之地址ˋ變、不再指向this.pronounceArr
		Object.assign(pronounceArr, Ut.serialReplace(pronounceArr, replacePair))
	}

	public getRawDividedSyllable(replacePair:RegexReplacePair[], pronounceArr=this.pronounceArr):string[]{
		return Ut.serialReplace(pronounceArr, replacePair)
	}


	/**
	 * 示例 phraws 
	 * let r = 首介腹尾調_分割('首1ph首2介1r介2腹1a腹2尾1w尾2調1s調2', new ChieneseSyllable())
	 * 返回的r是一個ChieneseSyllable實例、有onset到tone等等。
	 * @param str 
	 * @param oldSyllableObj 
	 * @param pattern 
	 * @returns 
	 */
	public static 首介腹尾調_分割(str:string,oldSyllableObj:ChieneseSyllable,pattern = /首1(.*?)首2(.*?)介1(.*?)介2(.*?)腹1(.*?)腹2(.*?)尾1(.*?)尾2(.*?)調1(.*?)調2/){
		
		const match = str.match(pattern);
		let result = new ChieneseSyllable()
		if (match) {
			const [, first, second, intro1, intro2, belly1, belly2, tail1, tail2, tone1, tone2] = match; 
//解构赋值、first對應match[1]
			// console.log("首1 to 首2:", first);
			// console.log("介1 to 介2:", intro1);
			// console.log("腹1 to 腹2:", belly1);
			// console.log("尾1 to 尾2:", tail1);
			// console.log("調1ʔ to 調2:", tone1);
			
			result.onset = Ut.$(first)
			result.medial = Ut.$(intro1)
			result.vowel = Ut.$(belly1)
			result.coda = Ut.$(tail1)
			result.tone = Ut.$(tone1)

			// result.p2 = Util.nonNullableGet(intro1+belly1)
			// result.p3 = Util.nonNullableGet(tail1+tone1)
		}
		//result 無whole字段、若傳入之oldSyllableObj有whole字段則能組合並返回一個完整的ChieneseSyllable對象
		return Object.assign(oldSyllableObj, result)
	}

	public static 三分arr(str:string[],pattern = /首1(.*?)首2(.*?)介腹1(.*?)介腹2(.*?)尾調1(.*?)尾調2/){
		let result:ChieneseSyllable[] = []
		for(let i = 0; i < str.length; i++){
			let one = str[i]
			let oneSyllable = this.三分(one, new ChieneseSyllable(), pattern)
			result.push(oneSyllable)
		}
		return result
	}
	
	//不要加全局標誌
	public static 三分(str:string,oldSyllableObj:ChieneseSyllable,pattern = /首1(.*?)首2(.*?)介腹1(.*?)介腹2(.*?)尾調1(.*?)尾調2/){
		//console.log(str)
		//console.log(pattern)//t
		const match = str.match(pattern);
		//console.log(match)
		let result = new ChieneseSyllable()
		if(match){
			const [, 首,,介腹,,尾調] = match;
			result.onset = Ut.$(首)
			result.p2 = Ut.$(介腹)
			result.p3 = Ut.$(尾調)
		}
		return Object.assign(oldSyllableObj, result)
	}

	public static getOccurrenceTimesMap(syllables:ChieneseSyllable[], field: keyof ChieneseSyllable){
		let strArr:string[] = []
		for(let i = 0; i < syllables.length; i++){
			try{
				let e = Ut.$(syllables[i][field])
				strArr.push(e)
			}catch(e){
				console.error(field)
				console.error('i= '+i)
				console.error(syllables[i])
			}
		}
		return Ut.mapOccurrenceTimes(strArr)
	}

	public static 批量取分割後ᵗ音節對象(){

	}


	public async countAll(){
		//<待做>{驗ᵣ重複項、濾除 碼潙空字串 者}
		await Sqlite.castNull(this.dbObj.db, this.name, DictType.cn.freq, 0)
		await DictDb.deleteDuplication(this.dbObj.db, this.name)
		console.log(await DictDb.getDuplication(this.dbObj.db, this.name))
		this._無重複漢字數 = await Sqlite.countDistinct(this.dbObj.db!, this.name, DictType.cn.char)
		this._無重複音節數 = await Sqlite.countDistinct(this.dbObj.db!, this.name, DictType.cn.code)
		this._字頻總和 = await Sqlite.getSum(this.dbObj.db, this.name, DictType.cn.freq)
		await this.assign_重碼頻數()
		this._加頻重碼率 = Ut.$(this.重碼頻數)! / Ut.$(this.字頻總和)!
	}

	public 算加頻重碼率(min?:number){

	}

	public async putInfo(){
		// let keys:string[] = Object.keys(this)
		// for(let i = 0; i < keys.length; i++){
		// 	//let fun = eval()
		// 	console.log(keys[i])
		// }
		//console.log(this.無重複音節數)
		//console.log(this._無重複音節數)
	}

	public async 各排列ˋ轄字ᵗ分析(){

	}
	
	public async saffes韻母轄字統計(newTableName:string){
		let seto = Ut.getCombinationsWithRepetition(Dict.L_ALPHABET.split(''), 2)
		let creatSql = `CREATE TABLE '${newTableName}' AS SELECT * FROM '${this.name}';`
		//await DictDb.alterIntoAllowNull(this.dbObj.db, this.name, newTableName)
		let objs:DictDbRow[] = []
		for(let i = 0; i < seto.length; i++){
			let obj:DictDbRow = {char:'temp', code:seto[i].join('')}
			objs.push(obj)
		}
		await this.dbObj.insert(objs)
	}

	public recoverBody(pronounceArr=this.pronounceArr,validBody=this.rawObj.validBody){
		let tr = Ut.transpose(validBody,'')
		let 字 = tr[0]
		let 浮點頻 = tr[2]
		//console.log([字, pronounceArr, 浮點頻])//t
		let 復原
		if(浮點頻){
			復原 = Ut.transpose([字, pronounceArr, 浮點頻])
		}else{
			復原 = Ut.transpose([字, pronounceArr])
		}
		
		return 復原
	}

	public outputToFile(path:string, head=this.rawObj.header){

		let recovered = this.recoverBody()
		//console.log(recovered)//t
		let outStr = head
		for(const line of recovered){
			for(const grid of line){
				outStr += grid+'\t'
			}
			outStr += '\n'
		}
		//console.log(outStr.slice(0,999))
		//console.log(path)
		fs.writeFileSync(path, outStr)
		//console.log(outStr)//t
	}

	public async update(){
		const dateNow:string = moment().format('YYYYMMDDHHmmss')
		const tempTable = 'temp'+dateNow

	}

	
	public static zyenphengToOc(){
		let replacePair:RegexReplacePair[] = 
		[
			{regex:/ /gm, replacement:''},

		]
		let o = new Dict({
			rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\zyenpheng.dict.yaml'}),
			//name:''
		})
		
		o.assign_pronounceArr()
		o.preprocess(replacePair)
		//console.log(o.pronounceArr)
		Ut.printArr(o.pronounceArr, '\t')
		
	}

}


/**
 * [23.07.08-2146,]
 * 用于處理字表、如rime輸入法之dict.yaml, 音韻學/方言字表等
 */
export class DictRaw {
	private _singleCharMode:boolean = true
	private _name?:string
	private _srcPath?:string //源碼表文件路徑
	private _splitter:string = '\t' //源碼表中分割字與碼之符號
	private _srcStr:string = ''
	private _srcLines:string[] = [] //按行分割原字表
	//private _char:string[] = [] //字
	//private _code:string[] = [] //碼、形碼或音碼

	//private _tableArr:string[][] = [] //行,列 整個文件
	private _header = '' //表頭、在.dict.yaml中對應...及其之前的部分
	private _indexOfHeader: number = -1 //表的起始索引、即「...」的下一行 在 整個tableArr數組中對應的索引。
	private _validBody:string[][] = [] //處理過的表身、無空行

	public set srcLines(v){
		this._srcLines = v
	}

	public get srcLines(){
		return this._srcLines
	}

	public set validBody(v){
		this._validBody = v
	}

	public get validBody(){
		return this._validBody
	}

	public set srcStr(v){
		this._srcStr = v
	}

	public get srcStr(){
		return this._srcStr
	}

	public set indexOfHeader(v){
		this._indexOfHeader = v
	}

	public get indexOfHeader(){
		return this._indexOfHeader
	}

/* 	public set tableArr(v){
		this._tableArr = v
	}

	public get tableArr(){
		return this._tableArr
	} */

	public set header(v){
		this._header = v
	}

	public get header(){
		return this._header
	}

	public set name(v){
		this._name = v
	}

	public get name(){
		return this._name
	}

	public set splitter(v){
		this._splitter = v
	}

	public get splitter(){
		return this._splitter
	}
	public set srcPath(v){
		this._srcPath = v
		
		this.assign_srcStr()
		
		this.assign_srcLines()
		
		this.assign_name()
		this.get_indexOfHeader()
		this.assign_validBody()
	}

	public get srcPath(){
		return this._srcPath
	}

	//public constructor(srcPath:string)
	public constructor(config:DictRawConfig)

	/* public constructor(srcPath:string){
		this.srcPath = srcPath
	} */
	public constructor(data:Partial<DictRaw>) {
		/* this.srcPath = data.srcPath??this.srcPath
		this.name = data.name??this.name
		this._singleCharMode = data.singleCharMode??this._singleCharMode */
		Object.assign(this,data)
	}

	public assign_srcStr(path=this.srcPath){
		if(!path){throw new Error('!path')}
		this.srcStr = fs.readFileSync(Ut.pathAt(path), 'utf-8')
	}
	
/* 	public assign_tableArrByPath(path=this.srcPath){
		if(!path){throw new Error('!path')}
		this.tableArr = Txt.getTableFromStr(fs.readFileSync(path, 'utf-8'))
	} */

	public assign_tableArr(){
		//this.tableArr = 
	}

	public get_indexOfHeader(){
		if(!this.srcLines){throw new Error('!this.srcLines')}
		/* for(let i = 0; i < this.tableArr.length; i++){
			let cur = Util.arrAt(this.tableArr, i)
			if(cur.length !== 1){continue}
			let curStr:string = Util.arrAt(cur, 0)
			if(curStr === '...'){
				this.indexOfHeader = i
			}
		} */

		for(let i = 0; i < this.srcLines.length; i++){
			let curStr = this.srcLines[i]
			if(curStr === '...'){
				this.indexOfHeader = i
				return i;
			}
		}
		let msg = `in ${this.srcPath} , "..." Not found`
		//throw new Error(msg)
		console.log(msg)
		return null
	}

	public get_header(){
		this.get_indexOfHeader()
		let headerLines:string[] = this.srcLines.slice(0, this.indexOfHeader+1)
		this.header = Txt.mergeArrIntoStr(headerLines)
		return this.header
	}

	public getOriginNameInDictYaml():string|undefined{
		if(!this.srcLines){throw new Error('!this.srcLines')}
		for(let i = 0; i < this.srcLines.length; i++){
			let curStr = this.srcLines[i]
			let caught = curStr.match(/^name:(.*)$/g)
			if(!caught){continue}
			
			//let name:string =  Util.arrAt(caught, 0).replace(/^name:(.*)$/g, '$1')
			let name:string =  caught[0].replace(/^name:(.*)$/g, '$1')
			name = name.trim()
			//若首尾是引號則除ᶦ
			let b1:boolean = (name.at(0) === '"' && name.at(name.length-1) === '"')
			let b2:boolean = (name.at(0) === "'" && name.at(name.length-1) === "'")
			if(b1 || b2){
				name = name.slice(1, name.length-1)
			}
			//this.name = name
			return name
		}
	}

	public assign_name(){
		if(this._name){return}
		this.name = this.getOriginNameInDictYaml()
	}

	/**
	 * 取 有效表身
	 */
	public assign_validBody(singleCharMode=this._singleCharMode){

		
		//this.validBody = []
		let bodyLines:string[] = []
		let body:string = ''
		let validBodyStr = ''
		//let excluded:string[] = []//t
		//if(this._singleCharMode){ //_singleCharMode未實現
			for(let i = this.indexOfHeader+1; i < this.srcLines.length; i++){
				//bodyLines.push(this.srcLines[i])
				body += (this.srcLines[i]+'\n')
			}
			body = Txt.removeSingleLineComments_s(body, '#')
			//console.log(bodyLines)
			bodyLines = Txt.spliteStrByNewline_s(body)
			let blankRe = new RegExp(/^(\s)+$/g)
			if(singleCharMode){
				for(let i = 0; i < bodyLines.length; i++){
					blankRe.lastIndex=0
					let left = bodyLines[i].split(this.splitter)[0]
					if(Txt.countChar(left)!==1){}
					else if( bodyLines[i] === '' && blankRe.test(bodyLines[i])){ //!bodyLines[i].match(/(\s)*/g)
					}
					else{
						validBodyStr += (bodyLines[i]+'\n')
					}
				}
			}else{
				for(let i = 0; i < bodyLines.length; i++){
					blankRe.lastIndex=0
	
					if( bodyLines[i] === '' && blankRe.test(bodyLines[i])){ //!bodyLines[i].match(/(\s)*/g)
						
					}
					else{
						validBodyStr += (bodyLines[i]+'\n')
					}
				}
			}

			//console.log(excluded)//t

			validBodyStr = validBodyStr.slice(0, validBodyStr.length-1)
			this.validBody = Txt.getTableFromStr(validBodyStr)
		
	}

	public assign_srcLines(){
		if(!this.srcStr){throw new Error('!this.srcStr')}
		this.srcLines = Txt.spliteStrByNewline_s(this.srcStr)
	}


	public static getDictYamlPaths(userPath:string='D:/Program Files/Rime/User_Data'):string[]{
		const fileNames:string[] = fs.readdirSync(userPath)
		let dictyamlFullPath:string[] = Txt.getFilted(fileNames, '^.*\\.dict\\.ya?ml$')
		for(let i = 0; i < dictyamlFullPath.length; i++){
			dictyamlFullPath[i] = userPath+'/'+dictyamlFullPath[i]
		}
		return dictyamlFullPath
	}

	public static 轉置後連續替換(body:string[][], index:number, replacePair:RegexReplacePair[]){
		let tr = Ut.transpose(body)
		return Ut.serialReplace(tr[index], replacePair)
	}

	
	/**
	 * 把有效表身存進數據庫
	 *//* 
	public async saveInDb(){
		if(!this.name){throw new Error("!this.name");}
		let db = new DictDb(this.name)
		db.insert(this.validBody).then((data)=>{
			console.log(data)
		})
	} */

}





export class DictDb{

	private _dbName = 'DictDb';public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}
	private _dbPath = rootDir+'/db/'+this._dbName+'.db' 
	private _essayPath = rootDir+'/db/essay.txt'  ;public get essayPath(){return this._essayPath;};;public set essayPath(v){this._essayPath=v;};
	private _tableName?:string
	private _essayName='essay' ;public get essayName(){return this._essayName;};;public set essayName(v){this._essayName=v;};

	// public static column_type = new Map<string, string>([
	// 	["char", "VARCHAR(64)"],
	// 	["code", "VARCHAR(64)"],

	// ])
	private _db:Database = new sqlite3.Database(this.dbPath, (err)=>{
		if(err){throw err}
	})

	constructor(props:Partial<DictDb>){
		Object.assign(this, props)
	}

	;public get dbPath(){return this._dbPath;};;
	public set dbPath(v){
		this._dbPath=v;
		this._db = new sqlite3.Database(this.dbPath, (err)=>{
			if(err){throw err}
		})
	};

	public set tableName(v){
		this._tableName = v
	}

	public get tableName(){
		return this._tableName
	}

	public get db(){
		return this._db
	}



	public async isTableExists(tableName = this.tableName){
		//写一个同步的typescript函数、判断一个sqlite数据库是否含有某表
		if(!this.db){throw new Error('!this.db')}
		if(!tableName){return false}
		return Sqlite.isTableExist(this.db, tableName)
	}

	public static async creatTable(db:Database, tableName:string){
		let sql:string = `CREATE TABLE [${tableName}] ( \
${cn.id} INTEGER PRIMARY KEY AUTOINCREMENT, \
${cn.char} VARCHAR(1024) NOT NULL, \
${cn.code} VARCHAR(64) NOT NULL, \
${cn.ratio} VARCHAR(64) \
)`
		return Sqlite.all(db,sql)
	}


	public async creatTable(tableName = this.tableName){
		
// 		let sql:string = `CREATE TABLE [${tableName}] ( \
// ${cn.id} INTEGER PRIMARY KEY AUTOINCREMENT, \
// ${cn.char} VARCHAR(1024) NOT NULL, \
// ${cn.code} VARCHAR(64) NOT NULL, \
// ${cn.ratio} VARCHAR(64) \
// )`

// 		return new Promise((s,j)=>{
			
// 			Util.nonFalseGet(this.db).run(sql, (err)=>{
// 				if(err){j(err);return}
// 				console.log('at\t'+this.dbPath)
// 				s(sql+'成功')
// 			})
			
// 		})
// 		//IF NOT EXISTS 
		
// 		//this.db.exec(testCreat)
		return DictDb.creatTable(this.db, Ut.$(tableName))
	}


	

	public async insert(data:DictDbRow[]|string[][]){
		return new Promise((s,j)=>{
			Ut.$(this.db)
		let rowObjs:DictDbRow[] = []
		if(cn.char in data[0] && cn.code in data[0]){
			rowObjs = data as DictDbRow[]
		}else{
			rowObjs = DictDb.toObjArr(data as string[][])
		}
		let sql = `INSERT INTO '${this.tableName}' (${cn.char}, ${cn.code}) \
VALUES (?,?)`

		this.db!.serialize(()=>{
			this.db!.run('BEGIN TRANSACTION')
			const stmt = this.db!.prepare(`INSERT INTO '${this.tableName}' (${cn.char}, ${cn.code}) \
VALUES (?,?)`)
			for(let i = 0; i < data.length; i++){
				stmt.run(rowObjs[i].char, rowObjs[i].code)
			}
			this.db!.run('COMMIT')
		})
		})
		
		//DictDb.transaction(this.db, sql, )
		/* DictDb.db.close((err)=>{
			if(err){throw err}
		}) */
	}

	public async attachFreq(/* essayTableName='essay' */){
		Ut.$(this.db)
		if(!this.tableName){throw new Error('this.tableName')}
		DictDb.attachFreq(this.db!, this.tableName)
	}

	/**
	 * 依照八股文 在表中爲每個字附上字頻
	 * @param db 
	 * @param tableName 
	 * @param essayTableName 
	 */
	public static async attachFreq(db:Database, tableName:string ,essayTableName='essay'){
		let b1 = await Sqlite.isColumnExist(db, tableName ,cn.freq)
		let b2 = await Sqlite.isColumnExist(db,tableName ,cn.essay_id)
		if(!b1 || !b2){
			let altSql = new Array<string>()
			altSql[0] = `ALTER TABLE '${tableName}' ADD COLUMN '${cn.freq}' INTEGER`
			altSql[1] = `ALTER TABLE '${tableName}' ADD COLUMN ${cn.essay_id} INTEGER REFERENCES ${essayTableName}(id) ON DELETE SET NULL`
			await Sqlite.all(db, altSql[0])
			await Sqlite.all(db, altSql[1])
			
		}
		let attachSql = `UPDATE '${tableName}' \
\ SET ${cn.freq} = CAST(COALESCE(${essayTableName}.${cn.code}, '') AS INTEGER) \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`//不使用外鍵、已棄用

		let attachSql2 = `UPDATE '${tableName}' \
\ SET ${cn.essay_id} = COALESCE(${essayTableName}.${cn.id}, '') \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`
		Sqlite.all(db, attachSql)
		Sqlite.all(db, attachSql2)
	
	}

	public static async putNewTable(dictRaw:DictRaw){
		if(!dictRaw.name){throw new Error("!dictRaw.name");}
		let dictDb = new DictDb({tableName:dictRaw.name})
		let b:boolean = await dictDb.isTableExists()
		if(!b){await dictDb.creatTable()}
		dictDb.insert(dictRaw.validBody).catch((e)=>{console.error(e)})
	}

	public async putNewTable(dictRaw:DictRaw, preprocess?:RegexReplacePair[]){
		if(!dictRaw.name){throw new Error("!dictRaw.name");}
		let dictDb = new DictDb({tableName:dictRaw.name})
		let b:boolean = await dictDb.isTableExists()
		if(!b){await dictDb.creatTable()}
		let toInsert
		if(preprocess){
			toInsert = DictRaw.轉置後連續替換(dictRaw.validBody, 1, preprocess)
		}else{
			toInsert = dictRaw.validBody
		}
		
		dictDb.insert(toInsert).catch((e)=>{console.error(e)})
	}

	public static async serialReplace(db:Database, table:string, column:string, replacementPair:RegexReplacePair[]){
		return Sqlite.serialReplace(db, table, column, replacementPair)
	}

	public static toObjArr(strArr:string[][]):DictDbRow[]{
		let result:DictDbRow[] = []
		for(let i = 0; i < strArr.length; i++){
			//let obj = {columnName.char: Util.arrAt(strArr,i,0), "pronounce": strArr[i][1]??''}
			//let obj:DictDbRow = {char:Util.arrAt(strArr,i,0), code: strArr[i][1]??''}
			let obj:DictDbRow = {char:Ut.$(strArr[i][0]), code: strArr[i][1]??''} //[23.07.31-0931,]
			result.push(obj)
		}
		return result
	}


	/**
	 * 先盡刪表、然後把整個User_Data下的.dict.yaml文件 字表的有效部分添進數據庫
	 * @param userPath User_Data的絕對路徑
	 */
	public static async testAll(db:Database, userPath:string='D:/Program Files/Rime/User_Data'){
		//await Sqlite.dropAllTables(db)
		await DictDb.putEssay(db)
		let paths:string[] = DictRaw.getDictYamlPaths(userPath)
		let names:string[] = []
		for(let i = 0; i < paths.length; i++){
			let temp = new DictRaw({srcPath:paths[i]})
			let name = temp.getOriginNameInDictYaml()
			if(name){names.push(name)}
		}

		//let prms:Promise<any>[] = []
		for(let i = 0; i < paths.length;i++){
			let pro = i+'/'+paths.length
			console.log(pro)
			await DictDb.putNewTable(new DictRaw({srcPath:paths[i]})).catch((e)=>{
				console.error(paths[i])
				console.log(e)
			})
			//await temp // 防 sqlite busy
			//prms.push(temp)
		}
	}

	public static selectAll(db:Database, table:string){
		let sql = `SELECT * FROM '${table}'`
		return Sqlite.all<DictDbRow>(db, sql)
	}

	/**
	 * 把八股文(字頻表)加進數據庫裏、表名命名爲essay
	 * @param path 
	 */
	public static async putEssay(db:Database, path=new DictDb({}).essayPath, essayName='essay'){
		return new Promise(async(s,j)=>{
			let b = await Sqlite.isTableExist(db, essayName)
			//if(!b){await DictDb.quickStart(path,essayName)}
			if(!b){await DictDb.putNewTable(new DictRaw({srcPath:path, name:essayName}))}
			s(0)
		})
	}



	public static async get重碼頻數(db:Database, tableName:string){
		/* 
這是一個複雜的 SQL 查詢，它使用了子查詢和窗口函數來計算每個 code 對應的非最大頻率的總和。
讓我們逐步解釋這個查詢：
首先，內部的子查詢選擇了 saffes 表中的 code 和 freq 字段，並使用窗口函數 ROW_NUMBER() 來為每個 code 分組，並按照 freq 的降序進行排序。ROW_NUMBER() 函數為每個分組的行分配一個連續的整數值，最大的 freq 對應的行會得到 rn 為 1，第二大的 freq 對應的行會得到 rn 為 2，以此類推。
然後，外部的主查詢（SELECT）對內部子查詢得到的結果集 s 進行過濾，只保留 rn > 1 的行，即保留非最大頻率的行。
接著，對過濾後的結果進行分組（GROUP BY），按照 code 字段進行分組，並對每個 code 分組計算 freq 的總和，並將結果作為新的 total_freq 列返回。
總體來說，這個查詢的目的是計算每個 code 對應的非最大頻率的總和，並將結果返回。這個查詢中使用了子查詢和窗口函數來實現這個功能，因此比較複雜，但在特定的業務場景中可能會很有用。
		*/
		let sql1 = `SELECT
		${DictType.cn.code},
		SUM(${DictType.cn.freq}) AS freq_of_homo
	  FROM (
		SELECT
		${DictType.cn.code},
		${DictType.cn.freq},
		  ROW_NUMBER() OVER (PARTITION BY ${DictType.cn.code} ORDER BY ${DictType.cn.freq} DESC) AS rn
		FROM
		  '${tableName}'
	  ) AS s
	  WHERE
		rn > 1
	  GROUP BY
	  ${DictType.cn.code};`

		//sql1幾乎瞬間出結果、sql2要等幾十秒
	  let sql2 = `SELECT 
	  ${DictType.cn.code},
	  SUM(${DictType.cn.freq}) AS freq_of_homo
	FROM
	  ${tableName} s1
	WHERE
	${DictType.cn.freq} < (SELECT MAX(${DictType.cn.freq}) FROM ${tableName} s2 WHERE s1.${DictType.cn.code} = s2.${DictType.cn.code})
	GROUP BY
	${DictType.cn.code};`
		return Sqlite.all<{code:string, freq_of_homo:number}>(db, sql1)

		/*
  亦可、然更慢*/
	}


	/**
	 * 取 重複項。若char,code,ratio皆同則視爲重複。
	 * @param db 
	 * @param tableName 
	 * @returns 
	 */
	public static async getDuplication(db:Database, tableName:string){
		let sql = 
`SELECT ${cn.char}, ${cn.code}, ${cn.ratio}, COUNT(*) AS count \
FROM '${tableName}' \
GROUP BY ${cn.char}, ${cn.code}, ${cn.ratio} \
HAVING COUNT(*) > 1;`
		return new Promise<Duplication[]>((s,j)=>{
			db.all(sql, (err, rows:Duplication[])=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(rows)
			})
		})
	}

	/**
	 * 刪除重複項、只保留id最大者。若char,code,ratio皆同則視爲重複。
	 * @param db 
	 * @param tableName 
	 * @returns 
	 */

	public static async deleteDuplication(db:Database, tableName:string){
		let sql = 
`DELETE FROM '${tableName}' WHERE ID NOT IN (SELECT MAX(ID) FROM '${tableName}' GROUP BY ${cn.char}, ${cn.code}, ${cn.ratio})`
		return new Promise((s,j)=>{
			db.all(sql, (err)=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(0)
			})
		})
	}


	public static async copyTransDb(targetDb:Database, srcDb:Database, srcTableName:string){

		//await Sqlite.all(targetDb)
	}



	// public static fullJoinOnEqual(db:Database, fromTable:string, tableB:string, fieldA:string, fieldB:string){
	// 	function getSql(fromTable:string, tableB:string, fieldA:string, fieldB:string){
	// 		return ``
	// 	}
	// }

	// public static async findMinimalPairs_old(db:Database, tableName:string, columnName:string, phoneme1:string, phoneme2:string){
	// 	/* 先分別對兩音素 SELECT * 、然後取 返回的行數少 者。假如查詢a音素返回的行數比b少。
	// 	則在a返回的表中、每個字的完整讀音的字串的子串都應包含音素a。
	// 	算出a在完整讀音的字串中的位置、在相同位置、把a替換成b、然後用替換後的完整讀音逐個查詢。查得的結果即最小對立對。
	// 	*/
	// 	function getSql(p:string){
	// 		let sql = `SELECT ${cn.id}, ${columnName}, (INSTR(${columnName}, '${p}')-1) AS position FROM '${tableName}' WHERE ${columnName} LIKE '%${p}%';`
	// 		return sql
	// 	}
		
	// 	let qrySql:string
	// 	let p:string
	// 	let len:number
	// 	//qrySql = `SELECT * FROM '${tableName}' WHERE ${columnName}='${p}'`
	// 	let result1 = await Sqlite.all<DictDbRow & {position:number}>(db, getSql(phoneme1))
	// 	let result2 = await Sqlite.all<DictDbRow & {position:number}>(db, getSql(phoneme2))
	// 	let result:(DictDbRow & {position:number})[]
	// 	//若result1結果更少、則用result1 音素替換成p2後來查。
	// 	if(result1.length <= result2.length){
	// 		result = result1
	// 		p=phoneme2
	// 		len=phoneme1.length
	// 	}else{
	// 		result = result2
	// 		p=phoneme1
	// 		len=phoneme2.length
	// 	}
	// 	result1 = [];result2 = []
	// 	let strToBeQueried:string[] = []
	// 	for(let i = 0; i < result.length; i++){
	// 		let s = Util.nonNullableGet(result[i][columnName])
	// 		s = Util.spliceStr(s, result[i].position, len, p)
	// 		strToBeQueried.push(s)
	// 	}
	// 	//console.log(strToBeQueried)//t
	// 	if(strToBeQueried.length !== result.length){Promise.reject('')}
	// 	let sql = `SELECT * FROM '${tableName}' WHERE ${columnName}=?`
	// 	return DictDb.transaction<DictDbRow>(db, sql, strToBeQueried)
		

	// }

	/*有bug。let pair = await DictDb.findMinimalPairs(new DictDb({}).db, 'OC_msoeg', 'code', 't', 'k')
	k在聲母/韻尾
	*/

	public static async findMinimalPairs_old2(db:Database, tableName:string, columnName:string, phoneme1:string, phoneme2:string){
		function getSql(p:string){
			let sql = `SELECT ${cn.id}, ${columnName}, (INSTR(${columnName}, '${p}')-1) AS position FROM '${tableName}' WHERE ${columnName} REGEXP BINARY '${p}';`
			return sql
		}
		
		//獲取第二個參數的結果
		async function getR2(phoneme1:string, phoneme2:string){
			let qrySql:string
			let p:string
			let len:number
			//qrySql = `SELECT * FROM '${tableName}' WHERE ${columnName}='${p}'`
			let result1 = await Sqlite.all<DictDbRow & {position:number}>(db, getSql(phoneme1))
			let result2 = await Sqlite.all<DictDbRow & {position:number}>(db, getSql(phoneme2))
			console.log(`console.log(result1.length)`)//t
			console.log(result1.length)
			console.log(`console.log(result2.length)`)//t
			console.log(result2.length)
			//let result:(DictDbRow & {position:number})[]
			//若result1結果更少、則用result1 音素替換成p2後來查。
			// if(result1.length <= result2.length){
			// 	result = result1
			// 	p=phoneme2
			// 	len=phoneme1.length
			// }else{
			// 	result = result2
			// 	p=phoneme1
			// 	len=phoneme2.length
			// }
			//result1 = [];result2 = []
			function getStrToBeQueried(result1:(DictDbRow & {position: number;})[], p1:string, p2:string){
				let strToBeQueriedForP2:string[] = []
				for(let i = 0; i < result1.length; i++){
					let s = Ut.$(result1[i][columnName])
					s = Ut.spliceStr(s, result1[i].position, phoneme1.length, phoneme2)
					strToBeQueriedForP2.push(s)
				}
				return strToBeQueriedForP2
			}
			let strToBeQueriedForP2:string[] = getStrToBeQueried(result1, phoneme1, phoneme2)
			console.log(`console.log(strToBeQueriedForP2)`)
			console.log(strToBeQueriedForP2)//t
			if(strToBeQueriedForP2.length !== result1.length){Promise.reject('')}
			let sql = `SELECT * FROM '${tableName}' WHERE ${columnName}=?`
			return await Sqlite.transaction<DictDbRow>(db, sql, strToBeQueriedForP2)
		}
		let r2 = await getR2(phoneme1, phoneme2)
		console.log(r2.length)
		let r1 = await getR2(phoneme2, phoneme1)
		console.log(r1.length)
		// for(let i = 0; i < r1.length; i++){
		// 	console.log(r1[i])
		// 	console.log(r2[i])
		// }
		return Ut.transpose([r1,r2])
			//console.log('r2.length')
			//console.log(r2.length)
			//let strToBeQueriedForP1:string[] = getStrToBeQueried(r2, phoneme2, phoneme1)
	
	}





	public static findMinimalPairs(rows:DictDbRow[], pattern1:string ,p2:string, mode='gm'){
		/*pattern1必須只有三個捕獲組、其中音位在第二個捕獲組。
		*/
		if(!/\(.*\)\(.*\)\(.*\)/g.test(pattern1)){
			console.error(`console.error(pattern1)`)
			console.error(pattern1)
			throw new Error('pattern1必須只有三個捕獲組')
		}

		let re1 = new RegExp(pattern1, mode)
		//㕥存 第一個音位在對象數組中對應的索引
		//let p1Indexes:number[] = []

		//把音位一替換成音位二後所得字串 所成數組
		// let strToBeQueried:string[] = []
		// let p1objs:{p1Index:number, strToBeQueried:string}[] = []
		// let p1Rows:DictDbRow[] = []

		//包含p1音位的音在數據庫中的id
		let p1Ids:number[][] = []
		//獲取 整個數據庫中 音 對 id 之映射。緣有同音字、 一 音 可能 對應 多個 id
		let mapCodeToIds_all = Ut.mapFields(rows, 'code', 'id')
		//把上面的map轉成對象數組
		let codeToIdsArr = Ut.mapToObjArr(mapCodeToIds_all)
		//p1屬性㕥存數據庫中包含p1音位的音、p2屬性即在p1屬性的基礎上把p1音位換成p2
		let p1vsP2:{p1:string, p2:string}[] = []

		//邊歷數據庫的每種音、尋 p1vsP2
		for(let i = 0; i < codeToIdsArr.length; i++){
			if(!codeToIdsArr[i].k){continue} //判空
			let curCode = codeToIdsArr[i].k as string //當前要研究的音
			re1.lastIndex = 0;
			//let result = re1.exec(rows[i].code??'')
			if(re1.test(curCode)){ //若符合正則表達式r1 則此音潙包含p1音位的音
				//p1Indexes.push(i) //舊
				let s = curCode.replace(re1, '$1'+p2+'$3') //在curCode中把p1音位換成p2音位
				p1vsP2.push({p1:curCode, p2:s}) //把一組可能的存在的最小對立對 push入p1vsP2
				p1Ids.push(codeToIdsArr[i].v as number[]) //把 數據庫中curCode這個音對應的諸個漢字的各自的id所構成的數組 push


				// strToBeQueried.push(s)//舊
				// let tempP1Obj = {p1Index:i, strToBeQueried:s}
				// p1objs.push(tempP1Obj)
				// p1Rows.push(rows[i])//?
				
			}
		}
		//let mapCodeToIds_p1 = Util.mapFields(p1Rows, 'code', 'id')

		// let resultIds1:number[][] = [] 
		// let resultIds2:number[][] = [] 
		//let result:{p1:string, p2:string, rows1:DictDbRow[], rows2:DictDbRow[]}[] = []
		//let result:{p1:string, p2:string, ids1:number[], ids2:number[]}[] = []
		let result:Tp.MinimalPair[] = []
		for(let i = 0; i < p1vsP2.length; i++){
			let curCode = p1vsP2[i].p2
			let ids = mapCodeToIds_all.get(curCode) as number[]
//若整個數據庫中存在curCode這樣的音、即有最小對立對
			if(ids){
				//let unusResult = {p1:p1vsP2[i].p1, p2:p1vsP2[i].p2, ids1: p1Ids[i], ids2:ids}
				let unusResult:Tp.MinimalPair = {pair:[p1vsP2[i].p1, p1vsP2[i].p2], ids1: p1Ids[i], ids2:ids}
				result.push(unusResult)
				// resultIds1.push(p1Ids[i])
				// resultIds2.push(ids)
			}
		}
		// {
		// 	p1:'park'
		// 	p2:'bark'
		// 	id1:[] //讀音爲p1的諸字的id之集
		// 	id2:[]
		// }[]
		//<待改>{返回ᵗ格式:}
		//return [resultIds1, resultIds2]
		return result
	}


	/**
	 * 示例 
	 * let r = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', ['p','t','k'], ['b', 'd'], 'asc');console.log(r)
	 * 輸出 
	 * 
	 * [
		{ pair: [ 'k', 'b' ], proportion: 0.026951720981624523 },
		{ pair: [ 'p', 'b' ], proportion: 0.029148193756669428 },
		{ pair: [ 't', 'b' ], proportion: 0.04542717702311534 },
		{ pair: [ 'k', 'd' ], proportion: 0.06330477231253857 },
		{ pair: [ 't', 'd' ], proportion: 0.06988718801675056 },
		{ pair: [ 'p', 'd' ], proportion: 0.07573960447134613 }
		]
	 * 
	 * @param db 
	 * @param table 
	 * @param leftPattern 
	 * @param rightPattern 
	 * @param phoneme1 
	 * @param phoneme2 
	 * @param orderBy 
	 * @returns 
	 */
	public static async multiMinimalPairs(db:Database, table:string, leftPattern:string, rightPattern:string, phoneme1:string[], phoneme2?:string[], orderBy?:'asc'|'desc'){
		if(!phoneme2){phoneme2 = phoneme1}
		let rows = await Sqlite.all<DictDbRow>(db, `SELECT * FROM '${table}'`)
		let freqSum = await Sqlite.getSum(db, table, cn.freq)
		let cartesianProduct = Ut.cartesianProduct(phoneme1, phoneme2)
		cartesianProduct = Ut.filterArrLikeSets(cartesianProduct)
		//console.log(cartesianProduct)
		//console.log(cartesianProduct.length)
		//let result:{pair:string[], proportion:number}[] = []
		let result:Tp.MultiMinimalPairs[] = []
		for(let i = 0; i < cartesianProduct.length; i++){
			let leftPhoneme = cartesianProduct[i][0]
			let rightPhoneme = cartesianProduct[i][1]
			let curPattern = leftPattern + leftPhoneme + rightPattern
			// console.log(`console.log(curPattern)`)
			// console.log(curPattern)
			let pairs = DictDb.findMinimalPairs(rows, curPattern, rightPhoneme)
			let freqPair = await MinimalPairUtil.sumFreq(db, table, pairs)
			//let proportion = (freqPair[0] + freqPair[1]) / freqSum
			let proportion:[number, number] = [freqPair[0]/freqSum, freqPair[1]/freqSum]
			if(pairs.length === 0){//處理 完全不對立之況。有的對立對 轄字之字頻之和 亦可能潙0、與此區分。
				proportion = [-1,-1]
			}
			//let unus = {pair: [leftPhoneme, rightPhoneme], proportion:proportion}
			let unus:Tp. MultiMinimalPairs = {pair: [leftPhoneme, rightPhoneme], proportion:proportion}
			result.push(unus)
		}
		if(!orderBy){return result}
		if(orderBy === 'asc'){
			result.sort((a,b)=>{return a.proportion[0]+a.proportion[1] - b.proportion[0]+b.proportion[1]})
			return result
		}else{
			result.sort((b,a)=>{return a.proportion[0]+a.proportion[1] - b.proportion[0]+b.proportion[1]})
			return result
		}
		
	}

}



function t20230618094140(){
	
	let input = fs.readFileSync(__dirname+'/input.txt', 'utf-8')
	input = input.replace(/./g, (match)=>{
		return match.toLowerCase()
	}) 
	//console.log(input)
	let rawRegex = fs.readFileSync(__dirname+'/regex.txt', 'utf-8')
	rawRegex = Txt.unifyNewline_s(rawRegex)
	//const regexEachLine:string[] = SerialRegExp.spliteStrBy_(rawRegex, '\n')
	//console.log(regexEachLine)
	let regex:string[][] = Txt.getRegExp(rawRegex, '\t')
	//console.log(regex)
	/* for(let i = 0; i < regex.length; i++){
		console.log(regex[i][0])
	} */
	const output:string = ''//SerialRegExp.replace(input, regex)
	//console.log(output)
	fs.writeFile(__dirname+'/output.txt', output, {encoding:'utf-8'}, (err)=>{
		if(err){throw err}
	})
	//const newStr = SerialRegExp.replace(oldFile,)

}

//t20230618094140()

//