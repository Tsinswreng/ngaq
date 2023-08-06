//[23.07.09-2232,]
//const fs = require('fs')
import {RegexReplacePair} from 'Type';
import * as fs from 'fs';
import * as path from 'path'
import now from 'performance-now';
import _ from 'lodash'

type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T;//假设我们有一个类型为 number[][] 的二维数组，使用 ArrayElementType<number[][]> 将得到 number 类型，因为 number[][] 表示一个二维数组，它的元素类型是 number[]，再继续解开 number[]，我们得到的是 number 类型。如果传入的是 string[][][]，则最终返回的是 string 类型。
export default class Util{
	
	private constructor(){}

	public static readonly L_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'

/**
 * [23.07.09-2134,]
 * [23.07.31-0928]{建議用getNonDef來代替此函數}
 * 訪問數組元素、越界則拋錯誤。支持任意維數組。如需訪問arr[3][2]則arrAt(arr, 3, 2)
 * @param arr 
 * @param indexPath 
 * @returns 
 */
	/* public static arrAt<T>(arr: T[], ...indexPath: number[]): T {
		function traverseArray(currentArray: any[], currentIndexPath: number[]): any {
			if (currentIndexPath.length === 0) {
				return currentArray;
			}
	
			const currentIndex = currentIndexPath[0];
			if (currentIndex < 0 || currentIndex >= currentArray.length) {
				let msg = `Index ${currentIndex} out of bounds`
				throw new Error(msg);
			}

			const nextArray = currentArray[currentIndex];
			//const nextIndexPath = currentIndexPath.slice(1);
			currentIndexPath.shift();
			const nextIndexPath = currentIndexPath
			return traverseArray(nextArray, nextIndexPath);
		}

		return traverseArray(arr, indexPath);
	} */

	

	public static arrAt<T extends any[]>(arr: T, ...indexPath: number[]): ArrayElementType<T> {
		function traverseArray(currentArray: any[], currentIndexPath: number[]): any {
			if (currentIndexPath.length === 0) {
				return currentArray as ArrayElementType<T>;
			}

			const currentIndex = currentIndexPath[0];
			if (currentIndex < 0 || currentIndex >= currentArray.length) {
				let msg = `Index ${currentIndex} out of bounds`
				throw new Error(msg);
			}

			const nextArray = currentArray[currentIndex];
			//const nextIndexPath = currentIndexPath.slice(1);
			currentIndexPath.shift();
			const nextIndexPath = currentIndexPath
			return traverseArray(nextArray, nextIndexPath);
		}

		return traverseArray(arr, indexPath);
	}


	/**
	 * 檢 路徑是存在、若存在則原樣返回
	 * @param dir 
	 * @returns 
	 */
	public static pathAt(dir:string):string{
		if(!fs.existsSync(dir)){
			console.error('<absoluteDir>')
			console.error(path.resolve(dir))
			console.error('</absoluteDir>')
			throw new Error('file not found')
		}
		return dir
	}

	public static nonFalseGet<T>(v:T){

		if(!v){throw new Error(v+'')}
		return v
	}


	public static nonNullableGet<T>(v:T): NonNullable<T>{
		if(v === undefined){
			throw new Error(v+' '+undefined)
		}
		if(v === null){
			throw new Error(v+' '+null)
		}
		return v
	}

/* 	public static nonNullableGetArr<T>(v:T): NonNullable<T>{
		if(v === undefined){
			throw new Error(v+' '+undefined)
		}
		if(v === null){
			throw new Error(v+' '+null)
		}
		return v
	} */

	//[23.08.01-2101,]<>{nonUndefGet做不出}


	public static 有重複排列<T>(seto:T[]|Set<T>, n:number){


		//給用來表示位值的數組做加法、等于或超過carryBit時則向高位進位。如[1,8] 加上 9 、當carryBit爲10時則進位(即滿十進一)、結果得[2,7]
		function plus(arr:number[], plusNum:number, carryBit:number){
			let result = arr.slice()
			let lastEle = result[result.length-1]
			//let carryOver = 0
			for(let i = result.length-1; i>=0; i--){
				result[i] += plusNum
				plusNum = 0
				if(result[i]>=carryBit && i !== 0){
					plusNum = parseInt((result[i] / carryBit)+'')
					result[i] -= carryBit
				}else{
					break
				}
			}
			return result
		}

		//若 傳入的 seto是包含所有26個小寫字母的集合、n是3、要列舉 由任意三個可重複的字母組成的字符串 的所有可能
		let setus:Set<T>
		if(seto instanceof Set){
			setus = seto
		}
		else{
			setus = new Set<T>([...seto])
		}
		let setArr:T[] = [...setus] //處理傳入的參數、統一化作無重複的數組
		let outIndexes:number[][] = [] //用索引表示原集合中元素的位置
		let innerIndexes:number[] = new Array(n).fill(0)
		outIndexes.push(innerIndexes)
		for(let i = 0;; i++){
			innerIndexes = plus(innerIndexes, 1, setArr.length) //窮舉 [0,0,0],[0,0,1]...直到[25,25,25] (n爲26時最大索引是25)
			if(innerIndexes[0]>=setArr.length){break} // arr.length是26、當上一個元素是[25,25,25]、再加一得[26,0,0]時已逾界、停止循環
			outIndexes.push(innerIndexes)
		}
		//根據outIndexe取結果
		let result:T[][] = []
		for(let i = 0; i < outIndexes.length; i++){
			result.push(Util.getNewArrByIndexes(setArr, outIndexes[i], true))//t
		}
		return result
	}

