//[23.07.09-2232,]
//const fs = require('fs')
//import {RegexReplacePair} from '';
import * as fs from 'fs';
import * as path from 'path'
import now from 'performance-now';
import _, { last } from 'lodash'
import dayjs from 'dayjs';


//type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T;//假设我们有一个类型为 number[][] 的二维数组，使用 ArrayElementType<number[][]> 将得到 number 类型，因为 number[][] 表示一个二维数组，它的元素类型是 number[]，再继续解开 number[]，我们得到的是 number 类型。如果传入的是 string[][][]，则最终返回的是 string 类型。



/**
 * 正則表達式替換組。
 */
export interface RegexReplacePair{
	regex:RegExp,
	replacement:string
}

export function add(a:number, b:number){
	return a+b
}

export function sub(a:number, b:number){
	return a-b
}

export function mul(a:number, b:number){
	return a*b
}

export function div(a:number, b:number){
	return a / b
}

export function eq(a:number, b:number){
	return a === b
}

// export function bigger(a:number, b:number){

// }

export function lastOf<T>(arr:T[]):T{
	return arr[arr.length-1]
}

/**
 * nonUndefinedGet
 * @param v 
 * @param fn 
 * @param errMsg 
 * @returns 
 */
export function nug<T, U=undefined>(v: T | undefined, errMsg?:string):Exclude<T, U>{
	if(v === void 0){
		throw new Error(errMsg)
	}
	return v as Exclude<T, U>
}


// export function nug<T>(v: T | undefined, fn:undefined|((v:T|undefined)=>void), errMsg?:string): Exclude<T, undefined> {
// 	if(fn === undefined){
// 		fn = (v)=>{throw new Error(errMsg)}
// 	}
// 	if (v === undefined) {
// 		fn(v)
// 	}
// 	return v as Exclude<T, undefined>;
// }

/**
 * 判空後返回
 * @param v 
 * @param errMsg 
 * @returns 
 */
export function $<T>(v:T, errMsg?:string): NonNullable<T>{
	if(v === void 0){
		throw new Error(errMsg)
	}
	if(v === null){
		throw new Error(errMsg)
	}
	return v as NonNullable<T>
}

/**
 * 集合取並集
 * @param s1 
 * @param s2 
 * @returns 
 */
export function union<T>(s1:T[], s2:T[]):T[]
export function union<T>(s1:Set<T>, s2:Set<T>):Set<T>

export function union<T>(s1:T[]|Set<T>, s2:T[]|Set<T>){
	
	if(Array.isArray(s1)){
		return Array.from(new Set([...s1, ...s2]))
	}else{
		return new Set([...s1, ...s2])
	}
	
}

/**
 * 檢 路徑是存在、若存在則原樣返回
 * @param dir 
 * @returns 
 */
export function pathAt(dir:string):string{
	if(!fs.existsSync(dir)){
		console.error('<absoluteDir>')
		console.error(path.resolve(dir))
		console.error('</absoluteDir>')
		throw new Error('file not found')
	}
	return dir
}


export function measureTime(fn:()=>void){
	const startTime = now();
	fn();
	const endTime = now();
	const executionTime = endTime - startTime;
	return executionTime;
}

/**
 * map轉對象數組
 * @param map 
 * @returns 
 */
export function mapToObjArr<K,V>(map:Map<K,V>){
	let objArr:{k:K,v:V}[] = []
	for(const [mk,mv] of map){
		objArr.push({k:mk, v:mv})
	}
	return objArr
}

/**
 * 連續正則表達式ᶤ替換
 * @param str 
 * @param regexArr 
 * @param mode 
 */
export function serialReplace(str:string, regexArr:string[][], mode:string):string
export function serialReplace(str:string, regexArr:RegexReplacePair[]):string
export function serialReplace(str:string[], regexArr:string[][], mode:string, splitter?:string):string[]
export function serialReplace(str:string[], regexArr:RegexReplacePair[], splitter?:string):string[]

