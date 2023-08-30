require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import 'module-alias/register';
//import {config} from '@root/config'

import * as Tp from 'Type'
import * as fs from 'fs'
import Ut from 'Ut';
import Txt from 'Txt';
import SingleWord2 from './SingleWord2';
/**
 * 㕥処理txt單詞源表
 */
export default class VocaRaw2{

	public constructor(p:{
		_srcFilePath:string,
		_ling:string,
	}){
		Object.assign(this,p)
		//this.assign_text()
	}

	public static readonly config:Tp.VocaRawConfig=require('@root/config').config

	private _srcFilePath:string=''
	;public get srcFilePath(){return this._srcFilePath;};

	private _encoding:BufferEncoding = 'utf-8'
	;public get encoding(){return this._encoding;};;public set encoding(v){this._encoding=v;};

	private _ling:string=''
	;public get ling(){return this._ling;};

	private _text:string=''
	;public get text(){return this._text;};;public set text(v){this._text=v;};

	public async assign_text(){
		this.text = await fs.promises.readFile(this.srcFilePath, {encoding:this._encoding})
	}

	public async getAllWords(){
		await this.assign_text()
		return VocaRaw2.getAllWords(this.text, this.ling)
	}


	/**
	 * 從單詞原表中取所有單詞對象
	 * @param text 
	 * @param ling 
	 * @returns 
	 */
	public static getAllWords(text:string, ling:string){
		let T = VocaRaw2
		T.checkBracesMatch(text)
		text = T.processRawText(text) //+
		let dateBlocks = T.getDateBlocks(text)
		const words:SingleWord2[] = []
		for(const e of dateBlocks){
			const partWords = T.getWordsInDateBlock(e, ling)
			words.push(...partWords)
		}
		//console.log(words)//t -
		return words
	}

	/**
	 * 檢查大括號是否匹配
	 * @param text 
	 */
	public static checkBracesMatch(text:string){
		const c = VocaRaw2.config
		let b = Ut.isMatchInPair(text, c.dateBlock[0], c.dateBlock[1])
		if(!b){
			throw new Error(`dateBlock大括號不配對`)
		}
	}

	public checkBracketsMatch(text=this.text){
		return VocaRaw2.checkBracesMatch(text)
	}


	public static processRawText(text:string){
		const cf = VocaRaw2.config
		text = Txt.unifyNewline_s(text, '\n') //統一ᵣ換行符
		
		//在dateBlock前後添空行
		text = VocaRaw2.addCharAroundPattern(text, `(${cf.dateBlock[0]})`, '\n', 1)
		text = VocaRaw2.addCharAroundPattern(text, `(${cf.dateBlock[1]})`, '\n', 1)
		text = VocaRaw2.handleWordBlock(text, cf.wordBlock)//handleWordBlock前後添空行
		//console.log(text)//t +
		return text
	}

	/**
	 * 取 日期塊、即 20230829213905000{......}
	 * @param text 
	 * @returns 
	 */
	public static getDateBlocks(text:string){
		const cf = VocaRaw2.config
		const regex = new RegExp(`(${cf.dateRegex}\\s*?${cf.dateBlock[0]}.*?${cf.dateBlock[1]})`, 'gs')
		const matches = text.match(regex)
		if(!matches){return [] as string[]}
		//全局模式旹matches[0]代表第一個捕獲組
		return matches as string[]
	}

	/**
	 * 取日期塊中ᵗ日期
	 * @param dateBlock 
	 * @returns 
	 */
	public static getRawDateInDateBlock(dateBlock:string){
		dateBlock=dateBlock.trim()
		const cf = VocaRaw2.config
		const regex = new RegExp(`\\s*?(${cf.dateRegex})`) //不開全局模式
		let match = dateBlock.match(regex)
		if(!match){return ''}
		return match[1]
	}

