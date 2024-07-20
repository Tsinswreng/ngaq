enum TokenType {
	EOF = 'eof',
	Comment = 'comment',
	Punctuator = 'punctuator',
	String = 'string',
	Numeric = 'numeric',
	Identifier = 'identifier',
	Null = 'null',
	Boolean = 'boolean'
}


enum LexState {
	Default = 'default',
	Comment = 'comment',
	IdentifierNameEscape = 'identifierNameEscape',
	IdentifierName = 'identifierName',
	MultiLineComment = 'multiLineComment',
	SingleLineComment = 'singleLineComment',
	MultiLineCommentAsterisk = 'multiLineCommentAsterisk',
	Sign = 'sign',
	DecimalPointLeading = 'decimalPointLeading',
	Zero = 'zero',
	DecimalInteger = 'decimalInteger',
	String = 'string',
	DecimalPoint = 'decimalPoint',
	DecimalExponent = 'decimalExponent',
	Hexadecimal = 'hexadecimal',
	DecimalFraction = 'decimalFraction',
	DecimalExponentSign = 'decimalExponentSign',
	DecimalExponentInteger = 'decimalExponentInteger',
	HexadecimalInteger = 'hexadecimalInteger',
	Value = 'value',
	IdentifierNameStartEscape = 'identifierNameStartEscape'
}

enum ParseState {
	Start = 'start',
	End = 'end',
	BeforePropertyValue = 'beforePropertyValue',
	AfterPropertyValue = 'afterPropertyValue',
	BeforeArrayValue = 'beforeArrayValue',
	AfterArrayValue = 'afterArrayValue',
	BeforePropertyName = 'beforePropertyName',
	AfterPropertyName = 'afterPropertyName'
}



class Token{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Token.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return Token}

}


export class Json5Lex{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Json5Lex.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Json5Lex}
	lexState:LexState
	buffer:str = ""
	doubleQuote:bool = false
	sign: 1|-1
	c:str = ""
	/** 源碼 */
	source:string
	parseState:ParseState
	stack = []
	pos:number = 0
	line:number = 0
	column:number = 0
	token
	key
	root

	peek () :str|undef{
		const z = this
		const source = z.source
		const pos = z.pos
		if (source[pos]) {
			return String.fromCodePoint(source.codePointAt(pos)!)
		}
		
	}
	[LexState.Comment](){
		
	}
}
