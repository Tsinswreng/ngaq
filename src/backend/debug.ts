//require('module-alias/register');
require('tsconfig-paths/register');
import SingleWord2, { VocaDbTable } from "@shared/SingleWord2"
import { getShuffle, group, deprecated_simpleRandomArr, simpleUnion, randomIntArr, creatFileSync, $a, deprecated_measureTime, measurePromiseTime, blobToBase64_fr, measureFunctionTime, delay, readLine, $ } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2";
import Sqlite, { SqlToValuePair } from "@shared/db/Sqlite";
import VocaSqlite from "./VocaSqlite";
import Tempus from "@shared/Tempus";
import { randomInt } from "crypto";
import _ from 'lodash'
import RandomImg from "./Img";
import * as mathjs from 'mathjs'
import { Readline } from "node:readline/promises";
import * as fs from 'fs'
import * as mht from 'mhtml-parser'
import mht2 from 'mhtml-parser'
import {parse} from 'mhtml-parser'
import VocaTempus from "@shared/VocaTempus";
let text = 
`
2023-09-23T19:27:15.001+08:00
{
fuck
美: [fʌk] 
英: [fʌk] 
n.	性交；性伴侣；蹩脚货；没用的东西
v.	性交；滚；操；发出命令时用
int.	操；滚；单独使用
网络	干；他妈的；法克

}

2023-09-23T19:28:27.002+08:00
{
fuck
美: [fʌk] 
英: [fʌk] 
n.	性交；性伴侣；蹩脚货；没用的东西
v.	性交；滚；操；发出命令时用
int.	操；滚；单独使用
网络	干；他妈的；法克

}

`

// const raw = new VocaRaw2(text)

// console.log(new RegExp(raw.config.dateRegex))
// let words = raw.parseWords()
// console.log(words)

async function t20230925190348(){
	let t1 = new Tempus('2023-09-26T05:52:20.071Z')
	let t2 = new Tempus('2023-09-25T14:27:25.951Z')
	let diff = Tempus.diff_mills(t1,t2)
	console.log(diff)
	console.log(getDateWeight(diff/1000))
}

//t20230925190348()

function getDateWeight(dateDif:number):number{
	let result = (1/25)*Math.pow(dateDif, 1/2)
	if(result <= 1){
		result = 1.01;
	}
	return result;
}

function testRandom(){
	let r = deprecated_simpleRandomArr(1, 20, 10, 'int')
	console.log(r)
}

//testRandom()

function testGroup(){
	let arr = [0,1,2,3,4,5,6,7,8,9,10]
	let g = group(arr, 5)
	console.log(g)
}

//testGroup()

function test_getShuffle(){
	let arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
	let s = getShuffle(arr, 5, 4)
	console.log(s)
	console.log(s.length)
}
//test_getShuffle()


function test_random(){
	let arr:number[] = []
	for(let i = 571; i>=0; i--){
		arr.push(i)
	}
	//console.log(arr)
	let sh = getShuffle(arr, 8, (571/8))
	console.log(sh)
}
//test_random()


function test_sh(){
	let a = getShuffle([], 0, 0)
	console.log(a)
}
//test_sh()

function py(a:number, b:number){
	let i = 1;
	let result:number[] = []
	while(true){
		let p = Math.pow(2,i)
		if(p<a){}
		else if(p>=a && p<=b){
			result.push(p)
		}else{break}
		i++
	}
	return result
}

function testForceMerge(){
	const a = { x: 1, y: { z: 2 } };
	const b = { x:void 0 , y: { z: 3, w: undefined }, w: 5 };

	function customMerge(objValue: any, srcValue: any) {
		if (_.isUndefined(srcValue)|| !objValue) {
			return srcValue;
		}
	}
	//_.mergeWith()
	const result = (_ as any).mergeWith({}, a, b, customMerge);
	
	console.log(result);
}
//testForceMerge()

async function test_copyCrossDb(){
	let vs = new VocaSqlite({

	})
	let vs2 = new VocaSqlite({
		_dbPath: './voca2.db'
	})
	console.log(vs2.dbPath)
	console.log(vs2.db)
	await Sqlite.copyTableCrossDbNonBatch(vs.db, 'english', vs2.db)
	//let words = await vs2.getAllWords('japanese')
	//console.log(words)
	console.log('done')
}

