//[23.07.09-2234,]
class Txt{
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

}