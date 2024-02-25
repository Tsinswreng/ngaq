import 'tsconfig-paths/register'
import * as Ut from "@shared/Ut"
const $ = Ut.$
console.log("一二三")

class Tvs{
	path:string=''
	constructor(path:string){
		this.path = path
	}

	write

	
}


function out(){
	let a = 1
	let b = 2
	return ()=>{
		a+=1;
		return a
	}
}

let o1 = out()
let o2 = out()

// console.log(o1())
// console.log(o2())

/*
[[a], [b,c], [d], [e,f]]
->[abde, acde, abdf, acdf]

[[a,b], [c,d,e]]
->[ac,ad,ae,bc,bd,be] T[][]
00 10 -> ac
00 11 -> ad
00 12 -> ae
01 10 -> bc
01 11 -> bd
01 12 -> be

i,j
i=0,j=0
[0,0] [0,1] [0,2] [1,0] [1,1], [1,2]

stack = []
stack: [a]
stack.push(c)
stack: [ac]
stack.length == arr.length
stack now add to answer
stack.pop()
stack is [a]
someThing++
stack.push(d)
stack is [ad]
stack.length == arr.length
stack now add to answer
stack.pop()
stack is [a]
00 10 20 30
01 11 21 31
02 12 22 32
*/
function plusOne(len:number[], numArr:number[], pos:number){
	const max = len[pos] - 1
	let i = pos
	for(;i>=0;){
		if(numArr[i] + 1 > max){
			numArr[i] = 0
			i--
		}else{
			numArr[i] += 1
			break
		}
	}
}

/**
 * 自作于2024-02-16T02:26:25.000+08:00
 * 測試恐不足
 * @param arr 
 * @returns 
 */
function arrCombination<T>(arr:T[][]):T[][]{
	if(arr.length===0){return []}
	const pos = Array<number>(arr.length)
	const len = Array<number>(arr.length) // 每個子數組的長度、如[[1],[1,2],[1,2,3,4]]則len潙[1,2,4]
	for(let i=0;i<arr.length;i++){
		const u = arr[i]
		if(u.length === 0){return []}
		pos[i] = 0
		len[i] = u.length
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
			ans.push(stack.slice())
			if(stack.length===0){return ans}
			stack.pop()
			pos[i]++
			ipp=false
		}
		if(pos[i]===arr[i].length){
			pos[i] = 0
			i--
			if(stack.length===0){return ans}
			stack.pop()
			for(;i>=0;){
				if(pos[i]+1 >= len[i]){
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
	//console.log(cnt)
	return ans
}

import * as algo from '@shared/algo'

function testComb(numArr:any[]){
	const ans = algo.arrCombination(numArr)
	console.log(ans)
	console.log()
}


testComb([[1], [2,3], [4,5]])
testComb([[1,2],[3],[4,5],[6]])
testComb([[1],[2],[3],[4,9]])
testComb([[1],[2],[3],[4,9,8]])




// const len = [10,10,10]
// const numArr = [8,9,9]
// plusOne(len, numArr, 2)
// console.log(numArr)