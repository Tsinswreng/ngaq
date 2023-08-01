
export class SerialRegExp {

	public static getUnescapeStr(str:string):string{
		let result:string = str + ''  //
		
		result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')

		if(result === undefined/*  || result === 'undefined' */){
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
	//public static replace(str:string, regexArr: string[][]):string{

		// let result:string = str + '' //複製字符串
		// for(let i = 0; i < regexArr.length; i++){
		// 	if(typeof(regexArr[i][0]) !== 'string'){
		// 		throw new Error(`regexArr[i][0]) !== 'string'`)
		// 	}
		// 	if(typeof(regexArr[i][1]) !== 'string'){
		// 		regexArr[i][1] = ''
		// 	}

		// 	let left = new RegExp(regexArr[i][0], 'gm')
		// 	let right:string = SerialRegExp.getUnescapeStr(regexArr[i][1])
		// 	result = result.replace(left, right)
		// 	//result = result.replace(/./g, '$0$0')
		// 	//result = XRegExp.replace(result, left, regexArr[i][1])
		// 	//result = XRegExp.replace(result, /(.)/g, '\\U$1')
		// 	//console.log(right)
		// }
		// return result
	//}

	public static serialReplace(str:string, regexArr:string[][]|RegexReplacePair[], mode:string):string
	public static serialReplace(str:string[], regexArr:string[][]|RegexReplacePair[], mode:string, splitter?:string):string[]
	public static serialReplace(str:string|string[], regexArr:string[][]|RegexReplacePair[], mode:string, splitter=/* String.fromCharCode(30) */'\n'){
		let regexObjs:RegexReplacePair[] = []
		if(Array.isArray(regexArr[0])){ //對應string[][]
			regexObjs = SerialRegExp.regexStrArrToObjs(regexArr as string[][], mode)
		}else{
			regexObjs = regexArr as RegexReplacePair[]
		}

		function replaceStr(str:string, serialRegex:RegexReplacePair[]){
			let result = str+''
			for(let i = 0; i < serialRegex.length; i++){
				result = result.replace(serialRegex[i].regex, serialRegex[i].replacement)
			}
			return result
		}


		if(typeof(str)==='string'){
			return replaceStr(str, regexObjs)
		}else{
			let joined:string = str.join(splitter)
			let processed:string = replaceStr(joined, regexObjs)
			return processed.split(splitter)
		}
	}

	public static regexStrArrToObjs(regexArr:string[][], mode:string){
		let result:RegexReplacePair[] = []
		for(let i = 0; i < regexArr.length; i++){
			if(typeof(regexArr[i][0]) !== 'string'){
				throw new Error(`regexArr[i][0]) !== 'string'`)
			}
			if(typeof(regexArr[i][1]) !== 'string'){
				regexArr[i][1] = ''
			}
			let left = new RegExp(regexArr[i][0], mode)
			let right:string = SerialRegExp.getUnescapeStr(regexArr[i][1])
			let unus:RegexReplacePair = {regex:left, replacement:right}
			result.push(unus)
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

export interface RegexReplacePair{
	regex:RegExp,
	replacement:string
}