//test_copyCrossDb()


async function t20231005204331(){
	//creatFileSync('./ASD', true)
	let vs = new VocaSqlite({_dbPath:'./SSS'})
	console.log(vs.dbPath)
}
//t20231005204331()

async function t20231006112813(){
	let vs = new VocaSqlite({_tableName:'japanese'})
	const rows = await VocaSqlite.qryWordByWordShape(vs.db, $a(vs.tableName), 'どころか')
	let row = rows[0]
	console.log(row)
	console.log(JSON.parse(row.mean)[0])

}
//t20231006112813()

async function test_grout(){
	let arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
	let r = group(arr, 3)
	console.log(r)
}
//test_grout()



// async function test_qryByIdTime(){
// 	let id1To2000:number[] = []
// 	for(let k = 0; k < 50; k++){
// 		for(let i = 1; i < 2001; i++){
// 			id1To2000.push(i)
// 		}
// 	}
	
	
// 	let ids = [1,2,3]
// 	let id = 1
// 	const vs = new VocaSqlite({_tableName: 'english'})
// 	let r,rs:any
// 	//r = await Sqlite.qryByOneId(vs.db, vs.tableName??'', id)
// 	let fn = Sqlite.qryByIds(vs.db, vs.tableName??'', id1To2000)
// 	let test = Sqlite.test(vs.db, vs.tableName??'', id1To2000)
// 	let test2 = Sqlite.qryByIds(vs.db, vs.tableName??'', id1To2000)
// 	const t = await measurePromiseTime(fn)
// 	const d = await measurePromiseTime(test)
// 	const te2 = await measurePromiseTime(test2)
// 	//console.log(t[1])
// 	console.log(t[0])
// 	console.log(t[1][0].length)
// 	console.log()
// 	console.log(d[0])
// 	console.log(d[1].length)
// 	console.log()
// 	console.log(te2[0])
// }
//test_qryByIdTime()

async function test_qryById(){
	//console.log(11)
	const vs = new VocaSqlite({_tableName: 'english'})
	let r = await Sqlite.qryByIds_unsafeInt(vs.db, vs.tableName??'', [1,2,3])
	console.log(r)
}
//test_qryById()

async function test_qryWordShape(){
	const vs = new VocaSqlite({_tableName: 'english'})
	const r = await VocaSqlite.qryWordByWordShape(vs.db, vs.tableName??'', ['peer', 'leak'])
	console.log(r)
}
//test_qryWordShape()
// type nonArr = Record<string, any>

// let ff : nonArr = {d:2, e:3}
// let gg :nonArr = []
// type NotArray = (object | string | bigint | number | boolean) & { length?: never; };
//let ga:NotArray 
/*NotArray & { length?: never; } 中的 & 运算符表示类型的交集，也就是将两个类型合并为一个类型。在这种情况下，它合并了 NotArray 类型和 { length?: never; } 类型。

{ length?: never; } 是一个对象类型字面量，它指定了一个名为 length 的属性，但这个属性的类型是 never，并且还包含了一个可选的 ? 标记。

length 属性的类型为 never 表示这个属性可以存在，但它永远不会被赋予任何有效的值。never 是 TypeScript 中的一个特殊类型，表示永远不存在的值，通常用于表示不可到达的代码路径或不可能发生的情况。

? 标记表示 length 属性是可选的，也就是说，它可以存在，也可以不存在。

因此，NotArray & { length?: never; } 表示一个类型，该类型包含了 NotArray 类型的所有成员，并且还包含一个可选的 length 属性，但这个属性的类型永远是 never，因此它实际上表示了一个不会具有有效 length 属性的类型。

这个类型别名的目的是排除那些具有有效 length 属性的对象，例如数组，从而只保留那些没有 length 属性的对象或基本数据类型。*/

async function test_Img(){
	const dir = `C:\\Users\\lenovo\\Pictures\\屏保\\nizigenBito`//
	const ri = await RandomImg.konstructor([dir])
	for(let i = 0; i < 10; i++){
		console.log(ri.oneRandomFile())
	}
}
//test_Img()