	/**
	 * 在一日期塊中取諸詞塊
	 * @param dateBlock 
	 * @returns 
	 */
	public static getWordUnitsInDateBlock(dateBlock:string){
		const cf = VocaRaw2.config
		dateBlock = dateBlock.trim()
		//let date = VocaRaw2.getRawDateInDateBlock(dateBlock)

		//除 日期 與 dateBlock、只取其內ᐪ。
		const inner = new RegExp(`${cf.dateRegex}\\s*?${cf.dateBlock[0]}(.+?)${cf.dateBlock[1]}`, 'gs')
		dateBlock = dateBlock.replace(inner, '$1')
		dateBlock = dateBlock.trim()
		let wordUnits:string[] = []

		let s = getMarkedWordBlock(dateBlock); wordUnits.push(...s)
		dateBlock = removeMarkedWordBlock(dateBlock)
		dateBlock = dateBlock.trim()
		s = getUnmarkedWordBlock(dateBlock); wordUnits.push(...s)
		/* for(let i = 0; i < wordUnits.length; i++){
			console.log(i)
			console.log(wordUnits[i])
		} */
		return wordUnits

		//取 被wordBlock括着之詞塊
		function getMarkedWordBlock(dateBlock:string){
			const regex = new RegExp(`${cf.wordBlock[0]}(.*?)${cf.wordBlock[1]}`, 'gs')

			let matches = dateBlock.match(regex)
			if(!matches){return [] as string[]}
			//matches.s/hift()
			for(let i = 0; i < matches.length; i++){
				matches[i] = matches[i].replace(regex, '$1')
				matches[i]=matches[i].trim()
			}
			
			return matches as string[]
		}

		//除 被wordBlock括着之詞塊
		function removeMarkedWordBlock(dateBlock:string){
			const regex = new RegExp(`${cf.wordBlock[0]}(.*?)${cf.wordBlock[1]}`, 'gs')
			return dateBlock.replace(regex, '')
		}

		//取 不被wordBlock括着之詞塊
		function getUnmarkedWordBlock(dateBlock:string){
			dateBlock = dateBlock.trim()
			let s = dateBlock.split('\n\n')
			const r:string[] = []
			for(const e of s){
				if(/^\s*$/.test(e)){}
				else{r.push(e.trim())}
			}
			return r 
		}

	}

	/**
	 * 在一詞塊中取註ˇ
	 * @param wordUnit 
	 * @returns 
	 */
	public static getAnnotation(wordUnit:string){
		const cf = VocaRaw2.config
		const regex = new RegExp(`${cf.annotation[0]}(.+?)${cf.annotation[1]}`, 'gs')
		const matches = wordUnit.match(regex)
		if(!matches){return [] as string[]}
		//matches.s/hift()
		for(let i =0 ; i < matches.length; i++){
			matches[i] = matches[i].replace(regex, '$1')
		}
		return matches as string[]
	}

	/**
	 * 在一詞塊中除註ˇ
	 * @param wordUnit 
	 * @returns 
	 */
	public static removeAnnotation(wordUnit:string){
		const cf = VocaRaw2.config
		const regex = new RegExp(`${cf.annotation[0]}(.+?)${cf.annotation[1]}`, 'gs')
		let r = wordUnit.replace(regex, '')
		return r
	}

