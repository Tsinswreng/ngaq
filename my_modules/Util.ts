//[23.07.09-2232,]
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
				throw new Error('Index out of bounds');
			}

			const nextArray = currentArray[currentIndex];
			//const nextIndexPath = currentIndexPath.slice(1);
			currentIndexPath.shift();
			const nextIndexPath = currentIndexPath
			return traverseArray(nextArray, nextIndexPath);
		}

		return traverseArray(arr, indexPath);
	}

}