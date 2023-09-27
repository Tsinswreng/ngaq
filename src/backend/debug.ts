//require('module-alias/register');
require('tsconfig-paths/register');
import SingleWord2 from "@shared/SingleWord2"
import { getShuffle, group, deprecated_simpleRandomArr, simpleUnion, randomIntArr } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2";
import Sqlite from "@shared/db/Sqlite";
import VocaSqlite from "./VocaSqlite";
import Tempus from "@shared/Tempus";
import { randomInt } from "crypto";

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
test_random()