	/**
	 * 從一詞塊中解析單詞對象
	 * @param wordUnit 
	 * @param date 
	 * @param ling 
	 * @returns 
	 */
	public static getWordInWordUnit(wordUnit:string, date:number, ling:string){
		//VocaRaw2.checkDate(date)
		wordUnit = wordUnit.trim()
		//let wordShape = wordUnit.replace(/(.+?)\n/, '$1')
		let annotation = VocaRaw2.getAnnotation(wordUnit)
		wordUnit = VocaRaw2.removeAnnotation(wordUnit)
		let wordShapeAndMean:[string, string]|null = getWordShapeAndMean(wordUnit)
		let wordShape = wordShapeAndMean[0]
		let mean = wordShapeAndMean[1]
		wordShapeAndMean = null
		
		if(mean === '' && annotation.length === 0){
			console.log(`console.log(wordUnit)`)
			console.log(wordUnit)
			console.log(`/console.log(wordUnit)`)
			throw new Error(`mean === '' || annotation.length === 0`)
		}

		let word = new SingleWord2({
			ling:ling,
			wordShape: wordShape.trim(),
			mean:[mean.trim()],
			annotation: annotation,
			dates_add: [date],
		})
		//console.log(word)//t
		return word

		function getWordShapeAndMean(wordUnit:string):[string, string]{
			wordUnit=wordUnit.trim()
			let wordShape = wordUnit.split('\n')[0]
			// if(parts.length <= 1){//只有詞形無釋義
			// 	console.log(`console.error(wordUnit)`)
			// 	console.error(wordUnit)
			// 	console.log(`/console.error(wordUnit)`)
			// 	console.log(`console.log(parts)`)
			// 	console.log(parts)
			// 	console.log(`/console.log(parts)`)
			// 	throw new Error(`parts.length <= 1`)
			// }
			let mean = wordUnit.replace(wordShape, '')
			
			return [wordShape, mean]
		}
		
	}

	/**
	 * 從一DateBlock中解析所有單詞對象
	 * @param dateBlock 
	 * @param ling 
	 * @returns 
	 */
	public static getWordsInDateBlock(dateBlock:string, ling:string){
		const T = VocaRaw2
		let rawDate = T.getRawDateInDateBlock(dateBlock)
		let date = T.parseRawDate(rawDate)
		let wordUnits = T.getWordUnitsInDateBlock(dateBlock)
		
		const words:SingleWord2[] = []
		for(const e of wordUnits){
			const word = T.getWordInWordUnit(e, date, ling)
			words.push(word)
		}
		return words
	}

	/**
	 * 統一日期格式潙 形如YYYYMMDDHHmmssSSS之整數。 目前只支持 YYYYMMDDHHmmssSSS。
	 * @param date 
	 * @returns 
	 */
	public static parseRawDate(date:string){
		if(VocaRaw2.config.dateFormat === 'YYYYMMDDHHmmssSSS'){
			date = VocaRaw2.checkDate(date) as string
			return parseInt(date)
		}else{
			throw new Error(`目前只支持YYYYMMDDHHmmssSSS`)
		}
	}

	/**
	 * 檢 日期 是否合法。須是 含17個數字之 十進制整數。
	 * @param date 
	 * @param digits 
	 * @returns 
	 */
	public static checkDate(date:string|number, digits=17){
		let dateStr = date+''
		if(dateStr.length!==digits){throw new Error(`date.length!==digits`)}
		return date
	}

	/**
	 * handleWordBlock前後添空行
	 * @param text 
	 * @param wordBlock 
	 * @returns 
	 */
	public static handleWordBlock(text:string, wordBlock:[string, string]){
		let re1 = new RegExp(`^(\\s)*(${wordBlock[0]})`, 'gm')
		let re2 = new RegExp(`(${wordBlock[1]})(\\s)*$`, 'gm')
		let r = text.replace(re1, `\n$2\n`)
		r = r.replace(re2, `\n$1\n`)
		return r
	}

	/**
	 * 在pattern前後添chara
	 * @param text 
	 * @param pattern 
	 * @param chara 
	 * @returns 
	 */
	public static addCharAroundPattern(text:string, pattern:string, chara:string, groupIdx:number){
		let regex = new RegExp(`${pattern}`,'g')
		return text.replace(regex, `${chara}$${groupIdx}${chara}`)
	}

	/**
	 * 批量合併單詞數組
	 * @param ws 
	 * @returns 
	 */
	public static merge(ws:SingleWord2[]){
		let map = new Map<string, SingleWord2>()
		for(const word of ws){
			let g = map.get(word.wordShape)
			if(g){
				let m = SingleWord2.intersect(g,word)
				map.set(m.wordShape, m)
			}else{
				map.set(word.wordShape, word)
			}
		}
		return Array.from(map.values())
	}
}

