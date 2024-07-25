import { Lex, LocatePair, ParseError, SegmentLex, StrSegment } from "../Lex"
import { JoinedWord } from '@shared/model/word/JoinedWord'
import * as Mod from '@shared/model/word/NgaqModels'
import * as Row from '@shared/model/word/NgaqRows'
import * as algo from '@shared/algo'
import type { MakeOptional,PubNonFuncProp } from "@shared/Type"
import Tempus from "@shared/Tempus"
import { splitByFirstSep } from "@shared/tools/splitByFirstSep"
import type { I_Segment } from "@shared/interfaces/I_Parse"
//import { splitStr } from "@shared/tools/StrSegment"
import {key__arrMapPush} from '@shared/tools/key__arrMapPush'
import type * as WordIf from '@shared/interfaces/WordIf'
const splitStr = StrSegment.split

/** @deprecated */
function read_prop_deprecated(z:Lex):StrSegment|undef{
	const start = z.index
	if(!z.eat('[[')){
		return undefined
	}
	const propStr = z.readUntilStr(']]')
	z.old_eat(']]', true)
	const ofs = z.getIndexOffset()
	const ans = StrSegment.new(
		ofs+start, ofs+z.index, propStr
	)
	return ans
}

/**
 * 除mean之外
 * [[tag|N1]] ->
 * like {belong: 'tag'
 * text: 'N1'}
 */
function read_prop(z:Lex):WordProp|undef{
	
	if(!z.eat('[[')){
		return undefined
	}

	let textSb = [] as str[]
	let belongSb = [] as str[]
	let sb = belongSb
	const ofs = z.getIndexOffset()
	let start = z.index
	let belong:StrSegment|undef
	let text:StrSegment|undef
	let state = 'start'
	for(;;z.index++){
		if(z.index >= z.text.length){
			z.error(`expected ]], got EOF`)
		}
		const c = z.sliceFromCurPos(1)
		//console.log(c, 'c')
		if(c === '|'){
			state = '|'
			sb=textSb
			belong = StrSegment.new(
				ofs+start
				, ofs+z.index-1 //不含 '|'
				, belongSb.join('')
			)
			start = z.index
			continue
		}
		if(z.sliceFromCurPos(2) === ']]'){
			if(state === '|'){
				text = StrSegment.new(ofs+start, ofs+z.index, textSb.join(''))
			}else{
				belong = StrSegment.new(ofs+start, ofs+z.index, belongSb.join(''))
			}
			z.index+=2
			break
		}
		sb.push(c)
	}
	if(belong == void 0){
		z.error(`got nothing in word prop`)
		return
	}
	const ans = WordProp.new(belong, text)
	return ans
}
class WordProp{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordProp.new>){
		const z = this
		z.belong = args[0]
		z.text = args[1]
		return z
	}

	static new(belong:StrSegment, text:StrSegment|undef){
		const z = new this()
		z.__init__(belong, text)
		return z
	}

	//get This(){return WordProp}
	belong:StrSegment
	text?:StrSegment
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
	commonProp:WordProp[] = []
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
		//z.text = z.text.replace(/\r\n/g, '\n')
		return z
	}

	static new(...args:Parameters<typeof Lex.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}


	protected _patterns = new Patterns()
	get patterns(){return this._patterns}
	protected set patterns(v){this._patterns = v}

	/** 調用ʹ入口 */
	read_tempus__wordBlocks():Map<Tempus, WordIf.I_WordFromTxt[]>{
		const z = this
		const crude = z.crudeParse()
		const ans = Fine.parse({
			crude: crude
		})
		return ans
	}

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
		z.eat(z.patterns.metadataStart, true)
		const end = z.patterns.metadataEnd
		const str = z.readUntilStr(end, true)
		z.eat(end, true)
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
		z.eat(z.patterns.dateBlockContentStart, true)
		const end = z.patterns.dateBlockContentEnd
		const str = z.readUntilStr(end, true)
		z.eat(end, true)
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
		const prop = z.read_props()
		//console.log(prop, z.index)//t
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

	protected read_props():WordProp[]{
		const z = this
		const ans = [] as WordProp[]
		for(;;){
			const ua = read_prop(z)
			if(ua == void 0){break}
			ans.push(ua)
			z.read_white()
		}
		return ans
	}


	protected crudeParse(){
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

	/** @deprecated */
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
	// date:Tempus
	// wordBodys:StrSegment[]

	static parse(prop:{metadata:Metadata, dateBlock:DateBlock}){
		const z = DateBlockParser.new(prop.metadata, prop.dateBlock)
		return z.readAll()
	}

	protected readAll():[Tempus, StrSegment[]]{
		const z = this
		const date = z.parse_date()
		const wordBodys = z.splitWordBodys()
		return [date, wordBodys]
	}

	protected parse_date(){
		const z = this
		const date = Tempus.new(
			z.dateBlock.date.data
			,z.metadata.dateFormat
		)
		return date
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
		return ans
	}

}


