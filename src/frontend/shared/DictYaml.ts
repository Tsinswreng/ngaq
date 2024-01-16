import Txt from '@shared/Txt'
import { N3, N4, Sros } from '@shared/Sros'
import { $ } from '@shared/Ut'
import * as fs from 'fs'
const sros = Sros.new({})
const s = sros.short

const paths = {
	essay: `C:/Program Files (x86)/Rime/weasel-0.15.0/data/essay.txt`
	,luna_pinyin: `C:/Program Files (x86)/Rime/weasel-0.15.0/data/luna_pinyin.dict.yaml`
	,cangjie5: `C:/Program Files (x86)/Rime/weasel-0.15.0/data/cangjie5.dict.yaml`
	,wubi86: `D:/Program Files/Rime/User_Data/wubi86_jidian.dict.yaml`
	,dks: `D:\\Program Files\\Rime\\User_Data\\dks.dict.yaml`
}
export default class DictYaml{
	protected constructor(){}
	static new(){
		const o = new this()
		return o
	}

	/**
	 * 取單字碼表 僅對dict.yaml
	 * @param text 
	 * @returns 
	 */
	static getTable(text:string){
		const raw = Txt.getTableFromStr(text, '\t')
		const ans:string[][] = []
		//console.log(raw.slice(0,40))
		let beginPos = 0
		for(; beginPos<raw.length; beginPos++){
			if(raw[beginPos][0]==='...'){break}
			if(beginPos === raw.length){
				throw new Error(`碼表ʸ尋不見ᵣ始ᵗ標誌`)
			}
		}
		for(let i = beginPos; i < raw.length; i++){
			const line = raw[i]
			if(line[0].length === 1 && line[0].match(/\S+/g) && line[1].match(/\S+/g) ){
				ans.push(
					[line[0], line[1].trim()]
				)
			}
		}
		return ans
	}



	/**
	 * 除詞、留單字
	 * @param table 
	 * @deprecated
	 * @returns 
	 */
	static lra_svq(table:string[][]){
		const ans:string[][] = []
		for(const line of table){
			if(line[0].length === 1){
				ans.push(line)
			}
		}
		return ans
	}

	/**
	 * 
	 * @param essayText 
	 * @returns 漢字_頻數。只有utf8單字
	 */
	static get_char__freqNum(essayText:string){
		const table = Txt.getTableFromStr(essayText)
		const ans = new Map<string, N3>()
		for(const u of table){
			if(u.length < 2){continue}
			if(u[0].length !== 1){continue}
			ans.set(
				$(u[0])
				,s.n($(u[1]))
			)
		}
		return ans
	}

	static getSortedMap(map:[any,N4][]|Map<any, N4>){
		const sortedTable = Array.from(map)
		sortedTable.sort((b,a)=>{
			return s.c(a[1] , b[1])
		})
		return sortedTable
	}

	/**
	 * 降序 把Map寫入文件
	 * @param map 
	 * @param path 
	 */
	static writeMap(map:[any,N4][]|Map<any, N4>, path:string){
		const sortedTable = Array.from(map)
		sortedTable.sort((b,a)=>{
			return s.c(a[1] , b[1])
		})
		//console.log(sortedTable)//t
		let ans = ''
		let cnt = 0
		try {
			for(const line of sortedTable){
				for(const cell of line){
					ans += cell+'\t'
					cnt++
				}
				ans += ans+'\n'
			}
		} catch (err) {
			console.log(cnt)
		}

		fs.writeFileSync(path, ans, 'utf-8')
	}

	/**
	 * 
	 * @param char__freqNum returnOf @see get_char__freqNum
	 * @returns 字_頻率
	 */
	static get_char__freq(char__freqNum: Map<string, N3>){
		let sum = s.n(0)
		for(const [char, freqNum] of char__freqNum){
			sum = s.a(sum, freqNum)
		}
		const ans = new Map<string, N3>()
		for(const [char, freqNum] of char__freqNum){
			const freqRate = s.d(freqNum, sum)
			ans.set(char, freqRate)
		}
		return ans
	}

