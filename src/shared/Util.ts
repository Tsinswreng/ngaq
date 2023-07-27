//[23.07.09-2232,]
//const fs = require('fs')
import * as fs from 'fs';
import * as path from 'path'
type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T;//假设我们有一个类型为 number[][] 的二维数组，使用 ArrayElementType<number[][]> 将得到 number 类型，因为 number[][] 表示一个二维数组，它的元素类型是 number[]，再继续解开 number[]，我们得到的是 number 类型。如果传入的是 string[][][]，则最终返回的是 string 类型。
export default class Util{
	
	private constructor(){}

/**
 * [23.07.09-2134,]
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

	

	public static arrAt<T extends any[]>(arr: T, ...indexPath: number[]): ArrayElementType<T> {
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
	}


	/**
	 * 檢 路徑是存在、若存在則原樣返回
	 * @param dir 
	 * @returns 
	 */
	public static pathAt(dir:string):string{
		if(!fs.existsSync(dir)){
			console.error('<absoluteDir>')
			console.error(path.resolve(dir))
			console.error('</absoluteDir>')
			throw new Error('file not found')
		}
		return dir
	}

	public static check(v:any){
		if(v === undefined){throw new Error(v+' '+undefined)}
		return v
	}

	/* public static getFieldNames<T>(obj:T):(keyof T)[]{
		return Object.keys({} as T) as (keyof T)[];
	} */
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