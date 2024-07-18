import { randomIntArr } from "./randomIntArr"
import { group } from "./group"

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