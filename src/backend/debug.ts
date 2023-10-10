//require('module-alias/register');
require('tsconfig-paths/register');
import SingleWord2 from "@shared/SingleWord2"
import { getShuffle, group, deprecated_simpleRandomArr, simpleUnion, randomIntArr, creatFileSync, $a, deprecated_measureTime, measurePromiseTime } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2";
import Sqlite from "@shared/db/Sqlite";
import VocaSqlite from "./VocaSqlite";
import Tempus from "@shared/Tempus";
import { randomInt } from "crypto";
import _ from 'lodash'

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
	await Sqlite.copyTableCrossDb(vs.db, 'english', vs2.db)
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
	let r = await Sqlite.qryByIds(vs.db, vs.tableName??'', [1,2,3])
	console.log(r)
}
//test_qryById()

async function test_qryWordShape(){
	const vs = new VocaSqlite({_tableName: 'english'})
	const r = await VocaSqlite.qryWordByWordShape(vs.db, vs.tableName??'', ['peer', 'leak'])
	console.log(r)
}
test_qryWordShape()
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




