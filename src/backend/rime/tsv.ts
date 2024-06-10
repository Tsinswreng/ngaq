

//'abcd'.indexOf('bc') -> 1
//'abcd'.indexOf('1') -> -1

import { $, $a } from "@shared/Ut"
import { Line } from "./Line"

interface I_next<T>{
	next():T
}

export interface I_readN<T>{
	read(n:int):T
}


class Status{
	nextLineNoComment=false
	in_meta = false
	in_body = false
	end=false
}

class LineType{
	noComment=false
	isBody=false
}


export class DictLine extends Line{
	protected static lineCommentMark = '#'
	protected constructor(){super()}
	protected __init__(...args:Parameters<typeof DictLine.new>){
		const z = this
		super.__init__(...args)
		return z
	}
	static new(text:str, index:int){
		const z = new this()
		z.__init__(text, index)
		return z
	}

	type = new LineType()

	/**
	 * 取字串芝除註釋後者
	 * @param text 
	 * @returns 
	 */
	static rmComment(text:str){
		const z = this
		return super.rmComment(text, z.lineCommentMark)
	}

	processedText():str{
		const z = this
		if(z.type.noComment){
			return z.rawText
		}
		return DictLine.rmComment(z.rawText)
	}
}

/** 按行解析 */
export class TsvParser{

	protected constructor(){}

	protected __init__(...args:Parameters<typeof TsvParser.new>){
		const z = this
		z._readNObj = args[0]
		return z
	}

	static new(readNObj:I_readN<Promise<str[]>>){
		const z = new this()
		z.__init__(readNObj)
		return z
	}

	get This(){return TsvParser}

	// protected _nextObj:I_next<Promise<str>>
	// get nextObj(){return this._nextObj}

	static readonly noCommentPattern = '# no comment'

	protected _readNObj:I_readN<Promise<str[]>>
	get readNObj(){return this._readNObj}

	protected _status = new Status()
	get status(){return this._status}

	/** 當前処理ʹ行號 */
	protected _linePos = -1
	get linePos(){return this._linePos}

	protected _metaStartLinePos:int|undef
	get metaStartLinePos(){return this._metaStartLinePos}

	protected _metaEndLinePos:int|undef
	get metaEndLinePos(){return this._metaEndLinePos}

	/** 全文字串 */
	// protected _text:str
	// get text(){return this._text}

	/** 不含元數據 */
	// protected _data2d:str[][] = []
	// get data2d(){return this._data2d}

	/** 原文按行分割 */
	// protected _oriLines:Line[] = []
	// get oriLines(){return this._oriLines}

	/** 元數據 全文字串 */
	protected _metaText:str = ''
	get metaText(){return this._metaText}

	// reset(){
	// 	const z = this
	// 	z._linePos = -1
	// 	z._metaStartLinePos = void 0
	// 	z._metaEndLinePos = void 0
	// 	//z._readNObj = //
	// }

	/**
	 * ---中首個-在全文中ʹ位
	 * @param text 
	 */
	static getMetaTextStartPosByFullText(text:str){
		const pos = text.indexOf('---')
		return pos
	}

	/**
	 * ...中末個點在全文中ʹ位
	 * @param text 全文
	 * @returns 
	 */
	static getMetaTextEndPosByFullText(text:str){
		const pos = text.indexOf('...') //...中第一個點之位
		const endPos = pos+2 //...中末個點之位
		return endPos
	}

	async readLines(num:int){
		const z = this
		const lines = await z.readNObj.read(num)
		if(lines == void 0 || lines.length === 0){
			z.status.end = true
			return []
		}
		const ans:DictLine[] = []
		for(const lineTxt of lines){
			if(lineTxt == void 0){continue}
			const ua = z.handleLine(lineTxt)
			ans.push(ua)
		}
		return ans
	}

	protected handleLine(lineTxt:str){
		const z = this
		z._linePos ++
		// const lineTxt = await z._nextObj.next()
		const noCommentPattern = z.This.noCommentPattern
		const line = DictLine.new(lineTxt, z._linePos)
		if(z.status.nextLineNoComment === true){ //即上一行有 no comment 指令
			line.type.noComment = true
		}else{
			line.type.noComment = false
		}

		if(z.status.in_body === false){
			if(lineTxt === '---'){
				z.status.in_meta = true
				z.status.in_body = false
				z._metaStartLinePos = z.linePos
			}
			else if(lineTxt === '...'){
				z.status.in_meta = false
				z.status.in_body = true
				z._metaEndLinePos = z.linePos
			}
		}else{ //在body
			line.type.isBody = true
			z._status.nextLineNoComment = false //褈置
			if(lineTxt === noCommentPattern){
				z._status.nextLineNoComment = true
			}
		}
		
		return line
	}
}