class WordBlock{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordBlock.new>){
		const z = this
		const props = args[0]
		Object.assign(z, props)
		return z
	}

	static new(
		props:MakeOptional<
			PubNonFuncProp<WordBlock>, 'commonProp'
		>
	){
		const z = new this()
		z.__init__(props)
		return z
	}

	//get This(){return WordBlock}
	commonProp:WordProp[] = []
	prop:WordProp[] = []
	wordText:StrSegment
	body:StrSegment
	date:Tempus
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

	/** @deprecated */
	static new(segment:StrSegment):WordBlockParser
	static new(arg):never
	static new(segment:StrSegment){
		const z = new this()
		z.__init__(segment)
		return z
	}

	static parse(prop:{wordSegment:StrSegment, date:Tempus}){
		const z = WordBlockParser.new(prop.wordSegment)
		z.date = prop.date
		const ans = z.readAll()
		return ans
	}
	// in param
	//segment:StrSegment
	date:Tempus

	protected readAll(){
		const z = this
		z.read_white()
		const wordText = z.read_wordText()
		const [body, prop] = z.read_bodyEtProp()
		const ans = WordBlock.new({
			date: z.date
			,wordText:wordText
			,body: body
			,prop:prop

		})
		return ans
	}

	//TODO duplicate define
	protected read_white(){
		const z = this
		for(; z.index < z.text.length;){
			const cur = z.text[z.index]
			if(/\s/.test(cur)){
				z.index++
			}else{
				break
			}
		}
	}

	/**
	 * 
	 * @returns [body, prop]
	 */
	protected read_bodyEtProp():[StrSegment, WordProp[]]{
		const z = this
		const bodySb = [] as str[]
		const start = z.index
		//let prop:StrSegment|undef
		const props = [] as WordProp[]
		for(;z.index<z.text.length;){
			if(z.sliceFromCurPos('[['.length)==='[['){
				const prop = read_prop(z)
				if(prop == void 0){
					z.error(`expected prop, got undef`)
				}else{
					props.push(prop)
				}

				continue
			}
			bodySb.push(z.sliceFromCurPos(1))
			z.index++
		}
		const bodyStr = bodySb.join('')
		const body = StrSegment.new(
			z.getIndexOffset() + start
			,z.getIndexOffset() + z.index
			, bodyStr
		)
		return [body, props]
	}

	protected read_wordText(){
		const z = this
		const start = z.index
		const firstLine = z.readUntilStr('\n')
		z.eat('\n', true)
		const ofs = z.getIndexOffset()
		const wordText = StrSegment.new(ofs+start, ofs+z.index, firstLine)
		return wordText
	}

}



class Fine{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Fine.new>){
		const z = this
		const prop = args[0]
		z.crude = prop.crude
		//z.metadata = prop.metadata
		z.metadata = z.parse_metadata(z.crude.metadata)
		return z
	}

	protected static new(prop:{
		crude:CrudeResult
	}){
		const z = new this()
		z.__init__(prop)
		return z
	}
	get This(){return Fine}

	crude:CrudeResult
	metadata:Metadata

	static parse(...args:Param<typeof Fine.new>){
		const z = this.new(...args)
		const tempus__wordBlocks = z.read_Tempus__wordBlocks()
		const ans = new Map<Tempus, JoinedWord[]>()
		for(const [tempus, wordBlocks] of tempus__wordBlocks){
			const jwords = wordBlocks.map(e=>z.wordBlockToJoinedWord(e))
			ans.set(tempus, jwords)
		}
		return ans
	}

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

	/** @runOnInit */
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

	read_Tempus__wordBlocks(){
		const z = this
		const ans = new Map<Tempus, WordBlock[]>()
		for(const db of z.crude.dateBlocks){
			const ua = z.dateBlockToWordBlock(db)
			if(ua.length > 0){
				const date = ua[0].date
				if(!ans.has(date)){
					ans.set(date, ua)
				}else{
					ua.map(e=>key__arrMapPush(ans, date, e))
				}
			}
		}
		return ans
	}

	wordBlockToJoinedWord(wordBlock:WordBlock){
		const z = this
		const metadata = z.metadata
		const date = wordBlock.date
		const textWord = Mod.TextWord.new({
			id:NaN
			,text: wordBlock.wordText.data
			,belong: metadata.belong
			,ct: wordBlock.date
			,mt: wordBlock.date
		})
		function parseProperty(wordProps:WordProp[]){
			return wordProps.map(e=>
				Mod.Property.new({
					id:NaN
					,belong:e.belong.data
					,ct: date
					,mt:date
					,text: e.text?.data??''
					,wid: NaN
				})
			)
		}
		const mean = Mod.Property.new({
			id:NaN
			,belong: Row.PropertyBelong.mean
			,ct: date
			,mt:date
			,text: wordBlock.body.data
			,wid: NaN
		})
		
		const propertys = parseProperty(
			[...wordBlock.commonProp, ...wordBlock.prop]
		)
		propertys.push(mean)
		const ans = JoinedWord.new({
			textWord: textWord
			,propertys: propertys
			,learns: []
		})
		return ans
	}


	protected dateBlockToWordBlock(dateBlock:DateBlock):WordBlock[]{
		const z = this
		const [tempus, wordSegs] = DateBlockParser.parse({
			metadata: z.metadata
			,dateBlock:dateBlock
		})
		
		const wordBlocks = [] as WordBlock[]
		for (const ws of wordSegs){
			if(/^(\s)*$/.test(ws.data)){
				continue
			}
			const ua = WordBlockParser.parse({
				wordSegment: ws
				,date: tempus
			})
			ua.commonProp = dateBlock.commonProp
			wordBlocks.push(ua)
		}
		return wordBlocks
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
