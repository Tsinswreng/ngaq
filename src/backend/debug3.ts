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
console.log(t.time)
//let fun = (a,b)=>{return a+b}
//console.log(v8.serialize(fun).byteLength)
//console.log(v8.serialize(t).byteLength)
//console.log(v8.serialize(str).byteLength)
//console.log(v8.serialize(str2).byteLength)
//console.log(JSON.stringify(day_))
//console.log(dayjs("2023-09-09T01:36:14.066Z"))

//console.log(t.format())
//console.log(dayjs('2023-09-09T10:46:46+08:00'))
