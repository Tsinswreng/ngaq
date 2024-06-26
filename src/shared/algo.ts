import { KeyMirror } from "./Type"
import {$} from "./Ut"

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


/**
 * 數組分組
 * @param arr 
 * @param memberAmount 足夠分旹每組元素ᵗ數。不足旹餘者作一組。
 * @returns 
 * @instance
 * 
 * 	let arr = [0,1,2,3,4,5,6,7,8,9,10]
 * 	let g = group(arr, 5)
 * [ [ 0, 1, 2, 3, 4 ], [ 5, 6, 7, 8, 9 ], [ 10 ] ]
 * 
 */
export function group<T>(arr:T[], memberAmount:number){
	if(memberAmount <= 0){
		throw new RangeError(`${memberAmount}\nmemberAmount <= 0`)
	}
	const result:T[][] = []
	let unusGroup:T[] = []
	for(let i=0; ; i++){
		unusGroup.push(arr[i])
		if(unusGroup.length===memberAmount){
			result.push(unusGroup)
			unusGroup = []
		}
		if(i===arr.length-1){
			if(unusGroup.length!==0){
				result.push(unusGroup)
			}
			break
		}
	}
	return result
}

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

export function randomIntArr(min:number, max:number, howMany:number, allowDuplicate=true){
	if(allowDuplicate===false){
		return non_duplicateInt(min, max, howMany)
	}else{
		return duplicateInt(min, max, howMany)
	}
	function duplicateInt(min:number, max:number, howMany:number){
		const result:number[] = []
		for(let i = 0; i < howMany; i++){
			let unusRandom = Number(max-min)* Math.random()+Number(min)
			result.push(Math.floor(unusRandom))
		}
		return result
	}
	/**
	 * GPT寫的
	 */
	function non_duplicateInt(min: number, max: number, howMany: number) {
		if (max - min + 1 < howMany) {
			throw new Error(`max - min + 1 < howMany`);
		}
		//创建一个包含从 min 到 max 的所有整数的数组。
		const integerArray = Array.from({ length: max - min + 1 }, (_, index) => index + min);
		for (let i = integerArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[integerArray[i], integerArray[j]] = [integerArray[j], integerArray[i]];
		}
		return integerArray.slice(0, howMany);
	}
}


/**
 * 取打亂後ᵗ數組
 * 整體ᵗ思想: 從整ᵗ數組中隨機取 @see totalDisorderAmount 個元素。把數組按 @see groupMemberAmount-1 個一組 分成若干組(末ʸ不足者自成一組)、再把前ʸ隨機取出ᵗ元素均ᵈ分予各組、插入到各組ᵗ末。若分配後猶有餘則皆予末組。
 * @param arr 
 * @param groupMemberAmount 每組幾個元素
 * @param totalDisorderAmount 總ᵗ亂序ᵗ元素ᵗ數
 * @instance
 * let arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
 * let s = getShuffle(arr, 5, 4)
 * [
  0,  2,  3,  4, 15,  5,  6,
  8,  9, 17, 10, 11, 12, 13,
  1, 14, 16, 18, 19,  7, 20
]  //
 * @returns 
 */
export function getShuffle<T>(arr:T[], groupMemberAmount:number, totalDisorderAmount:number){
	//$a(arr, '不能打亂空數組')
	if(arr.length === 0){
		return arr
	}
	const copy:(T|null)[] = arr.slice()
	const maxIndex = arr.length -1
	//
	const randomIndexs = randomIntArr(0, maxIndex, totalDisorderAmount, false)

	//在copy中把曩ʸ取出ᵗ元素ᵗ處ʸ設null
	for(let i = 0; i < randomIndexs.length; i++){
		copy[randomIndexs[i]] = null
	}
	const copyWithoutNull:T[] = []
	for(const c of copy){
		if(c!==null){
			copyWithoutNull.push(c)
		}
	}
	//對copyWithoutNull分組、每組groupMemberAmount-1個元素。末ʸ不足者自成一組。
	const groups = group(copyWithoutNull, groupMemberAmount-1)
	//每組最多能得幾個亂序元素
	const disorderAmountForEachGroup = Math.ceil(totalDisorderAmount/groups.length)
	let k = 0
	//遍歷groups、disorderAmountForEachGroup個ᵗ曩取出ᵗ亂序元素ˇ添ᵣ每組之末ʸ
	for(let i = 0; i < groups.length; i++){
		for(let j = 0; j < disorderAmountForEachGroup; j++){
			if(randomIndexs[k]===void 0){break}
			groups[i].push(arr[randomIndexs[k]])
			k++
		}
	}
	//曩取出ᵗ亂序元素芝未盡分配者ˇ全ᵈ予末ᵗ組
	for(;randomIndexs[k]!==void 0;k++){
		groups[groups.length-1].push(arr[randomIndexs[k]])
	}
	const result:T[] = []
	for(const g of groups){
		result.push(...g)
	}
	return result
}


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

/**
 * 
 * @param arr 
 * @param keyOfMap 返ᵗ值ˋ作Map之鍵
 * @returns 
 */
export function classify<Ele,Key>(arr:Ele[], keyOfMap:(ele:Ele)=>Key){
	const ans = new Map<Key, Ele[]>()
	for(const e of arr){
		const key = keyOfMap(e)
		let got = ans.get(key)
		if(got == void 0){
			ans.set(key, [e])
		}else{
			got.push(e)
			ans.set(key, got)
		}
	}
	return ans
}


export function diffMapByKey<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
	const ans = new Map<K, V>();
	map1.forEach((value, key) => {
		if (!map2.has(key)) {
			ans.set(key, value);
		}
	});

	return ans;
}

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

export function keyMirror<T extends kvobj>(obj:T){
	const ans = {}
	const keys = Object.keys(obj)
	for(const k of keys){
		ans[k] = k
	}
	return ans as KeyMirror<T>
}
