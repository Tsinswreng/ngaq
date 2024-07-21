import { classify } from "./classify"
import { diffMapByKey } from "./diffMapByKey"
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
fn(arr1, arr2, (e)=>e.num) -> Map{3=>[{text:'c', num:3}]}
*/
export function diffArrIntoMap<ArrEle, Fld>(arr1:ArrEle[], arr2:ArrEle[], fn:(key:ArrEle)=>Fld){
	const map1 = classify(arr1, fn)
	const map2 = classify(arr2, fn)
	const ans = diffMapByKey(map1, map2)
	return ans
}