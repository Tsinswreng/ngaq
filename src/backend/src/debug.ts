// import VocaRaw from "./VocaRaw";
// const fs = require('fs')
// import VocaServer from "./VocaServer";
//const { Worker } = require('worker_threads');
//import { Database } from "sqlite3";
//const temp = require('sqlite3')
// import * as sqlite3Temp from 'sqlite3'
// let sqlite3 = sqlite3Temp.verbose()
import { DictDb } from "./dict/DictRaw";
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
//dictDb.creatTable('saffes')
dictDb.testInsert()

//console.log(dictDb.r)

//dictDb.testInsert()
//console.log(dictDb)




 