import { Lex, LocatePair } from "./Lex"
import { JoinedWord } from '@shared/entities/Word/JoinedWord'
import * as Mod from '@shared/model/NgaqModels'
import * as algo from '@shared/algo'

class DateBlock{
	date:str
	text:str
}

class Patterns{
	white = /\s/
	metadataStart = `<metadata>`
	metadataEnd = `</metadata>`
	dateBlockContentStart = '{{'
	dateBlockContentEnd = '}}'
}

class Result{
	metadata:str
	dateBlocks:DateBlock[] = []
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

	protected read_metadata(){
		const z = this
		//console.log(z.locate())//t
		z.eat(z.patterns.metadataStart, true)
		const end = z.patterns.metadataEnd
		const ans = z.readUntilStr(end, true)
		z.eat(end, true)
		//console.log(z.locate())//t
		//console.log(ans)
		return ans
	}

	protected read_date(){
		const z = this
		z.eat('[', true)
		const ans = z.readUntilStr(']', true)
		z.eat(']', true)
		return ans
	}

	protected read_dateBlockContent(){
		const z = this
		z.eat(z.patterns.dateBlockContentStart, true)
		const end = z.patterns.dateBlockContentEnd
		const ans = z.readUntilStr(end, true)
		z.eat(end, true)
		return ans
		//return z.readUntil(new RegExp(z.patterns.dateBlockContentEnd))
	}

	protected read_dateBlock(){
		const z = this
		const date = z.read_date()
		z.read_white()
		const content = z.read_dateBlockContent()
		const ans = new DateBlock()
		ans.date = date
		ans.text = content
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
			// console.log(i, 'start')//t
			// if(i === 2){
			// 	console.log(z.index)
			// 	console.log(z.locate())
			// }
			z.read_white()
			// console.log(z.index, 'wh')//t
			if(z.index >= z.text.length -1){
				break
			}
			const ua = z.read_dateBlock()
			dateBlocks.push(ua)
		}
		return dateBlocks
	}


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

	

	
}
