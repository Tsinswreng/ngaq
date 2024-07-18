import {classify} from '@shared/tools/classify'

/**
 * 例:
arr是數組、數組中每個元素都有一個屬性叫belong。
belong類型爲 'a'|'b'|'c'
fn(arr, e=>e.belong, [
	'a', 'a', 'b', 'b', 'c'
])
執行上面的函數後，arr會按每個元素的belong成員的值分組
a,a,b,b,c,a,a,b,b,c....一直循環下去
考慮邊界情況、如belong爲a的元素率先耗盡則按b,b,c,b,b,c...來排。
 * @param arr 
 * @param by 
 * @param order 
 * @returns 
 */
export function customSort<Ele, Cri>(arr:Ele[], by:(e:Ele)=>Cri, order:Cri[]){
	const ans = [] as Ele[]
	const belong__arr:Map<Cri, Ele[]> = classify(arr, by)

	for(const [k,v] of belong__arr){
		const reversed = v.reverse()
		belong__arr.set(k,v)
	}

	//k 用于循環遍歷order
	for(let i = 0, k = 0; i < arr.length; i++,k++){
		if(k>=order.length){k=0}
		//const e = arr[i]
		const belong:Cri = order[k]
		const gotArr = belong__arr.get(belong)!
		const last = gotArr.pop()
		if(last == void 0){continue}
		ans.push(last)
	}
	return ans
}
