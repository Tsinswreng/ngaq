import VocaRaw from "./VocaRaw"
import * as fs from "fs";
const xml2js = require('xml2js')
/*
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'
jap.srcFilePath = 'D:\\#\\mmf\\倭\\jap[20230515112439,].txt'
*/

/*
let re = VocaRaw.getObjsByConfig()
console.log(re)*/
/*

let parser = new xml2js.Parser();
let xml = fs.readFileSync('./config.xml')
let glo:any;
function callback(err:any, result:any){
	//console.log(result)
	glo = result;
}
parser.parseString(xml, callback)
/!*
console.log(glo)
console.log('114514')
*!/
console.dir(glo.root.lings[0].ling[0])

*/

let vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig()

console.log(vocaObjs[0])

