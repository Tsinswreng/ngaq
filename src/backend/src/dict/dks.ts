require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Ut from 'Ut';
import { DictDb, DictRaw, Dict, MinimalPairUtil,ChieneseSyllable } from "./Dict";

//import Txt from "../../shared/Txt";


import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow, cn } from 'Type';
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
import {replacePair as saffesToOcRegex} from './regex/saffesToOcRegex'
import {replacePair as ocToOc3} from './regex/ocToOc3'
import { replacePair as cangjieRegex } from './regex/cangjie';
import moment = require('moment');
import Sqlite from 'db/Sqlite';

Error.stackTraceLimit = 50;

// async function run(){
// 	//await DictDb.putNewTable(new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\msdks.dict.yaml'}))
// 	//await DictDb.putNewTable(new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'}))
// 	//await DictDb.attachFreq(new DictDb({}).db, 'essay2')
// 	let o = new Dict({
// 		rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\saffes.dict.yaml'}),
// 		name:'dks'
// 	})
// 	o.assign_pronounceArr()
// 	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toUpperCase()}) //轉大寫
// 	o.preprocess(saffesToOcRegex)
// 	//o.pronounceArr = Util.serialReplace(o.pronounceArr, saffesToOcRegex)
// 	o.preprocess(ocToOc3)
// 	//console.log(saffesToOcRegex)
// 	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toLowerCase()}) //轉小寫
// 	console.log(o.pronounceArr)
// let 碼表頭 = ''
// //加頻重碼率算法有問題。蔿已有的字新增讀音不應使重碼率下降。
	
// 	let path = 'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'
// 	let db = new DictDb({}).db
// 	let table = 'dks'
// 	o.outputToFile(path, 碼表頭)
	
// 	await DictDb.putNewTable(new DictRaw({srcPath:path}))
// 	await DictDb.attachFreq(db, table)
// 	await o.countAll()
// 	console.log(o.加頻重碼率)
// 	async function p(){
// 		let rows = await DictDb.selectAll(db, table)
// 		let pairs = await DictDb.findMinimalPairs(rows, '^()(a)(.*)$', 'x')
// 		console.log(pairs)
// 		let freqSum = await DictDb.getSum(new DictDb({}).db, table, 'freq')
// 		let sumArr = await MinimalPairUtil.sumFreq(db, table, pairs)
// 		console.log(`console.log(pairs)`)
// 		console.log(pairs)
// 		console.log(`console.log(pairs.length)`)
// 		console.log(pairs.length)
// 		console.log(`console.log(sumArr)`)
// 		console.log(sumArr)
// 		console.log([sumArr[0]/freqSum*100+'%',sumArr[1]/freqSum*100+'%'])
// 		console.log(((sumArr[0]+sumArr[1])/freqSum)*100+'%')
// 		console.log(`console.log(freqSum)`)
// 		console.log(freqSum)
// 	}
// 	await DictDb.dropTable(db, table)
// }
// //run()

class Dks{
	static dksPath = 'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'
	static saffesPath = rootDir+'/src/backend/src/dict/原表/saffes.dict.yaml'
	static dkzPath = rootDir+'/src/backend/src/dict/原表/dkz.dict.yaml'
	static dkpPath = rootDir+'/src/backend/src/dict/原表/dkp.dict.yaml'
	static targetDkpPath = 'D:\\Program Files\\Rime\\User_Data\\dkp.dict.yaml'
	static cangjiePath = rootDir+'/src/backend/src/dict/原表/cangjie7-1含五六相異者.yaml'
	static 輔助碼dictName = 'dks_v'
	static 輔助碼dictPath = `D:\\Program Files\\Rime\\User_Data\\${Dks.輔助碼dictName}.dict.yaml`
	static db = new DictDb({})
	static dksHead = 
`
#${moment().format('YYYYMMDDHHmmss')}
#
# Rime dictionary
# vim: set ts=8 sw=8 noet:
# encoding: utf-8
#匪漢字:[\\x00-\\xff]
#詞:[^\\x00-\\xff]{2,}.*
#空行:^.*\\r\\n$
---
name: dks
version: ""
sort: by_weight
use_preset_vocabulary: true
import_tables:  #加載其它外部碼表 似不支持多級引入
  #- cangjie7-1ForLookUp2
  - nonKanji
  - chineseDict
...
`
	tempTable:string = ''
	saffes = new Dict({rawObj:new DictRaw({srcPath:Dks.saffesPath})})
	dkp = new Dict({rawObj:new DictRaw({srcPath:Dks.dkpPath})})
	dkz?:Dict
	cangjie = new Dict({rawObj: new DictRaw({srcPath: Dks.cangjiePath})})
	assign_dkz(){
		this.dkz = new Dict({rawObj:new DictRaw({srcPath:Dks.dkzPath})})
	}