	/**
	 * 碼長平均值
	 * @param char__code 字_碼 數組
	 * @returns 
	 */
	static calc_averCodeLen(char__code:string[][]){
		let ans = s.n(0)
		for(let i = 0; i < char__code.length; i++){
			const u = char__code[i]
			const uLen = $(u[1]).length
			// if(uLen !== 3){
			// 	console.log(i)
			// 	console.log(u)
			// }
			ans = s.a(ans, uLen)
		}
		ans = s.d(ans, char__code.length)
		return ans
	}

	static get_char_code_freqRate(char_code:string[][], char_freqRate:Map<string, N3>){
		const ans:[string, string, N3][] = []
		for(const line of char_code){
			const char = $(line[0])
			const code = $(line[1])
			const freqRate = (char_freqRate.get(char))??s.n(0)
			ans.push([char, code, freqRate])
		}
		return ans
	}

	/**
	 * 計算碼長期望
	 * @param char_code_freqNum [字,碼,頻率][]
	 * @returns 
	 */
	static calc_expectationCodeLen(char_code_freqNum:[string, string , N3][]){

		let freqSum = s.n(0)
		for(const u of char_code_freqNum){
			freqSum = s.a(freqSum, $(u[2]))
		}

		let ans = s.n(0)
		
		for(let i = 0; i < char_code_freqNum.length; i++){
			const u = char_code_freqNum[i]
			
			let ua = s.m(
				u[1].length
				,s.d(
					u[2]
					,freqSum
				)
			)
			ans = s.a(ans, ua)
		}
		
		return ans
	}

	static variance(char_code:string[][], aver:N4){
		const data = char_code.map( e => $(e[1]).length )
		return variance(data, aver)
	}




	static calcOne(text:string, essayText:string){
		//字__頻數
		const char__freqNum: Map<string, N3> = C.get_char__freqNum(essayText)
		//字__頻率
		const char__freqRate = C.get_char__freq(char__freqNum)
		//單字表
		const table = C.getTable(text)
		
		//字_碼
		const char_code = table.map( e => [$(e[0]),$(e[1])] )
		const outEssay = './outEssay.txt'
		
		//字_碼_頻率
		const char_code_freqRate = C.get_char_code_freqRate(char_code, char__freqRate)
		const freq1 = C.getSortedMap(char__freqNum)
		const freq2 = C.getSortedMap(char__freqRate)
		//console.log(freq1)
		//console.log(freq2.map(e=>[e[0],s.n(e[1]).toFixed(4)]))
		//均值
		const averCodeLen = C.calc_averCodeLen(char_code)
		const var1 = C.variance(char_code, averCodeLen)
		const expect = C.calc_expectationCodeLen(char_code_freqRate)
		const var2 = C.variance(char_code, expect)
		console.log(`码长平均值:`)
		console.log(averCodeLen)
		console.log(`方差1:`)
		console.log(var1)
		console.log(`码长期望:`)
		console.log(expect)
		console.log(`方差2:`)
		console.log(var2)
	}

	static runByPath(path:string, essayText:string){
		const text = fs.readFileSync(path, 'utf-8')
		return C.calcOne(text,essayText)
	}
	
	static run(){
		const essayText = fs.readFileSync(paths.essay, 'utf-8')
		C.runByPath(paths.luna_pinyin, essayText)
		console.log()
		C.runByPath(paths.dks, essayText)
	}
}

const C = DictYaml
type C = DictYaml
/**
 * 方差
 * @param data 原始數據
 * @param aver 均值
 * @returns 
 */
function variance(data:N4[], aver:N4){
	const len = data.length
	let sum = s.n(0)
	for(let i = 0; i < data.length; i++){
		const u = data[i]
		let ua = sros.pow(
			s.s(u, aver)
			,2
		)
		sum = s.a(sum, ua)
	}
	let ans = s.d(sum, len)
	return ans
}