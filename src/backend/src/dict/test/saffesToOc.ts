require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Util from '@shared/Util';
import { DictDb, DictRaw, Dict, MinimalPairUtil } from "../../dict/Dict";
//import Txt from "../../shared/Txt";

import * as fs from 'fs'
import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow } from '../../dict/DictType';
const rootDir:string = require('app-root-path').path
Error.stackTraceLimit = 50;


function saffesToOc(){
	const replacePair:RegexReplacePair[] = require('../regex/saffesToOcRegex')
	const replacePair2:RegexReplacePair[] = require('../regex/ocToOc3')
	let o = new Dict({
		rawObj: new DictRaw({srcPath:'D:\\Program Files\\Rime\\User_Data\\saffes.dict.yaml'}),
		name:'saffes'
	})
	
	o.assign_pronounceArr()
	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toUpperCase()})
	o.preprocess(replacePair)
	o.preprocess(replacePair2)
	o.pronounceArr = o.pronounceArr.map((e)=>{return e.toLowerCase()})
	//console.log(o.pronounceArr)
	let 字 = Util.transpose(o.rawObj.validBody)[0]
	let 浮點頻 = Util.transpose(o.rawObj.validBody)[2]
	let 復原 = Util.transpose([字, o.pronounceArr, 浮點頻])
	const msoeg:string[][] = require('./msoc_test')
	
	//Util.printArr(復原, '\t')
	復原.forEach((e)=>{console.log(e)})
	Util.printArr(o.pronounceArr, '\t')
	let outPath = 'D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml'
	let 碼表頭 = `#23.08.09-1604
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
	let outStr = 碼表頭
	for(const line of 復原){
		for(const grid of line){
			outStr += grid+'\t'
		}
		outStr += '\n'
	}
	fs.writeFile(outPath, outStr, (err)=>{
		console.log('done')
	})
}

saffesToOc()
