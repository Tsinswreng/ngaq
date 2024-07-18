import {$} from "./Common"

/**
 * 自作于2024-02-16T02:26:25.000+08:00
 * 測試恐不足
 * AI曰 O(n^m)，其中n是数组的大小，m是数组中每个子数组的平均长度。
[[1], [2,3], [4,5]]// -> [[1,2,4],[1,2,5],[1,3,4],[1,3,5]]
[[1,2],[3],[4,5],[6]] // -> 1346,1356,2346,2356
 * @param arr T[][]
 * @returns T[][]
 */
export function cartesianProduct<T>(arr:T[][]):T[][]{
	if(arr.length===0){return []}
	const pos = Array<number>(arr.length)
	//const len = Array<number>(arr.length) // 每個子數組的長度、如[[1],[1,2],[1,2,3,4]]則len潙[1,2,4]
	for(let i=0;i<arr.length;i++){
		const u = arr[i]
		if(u.length === 0){return []}
		pos[i] = 0
		//len[i] = u.length
	}
	let stack = [] as T[]
	const ans:T[][] = []
	let i = 0
	let cnt = 0
	let ipp = false //潙true旹珩i++
	for(;;cnt ++){
		//先固定pos[i]潙0、使i從0迭代至極
		stack.push(
			(arr[i][pos[i]])
		)
		ipp = true
		if(stack.length === arr.length){
			ans.push(stack.slice()) // 取出結果之一ⁿ彈棧
			if(stack.length===0){return ans} // 疑冗
			stack.pop()
			pos[i]++ //i至極後再動pos[i]使從0至極。
			ipp=false
		}
		//pos[i]至極則進位
		if(pos[i]===arr[i].length){
			// pos[i] = 0
			// i--
			// if(stack.length===0){return ans}
			// stack.pop()
			for(;i>=0;){//對pos[i]加一、若滿則進位。如當每位ᵗ最大數皆潙9旹 [1,0,9] 對末位加一即得[1,1,0] (即十進制之109+1=110)。第i位潙len[i]進制、即其最大數潙len[i]-1
				if(pos[i]+1 >= arr[i].length){
					pos[i] = 0
					i--
					if(stack.length===0){return ans}
					stack.pop()
				}else{
					pos[i] += 1
					break
				}
			}
			ipp = false
		}
		if (ipp){i++}
		//if(arr[i]===void 0 || pos[i]>=arr[i].length){break}
	}
	return ans
}





/**
let a = ['a','e','i','o','u']
let b = ['z','x','c','v','b']
let ans = geneRegexReplacePair(
	['k',a,'$']
	,['g', b,]
)
console.log(ans)
->
[
	 ['ka$', 'gz']
	,['ke$', 'gx']
	,['ki$', 'gc']
	,['ko$', 'gv']
	,['ku$', 'gb']
]
2024-02-20T23:13:50.000+08:00
 * 每邊最多只能放一個數組
 * @param find 
 * @param replacement 
 */
export function geneRegexReplacePair(find:(string|string[])[], replacement:(string|string[])[]):[string,string][]{

	if(find.length === 0){
		return []
	}
	function paramToStr(pa:(string|string[])[], strInArr:string=''){
		let ans = ''
		for(let i = 0; i < pa.length; i++){
			const u = pa[i]
			if(typeof(u)==='string'){
				ans+=u
			}else{
				ans += strInArr
			}
		}
		return ans
	}
	function arrPos<T>(arr:(T|T[])[]){
		let cnt = 0
		let ans:number|undefined
		for (let i = 0; i < arr.length; i++){
			if(Array.isArray(find[i])){
				ans = i
				//break
				cnt++
			}
		}
		if(cnt>1){throw new Error('more than one array')}
		return ans
	}
	let findArrPos = arrPos(find)
	let replaceArrPos = arrPos(replacement)
	
	if(findArrPos == void 0){
		const left = paramToStr(find)
		const right = paramToStr(replacement)
		return [[left, right]]
	}

	//const map = new Map<string, string>()
	const map = [] as [string, string][]
	const findArr = find[findArrPos] as string[]
	let replaceArr: string[]
	if(replaceArrPos == void 0 ){
		replaceArr = []
	}else{
		replaceArr = replacement[replaceArrPos] as string[]
	}
	for(let i = 0; i < findArr.length; i++){
		const k = findArr[i]
		const v = replaceArr[i]??''
		map[i] = [k,v]
	}

	const ans:[string,string][]=[]
	
	for(let i = 0; i < map.length; i++){
		const kv = map[i]
		const uLeft = paramToStr(find, kv[0])
		const uRight = paramToStr(replacement, kv[1])
		ans[i] = [uLeft, uRight]
	}

	return ans

}


import { group } from "./tools/group"
export {group}

import { getShuffle } from "./tools/getShuffle"
export {getShuffle}


/**
 * 對長度一個分組
 * @param length 總長度
 * @param memberPerGrout 每組之元素個數。末尾不足者自成一組
 * @returns 分組區間
 * 如 fn(11, 5) 即 返回 [[0,4], [5,9], [10,10]]
 */
