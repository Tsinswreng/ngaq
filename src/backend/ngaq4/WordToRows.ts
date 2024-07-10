import Word from "@shared/SingleWord2"
import * as Rows_ from '@shared/dbRow/NgaqRows'
import Tempus from "@shared/Tempus"
import { $ } from "@shared/Ut"
import { JoinedRow } from "@shared/dbRow/JoinedRow"
import * as Mod from '@shared/model/NgaqModels'

export class WordToRows{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordToRows.new>){
		const z = this
		z._word = args[0]
		return z
	}

	static new(word:Word){
		const z = new this()
		z.__init__(word)
		return z
	}

	get This(){return WordToRows}

	protected _word:Word
	get word(){return this._word}
	protected set word(v){this._word = v}
	
	protected _wordRow:Rows_.TextWord
	get wordRow(){return this._wordRow}
	protected set wordRow(v){this._wordRow = v}
	

	geneWordRow(){
		const z = this
		const w = z.word
		const tempus_event = Word.getSortedDateToEventObjs(w)
		let wc = Mod.TextWord.col
		const wordRow:Rows_.TextWord = {
			[wc.id]:w.id as int
			,[wc.belong]:w.belong
			,[wc.text]:w.wordShape
			,[wc.ct]:Tempus.toUnixTime_mills(w.dates_add[0])
			,[wc.mt]: Tempus.toUnixTime_mills($(tempus_event.at(-1)).tempus)
		}
		z.wordRow = wordRow
		return wordRow
	}

	protected geneOneLearnRow(tempus:Tempus, status:Rows_.LearnBelong){
		const z = this
		const word = z.word
		//const c = Rows_.LearnRow.col
		const c = Mod.Learn.col
		const ans:Rows_.Learn = {
			id: NaN
			,[c.wid]: $(word.id)
			,[c.belong]: status
			,[c.ct]: Tempus.toUnixTime_mills(tempus)
			,[c.mt]: Tempus.toUnixTime_mills(tempus)
		}
		return ans
	}

	geneLearnRows(){
		const z = this
		const w = z.word
		const ans = [] as Rows_.Learn[]
		for(const tempus of w.dates_add){
			const row =  z.geneOneLearnRow(tempus, Rows_.LearnBelong.add)
			ans.push(row)
		}
		for(const tempus of w.dates_rmb){
			const row =  z.geneOneLearnRow(tempus, Rows_.LearnBelong.rmb)
			ans.push(row)
		}
		for(const tempus of w.dates_fgt){
			const row =  z.geneOneLearnRow(tempus, Rows_.LearnBelong.fgt)
			ans.push(row)
		}

		return ans
	}

	protected geneOneProperty(text:str, belong:Rows_.PropertyBelong){
		const z = this
		const w = z.word
		//const c = Rows_.PropertyRow.col
		const c = Mod.Property.col
		const ans:Rows_.Property={
			id:NaN
			,[c.belong]:belong
			,[c.wid]:$(w.id)
			,[c.text]:text
			,[c.ct]: $(z.wordRow.ct)
			,[c.mt]: $(z.wordRow.mt)
		}
		return ans
	}

	genePropertyRows(){
		const z = this
		const w = z.word
		const ans = [] as Rows_.Property[]

		for(const txt of w.mean){
			const ua = z.geneOneProperty(txt, Rows_.PropertyBelong.mean)
			ans.push(ua)
		}

		for(const txt of w.tag){
			const ua = z.geneOneProperty(txt, Rows_.PropertyBelong.tag)
			ans.push(ua)
		}
		for(const text of w.annotation){
			const ua = z.geneOneProperty(text, Rows_.PropertyBelong.annotation)
			ans.push(ua)
		}
		return ans
	}

	geneJoinedRow(){
		const z = this
		const word = z.geneWordRow()
		const learns = z.geneLearnRows()
		const propertys = z.genePropertyRows()
		const ans = JoinedRow.new({
			word:word
			,learns:learns
			,propertys:propertys
		})
		return ans
	}
}


