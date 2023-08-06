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
import Util from '@shared/Util';
import {RegexReplacePair} from 'Type';
import {Duplication,DictDbRow,SqliteTableInfo,DictRawConfig, cn} from './DictType'
import * as DictType from './DictType'
import _ from 'lodash';

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
export class MinimalPair{
	constructor(props?:Partial<Kanji>) {
		if(props){Object.assign(this, props)}
	}
	/**
	 * pair的每個元素都是一對最小對立對、第二維長度皆是2 如pair[1][0].code 潙'ta'、pair[1][1].code 潙'tʰa'
	 */
	private _pairs:DictDbRow[][] = []
	;public get pairs(){return this._pairs;};
	;public set pairs(v){this._pairs=v;};

	/**
	 * 算字頻之和。考慮除重。
	 * @param pairs 
	 * @param side 0對應左邊的音位、1對應右邊的音位。不填則返回左右的和。
	 * @returns 
	 */
	public static sumFreq(pairs:DictDbRow[][], side?:0|1){
		console.log(`console.log(pairs.length)`)//t
		console.log(pairs.length)
		function sumFreqOfOneSide(pairs:DictDbRow[][], side:0|1){
			let tr = Util.transpose(pairs)
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



	public getUpdatedKanjis(validBody=this.rawObj.validBody, pronounceArr=this.pronounceArr){

		let kanjis:Kanji[] = []
		let tr = Util.transpose(validBody)
		if(pronounceArr.length !== tr[0].length){throw new Error('pronounceArr.length !== tr[0].length')}
		for(let i = 0; i < pronounceArr.length; i++){
			let syllable = new ChieneseSyllable({whole:pronounceArr[i]})
			let kanji = new Kanji({kanji:tr[0][i], syllable: syllable})
			this.kanjis.push(kanji)
		}
		return kanjis
	}

	public get_pronounceArr(validBody=this.rawObj.validBody){
		return Util.transpose(validBody)[1]
	}

	public assign_pronounceArr(){
		this.pronounceArr = this.get_pronounceArr()
	}

	public async assign_重碼頻數(){
		let objs = await DictDb.get重碼頻數(this.dbObj.db, this.name)
		let sum = 0
		for(let i = 0; i < objs.length; i++){
			sum += objs[i].freq_of_homo
		}
		this._重碼頻數 = sum
	}

	public preprocess(replacePair:RegexReplacePair[], pronounceArr=this.pronounceArr){
		//pronounceArr = Util.serialReplace(pronounceArr, replacePair) 如是則pronounceArr之地址ˋ變、不再指向this.pronounceArr
		Object.assign(pronounceArr, Util.serialReplace(pronounceArr, replacePair))
	}

	public getRawDividedSyllable(replacePair:RegexReplacePair[], pronounceArr=this.pronounceArr):string[]{
		return Util.serialReplace(pronounceArr, replacePair)
	}



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
			
			result.onset = Util.nonNullableGet(first)
			result.medial = Util.nonNullableGet(intro1)
			result.vowel = Util.nonNullableGet(belly1)
			result.coda = Util.nonNullableGet(tail1)
			result.tone = Util.nonNullableGet(tone1)

			// result.p2 = Util.nonNullableGet(intro1+belly1)
			// result.p3 = Util.nonNullableGet(tail1+tone1)
		}
		//result 無whole字段、若傳入之oldSyllableObj有whole字段則能組合並返回一個完整的ChieneseSyllable對象
		return Object.assign(oldSyllableObj, result)
	}


	public static 三分(str:string,oldSyllableObj:ChieneseSyllable,pattern = /首1(.*?)首2(.*?)介腹1(.*?)介腹2(.*?)尾調1(.*?)尾調2/){
		const match = str.match(pattern);
		let result = new ChieneseSyllable()
		if(match){
			const [, 首,,介腹,,尾調] = match;
			result.onset = Util.nonNullableGet(首)
			result.p2 = Util.nonNullableGet(介腹)
			result.p3 = Util.nonNullableGet(尾調)
		}
		return Object.assign(oldSyllableObj, result)
	}

	public static getOccurrenceTimesMap(syllables:ChieneseSyllable[], field: keyof ChieneseSyllable){
		let strArr:string[] = []
		for(let i = 0; i < syllables.length; i++){
			try{
				let e = Util.nonNullableGet(syllables[i][field])
				strArr.push(e)
			}catch(e){
				console.error(field)
				console.error('i= '+i)
				console.error(syllables[i])
			}
		}
		return Util.mapOccurrenceTimes(strArr)
	}