	saffesToDkz(){
		//console.log(1919)
		let saffes = this.saffes
		saffes.assign_pronounceArr()
		saffes.pronounceArr = saffes.pronounceArr.map((e)=>{return e.toUpperCase()})
		saffes.preprocess(saffesToOcRegex)

		saffes.outputToFile(Dks.dkzPath, Dict.getSimpleHead('dkz'))

		//console.log(114514)
		//console.log(saffes.pronounceArr)//t
		//Txt.mergeArrIntoStr()
	}

	getCharOfDkp(){
		let dkp = this.dkp
		//console.log(`console.log(dkp.rawObj.validBody)`)
		//console.log(dkp.rawObj.validBody)
		let charSet = Ut.transpose(dkp.rawObj.validBody, '')[0]
		//charSet = Array.from(new Set([...charSet]))
		//console.log(`console.log(charSet)`)
		//Util.printArr(charSet)
		return charSet
	}

	async putTempInDb(body:string[][]){
		this.tempTable = 'temp'+moment().format('YYYYMMDDHHmmss')
		await DictDb.creatTable(Dks.db.db, this.tempTable)
		let columns = cn.char+','+cn.code+','+cn.ratio
		let sql = `INSERT INTO '${this.tempTable}' (${columns}) VALUES (?,?,?)`
		return Sqlite.transaction(Dks.db.db, sql, body)
	}
	
	async putDkzInDb(){
		this.assign_dkz()
		let dkz = this.dkz
		let body = Ut.transpose(dkz!.rawObj.validBody, '').slice(0,3)
		body = Ut.transpose(body)
		//console.log(body)
		return this.putTempInDb(body)
	}

	static async putTempInDb(body:string[][]){
		let tempTable = 'temp'+moment().format('YYYYMMDDHHmmss')
		await DictDb.creatTable(Dks.db.db, tempTable)
		let columns = cn.char+','+cn.code+','+cn.ratio
		let sql = `INSERT INTO '${tempTable}' (${columns}) VALUES (?,?,?)`
		await Sqlite.transaction(Dks.db.db, sql, body)
		return tempTable
	}

	static 取表身ᵗ前三列(body:string[][]){
		return Ut.transpose(Ut.transpose(body, '').slice(0,3))
	}





	async removeCharsInDb(table:string, chars:string[]){
		let sql = `DELETE FROM '${table}' WHERE ${cn.char}=?`
		return Sqlite.transaction(Dks.db.db, sql, chars)
	}

	async dropTempTable(){
		let sql = `DROP TABLE '${this.tempTable}'`
		return Sqlite.all(Dks.db.db, sql)
	}

	async updateDkzFile(){
		
		let charsToBeRemoved = this.getCharOfDkp()
		await this.removeCharsInDb(this.tempTable, charsToBeRemoved)
		let strArr = await Sqlite.toStrTable(Dks.db.db, this.tempTable, [cn.char, cn.code, cn.ratio])
		let dkpBody = this.dkp.rawObj.validBody
		let dkpStr = Txt.mergeArrIntoStr(dkpBody)
		//console.log(dkpStr)//t
		let str = Txt.mergeArrIntoStr(strArr)
		str = Dict.getSimpleHead('dkz')+'\n'+dkpStr+'\n'+str
		//console.log(`console.log(str)`)
		//console.log(str.slice(0,999))
		fs.writeFileSync(Dks.dkzPath, str)
	}

	updateDks(){
		this.assign_dkz()
		let dkz = Ut.nng(this.dkz)
		dkz.assign_pronounceArr()
		//this.dkz.pronounceArr = this.dkz.pronounceArr.map((e)=>{return e.toUpperCase()})
		dkz.preprocess(ocToOc3)
		dkz.pronounceArr = dkz.pronounceArr.map((e)=>{return e.toLowerCase()})
		//console.log(`console.log(this.dkz.rawObj.validBody)`)
		//console.log(dkz.rawObj.validBody)
		//console.log(`console.log(this.dkz.pronounceArr)`)
		//console.log(this.dkz.pronounceArr)
		dkz.outputToFile(Dks.dksPath, Dks.dksHead)
	}

	copyDkp(){
		fs.copyFileSync(Dks.dkpPath, Dks.targetDkpPath)
	}

