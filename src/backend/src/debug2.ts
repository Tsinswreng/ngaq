require('tsconfig-paths/register');
import 'module-alias/register';
//import Txt from "@shared/Txt"
import Txt from "Txt"
import Util from '@shared/Util';
import { DictDb, DictRaw, Dict, MinimalPair } from "./dict/Dict";
//import Txt from "../../shared/Txt";

import { GetCompiledJs } from "./GetCompiledJs";
import { partial } from 'lodash';
import { RegexReplacePair } from 'Type';
import { DictDbRow } from './dict/DictType';
const rootDir:string = require('app-root-path').path
Error.stackTraceLimit = 50;

let saffes = new DictRaw({srcPath:'D:/Program Files/Rime/User_Data/saffes.dict.yaml'})

//console.log(Util.transpose(saffes.validBody))

//DictDb.all(new DictDb({}).db, `SELECT * FROM saffes`).then((d)=>{console.log(Util.transpose([d]))})

async function test_findMinimalPairs(){
	let db = new DictDb({}).db
	let rows = await DictDb.all<DictDbRow>(db ,`SELECT * FROM saffes`)
	//console.log(rows)
	let threeD = DictDb.findMinimalPairs(rows, '^()(u)()', 'j')
	let 展開:number[] = []
	for(let i = 0; i < threeD[1].length; i++){
		for(let j = 0; j < threeD[1][i].length;j++){
			// console.log(threeD[0][i][j])
			// console.log(threeD[1][i].length)
			展開.push(threeD[0][i][j])
		}
	}
	//console.log(threeD[1])
	let sql = `SELECT * FROM saffes WHERE id=?`
	//let result = await DictDb.transaction(db, sql , 展開)
	//console.log(result)
}

//test_findMinimalPairs()

let os = [
	{char:'教', code:'kzm'},
	{char:'較', code:'kzm'},
	{char:'校', code:'kzm'},
	{char:'校', code:'gzm'},
	{char:'的', code:'tek'},
]

console.log(Util.mapFields(os, 'char', 'code'))