	public static 批量取分割後ᵗ音節對象(){

	}


	public async countAll(){
		//<待做>{驗ᵣ重複項、濾除 碼潙空字串 者}
		await DictDb.castNull(this.dbObj.db, this.name, DictType.cn.freq, 0)
		await DictDb.deleteDuplication(this.dbObj.db, this.name)
		console.log(await DictDb.getDuplication(this.dbObj.db, this.name))
		this._無重複漢字數 = await DictDb.countDistinct(this.dbObj.db!, this.name, DictType.cn.char)
		this._無重複音節數 = await DictDb.countDistinct(this.dbObj.db!, this.name, DictType.cn.code)
		this._字頻總和 = await DictDb.getSum(this.dbObj.db, this.name, DictType.cn.freq)
		await this.assign_重碼頻數()
		this._加頻重碼率 = Util.nonFalseGet(this.重碼頻數) / Util.nonFalseGet(this.字頻總和)
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
		let seto = Util.getCombinationsWithRepetition(Dict.L_ALPHABET.split(''), 2)
		let creatSql = `CREATE TABLE '${newTableName}' AS SELECT * FROM '${this.name}';`
		//await DictDb.alterIntoAllowNull(this.dbObj.db, this.name, newTableName)
		let objs:DictDbRow[] = []
		for(let i = 0; i < seto.length; i++){
			let obj:DictDbRow = {char:'temp', code:seto[i].join('')}
			objs.push(obj)
		}
		await this.dbObj.insert(objs)
	}


	public static testMsoc(){
		function msocPreprocess(){
			return [
				{regex:/（.*?）/gm, replacement:''}, 
				{regex:/(.*)\*/gm, replacement:''},
				{regex:/[\[\]]/gm, replacement:''},
				{regex:/ɛ/gm, replacement:'e'},
				{regex:/ɔ/gm, replacement:'o'},
				{regex:/ʴ/gm, replacement:'r'},
				{regex:/ɹ/gm, replacement:'r'},
				{regex:/\(.*?\)/gm, replacement:''},
				{regex:/⁽.*?⁾/gm, replacement:''},
				{regex:/([aeiouə])i/gm, replacement:'$1j'},
				{regex:/([aeiouə])u/gm, replacement:'$1w'},
			] as RegexReplacePair[]
		}
		function 標記首介腹尾調(){
			return [
				//{regex:/(ˁ?[aeiouə])/gm, replacement:'腹1$1腹2'},
				//{regex:/(r)/gm, replacement:'介1$1介2'},
				{regex:/(r?ˁ?[aeiouə])/gm, replacement:'介腹1$1介腹2'},
				//{regex:/^(.*)介1/gm, replacement:'首1$1首2介1'},
				//{regex:/^(.*)腹1/gm, replacement:'首1$1首2腹1'},
				{regex:/^(.*)(介腹1)/gm, replacement:'首1$1首2$2'},
				{regex:/(介腹2)(.*)$/gm, replacement:'$1尾調1$2尾調2'},
			] as RegexReplacePair[]
		}
		
		let o = new Dict({
			rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_msoeg.dict.yaml'}),
			name:'msoc'
		})
		
		o.assign_pronounceArr()
		o.preprocess(msocPreprocess())
		//console.log(o.pronounceArr)
		//Dict.首介腹尾調_分割(o.pronounceArr, )
		
		//帶標記的讀音數組
		let marked = Util.serialReplace(o.pronounceArr, 標記首介腹尾調())
		let syllables:ChieneseSyllable[] = []
		for(let i = 0; i < marked.length; i++){
			let sy = Dict.三分(marked[i], new ChieneseSyllable())
			if(sy.onset === undefined){console.log(marked[i])}
			syllables.push(sy)
			//console.log(sy)//t
		}
		//console.log(syllables[4132])
		let m = Dict.getOccurrenceTimesMap(syllables, 'p3')
		console.log(Util.sortMapIntoObj(m))
		//console.log(syllables[1]['onset'])
		function 聲母合併(){
			return [
				{regex:/ʔɫ/gm, replacement:'ʔ'},
				{regex:/ŋɫ/gm, replacement:'ŋ'},
				{regex:/kʰɫ/gm, replacement:'kʰj'},

			] as RegexReplacePair[]
		}
	}

