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
import { DictDb, DictRaw, Dict } from "./dict/Dict";
//import Txt from "../../shared/Txt";

import { GetCompiledJs } from "./GetCompiledJs";
import { partial } from 'lodash';

const rootDir:string = require('app-root-path').path
Error.stackTraceLimit = 50;
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

//let dictDb = new DictDb('saffes')
//let dictDb = new DictDb({dbPath=''})
//Partial<DictDb>

//let dictRaw = new DictRaw('D:/Program Files/Rime/User_Data/saffes.dict.yaml')
//dictRaw.assign_validBody()

// Dict.run().then((data)=>{
// 	console.log(data)
// })
// .catch((e)=>{
// 	console.error('輟辣!')
// 	console.error(e)
// })
//DictDb.run()
//dictDb.attachFreq().then((d)=>{console.log(d)})
//DictDb.getDuplication('kana').then((d)=>{console.log(d)})


// DictDb.quickStart('D:/Program Files/Rime/User_Data/OC_schuesslerOC.dict.yaml').then(
// 	()=>{DictDb.quickStart('D:/Program Files/Rime/User_Data/saffes.dict.yaml')}
// )
//DictDb.attachFreq('saffes')
//DictDb.testTransaction('saffes')
//Dict.putKanjiFreqTable()
//DictDb.getTableInfo('saffes').then((d)=>{console.log(d)})
//DictDb.isColumnExist('saffes', 'kanji').then((d:boolean)=>{console.log(d)})

async function debug(){
	//let name = 'OC_schuesslerOC'
	let name = 'OC_msoeg'
	let db = new DictDb({})
	//await DictDb.DropAllTables(db.db)
	let dict = new Dict({name:name})
	await DictDb.putNewTable(new DictRaw({srcPath:'D:/Program Files/Rime/User_Data/OC_msoeg.dict.yaml'}))
	await DictDb.attachFreq(db.db, name)
	await dict.countAll()
	console.log(dict)
}
//debug()

let a = 'abcdefghijklmnopqrstuvwxyz'.split('')
let ar = [7,8,9]
console.log(Util.plus(ar, 8, 10))

// DictDb.putEssay(db.db)
//DictDb.putNewTable(new DictRaw({srcPath:'D:/Program Files/Rime/User_Data/saffes.dict.yaml'}))
//DictDb.attachFreq(db.db, 'saffes')
// DictDb.attachFreq(db.db, 'saffes')
//DictDb.testAll(db.db).catch((e)=>{console.error(e)})


// let dk = new Dict('D:/Program Files/Rime/User_Data/dk.dict.yaml')
// let dkDb = new DictDb('www')

// dkDb.creatTable().then((d)=>{console.log(d)})
//DictDb.countDistinct('OC_schuesslerOC', 'id').then((d)=>{console.log(d)}).catch((e)=>{console.log(e)})
// dictRaw.assign_validBody(false)
// console.log(dictRaw.validBody)

