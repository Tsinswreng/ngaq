/**
 * 自作于2024-02-16T02:26:25.000+08:00
 * 測試恐不足
 * AI曰 O(n^m)，其中n是数组的大小，m是数组中每个子数组的平均长度。
[[1], [2,3], [4,5]]// -> 124,125,134,135
[[1,2],[3],[4,5],[6]] // -> 1346,1356,2346,2356
 * @param arr 
 * @returns 
 */
export function arrCombination<T>(arr:T[][]):T[][]{
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

