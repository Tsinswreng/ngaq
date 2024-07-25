import {classify} from '@shared/tools/classify'
import { diffMapByKey } from './diffMapByKey'


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
order元素潙null旹、表示此位接受任意值。
 * @param arr 
 * @param by 
 * @param order 
 * @returns 
 * 
 */
export function customSort<Ele, Cri>(arr:Ele[], by:(e:Ele)=>Cri, order:(Cri|null)[]){
	const ans = [] as Ele[]
	const belong__arr:Map<Cri, Ele[]> = classify(arr, by)
	const orderSet = new Set(order)
	// 取差集 belong - order
	const belongDiffOrder = diffMapByKey(belong__arr, orderSet)
	for(const [k,v] of belong__arr){
		const reversed = v.reverse()
		belong__arr.set(k,v)
	}

	//k 用于循環遍歷order
	let added = 0
	for(let i = 0, k = 0; i < arr.length; k++){
		if(k>=order.length){
	// 若遍歷一次order中 莫ˇ加入結果數組、則闡無所匹配、遂出循環
			if(added === 0){
				break
			}else{
				k=0
				added=0
			}
		}
		//const e = arr[i]
		const belong:Cri|null = order[k]
		if(belong === void 0){
			continue
		}
		if(belong === null){
			// 若order[k]爲null、表示此位接受任意值
			for(const [keyNotInOrder,v] of belongDiffOrder){
				//@ts-ignore
				const gotArr = belong__arr.get(keyNotInOrder)
				if(gotArr == void 0){
					//@ts-ignore
					belong__arr.delete(keyNotInOrder)
					continue
				}
				
				const last = gotArr.pop()
				if(last == void 0){
					//@ts-ignore
					belong__arr.delete(keyNotInOrder)
					continue
				}
				ans.push(last)
				added++
				break
			}
			continue
		}//~if(belong === null)

		const gotArr = belong__arr.get(belong)
		if(gotArr == void 0){
			//@ts-ignore
			order[k] = void 0 //除ᵣ序列中無效者
			continue
		}
		const last = gotArr.pop()
		if(last == void 0){continue}
		ans.push(last)
		added++
	}
	return ans
}
