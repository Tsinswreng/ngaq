import 'module-alias/register';
//import {config} from '@root/config'

import * as Tp from '@shared/Type'
import * as fs from 'fs'
import Ut from '@shared/Ut';
import Txt from '@shared/Txt';
import SingleWord2 from '@shared/SingleWord2';
import moment from 'moment';

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

	public static readonly defaultConfig:Tp.VocaRawConfig=require('@root/config').config

	private _config:Tp.VocaRawConfig=VocaRaw2.defaultConfig
	;public get config(){return this._config;};

	private _srcFilePath:string=''
	;public get srcFilePath(){return this._srcFilePath;};

	private _encoding:BufferEncoding = 'utf-8'
	;public get encoding(){return this._encoding;};;public set encoding(v){this._encoding=v;};

	private _ling:string=''
	;public get ling(){return this._ling;};

	private _text:string=''
	;public get text(){return this._text;};;public set text(v){this._text=v;};


	/**
	 * 日期ˋ數據庫ʸ存ᵗ格式
	 */
	private _dateFormat:{format:string, regex: RegExp} = {
		format: 'YYYY.MM.DD-HH:mm:ss.SSS',
		regex: /^\d{4}\.\d\d\.\d\d\-\d\d:\d\d:\d\d\.\d{3}$/
	}
	;public get dateFormat(){return this._dateFormat;};;public set dateFormat(v){this._dateFormat=v;};
	
	public async assign_text(){
		this.text = await fs.promises.readFile(this.srcFilePath, {encoding:this._encoding})
	}




	/**
	 * 從單詞原表中取所有單詞對象
	 * @param text 
	 * @param ling 
	 * @returns 
	 */
	public getAllWordsFromText(text:string=this.text){
		let ling:string=this.ling, config:Tp.VocaRawConfig=this.config
		
		VocaRaw2.checkBracesMatch(text, config.dateBlock)
		text = this.processRawText(text)
		let dateBlocks = this.getDateBlocks(text)
		// console.log(`console.log(dateBlocks)//t`)//t -
		// console.log(dateBlocks)//t
		const words:SingleWord2[] = []
		for(const e of dateBlocks){
			const partWords = this.getWordsInDateBlock(e)
			words.push(...partWords)
		}
		//console.log(words)//t -
		return words
	}public async getAllWords(){
		await this.assign_text()
		return this.getAllWordsFromText()
	}

	/**
	 * 檢查大括號是否匹配
	 * @param text 
	 */
	public static checkBracesMatch(text:string, blocks:[string, string]){
		
		let b = Ut.isMatchInPair(text, blocks[0], blocks[1])
		if(!b){
			throw new Error(`dateBlock大括號不配對`)
		}
	}private checkBracketsMatch(text=this.text){
		return VocaRaw2.checkBracesMatch(text,this.config.dateBlock)
	}


	/**
	 * 在dateBlock和wordBlock前後添空行
	 * @param text 
	 * @param dateBlock 
	 * @param wordBlock 
	 * @returns 
	 */
	private processRawText(text:string){
		let dateBlock:[string, string]=this.config.dateBlock, wordBlock:[string, string]=this.config.wordBlock
		text = Txt.unifyNewline_s(text, '\n') //統一ᵣ換行符
		
		//在dateBlock前後添空行
		text = VocaRaw2.addCharAroundPattern(text, `(${dateBlock[0]})`, '\n', 1)
		text = VocaRaw2.addCharAroundPattern(text, `(${dateBlock[1]})`, '\n', 1)
		text = this.handleWordBlock(text)//handleWordBlock前後添空行
		//console.log(text)//t +
		return text
	}

	/**
	 * 取 日期塊 即 日期 加 一對大括號 及其內
	 * <待改>{正則表達式有漏洞。dateBlock不在同一層級旹亦能配。}
	 * @param text 
	 * @returns 
	 */
	private getDateBlocks(text:string){
		let dateBlock:[string, string]=this.config.dateBlock, dateRegex:string=this.config.dateRegex
		const regex = new RegExp(`(${dateRegex}\\s*?${dateBlock[0]}.*?${dateBlock[1]})`, 'gs')
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
	private getRawDateInDateBlock(dateBlock:string){
		let dateRegex:string=this.config.dateRegex
		dateBlock=dateBlock.trim()
		const regex = new RegExp(`\\s*?(${dateRegex})`) //不開全局模式
		let match = dateBlock.match(regex)
		if(!match){return ''}
		return match[1]
	}/* public getRawDateInDateBlock(dateBlock:string){
		return VocaRaw2.getRawDateInDateBlock(dateBlock, this.config.dateRegex)
	} */

	/**
	 * 在一日期塊中取諸詞塊
	 * @param dateBlockStr 
	 * @returns 
	 */
	private getWordUnitsInDateBlock(dateBlockStr:string){
		let dateBlock:[string, string]=this.config.dateBlock, dateRegex:string=this.config.dateRegex,wordBlock:[string, string]=this.config.wordBlock
		dateBlockStr = dateBlockStr.trim()
		//let date = VocaRaw2.getRawDateInDateBlock(dateBlock)

		//除 日期 與 dateBlock、只取其內ᐪ。
		const inner = new RegExp(`${dateRegex}\\s*?${dateBlock[0]}(.+?)${dateBlock[1]}`, 'gs')
		dateBlockStr = dateBlockStr.replace(inner, '$1')
		dateBlockStr = dateBlockStr.trim()
		let wordUnits:string[] = []

		let s = getMarkedWordBlock(dateBlockStr); wordUnits.push(...s)
		dateBlockStr = removeMarkedWordBlock(dateBlockStr)
		dateBlockStr = dateBlockStr.trim()
		s = getUnmarkedWordBlock(dateBlockStr); wordUnits.push(...s)
		/* for(let i = 0; i < wordUnits.length; i++){
			console.log(i)
			console.log(wordUnits[i])
		} */
		return wordUnits

		//取 被wordBlock括着之詞塊
		function getMarkedWordBlock(dateBlock:string){
			const regex = new RegExp(`${wordBlock[0]}(.*?)${wordBlock[1]}`, 'gs')

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
			const regex = new RegExp(`${wordBlock[0]}(.*?)${wordBlock[1]}`, 'gs')
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
	private getAnnotation(wordUnit:string){
		let annotation:[string, string]=this.config.annotation
		const regex = new RegExp(`${annotation[0]}(.+?)${annotation[1]}`, 'gs')
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
	private removeAnnotation(wordUnit:string){
		let annotation:[string, string]=this.config.annotation
		const regex = new RegExp(`${annotation[0]}(.+?)${annotation[1]}`, 'gs')
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
	private getWordInWordUnit(wordUnit:string, date:string){
		let ling:string=this.ling, annotation:[string, string]=this.config.annotation
		//VocaRaw2.checkDate(date)
		wordUnit = wordUnit.trim()
		//let wordShape = wordUnit.replace(/(.+?)\n/, '$1')
		let annotationStr = this.getAnnotation(wordUnit)
		wordUnit = this.removeAnnotation(wordUnit)
		let wordShapeAndMean:[string, string]|null = getWordShapeAndMean(wordUnit)
		let wordShape = wordShapeAndMean[0]
		let mean = wordShapeAndMean[1]
		wordShapeAndMean = null
		
		if(mean === '' && annotationStr.length === 0){
			console.log(`console.log(wordUnit)`)
			console.log(wordUnit)
			console.log(`/console.log(wordUnit)`)
			throw new Error(`mean === '' || annotation.length === 0`)
		}

		let word = new SingleWord2({
			ling:ling,
			wordShape: wordShape.trim(),
			pronounce: [],
			mean:[mean.trim()],
			annotation: annotationStr,
			tag: [],
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
	private getWordsInDateBlock(dateBlock:string){
		let config = this.config
		let ling = this.ling
		let rawDate = this.getRawDateInDateBlock(dateBlock)
		let date = this.parseRawDate(rawDate,config.dateFormat)
		let wordUnits = this.getWordUnitsInDateBlock(dateBlock)
		const words:SingleWord2[] = []
		for(const e of wordUnits){
			const word = this.getWordInWordUnit(e, date)
			words.push(word)
		}
		return words
	}

	/**
	 * 統一日期格式潙 形如YYYYMMDDHHmmssSSS之整數。 目前只支持 YYYYMMDDHHmmssSSS。
	 * @param date 
	 * @returns 
	 */
	/* public static deprecated_parseRawDate(date:string, config:Tp.VocaRawConfig){
		if(config.dateFormat === 'YYYYMMDDHHmmssSSS'){
			date = VocaRaw2.checkDate(date) as string
			return parseInt(date)
		}else{
			throw new Error(`目前只支持YYYYMMDDHHmmssSSS`)
		}
	} */

	public static parseRawDate(oldDate:string, oldFormat:string, neoFormat:string){
		let d = moment(oldDate, oldFormat).format(neoFormat)
		return d
	}public parseRawDate(oldDate:string, oldFormat:string){
		return VocaRaw2.parseRawDate(oldDate, oldFormat, this.dateFormat.format)
	}


	/**
	 * 檢 日期 是否合法。須是 含17個數字之 十進制整數。
	 * @param date 
	 * @param digits 
	 * @returns 
	 */
	/* public static deprecated_checkDate(date:string|number, digits=17){
		let dateStr = date+''
		if(dateStr.length!==digits){throw new Error(`date.length!==digits`)}
		return date
	} */

	/**
	 * 檢 日期 是否合法。
	 * @param date 
	 * @param digits 
	 * @returns 
	 */
	private checkDate(date:string){
		let format = this.dateFormat
		if(format.format === 'YYYY.MM.DD-HH:mm:ss.SSS'){
			const regex = format.regex
			if(regex.test(date)){
				return date
			}else{
				throw new Error('日期格式不正確')	
			}
		}else{
			throw new Error('不支持')
		}
	}
	

	/**
	 * handleWordBlock前後添空行
	 * @param text 
	 * @param wordBlock 
	 * @returns 
	 */
	private handleWordBlock(text:string){
		let wordBlock:[string, string]=this.config.wordBlock
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

