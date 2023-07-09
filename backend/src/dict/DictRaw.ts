const sqlite3 = require("sqlite3").verbose();
import * as fs from 'fs'
const Txt = require("@my_modules/Txt")
/**
 * [23.07.08-2146,]
 * 用于處理字表、如rime輸入法之dict.yaml, 音韻學/方言字表等
 */
export class DictRaw{
	private _srcPath?:string //源碼表文件路徑
	private _splitter:string = '\t' //源碼表中分割字與碼之符號
	//private _char:string[] = [] //字
	//private _code:string[] = [] //碼、形碼或音碼

	private _table:string[][] = [] //行,列


	public static getTableFromStr(tableStr:string, splitter='\t'):string[][]{
		let tableStr2:string = ContinuousRegExp.unifyNewline_s(tableStr)
		let result:string[][] = []
		let half:string[] = []
		half = ContinuousRegExp.spliteStrByNewline_s(tableStr2)
		
		for(let i = 0; i < half.length; i++){
			result = ContinuousRegExp.
		}
	}

	

	
}


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




function t20230618094140(){
	
	let input = fs.readFileSync(__dirname+'/input.txt', 'utf-8')
	input = input.replace(/./g, (match)=>{
		return match.toLowerCase()
	}) 
	//console.log(input)
	let rawRegex = fs.readFileSync(__dirname+'/regex.txt', 'utf-8')
	rawRegex = Txt.unifyNewline_s(rawRegex)
	//const regexEachLine:string[] = ContinuousRegExp.spliteStrBy_(rawRegex, '\n')
	//console.log(regexEachLine)
	let regex:string[][] = Txt.getRegExp(rawRegex, '\t')
	//console.log(regex)
	/* for(let i = 0; i < regex.length; i++){
		console.log(regex[i][0])
	} */
	const output:string = ContinuousRegExp.replace(input, regex)
	//console.log(output)
	fs.writeFile(__dirname+'/output.txt', output, {encoding:'utf-8'}, (err)=>{
		if(err){throw err}
	})
	//const newStr = ContinuousRegExp.replace(oldFile,)

}

t20230618094140()