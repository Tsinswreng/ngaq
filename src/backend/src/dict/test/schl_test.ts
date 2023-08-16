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

async function schl_test(){
	let db = new DictDb({})
	let 預處理:RegexReplacePair[] = [
		{regex:/(.*)\*/gm, replacement:''},
		{regex:/(.)̂/gm, replacement:'ˁ$1'},
		//{regex:/(ja)/gm, replacement:'A'},
	]
	let 標記首介腹尾調:RegexReplacePair[] = [
		//{regex:/(ˁ?[aeiouə])/gm, replacement:'腹1$1腹2'},
			//{regex:/(r)/gm, replacement:'介1$1介2'},
			{regex:/(r?ˁ?[aeiouə])/gm, replacement:'介腹1$1介腹2'},
			//{regex:/^(.*)介1/gm, replacement:'首1$1首2介1'},
			//{regex:/^(.*)腹1/gm, replacement:'首1$1首2腹1'},
			{regex:/^(.*)(介腹1)/gm, replacement:'首1$1首2$2'},
			{regex:/(介腹2)(.*)$/gm, replacement:'$1尾調1$2尾調2'},
	]
	//DictDb.serialReplace(db.db, 'OC_schuesslerOC', 'code', 預處理)
	let o = new Dict({
		rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\下載\\RIME_OC_collections-main\\RIME_OC_collections-main\\OC_schuesslerOC.dict.yaml'}),
		name:'msoc'
	})

	o.assign_pronounceArr()
	o.preprocess(預處理)
	//帶標記的讀音數組
	let marked = Ut.serialReplace(o.pronounceArr, 標記首介腹尾調)
	let syllables:ChieneseSyllable[] = []
	for(let i = 0; i < marked.length; i++){
		let sy = Dict.三分(marked[i], new ChieneseSyllable())
		if(sy.onset === undefined){console.log(marked[i])}
		syllables.push(sy)
		//console.log(sy)//t
	}
	//console.log(syllables[4132])
	let m = Dict.getOccurrenceTimesMap(syllables, 'onset')
	console.log(Ut.sortMapIntoObj(m))
	//let 聲母集 = m.map((e)=>e.onset!)
	//let 聲母集 = Array.from(m.keys())
	//DictDb.serialReplace(db.db, 'OC_schuesslerOC', 'code', [{regex:/(.)̂/gm, replacement:'ˁ$1'}])
	let 聲母集 = Ut.sortMapIntoObj(m).map((e)=>e.k)
	console.log(聲母集)
	//let 諸最小對立對 = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', 聲母集, 聲母集, 'asc')
	let 寡 = 聲母集.slice(聲母集.length-10 ,聲母集.length)
	// console.log(`console.log(寡)`)
	// console.log(寡)
	let 諸最小對立對 = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', 聲母集, 聲母集, 'desc')
	諸最小對立對.forEach((e)=>{console.log(e)})
	
	//<待做>{對每個音位的proportion之和 排序; 尋ᵣ 完全不對立者}
	//
	//console.log(syllables[1]['onset'])
}
schl_test()
