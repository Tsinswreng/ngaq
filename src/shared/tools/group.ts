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