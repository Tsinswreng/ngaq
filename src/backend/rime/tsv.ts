

//'abcd'.indexOf('bc') -> 1
//'abcd'.indexOf('1') -> -1

interface I_next<T>{
	next():T
}


class Status{
	noComment=false
	in_meta = false
	in_body = false
}

class Line{
	protected static lineCommentMark = '#'
	protected constructor(){}
	protected __init__(...args:Parameters<typeof Line.new>){
		const z = this
		z.text = args[0]
		z.index = args[1]
	}
	static new(text:str, index:int){
		const z = new this()
		z.__init__(text, index)
		return z
	}
	text:str
	index:int

	/**
	 * 取字串芝除註釋後者
	 * @param text 
	 * @returns 
	 */
	static rmComment(text:str){
		const z = this
		const pos = text.indexOf(z.lineCommentMark)
		if(pos < 0){
			return text
		}
		return text.slice(0, pos)
	}
}

/** 按行解析 */
class TsvParser{

	protected constructor(){}

	// protected __init__(...args:Parameters<typeof TsvParser.new>){
	// 	const z = this
	// 	z._text = args[0]
	// 	return z
	// }
	// static new(text:str){
	// 	const z = new this()
	// 	z.__init__(text)
	// 	return z
	// }

	protected __init__(){

	}

	static new(){

	}

	protected _iter:I_next<str>
	get iter(){return this._iter}

	/** 當前処理ʹ行號 */
	protected _linePos = 0
	get linePos(){return this._linePos}

	protected _metaStartLinePos:int
	get metaStartLinePos(){return this._metaStartLinePos}

	protected _metaEndLinePos:int
	get metaEndLinePos(){return this._metaEndLinePos}

	/** 全文字串 */
	protected _text:str
	get text(){return this._text}

	/** 不含元數據 */
	protected _data2d:str[][] = []
	get data2d(){return this._data2d}

	/** 原文按行分割 */
	protected _oriLines:Line[] = []
	get oriLines(){return this._oriLines}

	/** 元數據 全文字串 */
	protected _metaText:str = ''
	get metaText(){return this._metaText}






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





}