	public static saffesToOc(){
		const replacePair:RegexReplacePair[] = require('./saffesToOcRegex')
		const replacePair2:RegexReplacePair[] = require('./ocToOc3')
		let o = new Dict({
			rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\saffes.dict.yaml'}),
			name:'saffes'
		})
		
		o.assign_pronounceArr()
		o.pronounceArr = o.pronounceArr.map((e)=>{return e.toUpperCase()})
		o.preprocess(replacePair)
		o.preprocess(replacePair2)
		//console.log(o.pronounceArr)
		Util.printArr(o.pronounceArr, '\t')
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
		Util.printArr(o.pronounceArr, '\t')
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
		this.srcStr = fs.readFileSync(Util.pathAt(path), 'utf-8')
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
		let tr = Util.transpose(body)
		return Util.serialReplace(tr[index], replacePair)
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



	public static async isTableExist(db:Database, tableName:string){
		let sql = `SELECT name FROM sqlite_master WHERE  type='table' AND name='${tableName}';`
		
		return new Promise<boolean>((resolve, reject)=>{
			
			db.get(sql, (err, result:any)=>{
				
				if(err){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw err
				}
				if(!result){
					resolve(false)
					return false
				}
				console.log(result)
				//console.log(result)
				/* if(!result || !result.hasOwnProperty('name')){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw new Error(`!result.hasOwnProperty('name')`)
				} */
				if(result.name === tableName){
					resolve(true)
					return true
					//return true
				}else{
					console.log('<result>')
					console.log(result)
					console.log('</result>')
					console.log('<tableName>')
					console.log(tableName)
					console.log('</tableName>')
					throw new Error('意外')
					//return false
				}
				//resolve(result as string)
			})
			
		})
	}

	public async isTableExists(tableName = this.tableName){
		//写一个同步的typescript函数、判断一个sqlite数据库是否含有某表
		if(!this.db){throw new Error('!this.db')}
		if(!tableName){return false}
		return DictDb.isTableExist(this.db, tableName)
	}


	public async creatTable(tableName = this.tableName){
		
		let sql:string = `CREATE TABLE [${tableName}] ( \
${cn.id} INTEGER PRIMARY KEY AUTOINCREMENT, \
${cn.char} VARCHAR(1024) NOT NULL, \
${cn.code} VARCHAR(64) NOT NULL, \
${cn.ratio} VARCHAR(64) \
)`

		return new Promise((s,j)=>{
			
			Util.nonFalseGet(this.db).run(sql, (err)=>{
				if(err){j(err);return}
				console.log('at\t'+this.dbPath)
				s(sql+'成功')
			})
			
		})
		//IF NOT EXISTS 
		
		//this.db.exec(testCreat)
	}

	/**
	 * 手動封裝的TRANSACTION
	 * @param db 
	 * @param sql 
	 * @param values 
	 * @returns 
	 */
	public static async transaction<T>(db:Database, sql:string, values:any[]){
		let result:T[] = []
		return new Promise<T[]>((s,j)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
				const stmt = db.prepare(sql, (err)=>{
					if(err){console.error(sql+'\n'+err+'\n');j(err);return} //<坑>{err+''後錯ᵗ訊會丟失行號 勿j(sql+'\n'+err)}
				})
				for(let i = 0; i < values.length; i++){
					stmt.each(values[i], (err, row:T)=>{
						if(err){console.error(sql+'\n'+err+'\n');j(err);return}
						result.push(row)
						//console.log(row)//t
					})

				}
				db.all('COMMIT', (err,rows)=>{
					if(err){console.error(sql+'\n'+err+'\n');j(err);return}
					s(result)
				})
			})
			
		})
		
	}

	
	

	public async insert(data:DictDbRow[]|string[][]){
		return new Promise((s,j)=>{
			Util.nonFalseGet(this.db)
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
		Util.nonFalseGet(this.db)
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
		let b1 = await DictDb.isColumnExist(db, tableName ,cn.freq)
		let b2 = await DictDb.isColumnExist(db,tableName ,cn.essay_id)
		if(!b1 || !b2){
			let altSql = new Array<string>()
			altSql[0] = `ALTER TABLE '${tableName}' ADD COLUMN '${cn.freq}' INTEGER`
			altSql[1] = `ALTER TABLE '${tableName}' ADD COLUMN ${cn.essay_id} INTEGER REFERENCES ${essayTableName}(id) ON DELETE SET NULL`
			await DictDb.all(db, altSql[0])
			await DictDb.all(db, altSql[1])
			
		}
		let attachSql = `UPDATE '${tableName}' \
\ SET ${cn.freq} = CAST(COALESCE(${essayTableName}.${cn.code}, '') AS INTEGER) \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`//不使用外鍵、已棄用

		let attachSql2 = `UPDATE '${tableName}' \
\ SET ${cn.essay_id} = COALESCE(${essayTableName}.${cn.id}, '') \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`
		DictDb.all(db, attachSql)
		DictDb.all(db, attachSql2)
	
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
		let sql = `SELECT ${column} AS result FROM '${table}'`
		let result = await DictDb.all<{result?:string}>(db, sql)
		let strArr:string[] = []
		for(let i = 0; i < result.length; i++){
			if(!result[i].result){Promise.reject('!result[i].result');return}//似無用
			strArr.push(result[i].result!)
		}
		if(strArr.length !== result.length){Promise.reject('strArr.length !== result.length');return}
		let newStrArr = Util.serialReplace(strArr, replacementPair)
		let replaceMap:Map<string, string> = new Map()
		for(let i = 0; i < newStrArr.length; i++){
			replaceMap.set(strArr[i], newStrArr[i])
		}
		db.serialize(()=>{
			db.run('BEGIN TRANSACTION');
			//let updateSql = `UPDATE '${table}' SET ${column} = (CASE WHEN ${column}=? THEN ? END)`
			let updateSql = `UPDATE '${table}' SET ${column} = ? WHERE ${column}= ?`
			const stmt = db.prepare(updateSql)
			for(const[k,v] of replaceMap){
				stmt.run([v,k], (err)=>{
					if(err){
						console.error(updateSql)
						console.error([v,k])
						Promise.reject(err);return
					}
				})
			}
			db.run('COMMIT', (err)=>{
				if(err){Promise.reject(err);return}
			})
		})
	}

	public static toObjArr(strArr:string[][]):DictDbRow[]{
		let result:DictDbRow[] = []
		for(let i = 0; i < strArr.length; i++){
			//let obj = {columnName.char: Util.arrAt(strArr,i,0), "pronounce": strArr[i][1]??''}
			//let obj:DictDbRow = {char:Util.arrAt(strArr,i,0), code: strArr[i][1]??''}
			let obj:DictDbRow = {char:Util.nonFalseGet(strArr[i][0]), code: strArr[i][1]??''} //[23.07.31-0931,]
			result.push(obj)
		}
		return result
	}

	public static async getTableInfo(db:Database, tableName:string, columnName:string):Promise<SqliteTableInfo|undefined>
	public static async getTableInfo(db:Database, tableName:string):Promise<SqliteTableInfo[]>
	public static async getTableInfo(db:Database, tableName:string, columnName?:string){
		const sql = `PRAGMA table_info('${tableName}')`
		let prms = DictDb.all<SqliteTableInfo>(db,sql)
		if(columnName){
			let infos = await prms
			for(let i = 0; i < infos.length; i++){
				if(infos[i].name === columnName){
					return infos[i]
				}
			}
			return undefined
		}else{
			
			return prms
		}

	}

	public static async isColumnExist(db:Database, tableName:string, columnName:string){
		let tableInfo = await DictDb.getTableInfo(db, tableName)
		for(let i = 0; i < tableInfo.length; i++){
			if(tableInfo[i].name === columnName){
				return true
			}
		}
		return false
	}

	public static async qureySqlite_sequence(db:Database){
		let sql = `SELECT * FROM sqlite_sequence`
		return /* await */ DictDb.all<DictType.Sqlite_sequence>(db, sql)
	}

	public static async querySqlite_master(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ DictDb.all<DictType.Sqlite_master>(db, sql)
	}

	public static async DropAllTables(db:Database){
		let tableNames:string[] = []
		let info = await DictDb.querySqlite_master(db)
		//let prms:Promise<any>[] = []
		for(let i = 0; i < info.length;i++){
			//prms.push(DictDb.DropTable(db,seqs[i].name))
			if(info[i].type === 'table' && info[i].name !== 'sqlite_sequence' && info[i].name !== 'sqlite_master')
			{tableNames.push(info[i].name)}
		}
		return DictDb.DropTable(db,tableNames)
		//return Promise.all(prms)
	}

	public static async DropTable(db:Database, tableName:string|string[]){
		if(Array.isArray(tableName)){
			// let sql = `DROP TABLE ?;`
			// let v:string[] = tableName
			// return DictDb.transaction(db, sql, v) <坑>{蓋佔位符ˉ?皆不可㕥代表名}
			let prms:Promise<any>[] = []
			for(let i = 0; i < tableName.length; i++){
				let sql = `DROP TABLE '${tableName[i]}';`
				//console.log(sql)
				//DictDb.all(db,sql).then(()=>{})//t
				prms.push(DictDb.all(db,sql))
			}
			//console.log(114514)

			return Promise.all(prms)
		}else{
			let sql = `DROP TABLE ${tableName};`
			return DictDb.all(db, sql)
		}
	}

	/**
	 * 先盡刪表、然後把整個User_Data下的.dict.yaml文件 字表的有效部分添進數據庫
	 * @param userPath User_Data的絕對路徑
	 */
	public static async testAll(db:Database, userPath:string='D:/Program Files/Rime/User_Data'){
		await DictDb.DropAllTables(db)
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

	/**
	 * 把八股文(字頻表)加進數據庫裏、表名命名爲essay
	 * @param path 
	 */
	public static async putEssay(db:Database, path=new DictDb({}).essayPath, essayName='essay'){
		return new Promise(async(s,j)=>{
			let b = await DictDb.isTableExist(db, essayName)
			//if(!b){await DictDb.quickStart(path,essayName)}
			if(!b){await DictDb.putNewTable(new DictRaw({srcPath:path, name:essayName}))}
			s(0)
		})
	}

	/**
	 * 統計表的某列中不重樣的值的數量
	 * @param tableName 
	 * @param columnName 不填列名則每一列都會被統計
	 * @returns 
	 */
	public static async countDistinct(db:Database,tableName:string):Promise<{column_name:string, distinct_count:number}[]>
	public static async countDistinct(db:Database,tableName:string, columnName:string):Promise<number>;
	
	public static async countDistinct(db:Database, tableName:string, columnName?:string){
		if(columnName){
			let sql = `SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
			let r = (await DictDb.all<{distinct_count:number}>(db, sql))[0].distinct_count
			return r
		}else{
			let tableInfo = await DictDb.getTableInfo(db, tableName)
			let sql = ''
			//`SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
			for(let i = 0; i < tableInfo.length; i++){
				//console.log(i)
				//console.log(tableInfo[i])
				columnName = tableInfo[i].name
				sql += `SELECT '${columnName}' AS column_name, COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
				if(i !== tableInfo.length-1){sql += ' UNION '}
				else{/* sql += ORDER BY column_name; */}
			}
			
			return await new Promise<{column_name:string, distinct_count:number}[]>((s,j)=>{
				
				db.all(sql, (err, rows:{column_name:string,distinct_count:number}[])=>{
					if(err || rows.length !== tableInfo.length){
						console.error('<sql>');console.error(sql);console.error('</sql>')
						console.error('<tableInfo>');console.error(tableInfo);console.error('</tableInfo>')
						console.error('<rows>');console.error(rows);console.error('</rows>')
						console.error('|| rows.length !== tableInfo.length')
						j(err);
						return
					}
					s(rows)
				})
			})
		}
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
		return DictDb.all<{code:string, freq_of_homo:number}>(db, sql1)

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

	/**
	 * 對某列求和、支持字符串轉數字
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @returns 
	 */
	public static async getSum(db:Database, tableName:string, columnName:string):Promise<number>{
		let sql = `SELECT SUM(CASE \
WHEN '${tableName}' NOT NULL AND ${columnName} GLOB '*[0-9]*' \
THEN CAST(${columnName} AS INTEGER) \
ELSE 0 \
END) AS sum_result \
FROM '${tableName}';`
		return (await DictDb.all<{sum_result:number}>(db, sql))[0].sum_result
	}

	/**
	 * 把一列中的null值轉爲指定值
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @param target 
	 * @returns 
	 */
	public static async castNull(db:Database, tableName:string, columnName:string, target:any){
		let sql = `UPDATE '${tableName}' SET ${columnName} = \ 
CASE WHEN ${columnName} IS NULL THEN ${target} ELSE ${columnName} END;`
		return DictDb.all(db, sql)
	}


	/**
	 * 封在Promise裏的db.all()、方便在異步函數裏用await取值。
	 * @param db Database 實例
	 * @param sql 
	 * @param params 
	 * @returns 
	 */
	public static all<T>(db:Database, sql:string, params?:any){
		//console.log(sql)//t
		return new Promise<T[]>((s,j)=>{
			db.all(sql, params,(err,rows:T[])=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				//console.log(rows)//t
				s(rows)
			})
		})
	}

	public static async alterIntoAllowNull(db:Database, tableName:string, columnName:string){
		let info = await DictDb.getTableInfo(db, tableName, columnName)
		let type = Util.nonNullableGet(info).type
		let sql = `ALTER TABLE '${tableName}' MODIFY COLUMN ${columnName} ${type}`
		return DictDb.all(db, sql)
	}

	public static async copyTransDb(targetDb:Database, srcDb:Database, srcTableName:string){

		//await DictDb.all(targetDb)
	}

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
	// 	let result1 = await DictDb.all<DictDbRow & {position:number}>(db, getSql(phoneme1))
	// 	let result2 = await DictDb.all<DictDbRow & {position:number}>(db, getSql(phoneme2))
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
			let result1 = await DictDb.all<DictDbRow & {position:number}>(db, getSql(phoneme1))
			let result2 = await DictDb.all<DictDbRow & {position:number}>(db, getSql(phoneme2))
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
					let s = Util.nonNullableGet(result1[i][columnName])
					s = Util.spliceStr(s, result1[i].position, phoneme1.length, phoneme2)
					strToBeQueriedForP2.push(s)
				}
				return strToBeQueriedForP2
			}
			let strToBeQueriedForP2:string[] = getStrToBeQueried(result1, phoneme1, phoneme2)
			console.log(`console.log(strToBeQueriedForP2)`)
			console.log(strToBeQueriedForP2)//t
			if(strToBeQueriedForP2.length !== result1.length){Promise.reject('')}
			let sql = `SELECT * FROM '${tableName}' WHERE ${columnName}=?`
			return await DictDb.transaction<DictDbRow>(db, sql, strToBeQueriedForP2)
		}
		let r2 = await getR2(phoneme1, phoneme2)
		console.log(r2.length)
		let r1 = await getR2(phoneme2, phoneme1)
		console.log(r1.length)
		// for(let i = 0; i < r1.length; i++){
		// 	console.log(r1[i])
		// 	console.log(r2[i])
		// }
		return Util.transpose([r1,r2])
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
		let p1Indexes:number[] = []

		//把音位一替換成音位二後所得字串 所成數組
		let strToBeQueried:string[] = []
		let p1objs:{p1Index:number, strToBeQueried:string}[] = []
		let p1Rows:DictDbRow[] = []
		//獲取 數據庫中 音 對 id 之映射。緣有同音字、 一 音 可能 對應 多個 id
		let mapCodeToIds = new Map<string, number[]>()
		for(let i = 0; i < rows.length; i++){
			if(!rows[i].code){continue}
			let k:string = rows[i].code!
			let eOfV:number = rows[i].id!
			if(mapCodeToIds.has(k)){
				let v:number[] = mapCodeToIds.get(k)!;
				v?.push(eOfV)
				mapCodeToIds.set(k,v!)
			}else{
				mapCodeToIds.set(k, [eOfV])
			}
		}
		let testMap = Util.mapFields(rows, 'code', 'id')
		console.log(`console.log(testMap)`)
		console.log(testMap)//t
		
		//console.log(mapCodeToIds)//t
		//邊歷數據庫每一行、尋 strToBeQueried
		for(let i = 0; i < rows.length; i++){
			if(!rows[i].code){continue}
			let curCode = rows[i].code!
			re1.lastIndex = 0;
			//let result = re1.exec(rows[i].code??'')

			if(re1.test(curCode)){
				
				p1Indexes.push(i)
				let s = curCode.replace(re1, '$1'+p2+'$3')
				strToBeQueried.push(s)
				let tempP1Obj = {p1Index:i, strToBeQueried:s}
				p1objs.push(tempP1Obj)
				p1Rows.push(rows[i])
			}
		}
		let resultIds1:number[][] = [] 
		let resultIds2:number[][] = [] 
		for(let i = 0; i < p1objs.length; i++){
			let curCode = p1objs[i].strToBeQueried
			let ids = mapCodeToIds.get(curCode)
			if(ids){
				//let tempResult1 = p1objs[i].p1Index
				resultIds1.push([p1Rows[i].id!])
				resultIds2.push(ids)
			}
		}
		{
			p1:'park'
			p2:'bark'
			id1:[] //讀音爲p1的諸字的id之集
			id2:[]
		}[]
		//<待改>{返回ᵗ格式:}
		return [resultIds1, resultIds2]
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

