

class ContinuousRegExp{

	public static getUnescapeStr(str:string):string{
		let result:string = str + ''  //
		/* if(str === undefined){
			throw new Error('0')
		}
		if(result === undefined ){
			throw new Error('1')
		}
		if(result === 'undefined'){
			throw new Error('2')
		} */
		
		result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')

		if(result === undefined || result === 'undefined'){
			//console.log('undefined')
			result = ''
		}
		//console.log(result)
		return result
	}

	/**
	 * 用一連串正則表達式給字符串作替換
	 * @param str 
	 * @param regexArr -正則表達式數組。循環中每次替換時會把regexArr[i][0]匹配到的內容替換成regexArr[i][1]
	 * @returns 
	 */
	public static replace(str:string, regexArr: string[][]):string{
		let result:string = str + '' //複製字符串
		for(let i = 0; i < regexArr.length; i++){
			if(typeof(regexArr[i][0]) !== 'string'){
				throw new Error(`regexArr[i][0]) !== 'string'`)
			}
			if(typeof(regexArr[i][1]) !== 'string'){
				regexArr[i][1] = ''
			}

			let left = new RegExp(regexArr[i][0], 'gm')
			let right:string = ContinuousRegExp.getUnescapeStr(regexArr[i][1])
			result = result.replace(left, right)
			//result = result.replace(/./g, '$0$0')
			//result = XRegExp.replace(result, left, regexArr[i][1])
			//result = XRegExp.replace(result, /(.)/g, '\\U$1')
			//console.log(right)
		}
		return result
	}
	/* public static replace(srcStr:string, left:string[], right:string[]):string{
		if(left.length !== right.length){
			throw new Error('left.length !== right.length');
		}
		let newStr = srcStr + ''
		for(let i = 0; i < left.length; i++){
			let regex = new RegExp(left[i])
			newStr = srcStr.replace(regex, right[i])
		}
		return newStr
	} */
}
