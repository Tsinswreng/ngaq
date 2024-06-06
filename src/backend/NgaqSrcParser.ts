
import * as Ut from '@shared/Ut'


/**
 * 
 * @param text 
 * @param index 
 * @returns [行,列]
 */
function locate(text: string, index: number) {
	if (index < 0 || index >= text.length) {
		throw new RangeError("Index out of bounds");
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

enum EleType{

}

class Ele{
	start:int
	end:int
	type:EleType
}



export interface I_readNChars{
	read(n:int):Promise<str[]>
}

enum Position{
	dateBlock='dateBlock'
	,wordBlock='wordBlock'
}

class Location{
	stack:Position[]=[]
}

class Status{
	index:int = -1
	location = new Location()
}

class DateBlock{
	date:str
	text:str
}

export class NgaqSrcParser{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof NgaqSrcParser.new>){
		const z = this
		z._readNChar = args[0]
		return z
	}
	static new(_readNChar:I_readNChars){
		const z = new this()
		z.__init__(_readNChar)
		return z
	}
	
	protected _readNChar:I_readNChars
	get readNChar(){return this._readNChar}
	protected set readNChar(v){this._readNChar = v}
	

	protected _status = new Status()
	get status(){return this._status}
	protected set status(v){this._status = v}
	
	protected _buffer:str[]
	get buffer(){return this._buffer}
	protected set buffer(v){this._buffer = v}
	

	/** 
	 * //TODO 判斷越界 
	 * 
	 */
	peek(){
		const z = this
		return z.buffer[0]
	}
	
	error(v){
		throw new Error(v)
	}

	eat(str:str, required?:bool){
		const z = this
		const len = str.length
		
	}

	async readN(n:int){
		const z = this
		const charArr = await z.readNChar.read(n)
		z.buffer.push(...charArr)
	}

	readDateBlock(){

	}

	readWhite(){
		const z = this
		
	}

}


/* 

用編譯原理的知識幫我寫一個解析器。
格式:
日期後面加一對大括號稱爲日期塊
如
```
2024-05-29T11:14:17.000+08:00
{

}
```
爲一個日期塊。
在日期塊內可以有多個單詞塊。
多個單詞塊之間用"---\a"分隔。

*/

/* 

2024-05-29T11:11:18.000+08:00
{
word
美: [wɜrd]
英: [wɜː(r)d]
n.	詞；單詞；字；消息
v.	措辭；用詞

say
美: [seɪ]
英: [seɪ]
v.	說；告訴；講；表達
n.	發言權；決定權

[[
speak

美: [spik]

英: [spiːk]

v.	說；說話；講話；發言
]]

}

用編譯原理的知識幫我寫一個解析器。
格式:
日期後面加一對大括號稱爲日期塊
如
```
2024-05-29T11:14:17.000+08:00
{

}
```
爲一個日期塊。
在日期塊內可以有多個單詞塊。
單詞塊有兩種、第一種用雙中括號包裹、如
```
[[
speak

美: [spik]

英: [spiːk]

v.	說；說話；講話；發言
]]

```
第二種單詞塊可以不用雙中括號包裹。如
```
word
美: [wɜrd]
英: [wɜː(r)d]
n.	詞；單詞；字；消息
v.	措辭；用詞

say
美: [seɪ]
英: [seɪ]
v.	說；告訴；講；表達
n.	發言權；決定權
```

若單詞塊是用中括號包裹的、則該單詞塊內部允許有空行。
以空行分隔不同的單詞塊。
若單詞塊沒用中括號包裹、則
*/


