import { Lex, LocatePair, ParseError, SegmentLex, StrSegment } from "../Lex"
import { JoinedWord } from '@shared/model/word/JoinedWord'
import * as Mod from '@shared/model/word/NgaqModels'
import * as algo from '@shared/algo'
import type { MakeOptional,PubNonFuncProp } from "@shared/Type"
import Tempus from "@shared/Tempus"
import { splitByFirstSep } from "@shared/tools/splitByFirstSep"
import type { I_Segment } from "@shared/interfaces/I_Parse"
import { splitStr } from "@shared/tools/splitStr"

function read_prop(z:Lex):StrSegment|undef{
	const start = z.index
	if(!z.eat('[[')){
		return undefined
	}
	const propStr = z.readUntilStr(']]')
	z.old_eat(']]', true)
	const ans = StrSegment.new(start, z.index, propStr)
	return ans
}

class CrudeResult{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof CrudeResult.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(
		prop:MakeOptional<
			PubNonFuncProp<CrudeResult>
			,'name'
		>
	){
		const z = new this()
		z.__init__(prop)
		return z
	}

	//get This(){return Result}
	name:str = ""
	metadata:StrSegment
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
	date:StrSegment
	content:StrSegment
	/** 整個日期塊內 䀬ʹ詞ʰ皆加ʹ屬性、如來源 等 */
	commonProp?:StrSegment
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

	//@ts-ignore
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
	protected read_metadata():StrSegment{
		const z = this
		const start = z.index
		z.old_eat(z.patterns.metadataStart, true)
		const end = z.patterns.metadataEnd
		const str = z.readUntilStr(end, true)
		z.old_eat(end, true)
		const ans = StrSegment.new(start, z.index, str)
		return ans
	}

	/**
	 * [2024-07-06T20:24:47.929+08:00]
	 * @returns 
	 */
	protected read_date():StrSegment{
		const z = this
		const start = z.index
		z.old_eat('[', true)
		const str = z.readUntilStr(']', true)
		z.old_eat(']', true)
		const ans = StrSegment.new(start, z.index, str)
		return ans
	}

	/**
	 * {{ ...... }}
	 */
	protected read_dateBlockContent():StrSegment{
		const z = this
		const start = z.index
		z.old_eat(z.patterns.dateBlockContentStart, true)
		const end = z.patterns.dateBlockContentEnd
		const str = z.readUntilStr(end, true)
		z.old_eat(end, true)
		const ans = StrSegment.new(start, z.index, str)
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

	protected read_prop():StrSegment|undef{
		const z = this
		const start = z.index
		if(!z.eat('[[')){
			return undefined
		}
		const propStr = z.readUntilStr(']]')
		z.old_eat(']]', true)
		const ans = StrSegment.new(start, z.index, propStr)
		return ans
	}


	crudeParse(){
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
		const ans = CrudeResult.new({
			metadata: metadata
			,dateBlocks: dateBlocks
		})
		return ans
	}

	
}


function seekKeyWithUndefVal(obj:kvobj){
	const keys = Object.keys(obj)
	for(const k of keys){
		const v = obj[k]
		if(v === void 0){
			return k
		}
	}
	return ""
}

class Metadata{
	belong:str
	delimiter:str
	dateFormat = Tempus.ISO8601FULL_DATE_FORMAT
}


class DateBlockParser{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof DateBlockParser.new>){
		const z = this
		z.metadata = args[0]
		z.dateBlock = args[1]
		return z
	}

	static new(metadata:Metadata, dateBlock:DateBlock){
		const z = new this()
		z.__init__(metadata, dateBlock)
		return z
	}

	get This(){return DateBlockParser}

	//in params
	dateBlock:DateBlock
	metadata:Metadata

	//outcome
	date:Tempus
	wordBodys:StrSegment[]

	protected runAll(){
		const z = this
		z.parse_date()
		z.splitWordBodys()
	}

	protected parse_date(){
		const z = this
		z.date = Tempus.new(
			z.dateBlock.date.data
			,z.metadata.dateFormat
		)
		return z.date
	}

	protected splitWordBodys(){
		const z = this
		const content = z.dateBlock.content
		//const wordBlocksStr = content.data.split(z.metadata.delimiter)
		const wordBlocksStr = splitStr(content.data, z.metadata.delimiter)
		const start = content.start
		let index = start //全文中ʹ位
		const ans = [] as StrSegment[]
		for(const wbs of wordBlocksStr){
			const ua = StrSegment.new(index, wbs.data.length-1, wbs.data)
			ans.push(ua)
			index += wbs.data.length
		}
		z.wordBodys = ans
		return ans
	}

	protected parseWordBlocks(){

	}


}


class WordBlock{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordBlock.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return WordBlock}
	prop?:StrSegment
	wordText:StrSegment
	body:StrSegment
}


class WordBlockParser extends SegmentLex{
	protected constructor(){super()}
	
	protected __init__(...args: Parameters<typeof WordBlockParser.new>){
		const z = this
		const segment = args[0]
		super.__init__(segment)
		//z.index = z.segment.start
		//z.text = args[0]
		return z
	}