export function lengthGroup(length:int, memberPerGrout:int):[int, int][]{
	if(memberPerGrout <= 0){
		throw new RangeError(`${memberPerGrout}\nmemberAmount <= 0`)
	}
	const groupCnt = Math.ceil(length / memberPerGrout) //組數
	//const mod = length % memberPerGrout
	const ans = [] as [int, int][]
	for(let i = 0; i < groupCnt; i++){
		let start = i*memberPerGrout
		if(i !== groupCnt-1){
			const ua = [start, start+memberPerGrout-1] as [int, int]
			ans.push(ua)
		}else{
			const ua = [start, length-1] as [int, int]
			ans.push(ua)
		}
	}
	return ans
}

import { randomIntArr } from "./tools/randomIntArr"
export {randomIntArr}





/**
 * 數組ᵘ判斷a是否b之真子集
 * <待叶:判斷對象>
 * @param a 
 * @param b 
 */
export function is_properSubsetOf_<T>(a:T[],b:T[]){
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


export function getNewArrByIndexes<T>(arr:T[], indexes:number[], checkBound:boolean=false){
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


export function 有重複排列<T>(seto:T[]|Set<T>, n:number){
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
		result.push(getNewArrByIndexes(setArr, outIndexes[i], true))//t
	}
	return result
}


function permute<T>(elements: T[], m: number): T[][] {
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
123456 3
123 124 125 126
134 135 136
145 146
156
234 235 236
245 246
256
345 346
356
456
 * 無放回抽取
 * 自作于 2024-03-14T21:38:10.000+08:00
 * @param arr 
 * @param cnt 從中抽取的元素個數
 */
export function permutation<T>(arr:T[], cnt:number):T[][]{
	if( arr.length < cnt ){return []}
	if( cnt <= 0 ){return []}
	const stack = [] as T[]
	const pos = [] as number[]
	for(let i = 0; i < cnt; i++){
		if(i === 0){
			pos[i] = 0
		}else{
			pos[i] = pos[i-1] + 1
		}
	}// 當cnt潙3旹 則pos潙[0,1,2]
	const ans = [] as T[][]
	let ipp = false
	for(let i = 0;;){
		ipp = true
		if( stack.length === cnt ){
			ans.push(stack.slice())
			if(stack.length === 0){return ans}
			stack.pop()
			ipp = false
			pos[i]++
			// 0,1,5
			for(let j = i, k = 0; j>=0; j--, k++){
				if( pos[j]>= arr.length-k ){
					pos[j] = 0
					pos[j-1]++
					if(stack.length === 0){return ans}
					stack.pop()
					ipp = true
					i--
				}else{
					break
				}
			}
		}
		if(pos[i]<=pos[i-1]){pos[i] = pos[i-1]+1;continue}
		stack.push(arr[ pos[i] ])
		if(ipp && i<cnt-1){i++}
	}
}

/**
 * [1,2,3,4] -> [[4],[3,4],[2,3,4],[1,2,3,4]]
 * @param arr 
 * @returns 
 */
export function abc_to_c_bc_abc<T>(arr:T[]){
	const ans = [] as T[][]
	for(let j=0,i = arr.length-1; i>=0; i--,j++){
		const u = arr[i]
		if(j === 0){
			const ua = [u]
			ans.push(ua)
		}else{
			let last = ans[j-1]
			const ua = [u,...last]
			ans.push(ua)
		}
	}
	return ans
}


/**
 * //TODO test
 * @param arr 
 * @param fn 
 * @returns 
 */
export function distinct<T, U>(arr:T[], fn:(ele:T)=>U){
	const ans = [] as T[]
	const set = new Set<U>()
	for(let i = 0; i < arr.length; i++){
		const ele = arr[i]
		const v = fn(ele)
		if(set.has(v)){

		}else{
			ans.push(ele)
			set.add(v)
		}
	}
	return ans
}

import { classify } from "./tools/classify"
export {classify}

export function diffMapByKey<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
	const ans = new Map<K, V>();
	map1.forEach((value, key) => {
		if (!map2.has(key)) {
			ans.set(key, value);
		}
	});

	return ans;
}

export { key__arrMapPush } from "./tools/key__arrMapPush"
/* 
arr1=[
	{text:'a', num:1}
	,{text:'b', num:2}
	,{text:'c', num:3}
]
arr2=[
	{text:'a', num:1}
	,{text:'b', num:2}
	,{text:'d', num:4}
]
diffAs(arr1, arr2, (e)=>e.num)
//TODO test
*/
export function diffArr<ArrEle, Fld>(arr1:ArrEle[], arr2:ArrEle[], fn:(key:ArrEle)=>Fld){
	// const map1 = new Map<Fld, ArrEle>()
	// const map2 = new Map<Fld, ArrEle>()
	const map1 = classify(arr1, fn)
	const map2 = classify(arr2, fn)
	const ans = diffMapByKey(map1, map2)
	return ans
}

export {keyMirror} from '@shared/tools/keyMirror'
export {splitAtLength} from '@shared/tools/splitAtLength'
export {splitAtHeadLength} from '@shared/tools/splitAtHeadLength'