export function serialReplace(str:string|string[], regexArr:string[][]|RegexReplacePair[], mode?:string, splitter=/* String.fromCharCode(30) */'\n'){
	let regexObjs:RegexReplacePair[] = []
	if(Array.isArray(regexArr[0])){ //對應string[][]
		regexObjs = regexStrArrToObjs(regexArr as string[][], mode!)
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

export function regexStrArrToObjs(regexArr:string[][], mode:string){
	let result:RegexReplacePair[] = []
	for(let i = 0; i < regexArr.length; i++){
		if(typeof(regexArr[i][0]) !== 'string'){
			throw new Error(`regexArr[i][0]) !== 'string'`)
		}
		if(typeof(regexArr[i][1]) !== 'string'){
			regexArr[i][1] = ''
		}
		let left = new RegExp(regexArr[i][0], mode)
		let right:string = getUnescapeStr(regexArr[i][1])
		let unus:RegexReplacePair = {regex:left, replacement:right}
		result.push(unus)
	}
	return result
}


export function getUnescapeStr(str:string):string{
	let result:string = str + ''  //
	
	result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\\\/g, '\\')

	if(result === undefined/*  || result === 'undefined' */){
		//console.log('undefined')
		result = ''
	}
	//console.log(result)
	return result
}

/**
 * 統計數組中各元素出現的次數
 * @param arr 
 * @returns 元素對出現次數的Map
 */
export function mapOccurrenceTimes<T>(arr:T[]):Map<T, number>{
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
 * 根據對象數組返回map。例如obj是對象數組、數組中每個元素都有字串name和數字id、則(obj, 'name', 'id')則返回 Map<string, number[]>
 * @param objArr 對象數組
 * @param fieldAsK 對象中的字段、該字段的值將作爲map的鍵
 * @param fieldAsV 對象中的字段、該字段的值將作爲map的值數組中的一個元素。皆只支持當前層級的基本數據類型的字段
 * @returns 
 */
export function mapFields<T, K extends keyof T, V extends keyof T>(objArr: T[], fieldAsK: K, fieldAsV: V): Map<T[K], T[V][]> {
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


export function deprecated_sortMapIntoObj<K>(map:Map<K,number>, desc=true){
	let obj = mapToObjArr(map)
	if(desc){
		obj = obj.sort((a,b)=>{return b.v - (a.v)})
	}
	else{
		obj = obj.sort((a,b)=>{return a.v - (b.v)})
	}
	return obj
}

export function spliceStr(str: string, start: number, deleteCount: number, replacement: string = ''): string {
	return str.slice(0, start) + replacement + str.slice(start + deleteCount);
}

/**
 * 二維數組轉置
 * @param arr 
 * @param insteadOfUndef 原arr中的undefined元素對應在返回值中將被替換成insteadOfUndef。若不填則會調用isLikeMatrix()檢查arr是否合法
 * @returns 
 */
export function transpose<T>(arr:T[][], insteadOfUndef?){
	if(insteadOfUndef === undefined){
		if(!Ut.isLikeMatrix(arr)){throw new Error('!Util.isMatrix(arr)')}
		return _.zip(...arr) as T[][]
	}else{
		return tr(arr, insteadOfUndef)
	}
	function tr(arr:T[][], insteadOfUndef){
		let max2DLength = findLongest2DLength(arr)
		//let result:T[][] = new Array(max2DLength).fill(new Array(arr.length).fill(undefined))
		let result:T[][] = [[]]
		//console.log(result)
		for(let i = 0; i < max2DLength; i++){
			result[i] = []
		}
		
		for(let i = 0; i < arr.length; i++){
			//result[i] = []
			for(let j = 0; j < max2DLength; j++){
				let cur = arr[i][j]??insteadOfUndef
				result[j][i] = cur
			}
		}
		return result
	}
	function findLongest2DLength(arr:any[][]){
		let max=arr[0].length
		for(let i = 0; i < arr.length; i++){
			if(arr[i].length>max){max=arr[i].length}
		}
		return max
	}
	
}

export function YYYYMMDDHHmmss(){
	return dayjs().format('YYYYMMDDHHmmss')
}
export function YYYYMMDDHHmmssSSS(){
	return dayjs().format('YYYYMMDDHHmmssSSS')
}

export function printArr(arr:any[], splitter=''){
	for(let i = 0; i < arr.length; i++){
		process.stdout.write(arr[i])
		process.stdout.write(splitter)
	}
}

/**
 * 求兩數組的笛卡爾積
 * @param arr1 
 * @param arr2 
 * @returns 
 */
export function cartesianProduct<A,B>(arr1: A[], arr2: B[]) {
	const result: [A,B][] = [];
	for (const item1 of arr1) {
		for (const item2 of arr2) {
			result.push([item1, item2]);
		}
	}
	return result
}

/**
 * 用集合的標準過濾數組、例如傳入 [[a,a],[a,b],[b,a],[a,c]] 則返回 [[a,b], [a,c]]
 * @param arr 
 * @returns 
 */
export function filterArrLikeSets<A,B>(arr: [A, B][]){
	const seenPairs = new Set<string>();
	const uniquePairs: [A, B][] = [];
	for (const pair of arr) {
		if (pair[0] as any !== pair[1]) { //<待叶>{如何在函數中比較兩個泛型類型是否是同一類型}
			const sortedPair = pair.slice().sort();
			const pairKey = `${sortedPair[0]},${sortedPair[1]}`;
		
			if (!seenPairs.has(pairKey)) {
				seenPairs.add(pairKey);
				uniquePairs.push(pair);
			}
		}
	}
	
	return uniquePairs;
}


export function getCombinationsWithRepetition<T>(set: T[], n: number): T[][] {
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

export function objArrToStrArr<T>(objArr:T[]){
	let result:string[][] = []
	for(let i = 0; i < objArr.length; i++){
		let line:string[] = []
		for(let key in objArr[i]){
			// console.log(`console.log(key)`)
			// console.log(key)
			// console.log(`console.log(objArr[i][key])`)
			// console.log(objArr[i][key])
			let e:any = objArr[i][key]
			if(!e){e=''}
			line.push(e.toString())
		}
		result.push(line)
	}
	return result
}














/**
 * [2023-09-09T15:34:49.000+08:00,]<>{欲重構、把各函數各自導出。}
 */
export default class Ut {
	
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

	

	/* public static arrAt<T extends any[]>(arr: T, ...indexPath: number[]): ArrayElementType<T> {
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
	} */



	public static nonFalseGet<T>(v:T){

		if(!v){throw new Error(v+'')}
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
			result.push(Ut.getNewArrByIndexes(setArr, outIndexes[i], true))//t
		}
		return result
	}

	public static getNewArrByIndexes<T>(arr:T[], indexes:number[], checkBound:boolean=false){
		let result:T[] = []
		if(checkBound){
			for(let i = 0; i < indexes.length; i++){
				result.push($(arr[indexes[i]]))
			}
		}else{
			for(let i = 0; i < indexes.length; i++){
				result.push(arr[indexes[i]])
			}
		}

		return result
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



	public static isLikeMatrix(arr: any[][]): boolean {
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






	/**
	 * AI寫的創建多維數組並填充(試驗)
	 * 創建一個2行3列的string[][]且使每個元素都是'a'
	 * let arr2 = Util.createArr<string>([2,3], 'a')
	 * @param dimensions 
	 * @param fill 
	 * @returns 
	 */
	public static createArr<T>(dimensions: number[], fill: any){
		if (dimensions.length === 0) {
			throw new Error("Dimensions array should not be empty");
		}
	
		const result: T[][] = [];
	
		function fillArray(dims: number[], depth: number): T | T[] {
			const currentDimension = dims[depth];
			const isLastDimension = depth === dims.length - 1;
	
			if (isLastDimension) {
				return Array(currentDimension).fill(fill) as unknown as T;
			} else {
				const subArray: T[] = [];
				for (let i = 0; i < currentDimension; i++) {
					subArray.push(fillArray(dims, depth + 1) as T);
				}
				return subArray;
			}
		}
	
		return [fillArray(dimensions, 0)];
	}
	


	

	public static permute<T>(elements: T[], m: number): T[][] {
		const result: T[][] = [];
	  
		function backtrack(tempArr: any[]) {
			if (tempArr.length === m) {
				result.push([...tempArr]);
				return;
			}
		
			for (let i = 0; i < elements.length; i++) {
				if (!tempArr.includes(elements[i])) {
					tempArr.push(elements[i]);
					backtrack(tempArr);
					tempArr.pop();
				}
			}
		}
	  
		backtrack([]);
		return result;
	}






	/**
	 * 取對象數組的某個字段的值組成一個新數組並返回
	 * @param arr 
	 * @param field 
	 * @returns 
	 */
	public static extractFieldValues<T extends any, K extends keyof T>(arr: T[], field: K): T[K][] {
		return arr.map((obj) => obj[field]);
	}




	/**
	 * json字串轉數字數組 如 '["1","2.3"]' --> 
	 * @param json 
	 * @returns 
	 */
	public static parseJsonNumArr(json:string){
		let strArr:string[] = JSON.parse(json)
		if(!Array.isArray(strArr)){
			console.error(json)
			throw new Error(`json解析之後不是數組\n${json}`)
		}
		let numArr = strArr.map((e)=>{return parseFloat(e)})
		return numArr
	}

	/**
	 * 判斷text中的str1與str2是否配對。若str1與str2皆無亦算已配對。
	 * @param text 
	 * @param str1 
	 * @param str2 
	 * @returns 
	 */
	public static isMatchInPair(text:string, str1:string, str2:string):boolean
	public static isMatchInPair(text:string, pairs:([string,string])[]):boolean

	public static isMatchInPair(text:string, pairs:([string,string])[]|string, p3?:string){
		function f(text:string, str1:string, str2:string){
			const regex = new RegExp(`${str1}|${str2}`, 'g')
			const matches = text.match(regex)
			if(!matches||matches.length===0){
				return true
			}
	
			let stack:string[] = []
			for(let i = 0; i < matches.length; i++){
				if(matches[i]===str1){stack.push(str1)}
				else if(matches[i]===str2){
					if(stack.length===0){return false}
					stack.pop()
				}
			}
			return stack.length === 0
		}

		if(p3!==undefined){
			return f(text, pairs as string, p3)
		}else{
			//......
		}
		
	}


	/**
	 * 轉換日期格式
	 * @param oldDate 
	 * @param oldFormat 
	 * @param neoFormat 
	 * @returns 
	 */
	public static convertDateFormat(oldDate:string, oldFormat:string, neoFormat:string):string
	public static convertDateFormat(oldDate:string[], oldFormat:string, neoFormat:string):string[]

	public static convertDateFormat(oldDate:string|string[], oldFormat:string, neoFormat:string){
		if(typeof(oldDate)==='string'){
			let obj = dayjs(oldDate, oldFormat)
			return obj.format(neoFormat)
		}else{
			let oldDates = oldDate
			let r:string[] = []
			for(const oldDate of oldDates){
				let obj = dayjs(oldDate, oldFormat)
				r.push(obj.format(neoFormat))
			}
			return r
		}
		
	}


	/**
	 * 數組ᵘ判斷a是否b之真子集
	 * <待叶:判斷對象>
	 * @param a 
	 * @param b 
	 */
	public static is_properSubsetOf_<T>(a:T[],b:T[]){
		let s1 = new Set([...a])
		let s2 = new Set([...b])
		if(s1.size >= s2.size){
			return false;
		}
		for(const item of s1){
			if(!s2.has(item)){
				return false;
			}
		}
		return true
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