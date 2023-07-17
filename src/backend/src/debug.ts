// import VocaRaw from "./VocaRaw";
// const fs = require('fs')
// import VocaServer from "./VocaServer";
//const { Worker } = require('worker_threads');
//import { Database } from "sqlite3";
//const temp = require('sqlite3')
// import * as sqlite3Temp from 'sqlite3'
// let sqlite3 = sqlite3Temp.verbose()
require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Util from '@shared/Util';
import { DictDb, DictRaw } from "./dict/DictRaw";
//import Txt from "../../shared/Txt";

import { GetCompiledJs } from "./GetCompiledJs";
const rootDir:string = require('app-root-path').path
/* console.log(__dirname)
const voca:VocaRaw[] = VocaRaw.getObjsByConfig()
//voca[1].init()
console.log(voca[1].srcFilePath) */

//let out:string = fs.readFileSync('\\'+voca[1].srcFilePath)

//VocaServer.main()
//import rootPath from './Root'

//console.log(global.rootDir)
//const vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig()
//console.log(vocaObjs)
/* console.log(VocaRaw.configFilePath)
vocaObjs[1].查重().then((o)=>{
	//vocaObjs[1].刪重(o)
	vocaObjs[1].第三步()
}) */


//console.log('\a')

let dictDb = new DictDb('saffes')
let dictRaw = new DictRaw('D:/Program Files/Rime/User_Data/saffes.dict.yaml')
let testStr = dictRaw.srcStr.slice(0, 512)
let uut = Txt.removeSingleLineComments_s(testStr, '#')
let testTable = Txt.getTableFromStr(testStr)
let testLines = Txt.spliteStrByNewline_s(testStr)
//console.log(testTable)
let merged = Txt.mergeArrIntoStr(testLines)
dictRaw.assign_validBody()
console.log(Util)
console.log(0xf)


//GetCompiledJs.test()
//console.log(new RegExp(/^.*\.js$/g).test('.git\\hooks\\applypatch-msg.sample.js'))
//console.log(dictRaw.validBody)
//dictDb.creatTable()
//dictDb.isTableExists().then((data)=>{console.log(data)})

//console.log(''.match(/(\s)*/))
//console.log(dictRaw.validBody[dictRaw.validBody.length-2])
//dictRaw.saveInDb()

//dictDb.creatTable('saffes')
//dictDb.testInsert()

//console.log(dictDb.r)

//dictDb.testInsert()
//console.log(dictDb)


/* 待做:{
	js與ts分離。完善GetCompiledJs.ts 、能把所有同名js移到一個文件夾。
	validBodyStr不乾淨。
} */

