//[23.07.09-2234,]
export default class Txt{
	private constructor(){}
	
	/**
	 * 統一ˢ換行符、默認統一作\n
	 * @param str 
	 * @param newline 
	 * @returns 
	 */
	public static unifyNewline_s(str:string, newline='\n'):string{
		let result = str.replace(/(\r\n)/g, newline)
		result = result.replace(/\r/g, newline);
		return result
	}

	/**
	 * 從 未按行分割的 一連串正則表達式 中 獲取正則表達式數組。
	 * @param unsplitedStr 
	 * @param regexSpliter 
	 * @returns 
	 */
	public static getRegExp(unsplitedStr:string, regexSpliter:string):string[][]{
		let result:string[][] = []
		let half:string[] = Txt.spliteStrByNewline_s(unsplitedStr)
		for(let i = 0; i < half.length; i++){
			result[i] = Txt.spliteStrBy_(half[i], regexSpliter)
		}
		return result//result[3][0]即第四行左式、result[3][1]即第四行右式
	}

	/**
	 * 分割字符串
	 * @param str 
	 * @param regexSpliter -ʃᶤ分割ᵗ依據、可潙單個字符也可潙正則表達式
	 * @returns 
	 */
	public static spliteStrBy_(str:string, regexSpliter:string):string[]{
		let result:string[] = []
		const reg = new RegExp(regexSpliter, 'g')
		result = str.split(reg)
		return result;
	}

	/**
	 * 按照換行符分割字符串、
	 * @param str 
	 * @returns -分割後所得的字符串數組
	 */
	public static spliteStrByNewline_s(str:string):string[]{
		str = Txt.unifyNewline_s(str)
		let result:string[] = Txt.spliteStrBy_(str, '\n')
		return result
	}

	/**
	 * 從字符串中獲取二維數組表格
	 * @param tableStr 
	 * @param splitter 同一行中分割單元格的依據、默認製表符
	 * @returns 
	 */
	public static getTableFromStr(tableStr:string, splitter='\t'):string[][]{
		let tableStr2:string = Txt.unifyNewline_s(tableStr)
		let result:string[][] = []
		let half:string[] = []
		half = Txt.spliteStrByNewline_s(tableStr2)
		
		for(let i = 0; i < half.length; i++){
			result[i] = half[i].split(splitter)
		}
		return result
	}


	/**
	 * 刪除單行註釋
	 * @param str 
	 * @param patternOfFlag 單行註釋標誌對應的正則表達式字符串。若與正則表達式的元字符重合則需轉義、否則按元字符處理
	 * @returns 
	 */
	public static removeSingleLineComments_s(str:string, patternOfFlag:string){
		// let lines:string[] = Txt.spliteStrByNewline_s(str)
		// for(let i = 0; i < lines.length; i++){
		// }
		let pattern = patternOfFlag+'.*$'
		let regex = new RegExp(pattern, 'gm')
		//console.log(regex)//t
		return str.replace(regex, '')
	}

	/**
	 * 把一維字符串數組合併成文本、換行符默認用\n
	 * @param strArr 
	 * @param newLine 
	 */
	public static mergeArrIntoStr(strArr: string[], newLine?: string): string;

	/**
	 * 把二維字符串數組表格合併成文本、換行符默認用\n、同一行的表格分割符默認用製表符
	 * @param strArr 
	 * @param newLine 
	 * @param separator 
	 */
	public static mergeArrIntoStr(strArr: string[][], newLine?: string, separator?: string): string;
	public static mergeArrIntoStr(arr: string[][] | string[], newLine: string = '\n', separator: string = '\t'): string {
		if (Array.isArray(arr[0])) {
			// 处理二维数组的情况
			const result = (arr as string[][]).map((subArr) => subArr.join(separator)).join(newLine);
			return result;
		} else {
			// 处理一维数组的情况
			const result = (arr as string[]).join(newLine);
			return result;
		}
	}

	/**
	 * 字符串數組以正則表達式過濾
	 * @param strArr 
	 * @param patternStr 
	 * @returns 
	 */

	public static getFilted(strArr:string[], patternStr:string):string[]{
		let regex = new RegExp(patternStr/* , 'g' */)
		
		let result:string[] = []
		for(let i = 0; i < strArr.length; i++){
			regex.lastIndex = 0;
			//console.log(regex+'.test(\''+strArr[i]+'\')')
			//console.log(regex.test(strArr[i]))
			if(regex.test(strArr[i])){
				result.push(strArr[i])
				//console.log('push: '+strArr[i])
			}
			//console.log('2')
			//console.log(regex+'.test(\''+strArr[i]+'\')')
			//console.log(regex.test(strArr[i]))

		}
		//console.log('result: '+result)//t
		return result
	}

	public static getMappedIndexes<T>(column1:T[], column2:T[]):Array<number[]|undefined>{
		let result:Array<number[]|undefined> = []
		let c2map = new Map<T, number[]>()
		for(let i = 0; i < column2.length; i++){
			let v:number[]|undefined = c2map.get(column2[i])
			if(v){
				v.push(i)
				c2map.set(column2[i], v)
			}else{

				c2map.set(column2[i], [i])
			}
		}
		//for(let e of l2map){console.log(e)}
		for(let i = 0; i < column1.length; i++){
			result[i] = c2map.get(column1[i])
		}
		return result
	}

	/**
	 * 獲取字符串中的字符數
	 * @param str 
	 * @returns 
	 */
	public static countChar(str:string) {
		// 使用正则表达式匹配字符串中的所有字符（包括Unicode字符）
		const regex = /./gu;
		const matches = str.match(regex);
	  
		// 返回字符的真实数量
		return matches ? matches.length : 0;
	}

	

//, separator='\t'
}