	public static getNewArrByIndexes<T>(arr:T[], indexes:number[], checkBound:boolean=false){
		let result:T[] = []
		if(checkBound){
			for(let i = 0; i < indexes.length; i++){
				result.push(Util.nonNullableGet(arr[indexes[i]]))
			}
		}else{
			for(let i = 0; i < indexes.length; i++){
				result.push(arr[indexes[i]])
			}
		}

		return result
	}

	

	public static measureTime(fn:()=>void){
		const startTime = now();
		fn();
		const endTime = now();
		const executionTime = endTime - startTime;
		return executionTime;
	}

	public static getCombinationsWithRepetition<T>(set: T[], n: number): T[][] {
		const result: T[][] = [];
	  
		function generateCombinations(currentCombination: T[]/* , currentIndex: number */) {
			if (currentCombination.length === n) {
				result.push(currentCombination);
				return;
			}
	
			for (let i = 0; i < set.length; i++) {
				generateCombinations([...currentCombination, set[i]]/* , i */);
			}
		}

		generateCombinations([]/* , 0 */);
		return result;
	}

	/**
	 * 統計數組中各元素出現的次數
	 * @param arr 
	 * @returns 元素對出現次數的Map
	 */
	public static mapOccurrenceTimes<T>(arr:T[]):Map<T, number>{
		let result = new Map<T,number>()
		for(let i = 0; i < arr.length; i++){
			let k = result.get(arr[i])
			if(k){
				let v = k+1
				result.set(arr[i], v)
			}else{
				result.set(arr[i], 1)
			}
		}
		return result
	}

	/**
	 * map轉對象數組
	 * @param map 
	 * @returns 
	 */
	public static mapToObjArr<K,V>(map:Map<K,V>){
		let objArr:{k:K,v:V}[] = []
		for(const [mk,mv] of map){
			objArr.push({k:mk, v:mv})
		}
		return objArr
	}

	// public static mapArrToIndexes<T,K,V>(objArr:T[], fieldAsK:keyof T, fieldAsV:keyof T){
	// 	let result = new Map<any, any[]>()
	// 	for(let i = 0; i < objArr.length; i++){
	// 		let v = result.get(objArr[i][fieldAsK])
	// 		//typeof(objArr[i][fieldAsK])
	// 		//console.log(typeof v)
	// 		//console.log(v)
			
	// 		if(v){
	// 			v.push(objArr[i][fieldAsV])
	// 			result.set(objArr[i][fieldAsK], v)
	// 		}else{
	// 			result.set(objArr[i][fieldAsK], [objArr[i][fieldAsV]])
	// 		}
	// 	}
	// 	return result as Map<K,V[]>
	// }

	// public static mapArrToIndexes<T extends Partial<Record<K, any>> & Record<V, any>, K extends keyof T, V extends keyof T>(objArr: T[], fieldAsK: K, fieldAsV: V): Map<T[K], T[V][]>{
	// 	let result = new Map<T[K], T[V][]>();
	  
	// 	for (let i = 0; i < objArr.length; i++) {
	// 		let v = result.get(objArr[i][fieldAsK]);
		
	// 		if (v) {
	// 			v.push(objArr[i][fieldAsV]);
	// 			result.set(objArr[i][fieldAsK], v);
	// 		} else {
	// 			result.set(objArr[i][fieldAsK], [objArr[i][fieldAsV]]);
	// 		}
	// 	}
	  
	// 	return result;
	// }

