//[23.07.09-2232,]
//const fs = require('fs')
import * as fs from 'fs';
import * as path from 'path'
export default class Util{
	
	private constructor(){}

/**
 * [23.07.09-2134,]
 * 訪問數組元素、越界則拋錯誤。支持任意維數組。如需訪問arr[3][2]則arrAt(arr, 3, 2)
 * @param arr 
 * @param indexPath 
 * @returns 
 */
	public static arrAt<T>(arr: T[], ...indexPath: number[]): T {
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
}


// function t20230712092052(){
// 	//const path = require('path')
// 	console.log(path.resolve(Util.pathAt(__dirname)))
// }
// t20230712092052()
