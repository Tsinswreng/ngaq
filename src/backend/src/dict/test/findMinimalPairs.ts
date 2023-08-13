require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Util from '@shared/Util';
import { DictDb, DictRaw, Dict, MinimalPairUtil } from "../../dict/Dict";
//import Txt from "../../shared/Txt";


import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow } from '../../dict/DictType';
const rootDir:string = require('app-root-path').path
Error.stackTraceLimit = 50;

async function debug(){
	//let name = 'OC_schuesslerOC'
	// let srcPath = "D:\\Program Files\\Rime\\User_Data\\OC_baxter-sagart.dict.yaml"
	// let raw = new DictRaw({srcPath:srcPath})
	// //let name = 'OC_msoeg'
	// let db = new DictDb({})
	// //await DictDb.DropAllTables(db.db)
	// let dict = new Dict({name:raw.name})
	// await DictDb.putNewTable(raw)
	// await DictDb.attachFreq(db.db, raw.name!)
	// await dict.countAll()
	// console.log(dict)
	//console.log()
	//let pair = await DictDb.findMinimalPairs_old(new DictDb({}).db, 'OC_msoeg', 'code', 'n̥', 'm̥')
	let db = new DictDb({}).db
	let table =  'OC_msoeg' //'saffes'
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
	
	
	

	//console.log(MinimalPairUtil.sumFreq_deprecated(pair)/freqSum * 100 +'%')
	
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

	//DictDb.serialReplace(new DictDb({}).db, 'OC_msoeg', 'code', msocPreprocess()).catch((e)=>{console.error(e)})
}
debug()