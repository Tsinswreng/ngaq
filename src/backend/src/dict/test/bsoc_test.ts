require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Ut from 'Ut';
import { DictDb, DictRaw, Dict, MinimalPairUtil,ChieneseSyllable } from "../../dict/Dict";
//import Txt from "../../shared/Txt";


import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow } from '../../dict/DictType';
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
Error.stackTraceLimit = 50;

async function minimalPairs(){
	let db = new DictDb({}).db
	let table =  'bsoc' //'saffes'
	let rows = await DictDb.all<DictDbRow>(db, `SELECT * FROM ${table}`)
	let pairs = await DictDb.findMinimalPairs(rows, '^()(ɫ̥)(.*)$', 'w̥')
	let freqSum = await DictDb.getSum(new DictDb({}).db, table, 'freq')
	let sumArr = await MinimalPairUtil.sumFreq(db, table, pairs)
	console.log(`console.log(pairs)`)
	console.log(pairs)
	console.log(`console.log(pairs.length)`)
	console.log(pairs.length)
	console.log(`console.log(sumArr)`)
	console.log(sumArr)
	console.log([sumArr[0]/freqSum*100+'%',sumArr[1]/freqSum*100+'%'])
	console.log(((sumArr[0]+sumArr[1])/freqSum)*100+'%')
	console.log(`console.log(freqSum)`)
	console.log(freqSum)
}

class Bsoc{
	public static 預處理:RegexReplacePair[] = [
		{regex:/g/gm, replacement:'ɡ'},
		{regex:/ˤ/gm, replacement:'ˁ'},
		{regex:/(.*)(ə)(.+)([Aaeiouə])(.*)/gm, replacement:'$1ɐ$3$4$5'},
		{regex:/.*\*/gm, replacement:''},
		{regex:/[\(\)\[\]\.\-<>]/gm, replacement:''},
	]

	public static 合併聲母:RegexReplacePair[]=[
		{regex:/S/gm, replacement:'s'},
		{regex:/ˁr([Aaeiouə])/gm, replacement:'$1'},
		{regex:/ˁ([Aaeiouə])/gm, replacement:'$1'},
		{regex:/^(.+)r([Aaeiouə])/gm, replacement:'$1$2'},

		


		{regex:/ɐ/gm, replacement:''},
		{regex:/C/gm, replacement:''},
		{regex:/([mnN])([bdɡ])/gm, replacement:'$2'},
		{regex:/([mnN])(p)/gm, replacement:'b'},
		{regex:/([mnN])(t)/gm, replacement:'d'},
		{regex:/([mnN])(k)/gm, replacement:'ɡ'},
		//{regex:/([mnN])(q)/gm, replacement:'ɢ'},
		//{regex:/tk/gm, replacement:'k'},
	]

	public static 拆分聲母:RegexReplacePair[]=[
		
		{regex:/(.*)([Aaeiouə])(.*)/gm, replacement:'首一$1首二腹一$2腹二尾一$3尾二'},
	]

	public static run(){
		let o = new Dict({
			rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_baxter-sagart.dict.yaml'}),
			name:'OC_baxter-sagart'
		})
		o.assign_pronounceArr()
		o.preprocess(this.預處理)
		
		o.preprocess(this.合併聲母)
		let marked = Ut.serialReplace(o.pronounceArr, this.拆分聲母)
		let syllables = Dict.三分arr(marked, /首一(.*?)首二(.*?)腹一(.*?)腹二(.*?)尾一(.*?)尾二/)
		let m = Dict.getOccurrenceTimesMap(syllables, 'onset')
		let 聲母出現次數 = Ut.sortMapIntoObj(m)
		聲母出現次數.forEach((e)=>{console.log(e)})
		console.log(`console.log(聲母出現次數.length)`)
		console.log(聲母出現次數.length)
		//Util.printArr(o.pronounceArr, '\t')
	}

	public static async minimalPairs(){
		//DictDb.serialReplace(new DictDb({}).db, 'bsoc', 'code', Bsoc.預處理)
		let db = new DictDb({})
		let table = 'bsoc'
		let rows = await DictDb.all<DictDbRow>(db.db,`SELECT * FROM '${table}'`)
		let pairs = DictDb.findMinimalPairs(rows, '^()(st)(.*)$', 'l̥')
		console.log(pairs)
		//DictDb.attachFreq(db.db, name)
		//let result = await MinimalPairUtil.sumFreq(db.db, table, pairs)
		//console.log(result)

		let freqSum = await DictDb.getSum(new DictDb({}).db, table, 'freq')
		let sumArr = await MinimalPairUtil.sumFreq(db.db, table, pairs)
		console.log(`console.log(pairs)`)
		console.log(pairs)
		console.log(`console.log(pairs.length)`)
		console.log(pairs.length)
		console.log(`console.log(sumArr)`)
		console.log(sumArr)
		console.log([sumArr[0]/freqSum*100+'%',sumArr[1]/freqSum*100+'%'])
		console.log(((sumArr[0]+sumArr[1])/freqSum)*100+'%')
		console.log(`console.log(freqSum)`)
		console.log(freqSum)
	}

}
//Bsoc.run()
Bsoc.minimalPairs()