	/**
	 * 根據對象數組返回map。例如obj是對象數組、數組中每個元素都有字串name和數字id、則(obj, 'name', 'id')則返回 Map<string, number[]>
	 * @param objArr 對象數組
	 * @param fieldAsK 對象中的字段、該字段的值將作爲map的鍵
	 * @param fieldAsV 對象中的字段、該字段的值將作爲map的值數組中的一個元素
	 * @returns 
	 */
	public static mapFields<T, K extends keyof T, V extends keyof T>(objArr: T[], fieldAsK: K, fieldAsV: V): Map<T[K], T[V][]> {
		const isValidObj = (obj: any): obj is T => obj != null && typeof obj === 'object' && fieldAsK in obj && fieldAsV in obj;
		
		if (!objArr.every(isValidObj)) {
		  throw new Error(`Some objects in the input array are missing '${fieldAsK.toString()}' or '${fieldAsV.toString()}' properties.`);
		}
	  
		let result = new Map<T[K], T[V][]>();
	  
		for (let i = 0; i < objArr.length; i++) {
		  let v = result.get(objArr[i][fieldAsK]);
		  
		  if (v) {
			v.push(objArr[i][fieldAsV]);
			result.set(objArr[i][fieldAsK], v);
		  } else {
			result.set(objArr[i][fieldAsK], [objArr[i][fieldAsV]]);
		  }
		}
	  
		return result;
	  }


	public static sortMapIntoObj<K,V>(map:Map<K,V>, desc=true){
		let obj = Util.mapToObjArr(map)
		if(desc){
			obj = obj.sort((a,b)=>{return b.v as number - (a.v as number)})
		}
		else{
			obj = obj.sort((a,b)=>{return a.v as number - (b.v as number)})
		}
		return obj
	}

	public static nonUndefGetArr<T>(arr:(T|undefined)[]){
		
	}

	public static isMatrix(arr: any[][]): boolean {
		if (!Array.isArray(arr)) {
		  return false; // 不是数组，不是矩阵
		}
	  
		// 检查每个子数组的长度是否一致
		const subArrayLength = arr[0].length;
		for (let i = 1; i < arr.length; i++) {
		  if (!Array.isArray(arr[i]) || arr[i].length !== subArrayLength) {
			return false; // 不是矩阵
		  }
		}
	  
		return true; // 是矩阵
	  }

	
	public static transpose<T>(arr:T[][]){
		if(!Util.isMatrix(arr)){throw new Error('!Util.isMatrix(arr)')}
		return _.zip(...arr) as T[][]
	}

	public static getUnescapeStr(str:string):string{
		let result:string = str + ''  //
		
		result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')

		if(result === undefined/*  || result === 'undefined' */){
			//console.log('undefined')
			result = ''
		}
		//console.log(result)
		return result
	}

	/**
	 * 用一連串正則表達式給字符串作替換
	 * @param str 
	 * @param regexArr -正則表達式數組。循環中每次替換時會把regexArr[i][0]匹配到的內容替換成regexArr[i][1]
	 * @returns 
	 */
	//public static replace(str:string, regexArr: string[][]):string{

		// let result:string = str + '' //複製字符串
		// for(let i = 0; i < regexArr.length; i++){
		// 	if(typeof(regexArr[i][0]) !== 'string'){
		// 		throw new Error(`regexArr[i][0]) !== 'string'`)
		// 	}
		// 	if(typeof(regexArr[i][1]) !== 'string'){
		// 		regexArr[i][1] = ''
		// 	}

		// 	let left = new RegExp(regexArr[i][0], 'gm')
		// 	let right:string = SerialRegExp.getUnescapeStr(regexArr[i][1])
		// 	result = result.replace(left, right)
		// 	//result = result.replace(/./g, '$0$0')
		// 	//result = XRegExp.replace(result, left, regexArr[i][1])
		// 	//result = XRegExp.replace(result, /(.)/g, '\\U$1')
		// 	//console.log(right)
		// }
		// return result
	//}

	public static serialReplace(str:string, regexArr:string[][], mode:string):string
	public static serialReplace(str:string, regexArr:RegexReplacePair[]):string
	public static serialReplace(str:string[], regexArr:string[][], mode:string, splitter?:string):string[]
	public static serialReplace(str:string[], regexArr:RegexReplacePair[], splitter?:string):string[]
	public static serialReplace(str:string|string[], regexArr:string[][]|RegexReplacePair[], mode?:string, splitter=/* String.fromCharCode(30) */'\n'){
		let regexObjs:RegexReplacePair[] = []
		if(Array.isArray(regexArr[0])){ //對應string[][]
			regexObjs = this.regexStrArrToObjs(regexArr as string[][], mode!)
		}else{
			regexObjs = regexArr as RegexReplacePair[]
		}

		function replaceStr(str:string, serialRegex:RegexReplacePair[]){
			let result = str+''
			for(let i = 0; i < serialRegex.length; i++){
				result = result.replace(serialRegex[i].regex, serialRegex[i].replacement)
			}
			return result
		}


		if(typeof(str)==='string'){
			return replaceStr(str, regexObjs)
		}else{
			let joined:string = str.join(splitter)
			let processed:string = replaceStr(joined, regexObjs)
			return processed.split(splitter)
		}
	}