	async countRate(){
		let tempTable = 'temp2_'+moment().format('YYYYMMDDHHmmss')
		let o = new Dict(new DictRaw({srcPath:Dks.dksPath, name:tempTable}))
		await DictDb.putNewTable(new DictRaw({srcPath:Dks.dksPath, name:tempTable}))
		await DictDb.attachFreq(Dks.db.db, tempTable)
		await o.countAll()
		console.log(`console.log(o.無重複漢字數)`)
		console.log(o.無重複漢字數)
		console.log(`console.log(o.無重複音節數)`)
		console.log(o.無重複音節數)
		console.log(`console.log(o.加頻重碼率)`)
		console.log(o.加頻重碼率)
		let min = 950
		let 頻ˋ大於950之字ᵗ頻ᵗ和 = await o.get_字頻總和(min)
		let 頻ˋ大於950之字ᵗ重碼頻數 = await o.get_重碼頻數(min)
		let 頻ˋ大於950之字ᵗ加頻重碼率 = 頻ˋ大於950之字ᵗ重碼頻數/頻ˋ大於950之字ᵗ頻ᵗ和
		console.log(`console.log(頻于前950之字ᵗ加頻重碼率)`)
		console.log(頻ˋ大於950之字ᵗ加頻重碼率)

		await Sqlite.dropTable(Dks.db.db, tempTable)
	}




	static async run(){
		let o = new Dks()
		
		o.saffesToDkz()
		await o.putDkzInDb()
		await o.updateDkzFile()
		// //console.log(114514)
		o.updateDks()
		console.log(`o.updateDks() done`)

		let dks = new Dict({rawObj:new DictRaw({srcPath:Dks.dksPath})})
		await AttachCangjie.run(dks, this.輔助碼dictPath, Dict.getSimpleHead(Dks.輔助碼dictName)).then(()=>{console.log(`輔助碼完成`)})
		// 改left join
		o.copyDkp()
		o.countRate()
		o.dropTempTable().then()
	}
}

class AttachCangjie{
	cangjie = new Dict({rawObj: new DictRaw({srcPath: Dks.cangjiePath})})
	tempTable_cangjie:string = ''
	tempTable_src:string = ''
	tempTable_Join = ''
	srcDict = new Dict({})
	db = new DictDb({})
	targetPath:string = ''
	targetDict = new Dict({})
	targetHead = Dict.getSimpleHead('')
	constructor(props?:Partial<AttachCangjie>){
		Object.assign(this,props)
	}
	preprocess(){
		this.cangjie.assign_pronounceArr()
		this.cangjie.preprocess(cangjieRegex)
		
	}

	async putCangjieInDb(){
		let body = Dks.取表身ᵗ前三列(this.cangjie.recoverBody())
		this.tempTable_cangjie = await Dks.putTempInDb(body)
	}

	async putSrcDictInDb(){
		let body = Dks.取表身ᵗ前三列(this.srcDict.rawObj.validBody)
		this.tempTable_src = await Dks.putTempInDb(body)
	}

	async leftJoin(){
		console.log(114514)
		function getSql(fromTable:string, tableB:string, onEqual=cn.char){
			return `SELECT a.*, b.code as b_code FROM '${fromTable}' a LEFT JOIN '${tableB}' b ON a.${onEqual}=b.${onEqual}`
		}
		this.tempTable_Join = `temp${Ut.YYYYMMDDHHmmssSSS()}`
		let creatSql = `CREATE TABLE '${this.tempTable_Join}' AS ` + getSql(this.tempTable_src, this.tempTable_cangjie)
		return Sqlite.all(this.db.db, creatSql)
		//return DictDb.all<DictDbRow & {b_code:string}>(this.db.db, getSql(this.tempTable_src, this.tempTable_cangjie))
	}

	async toTargetBody(){
		let strArr = await Sqlite.toStrTable(this.db.db, this.tempTable_Join, [cn.char, cn.code, 'b_code', cn.ratio])
		let 合併列:string[][] =[]
		for(let i = 0; i < strArr.length; i++){
			// for(let j = 0; j < strArr[i].length; i++){

			// }
			合併列[i] = []
			合併列[i][0] = strArr[i][0]
			合併列[i][1] = strArr[i][1]
			合併列[i][1] += strArr[i][2] // 合併每一行的code和b_code到同一格子裏
			合併列[i][2] = strArr[i][3]
		}
		return 合併列
	}

	async dropTempTable(){
		await Sqlite.dropTable(this.db.db, this.tempTable_cangjie)
		await Sqlite.dropTable(this.db.db, this.tempTable_src)
		await Sqlite.dropTable(this.db.db, this.tempTable_Join)
	}



	static async run(srcDict:Dict, targetPath:string, head:string){
		let o = new AttachCangjie({srcDict:srcDict, targetPath:targetPath, targetHead:head})
		o.preprocess()
		await o.putCangjieInDb()
		await o.putSrcDictInDb()
		await o.leftJoin()
		let body = await o.toTargetBody()
		let data = o.targetHead+'\n'+Txt.mergeArrIntoStr(body)
		fs.writeFileSync(o.targetPath, data)
		o.dropTempTable().then()
	}




}

//Dks.saffesToDkz()
Dks.run()


/*

# 的	a
# 一	a
# 是	a
# 了	a
# 我	a
# 有	a
# 啊	a
# 在	a


*/