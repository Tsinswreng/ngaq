/* // 定义一些示例函数

function add(x: number, y: number): number {
	return x + y;
  }
  
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
import { $, nug } from "@shared/Ut";
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
//console.log(SingleWord2.parse(SingleWord2.fieldStringfy(sw)))
//console.log(SingleWord2.fieldStringfy(sw))

// function parseDateJson(datesStr:string){
// 	let strArr = JSON.parse(datesStr)
// 	console.log(strArr[0])
// 	const dates:Tempus[] = []
// 	for(const s of strArr){
// 		let d = new Tempus(s)
// 		dates.push(d)
// 	}
// 	return dates
// }
// function stringfyDateArr(dates:Tempus[]){
// 	let strArr:string[] = []
// 	for(const d of dates){
// 		let t = Tempus.toISO8601(d)
// 		console.log(`console.log(t)`)
// 		console.log(t)
// 		strArr.push(t)
// 	}
// 	console.log(`console.log(strArr)`)
// 	console.log(strArr)
// 	return JSON.stringify(strArr)
// }
// let tempi = [new Tempus('2023-09-10T10:14:01+08:00')]
// let jsn = stringfyDateArr(tempi)
// console.log(`console.log(jsn)`)
// console.log(jsn)
// let dateJson = '["\\"2023-09-09T08:28:08.000Z\\"","\\"2023-09-10T08:28:29.000Z\\""]'
// let tempi:Tempus[] = parseDateJson(dateJson)
// console.log(`console.log(tempi)`)
// console.log(tempi)


class System{
	static out = {
		println:(v?)=>{console.log(v)}
	}
}

export default class Main{
	public static main(args?:string[]):void{
		System.out.println("Hello world");
	}
}

import sortedIndex from 'lodash/sortedIndex';

const sortedArray = [1, 3, 5, 7, 9];
const insertNumber = 10;

const insertPosition = sortedIndex(sortedArray, insertNumber);

console.log("Insert position:", insertPosition); // 输出 2，因为 4 应该插入到索引 2 处

function sa(){
	var undefined = 1
	console.log(undefined === undefined)
	console.log(undefined === void 0)
	//var null = 2
}
sa()

let e:undefined
let bs:number|undefined
bs = e