function test_measure(){
	function fn(a:number, b:string, c:boolean){
		return a+b+c
	}
	function sixParams(a:number, b:string, c:number, d:string, e:number, f:string, g:number){
		return a+g
	}
	let [time, result] = measureFunctionTime(fn, 1, '2', true)
	let six = measureFunctionTime(sixParams, 1,2,3,4,5,6,7)
	console.log(time)
	console.log(result)
	console.log(six)
}
//test_measure()

async function t20231014232256(){
	let p = new Promise((res, rej)=>{
		setTimeout(()=>{res(0)}, 1000)
	})
	let r = await measurePromiseTime(p)
	console.log(r)
}
//t20231014232256()

function matheval(){
	let r = mathjs.evaluate(`60*60`)
	console.log(r)
	console.log(typeof r)
}
//matheval()

async function asyfn(){
	await delay(500)
	console.log(`asyfn`)
}



function test_promise(){
	//asyfn()
	new Promise((res,rej)=>{
		setTimeout(()=>{console.log(`setTimeout`);res(0)})
	})
	console.log(`test_promise`)
}
//test_promise()

function py20231021100923(){
	let result = 0;
	for(let i = 1; i <= 996; i++){
		if(i%2==0){
			result-=i;
		}else{
			result+=i
		}
	}
	console.log(result)
}
//py20231021100923()

async function py20231021101421(){
	const username = 'Kate'
	const password = '666666'
	for(let i = 0; i < 3; i++){
		let input_username = await readLine()
		let input_password = await readLine()
		if(input_username===username && input_password===password){
			console.log(`登录成功`)
			break
		}
		if(i==2){
			console.log(`3次用户名或者密码均有误！退出程序。`)
		}
	}
	
	
}
//py20231021101421()

async function testMht(){
	const path = "D:\\_\\mmf\\PROGRAM\\_Cak\\voca\\out\\为什么伊朗可以爆发伊斯兰革命逆世俗化___兴汉的小仙女_的回答___知乎_zhihu.com_139773979.mht"
	const str = await fs.promises.readFile(path, 'utf-8')
	const parsed = mht.parse(str)
	console.log(parsed.text())
	console.log(114514)
}
//testMht()

async function test_vocaTempus(){
	const eng = new VocaSqlite({_tableName:'english'})
	const rows = await eng.getAllWords()
	const sws = SingleWord2.parse(rows)
	const r = VocaTempus.parse(sws)
	
	//console.log(r.length)
	VocaTempus.sort(r)
	console.log(r)
}
//const[t]=measureFunctionTime(test_vocaTempus)
//console.log(t)

async function test_bigintId(){
	const i64table = new VocaSqlite({_tableName: 'test_int64'})
	const sql = `SELECT * FROM '${i64table.tableName}'`
	const r = await Sqlite.all(i64table.db, sql)
	//console.log(r)
	let i64 = r[1] as any
	console.log(typeof(i64))
	console.log(i64)
	console.log(Object.keys(i64))
	console.log(i64.int64)
}
//test_bigintId()

async function py4_1(){
	function f(n:number){
		if(n===1||n===2){return 1}
		return f(n-1)+f(n-2)
	}
	let n = await readLine()
	console.log(f(parseFloat(n)))
}
//py4_1()

function test_instanceof(){

	class Homo{
		constructor(
			name?:string
			,age?:number
		){}
	}

	class PersonClass{
		constructor(
			name?:string
			,age?:number
		){}
	}

	

	interface IPerson{
		name?:string
		age?:number
	}

	//const personC:PersonClass = new PersonClass('jack', 18)
	const personI:IPerson = {name: 'jack', age:18}
	const personI2:IPerson = new PersonClass('jack', 18)
	console.log((personI as any).__proto__)
	console.log(personI instanceof PersonClass)
	console.log(personI2 instanceof PersonClass);
	//Object.setPrototypeOf(personI, personI2)
	(personI as any).__proto__ = PersonClass.prototype
	console.log(personI instanceof PersonClass)
	console.log((personI as any).__proto__)
	//@ts-ignore
	console.log(personI.__proto__)
	console.log(PersonClass.prototype)
	console.log(personI2 instanceof Homo)
	console.log(Object.getPrototypeOf(personI))
}
//test_instanceof()
// declare global {
// 	interface Number {
// 	  double(): number;
// 	}
//   }
  
