/**
 * 
 * @param text 
 * @param index 
 * @returns [行,列]
 */
function locate(text: string, index: number) {
	if (index < 0 || index >= text.length) {
		throw new RangeError(`${index}\nIndex out of bounds`);
	}

	let line = 1;
	let column = 1;

	for (let i = 0; i < index; i++) {
		if (text[i] === '\n') {
			line++;
			column = 1;
		} else {
			column++;
		}
	}

	return [line, column];
}

export class ParseError extends Error{
	protected constructor(msg:str){super(msg)}
	protected __init__(...args: Parameters<typeof ParseError.new>){
		const z = this
		return z
	}

	static new(msg:str){
		const z = new this(msg)
		z.__init__(msg)
		return z
	}

	get This(){return ParseError}
	index:int
	line:int
	col:int
}

export class Location{
	stack:str[]=[]
}

export class Status{
	index:int = 0
	location = new Location()
	end=false
}


export class Lex{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Lex.new>){
		const z = this
		z.text = args[0]
		return z
	}

	static new(text:str){
		const z = new this()
		z.__init__(text)
		return z
	}

	get This(){return Lex}
	protected _text:str
	get text(){return this._text}
	protected set text(v){this._text = v}

	protected _status = new Status()
	get status(){return this._status}
	protected set status(v){this._status = v}

	get index(){return this.status.index}
	set index(v){
		// if(v < this.text.length){
		// 	this.status.index = v
		// }else{
		// 	this.status.end = true
		// }
		this.status.index = v
	}


	static locate(...args:Parameters<typeof locate>){
		return locate(...args)
	}

	locate(){
		const z = this
		return z.This.locate(z.text, z.index)
	}
	
	error(msg:str){
		const z = this
		const err = ParseError.new(msg)
		err.index = z.index
		const [line, col] = z.This.locate(z.text, z.index)
		err.line = line
		err.col = col
		throw err
	}

	/**
	 * 从当前字符串位置开始，尝试匹配传入的字符串 str。
	 * 如果成功匹配，函数会将索引移动到匹配字符串的末尾，并返回匹配的字符串。
	 * 如果未能匹配到字符串，则根据是否传入了 required 参数来决定是否抛出一个错误，或者仅仅返回 null。
	 * @param str 
	 * @param required 
	 * @returns 
	 */
	eat(str: string, required?: boolean) {
		const z = this
		const idx = z.status.index
		if (z.text.slice(idx, idx + str.length) === str) {
			z.status.index += str.length;
			return str;
		}

		if (required) {
			this.error(`Expected '${str}' instead of '${this.text[z.status.index]}'`);
		}

		return null;
	}

	peek(){
		const z = this
		return z.text[z.index]
	}

	/**
	 * 讀樣式
	 * 若讀到則移字符指針並返所讀ʹ字符
	 * 如'abc123def' 當字符指針在'c'處旹 用read(/\d+/) 則 返'123'並將字符指針移到'd'處?
	 */
	read(pattern: RegExp) {
		const z = this
		const match = pattern.exec(this.text.slice(this.index));
		if (!match || match.index !== 0) return null;
		this.index += match[0].length;
		return match[0];
	}

	/**
	 * reads characters until it finds a match for the given pattern 
	 * or reaches the end of the string.
	 * It returns all characters read up to that point.
	 * @param pattern 
	 * @returns 
	 */
	readUntil(pattern: RegExp) {
		const z = this
		if (this.index >= this.text.length){
			this.error('Unexpected end of input');
		}

		const start = this.index;
		const match = pattern.exec(this.text.slice(start));

		if (match) {
			const start = this.index;
			this.index = start + match.index; //若有則更新當前ʹ索引
			return this.text.slice(start, this.index); //更新前ʹ索引 到 更新後ʹ索引
		}

		this.index = this.text.length; //若尋不見則設字符指針至終
		return this.text.slice(start);
	}

	/**
	 * Reads characters until it finds a match for the given string 
	 * or reaches the end of the string.
	 * It returns all characters read up to that point.
	 * @param str 
	 * @returns 
	 */
	readUntilStr(str: string, require=false) {
		const z = this;
		// console.log(str)//t
		// console.log(z.peek(), 'peek')//t
		if(z.index >= z.text.length){
			z.error('Unexpected end of input');
		}

		const start = z.index;
		const matchIndex = z.text.indexOf(str, start);

		if(matchIndex === -1){
			if(require){
				z.error(`${str}\nreadUntilStr error`)
			}
			z.index = z.text.length; // If not found, set the character pointer to the end
			return z.text.slice(start);
		}
		const end = matchIndex;
		z.index = end; // Update the current index to the match start index
		return z.text.slice(start, z.index); // Return the substring from start to the match start index
	}


}


