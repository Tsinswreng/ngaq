/* // 定义一些示例函数

function add(x: number, y: number): number {
	return x + y;
  }
  https://hxvnz1.ykjsmo.com/details?id=174093
  function double(x: number): number {
	return x * 2;
  }
  
  function square(x: number): number {
	return x * x;
  }
  
  // 使用管道操作符来链式调用函数
  
  const result = 5
	|> add(3)       // 将 5 与 3 相加
	|> double       // 将结果乘以 2
	|> square;      // 将结果平方
  
  console.log(result); // 输出 64 (5 + 3 = 8, 8 * 2 = 16, 16 * 16 = 64) */
require('module-alias/register');
import moment, { Moment } from "moment";
import SingleWord2 from "@shared/SingleWord2";
import dayjs from 'dayjs'
//import * as inspector from 'node:inspector/promises';
import v8 from 'v8'
import Tempus from "@shared/Tempus";
import { $, $a, nug } from "@shared/Ut";
import VocaSqlite from "./VocaSqlite";
import Sqlite from "@shared/db/Sqlite";
import * as fs from 'fs'
import VocaRaw2 from "@shared/VocaRaw2";
const print = console.log

let a:Moment = moment()
//console.log(a.format('HH:MM:ss.SSS'))
//console.log(JSON.stringify(a))
//let b = JSON.parse("2023-09-08T12:32:07.023Z")
//b = moment(b)
//console.log(b)
let b = moment("2023-09-08T12:32:07.023Z")
//console.log(b)

let moment_ = moment()
let day_ = dayjs()
let str = '2023.09.08-20:57:33.000'
let str2 = '2023-09-08T14:30:00.123+03:00'
//2023.09.08-21:43:11
let my = {
	year: 2023,
	month: 9,
	day: 8,
	hour: 21,
	minute:43,
	second: 11,
	mills: 998
}
let t = new Tempus('2023-09-09T16:29:33+08:00')
//console.log(t.time)
//let fun = (a,b)=>{return a+b}
//console.log(v8.serialize(fun).byteLength)
//console.log(v8.serialize(t).byteLength)
//console.log(v8.serialize(str).byteLength)
//console.log(v8.serialize(str2).byteLength)
//console.log(JSON.stringify(day_))
//console.log(dayjs("2023-09-09T01:36:14.066Z"))

//console.log(t.format())
//console.log(dayjs('2023-09-09T10:46:46+08:00'))


let sw = new SingleWord2(
	{
		id:1,
		table: 'english',
		wordShape: 'object',
		pronounce: [`ˈɒbdʒɪkt`, `əbˈdʒekt`],
		mean: [`n.	目标；物体；目的；东西
		v.	反对；不同意；不赞成；提出…作为反对的理由
		网络	对象；物件；宾语`, `英 [ˈɒbdʒɪkt; əbˈdʒekt]美 [ˈɑːbdʒekt]
		CET4 TEM4
		n. 物体，实物；目的，目标；宾语；（引发某种情感或行为的）对象；客体；（计算机）对象
		v. 反对；反对说，反对的理由是`],
		tag: ['CET-4', 'TEM-4'],
		annotation: ['對象', '反對', '目標'],
		dates_add: [new Tempus('2023-09-09T16:28:08+08:00'), new Tempus('2023-09-10T16:28:29+08:00')],
		dates_fgt: [new Tempus('2023-09-11T16:28:53+08:00'), new Tempus('2023-09-12T16:28:29+08:00')],
		dates_rmb: [new Tempus('2023-09-13T16:28:08+08:00'), new Tempus('2023-09-14T16:28:29+08:00')],
		source: ['web']
	}
)

// async function testF(){
// 	const sqlt = new VocaSqlite({_tableName:'english'})
// 	//let rows = await sqlt.getAllWords()
// 	//console.log(rows)
// 	let objs = [
// 		{sql:`SELECT * FROM 'english' WHERE wordShape = ?`, values: ['leakus']},
// 		{sql:`SELECT * FROM 'english' WHERE id = ?`, values: [1,2]},
		
// 	]
// 	let [r, runResult] = await Sqlite.transaction(sqlt.db, objs)
// 	console.log(r)
// 	console.log(runResult)
// }

//testF()

// async function testG(){
// 	const sqlt = new VocaSqlite({_tableName:'english'})
// 	let r = await VocaSqlite.qryWordByWordShape(sqlt.db, 'english', ['leak', 'fuck', 'peer'])
// 	console.log(r)
// 	//console.log(r[1])
// 	//console.log(r[1].length)
// }

// testG()


// let arr = [['peer'], [], ['leak', 'leak']]

function asy(){
	return new Promise((res,rej)=>{
		setTimeout(()=>{
			console.log(500);
			//res(0)
			rej(-1)
		}, 500)
	})
}

function asy2(){
	return new Promise((res,rej)=>{
		setTimeout(()=>{
			console.log(500);
			//res(0)
			throw new Error('-1')
			//rej(-1)
		}, 500)
	})
}

async function testH(){
	console.log('start')
	//await asy().catch((err)=>{console.error(err)}) // < -1
	// try {
	// 	await asy()
	// } catch (e) {
	// 	console.log(e) // < -1
	// }
	//await asy2() // < 一般ᵈ報錯
	//await asy2().catch((err)=>{console.error(err)}) // 亦報錯如上。
	try {
		await asy2()
	} catch (e) {
		console.error(e) //仍報錯。不被try catch 捕。
		console.log(114514)
	}
	console.log(3)
}

testH()

let ass = []


// async function test20230921225553(){
// 	const srcStr = await fs.promises.readFile("D:\\_\\mmf\\PROGRAM\\_Cak\\voca\\srcWordList\\eng\\eng.voca", 'utf-8')
// 	VocaRaw2.parseConfig(srcStr)
// }
// test20230921225553()