//   Number.prototype.double = function () {
// 	return this as number * 2;
//   };
  
//   let myNumber: number = 5;
//   let result = myNumber.double(); // TypeScript 現在知道 double 方法存在，不會報錯
//   console.log(result); // 將輸出 10
function test_protoType(){
	let str = ''
	console.log(Object.getPrototypeOf(str))
	let num = 0
	console.log(Object.getPrototypeOf(num))
	console.log(num as any instanceof Number) //false
	// Number.prototype.double = function() {
	// 	return this * 2;
	// };
	
	// // 現在你可以使用這個方法
	// let myNumber = 5;
	// console.log(myNumber.double()); // 將輸出 10
	//num.double()
}
//test_protoType()


function t20231101153919(){
	const usedPort = ['1', '2']
	const set_usedPort = new Set<string>(...usedPort)
	let randomInts = randomIntArr(1, 10, 10, false)
	let strArrRandomInts = randomInts.map(e=>e+'')
	for(const s of strArrRandomInts){
		set_usedPort.add(s)
	}
	console.log(set_usedPort)

}//t20231101153919()

function t20231101155232(){
	let randomInts = randomIntArr(0, 99999998, 9999999, true)
	//console.log(randomInts)

	let 數組 = randomInts.slice()
	let 集合 = new Set(randomInts)
	const measureArr = ()=>{
		return 數組.includes(114514)
	}
	const measureSet = ()=>{
		return 集合.has(114514)
	}
	const [集合查找耗時] = measureFunctionTime(measureSet)
	const [數組查找耗時] = measureFunctionTime(measureArr)
	console.log(`console.log(集合查找耗時)`)
	console.log(集合查找耗時)
	console.log(`console.log(數組查找耗時)`)
	console.log(數組查找耗時)

}
//t20231101155232()

async function t20231101222851(){
	const vocaSqlite = new VocaSqlite({_tableName: 'test_int64'})
	const sql = `INSERT INTO '${vocaSqlite.tableName}' (int64) VALUES (?)`
	//await Sqlite.all(vocaSqlite.db, sql, `10000000000000003`)
	//console.log(`number done`)
	//await Sqlite.all(vocaSqlite.db, sql, 10000000000000003n)
	//console.log(`bigint done`)

	const slect = `SELECT CAST(* AS TEXT) FROM '${vocaSqlite.tableName}'`
	const r = await Sqlite.all(vocaSqlite.db, slect)
	console.log(r)

}//t20231101222851()


async function test_stream1(){
	const vocaSqlite = new VocaSqlite({_tableName: 'testStream'})
	//const words = await vocaSqlite.getAllWords()
	
	//VocaSqlite.getInsertSql($(vocaSqlite.tableName), SingleWord2.parse(words[0]))
	//Sqlite.transaction(vocaSqlite.db, [{sql:}])
	const neoTable = 'testStream2'
	const creatSql = `CREATE TABLE ${neoTable} AS SELECT * FROM ${vocaSqlite.tableName}`
	//await Sqlite.run(vocaSqlite.db, creatSql)
	const sql = `INSERT INTO ${neoTable} SELECT * FROM ${vocaSqlite.tableName}`
	//await Sqlite.run(vocaSqlite.db, sql)
	const pairs:SqlToValuePair[] = []
	for(let i = 0; i < 9000 ; i++){
		let unus = new SqlToValuePair(sql, [[],[]])
		pairs.push(unus)
	}
	//console.log(pairs)
	await Sqlite.transaction_complex(vocaSqlite.db, pairs, 'run')
	console.log(`done1`)
}
//test_stream1()

// async function test_stream2(){
// 	const vocaSqlite = new VocaSqlite({_tableName: 'testStream2'})
// 	// const result = await measurePromiseTime(vocaSqlite.getAllWords())
// 	// console.log(result[0])
// 	// const words = result[1]
// 	// console.log(words.length)
// 	//console.log(`done`)

	
	