	static new(segment:StrSegment):WordBlockParser
	static new(arg):never
	static new(segment:StrSegment){
		const z = new this()
		z.__init__(segment)
		return z
	}

	// in param
	//segment:StrSegment
	date:Tempus



	result = WordBlock.new()
	bodySb = [] as str[]
	

	//get This(){return WordBlockParser}

	
	parse(){
		const z = this
		z.read_wordText()
		z.read_body()
		return z.result
	}

	protected read_body(){
		const z = this
		const start = z.index
		for(;z.index<z.text.length;){
			if(z.peek('[['.length)==='[['){
				z.result.prop = read_prop(z)
				continue
			}
			z.bodySb.push(z.peek(1))
			z.index++
		}
		const bodyStr = z.bodySb.join('')
		const body = StrSegment.new(start, z.index, bodyStr)
		z.result.body = body
	}

	protected read_wordText(){
		const z = this
		const start = z.index
		const firstLine = z.readUntilStr('\n')
		z.eat('\n', true)
		z.result.wordText = StrSegment.new(start, z.index, firstLine)
	}


}


class Fine{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Fine.new>){
		const z = this
		z.crude = args[0]
		z.metadata = z.parse_metadata(z.crude.metadata)
		return z
	}

	static new(crude:CrudeResult){
		const z = new this()
		z.__init__(crude)
		return z
	}
	get This(){return Fine}

	crude:CrudeResult
	metadata:Metadata

	static parseMetadata(text:str){
		const obj = JSON.parse(text)
		const ans = new Metadata()
		Object.assign(ans, obj)
		const keyWithUndef = seekKeyWithUndefVal(ans)
		if(keyWithUndef !== ""){
			throw ParseError.new(`${keyWithUndef}\nis expected in metadata`)
		}
		return ans
	}

	/** runOnInit */
	protected parse_metadata(metadata:StrSegment){
		const z = this
		try {
			return z.This.parseMetadata(metadata.data)
		} catch (err) {
			if(err instanceof ParseError){
				err.start = metadata.start
				err.end = metadata.end
			}
			throw err
		}
	}

	protected parse_dateBlock(dateBlock:DateBlock){
		const z = this
		const dp = DateBlockParser.new(z.metadata, dateBlock)
		
	}

}





// class WordBlockParser extends Lex{
// 	protected constructor(){super()}
// 	//@ts-ignore
// 	protected __init__(...args: Parameters<typeof WordBlockParser.new>){
// 		const z = this
// 		const text = args[0]
// 		const prop = args[1]
// 		super.__init__(text)
// 		z.baseIndex = prop.baseIndex
// 		z.baseLocate = prop.baseLocate
// 		return z
// 	}

// 	static new(text:str, opt:{
// 		baseIndex:int
// 		,baseLocate:LocatePair
// 	}){
// 		const z = new this()
// 		z.__init__(text, opt)
// 		return z
// 	}

// 	static mk(prop:{
// 		text:int
// 		,baseIndex:int
// 		,baseLocate:LocatePair
// 	}){
// 		const z = new this()
// 	}

// 	//@ts-ignore
// 	get This(){return WordBlockParser}

// 	protected _baseIndex:int
// 	get baseIndex(){return this._baseIndex}
// 	protected set baseIndex(v){this._baseIndex = v}

// 	protected _baseLocate: LocatePair
// 	get baseLocate(){return this._baseLocate}
// 	protected set baseLocate(v){this._baseLocate = v}
	
// 	protected _delimiter:str
// 	get delimiter(){return this._delimiter}
// 	protected set delimiter(v){this._delimiter = v}

// 	protected _dateStr:str
// 	get date(){return this._dateStr}
// 	protected set date(v){this._dateStr = v}
	
// 	// protected _text:str
// 	// get text(){return this._text}
// 	// protected set text(v){this._text = v}

// 	// override locate(){
// 	// 	const z = this
// 	// 	z.This.locate()
// 	// }


// 	/**
// 	 * 
// abc123
// [[a this is annotation]]
// def
// 	 */
// 	read_bodyEtProp(){
// 		const z = this
// 		const text = [] as str[]
// 		const ans = new WordBlock()
// 		for(;z.index < z.text.length; z.index++){
// 			const cur = z.text[z.index]
// 			if(cur ==='[' && z.text[z.index+1] === '['){
// 				z.eat('[[', true)
// 				const propStr = z.readUntilStr(']]')
// 				ans.prop = propStr
// 				z.eat(']]', true)
// 			}else{
// 				text.push(cur)
// 			}
// 		}
// 		ans.text = text.join('')
// 		return ans
// 	}

	
// 	parseOneWordBlock(text:str){
// 		//const firstNewLine = text.indexOf('\n')
// 	}

// 	read_wordText(){
// 		const z = this
// 		const ans = z.readUntilStr('\n')
// 		z.eat('\n', true)
// 		return ans
// 	}


// }
