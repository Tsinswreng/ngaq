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
let 外
async function testMsoc(){
	function msocPreprocess(){
		return [
			{regex:/g/gm, replacement:'ɡ'},
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
			{regex:/h$/gm, replacement:'s'},
			
		] as RegexReplacePair[]
	}
	function 標記首介腹尾調(){
		return [
			//{regex:/(ˁ?[aeiouə])/gm, replacement:'腹1$1腹2'},
			//{regex:/(r)/gm, replacement:'介1$1介2'},
			{regex:/(r?ˁ?[aeiouə])/gm, replacement:'介腹1$1介腹2'},
			//{regex:/([aeiouə])/gm, replacement:'介腹1$1介腹2'},
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
	const 聲母合併 = require('./msoeg聲母合併')
	const replacePair2:RegexReplacePair[] = require('../regex/ocToOc3')
	o.assign_pronounceArr()
	o.preprocess(msocPreprocess())
	
	o.preprocess(聲母合併)
	
	o.preprocess(replacePair2)
	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toLowerCase()})
	let 字 = Ut.transpose(o.rawObj.validBody)[0]
	//let 浮點頻 = Util.transpose(o.rawObj.validBody)[2]
	//let 復原 = Util.transpose([字, o.pronounceArr])
	let 復原 = o.recoverBody(o.pronounceArr,o.rawObj.validBody)
	外=復原
	//Util.printArr(復原, '\t')
	復原.forEach((e)=>{console.log(e)})
	Ut.printArr(o.pronounceArr, '\t')
	//console.log(o.pronounceArr)

	//console.log(o.pronounceArr)
	//Dict.首介腹尾調_分割(o.pronounceArr, )
	
	//帶標記的讀音數組
	let marked = Ut.serialReplace(o.pronounceArr, 標記首介腹尾調())
	let syllables:ChieneseSyllable[] = []
	// for(let i = 0; i < marked.length; i++){
	// 	let sy = Dict.三分(marked[i], new ChieneseSyllable())
	// 	if(sy.onset === undefined){console.log(marked[i])}
	// 	syllables.push(sy)
	// 	//console.log(sy)//t
	// }
	// //console.log(syllables[4132])
	let m = Dict.getOccurrenceTimesMap(syllables, 'onset')
	//console.log(Util.sortMapIntoObj(m))
	let 聲母映射能配的韻腹 = Ut.mapFields(syllables, 'onset', 'p2') //要除重
	for(let [k,v] of 聲母映射能配的韻腹){
		v = Array.from(new Set(v))
		聲母映射能配的韻腹.set(k,v)
	}
	let 聲母映射能配的韻腹toArr = Ut.mapToObjArr(聲母映射能配的韻腹)
	聲母映射能配的韻腹toArr.sort((a,b)=>{return a.v.length - b.v.length})
	//console.log(`console.log(聲母映射能配的韻腹toArr)`)
	//console.log(聲母映射能配的韻腹toArr)
	//let 聲母集 = m.map((e)=>e.onset!)
	//let 聲母集 = Array.from(m.keys())
	//let 聲母集 = Util.sortMapIntoObj(m).map((e)=>e.k)
	let 聲母集 = [
		'',   'ʔ',   'ŋ',   'xɫ',  'x',   'g',  'k',    
		'kɫ', 'kʰ',  'kʰɫ', 'l',   'ɫ',   'm̥',  'ŋ̊',  
		'r͂',  'r̥',   'tʃ',  'tʃʰ', 'tsʰ', 'ɫ͂',  'l̃',
		'ɫ̥',  's',   'l̥',   'dz',  'ts',  'dʒ', 'n̥', 
		'n',  'ʱɫ',  'd',   't',   'ʰɫ',  'tʰ', 'ʰ',    
		'p',  'pʰ',  'm',   'b',   'w',   'w̥',  'kw',
		'ʔw', 'kʰw', 'ŋw',  'gw',  'ŋɫ',  'gɫ', 'ʔɫ',
		'w͂'
	  ]
	//console.log(聲母集)
	//let 諸最小對立對 = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', 聲母集, 聲母集, 'asc')
	let 寡 = 聲母集.slice(聲母集.length-10 ,聲母集.length)
	//console.log(`console.log(寡)`)
	//console.log(寡)
	let 寡對立 = ['l̃', 'w͂',  'l̃', 'ʰɫ', ' kʰɫ', 'ŋ̊', 'kɫ', 'gɫ', 'ŋw', 'ŋɫ', 'xɫ', 'r͂', 'r̥', 'ʔɫ', 'ʰ' ]
	//console.log(syllables)
	let 諸最小對立對 = await DictDb.multiMinimalPairs(new DictDb({}).db, 'OC_msoeg', '^()(', ')(.*)$', ['ɫ̥'], 聲母集, 'desc')
	//諸最小對立對.forEach((e)=>{console.log(e)})
	//fs.writeFile('output.txt', 諸最小對立對.toString(), (err)=>{})
	//<待做>{對每個音位的proportion之和 排序; 尋ᵣ 完全不對立者}
	//
	//console.log(syllables[1]['onset'])
	let 碼表頭 = `#23.08.09-1840
#
# Rime dictionary
# vim: set ts=8 sw=8 noet:
# encoding: utf-8
#
#
#
#[23.02.08-1537,]取消了「那」之上
#匪漢字:[\\x00-\\xff]
#詞:[^\\x00-\\xff]{2,}.*
#空行:^.*\\r\\n$
#[23.02.08-1537,]取消了「那」之上聲、改「這」潙去聲
#[23.02.09-2342,]僻ᵗ多音字:
#未改者:请zts 但daf
---
name: msdks
version: ""
sort: by_weight
use_preset_vocabulary: true
import_tables:  #加載其它外部碼表 似不支持多級引入
  #- cangjie7-1ForLookUp2
  - nonKanji
  - chineseDict
...
`
	o.outputToFile('D:\\Program Files\\Rime\\User_Data\\msdks.dict.yaml', 碼表頭)
}
testMsoc()

export=外