// 	//const stre = await Sqlite.testReadStream(vocaSqlite.db, $(vocaSqlite.tableName))
// 	//console.log(stre)
// 	Sqlite.testReadStream(vocaSqlite.db, $(vocaSqlite.tableName)).then(d=>{console.log(d)})
// 	for(let i = 0; i < 20; i++){
// 		console.log(i)
// 		await delay(100)
// 	}
// 	await readLine(`done`)
	
// }
//test_stream2()


async function test_statement(){
	const vocaSqlite = new VocaSqlite({_tableName: 'testStream2'})
	const sql = `SELECT * FROM '${vocaSqlite.tableName}'`
	const stmt = vocaSqlite.db.prepare(sql)
	for(let i = 0 ; i < 10; i++){
		stmt.get((err, row)=>{
			if(err){throw err}
			console.log(row)
		})
	}
}//test_statement()

// async function test_stream3(){
// 	const vocaSqlite = new VocaSqlite({_tableName: 'testStream2'})
// 	const stream = Sqlite.testReadStream2(vocaSqlite.db, $(vocaSqlite.tableName))
// 	let cnt = 0;
// 	stream.on('data', (chunk)=>{
// 		console.log(
// 			JSON.parse(chunk)
// 		)
// 		cnt++
// 		console.log(cnt)
// 		if(cnt === 99){
// 			stream.destroy()
// 		}
// 	})
// }
//test_stream3()

import { Sqlite_master, SqliteTableInfo } from "@shared/db/Sqlite";
import { Database } from "sqlite3";

async function test_safeIntSql(){
	const vocaSqlite = new VocaSqlite({_tableName: 'testStream2'})
	const table = $(vocaSqlite.tableName)
	const db = vocaSqlite.db
	const tableInfo = await Sqlite.meta.getTableInfo(vocaSqlite.db, table)
	//console.log(tableInfo)
	const master = await Sqlite.meta.querySqlite_master_unsafeInt(db)
	//console.log(master)

	const r = await Sqlite.getSql_columnCastToText(db, table)
	//console.log(r)
	const r2 = await Sqlite.isTableExist(db, 'englishs')
	//console.log(r2)

	const fullSafeSql = await Sqlite.getSql_SelectAllIntSafe(db, table)
	console.log(fullSafeSql)

}//test_safeIntSql()

async function test_statement2(){
	const vocaSqlite = new VocaSqlite({_tableName: 'english'})
	const table = $(vocaSqlite.tableName)
	const db = vocaSqlite.db
	let safeIntColumns = await Sqlite.getSql_columnCastToText(db, table)
	const sql = `SELECT ${safeIntColumns} FROM '${table}' WHERE id = ?`
	const stmt = db.prepare(sql)
	for(let i = 0; i < 3000; i++){
		stmt.get(i, function(err, row){
			if(i%100===0){
				console.log(row)
			}
		})
	}
}
//test_statement2()
import sqlite3 from 'sqlite3';
const sqlt = sqlite3.verbose()
async function test_copyTable(){
	const vocaSqlite = new VocaSqlite({_tableName: 'english'})
	const neoDbPath = creatFileSync('./test.db', true)
	const neoDb = new sqlt.Database(neoDbPath)
	
	try {
		console.log(114514)
		const r = await measurePromiseTime(
			Sqlite.copyTableCrossDbNonBatch(vocaSqlite.db, $(vocaSqlite.tableName), neoDb, 'neo'+new Tempus().time)
		)
		console.log(r[1])
		console.log(r[0])
	} catch (e) {
		console.error(`console.error(e)`)
		console.error(e)
	}

	
}
test_copyTable()


async function test_verbose(){
	//const db = new Database('./aaa.db')
	const vocaSqlite = new VocaSqlite({_tableName: 'japanese'})
	//db.run('select', (err)=>{console.error(err)})
	// try {
	// 	db.run('select')
	// } catch (e) {
	// 	console.log(e)
	// }
	//const stmt = db.prepare('select')
	//await Sqlite.all(db, 'select')
	return new Promise(async (res,rej)=>{
		const stmt = Sqlite.prepare(vocaSqlite.db, `INSERT INTO ${vocaSqlite.tableName} (id) VALUES ('a')`)
		await Sqlite.stmtRun(stmt)
		res(0)
	})
	
}//test_verbose()