	public static regexStrArrToObjs(regexArr:string[][], mode:string){
		let result:RegexReplacePair[] = []
		for(let i = 0; i < regexArr.length; i++){
			if(typeof(regexArr[i][0]) !== 'string'){
				throw new Error(`regexArr[i][0]) !== 'string'`)
			}
			if(typeof(regexArr[i][1]) !== 'string'){
				regexArr[i][1] = ''
			}
			let left = new RegExp(regexArr[i][0], mode)
			let right:string = this.getUnescapeStr(regexArr[i][1])
			let unus:RegexReplacePair = {regex:left, replacement:right}
			result.push(unus)
		}
		return result
	}

	/**
	 * 
	 * @param mainString 
	 * @param replacement 
	 * @param start 
	 * @param end [start, end)
	 * @returns 
	 */
	// public static replaceInRange(mainString: string, replacement: string, start: number, end=replacement.length): string {
	// 	return mainString.substring(0, start) + replacement + mainString.substring(end);
	// }

	
	// public static replaceFirstSubstring(full:string, str1:string, str2:string){
	// 	let start = full.indexOf(str1)
	// 	if(start === -1){Promise.reject(str1+' non est substring de '+full)}
	// 	let end = start+str1.length
	// 	return this.replaceInRange(full, str2, start, end)
	// }
	/* public static replace(srcStr:string, left:string[], right:string[]):string{
		if(left.length !== right.length){
			throw new Error('left.length !== right.length');
		}
		let newStr = srcStr + ''
		for(let i = 0; i < left.length; i++){
			let regex = new RegExp(left[i])
			newStr = srcStr.replace(regex, right[i])
		}
		return newStr
	} */
	
	/**
	 * 
	 * @param oldStr 
	 * @param replacement 
	 * @param start 在oldStr上的起始索引
	 * @param replaceLength oldStr要被替換掉的長度
	 */
	// public static replace(oldStr:string, replacement:string, start:number, replaceLength=0):string{
	// 	if (start < 0 || start >= oldStr.length) {
	// 		// 如果起始索引超出原字符串范围，则直接返回原字符串
	// 		return oldStr;
	// 	  }
		
	// 	  // 截取原字符串中需要保留的部分
	// 	  const preservedPart = oldStr.substring(0, start);
	// 	  const end = start + replaceLength;
	// 	  const endPart = oldStr.substring(end);
		
	// 	  // 拼接替换后的新字符串
	// 	  const newStr = preservedPart + replacement + endPart;
		
	// 	  return newStr;
	// }


	public static spliceStr(str: string, start: number, deleteCount: number, replacement: string = ''): string {
		return str.slice(0, start) + replacement + str.slice(start + deleteCount);
	}

	public static printArr(arr:any[], splitter=''){
		for(let i = 0; i < arr.length; i++){
			process.stdout.write(arr[i])
			process.stdout.write(splitter)
		}
	}


}




// function t20230712092052(){
// 	//const path = require('path')
// 	console.log(path.resolve(Util.pathAt(__dirname)))
// }
// t20230712092052()

/*

type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T;  解釋一下
ChatGPT
当我们定义 type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T; 这个类型别名时，它的作用是将数组的多维嵌套结构转换为一维数组类型。让我们一步一步解释这个类型别名的含义：

type ArrayElementType<T>：这是一个类型别名的声明，它表示我们正在定义一个泛型类型别名，并用 T 表示这个泛型参数。

T extends (infer U)[]：这是一个条件类型。它判断泛型类型 T 是否是一个数组类型，即 T 是否可以赋值给 (infer U)[]。在这里，(infer U) 表示一个未知的元素类型。

?：这是 TypeScript 中的条件类型语法。当条件类型 T extends (infer U)[] 成立时，执行条件为 true 的分支，否则执行条件为 false 的分支。

ArrayElementType<U>：条件为 true 时的分支。当 T 是数组类型时，我们递归地调用 ArrayElementType 类型别名，并传入数组元素类型 U，以继续判断 U 是否是数组类型。

:：条件为 false 时的分支。当 T 不是数组类型时，直接返回 T 本身。

通过这个条件类型，我们能够一层一层地解开多维数组的嵌套结构，直到获取到最底层的元素类型。这样，我们就能够在 arrAt 方法中正确地处理多维数组，并返回正确的元素类型。

举个例子来说明：

假设我们有一个类型为 number[][] 的二维数组，使用 ArrayElementType<number[][]> 将得到 number 类型，因为 number[][] 表示一个二维数组，它的元素类型是 number[]，再继续解开 number[]，我们得到的是 number 类型。如果传入的是 string[][][]，则最终返回的是 string 类型。

这样，我们在 arrAt 方法中使用 ArrayElementType 就能够正确地获取多维数组中的元素类型，而不会受到多维嵌套结构的影响。

*/