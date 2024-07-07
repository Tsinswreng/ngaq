import { Lex, LocatePair, ParseResult } from "./Lex"
import { JoinedWord } from '@shared/entities/Word/JoinedWord'
import * as Mod from '@shared/model/NgaqModels'
import * as algo from '@shared/algo'
import { PubNonFuncProp } from "@shared/Type"
import type { MakeOptional } from "@shared/Type"




class Result{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof Result.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(
		prop:MakeOptional<
			PubNonFuncProp<Result>
			,'name'
		>
	){
		const z = new this()
		z.__init__(prop)
		return z
	}

	//get This(){return Result}
	name:str = ""
	metadata:ParseResult
	dateBlocks:DateBlock[] = []
}

class DateBlock{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof DateBlock.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(prop:PubNonFuncProp<DateBlock>){
		const z = new this()
		z.__init__(prop)
		return z
	}

	//get This(){return DateBlock}

	start:int
	end:int
	/** [2024-07-06T21:38:55.163+08:00] */
	date:ParseResult
	content:ParseResult
	/** 整個日期塊內 䀬ʹ詞ʰ皆加ʹ屬性、如來源 等 */
	commonProp?:ParseResult
}

class Patterns{
	white = /\s/
	metadataStart = `<metadata>`
	metadataEnd = `</metadata>`
	dateBlockContentStart = '{{'
	dateBlockContentEnd = '}}'
}


export class NgaqLex extends Lex{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof NgaqLex.new>){
		const z = this
		super.__init__(...args)
		z.text = z.text.replace(/\r\n/g, '\n')
		return z
	}

	static new(...args:Parameters<typeof Lex.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	get This(){return NgaqLex}

	

	protected _patterns = new Patterns()
	get patterns(){return this._patterns}
	protected set patterns(v){this._patterns = v}
	
	protected read_white(){
		const z = this
		for(; z.index < z.text.length;){
			const cur = z.text[z.index]
			if(z.patterns.white.test(cur)){
				z.index++
			}else{
				break
			}
		}
	}

	/**
	 * <metadata>......</metadata>
	 * @returns 
	 */
	protected read_metadata():ParseResult{
		const z = this
		const start = z.index
		z.eat(z.patterns.metadataStart, true)
		const end = z.patterns.metadataEnd
		const str = z.readUntilStr(end, true)
		z.eat(end, true)
		const ans = ParseResult.new(start, z.index, str)
		return ans
	}

	/**
	 * [2024-07-06T20:24:47.929+08:00]
	 * @returns 
	 */
	protected read_date():ParseResult{
		const z = this
		const start = z.index
		z.eat('[', true)
		const str = z.readUntilStr(']', true)
		z.eat(']', true)
		const ans = ParseResult.new(start, z.index, str)
		return ans
	}

	/**
	 * {{ ...... }}
	 */
	protected read_dateBlockContent():ParseResult{
		const z = this
		const start = z.index
		z.eat(z.patterns.dateBlockContentStart, true)
		const end = z.patterns.dateBlockContentEnd
		const str = z.readUntilStr(end, true)
		z.eat(end, true)
		const ans = ParseResult.new(start, z.index, str)
		return ans
	}

	/**
	 * 
	 * @returns 
	 */
	protected read_dateBlock():DateBlock{
		const z = this
		const start = z.index
		const date = z.read_date()
		z.read_white()
		const prop = z.read_prop()
		z.read_white()
		const content = z.read_dateBlockContent()
		// const ans = new DateBlockDeprecated()
		// ans.date = date
		// ans.text = content
		const ans = DateBlock.new({
			start:start
			,end:z.index
			,date: date
			,content: content
			,commonProp: prop
		})
		return ans
	}

	/**
	 * 
abc123
[[a this is annotation]]
def
	 */
	read_bodyEtProp(){
		const z = this
		const text = [] as str[]
		const ans = new WordBlock()
		for(;z.index < z.text.length; z.index++){
			const cur = z.text[z.index]
			if(cur ==='[' && z.text[z.index+1] === '['){
				z.eat('[[', true)
				const propStr = z.readUntilStr(']]')
				ans.prop = propStr
				z.eat(']]', true)
			}else{
				text.push(cur)
			}
		}
		ans.text = text.join('')
		return ans
	}

	protected read_prop():ParseResult{
		const z = this
		const start = z.index
		z.eat('[[', true)
		const propStr = z.readUntilStr(']]')
		z.eat(']]', true)
		const ans = ParseResult.new(start, z.index, propStr)
		return ans
	}


	parse(){
		const z = this
		//z.index++
		z.read_white()
		const metadata = z.read_metadata()
		z.read_white()
		const dateBlocks = [] as DateBlock[]
		for(let i = 0;z.index < z.text.length && !z.status.end;i++){
			z.read_white()
			if(z.index >= z.text.length -1){
				break
			}
			const ua = z.read_dateBlock()
			dateBlocks.push(ua)
		}
		//return dateBlocks
		const ans = Result.new({
			metadata: metadata
			,dateBlocks: dateBlocks
		})
		return ans
	}
}


class WordBlock{
	text:str = ""
	prop:str = ""
}


class WordBlockParser extends Lex{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof WordBlockParser.new>){
		const z = this
		const text = args[0]
		const prop = args[1]
		super.__init__(text)
		z.baseIndex = prop.baseIndex
		z.baseLocate = prop.baseLocate
		return z
	}

	static new(text:str, opt:{
		baseIndex:int
		,baseLocate:LocatePair
	}){
		const z = new this()
		z.__init__(text, opt)
		return z
	}

	static mk(prop:{
		text:int
		,baseIndex:int
		,baseLocate:LocatePair
	}){
		const z = new this()
	}

	//@ts-ignore
	get This(){return WordBlockParser}

	protected _baseIndex:int
	get baseIndex(){return this._baseIndex}
	protected set baseIndex(v){this._baseIndex = v}

	protected _baseLocate: LocatePair
	get baseLocate(){return this._baseLocate}
	protected set baseLocate(v){this._baseLocate = v}
	
	protected _delimiter:str
	get delimiter(){return this._delimiter}
	protected set delimiter(v){this._delimiter = v}

	protected _dateStr:str
	get date(){return this._dateStr}
	protected set date(v){this._dateStr = v}
	
	// protected _text:str
	// get text(){return this._text}
	// protected set text(v){this._text = v}

	// override locate(){
	// 	const z = this
	// 	z.This.locate()
	// }
	
	parse(){
		const z = this
		const sp = z.text.split(z.delimiter)
	}

	parseOneWordBlock(text:str){
		//const firstNewLine = text.indexOf('\n')

	}

	read_wordText(){
		const z = this
		const ans = z.readUntilStr('\n')
		z.eat('\n', true)
		return ans
	}



	parse_prop(){
		const z = this
	}


}
