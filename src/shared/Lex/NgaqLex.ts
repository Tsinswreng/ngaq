import { Lex } from "./Lex"

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
		for(;z.index < z.text.length;){
			z.read_white()
			const ua = z.read_dateBlock()
			dateBlocks.push(ua)
		}
		return dateBlocks
	}


}
