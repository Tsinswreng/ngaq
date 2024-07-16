import { JoinedRow } from '@shared/dbRow/JoinedRow'
import * as Mod from '@shared/model/NgaqModels'
import Tempus from "@shared/Tempus"
import { classify } from "@shared/Ut"
import * as Row from '@shared/dbRow/NgaqRows'
import { Word } from "@shared/entities/Word/Word"
import { diffArr } from "@shared/algo"

export class JoinedWord{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof JoinedWord.new>){
		const z = this
		const row = args[0]
		z.textWord = Mod.TextWord.fromRow(row.word)
		z.propertys = row.propertys.map(e=>Mod.Property.fromRow(e))
		z.learns = row.learns.map(e=>Mod.Learn.fromRow(e))
		return z
	}

	static new(row:JoinedRow){
		const z = new this()
		z.__init__(row)
		return z
	}

	get This(){return JoinedWord}
	protected _textWord:Mod.TextWord
	get textWord(){return this._textWord}
	protected set textWord(v){this._textWord = v}

	protected _propertys:Mod.Property[]
	get propertys(){return this._propertys}
	protected set propertys(v){this._propertys = v}

	protected _learns:Mod.Learn[]
	get learns(){return this._learns}
	protected set learns(v){this._learns = v}

	static toRow(j:JoinedWord):JoinedRow{
		const ans = JoinedRow.new({
			word: j.textWord.toRow()
			,learns: j.learns.map(e=>e.toRow())
			,propertys: j.propertys.map(e=>e.toRow())
		})
		return ans
	}

	toRow(){
		const z = this
		return z.This.toRow(z)
	}

	static toPlainWord(jw:JoinedWord){
		const propMap = classify(jw.propertys, (e)=>e.belong)
		const learnMap = classify(jw.learns, (e)=>e.belong)
		const ans = Word.new({
			id: jw.textWord.id
			,table: jw.textWord.belong
			,wordShape: jw.textWord.text
			,mean: (propMap.get(Row.PropertyBelong.mean)??[]).map(e=>e.text)
			,tag: (propMap.get(Row.PropertyBelong.tag)??[]).map(e=>e.text)
			,annotation: (propMap.get(Row.PropertyBelong.annotation)??[]).map(e=>e.text)
			,dates_add: (learnMap.get(Row.LearnBelong.add)??[]).map(e=>e.mt)
			,dates_rmb: (learnMap.get(Row.LearnBelong.rmb)??[]).map(e=>e.mt)
			,dates_fgt: (learnMap.get(Row.LearnBelong.fgt)??[]).map(e=>e.mt)
		})
		//ans.joinedWordOld = jw
		return ans
	}


	/**
	 * 以mt潙準取差集
	 * w1有洏w2無 者
	 * //TODO test
	 */
	static diffProperty(w1:JoinedWord, w2:JoinedWord){
		if(w1.textWord.text !== w2.textWord.text
			|| w1.textWord.belong !== w2.textWord.belong
		){
			throw new Error(
`${w1.textWord.text}\t${w1.textWord.belong}\
\n${w2.textWord.text}\t${w2.textWord.belong}\n\
w1 and w2 is not the same word`
			)
		}
		const diff = diffArr(
			w1.propertys
			,w2.propertys
			,(e)=>Tempus.toUnixTime_mills(e.mt)
		)
		const ans = [] as Mod.Property[]
		for(const [k,v] of diff){
			ans.push(...v)
		}
		return ans
	}

	/**
	 * 同ʹ兩詞 合併䀬ʹproperty。以mt更晚者潙準。
	 * @param w1 數據庫中既有ʹ詞
	 * @param w2 待合入ʹ詞
	 * @deprecated //TODO 考慮 順序不對應
	 */
	static mergeProperty(w1:JoinedWord, w2:JoinedWord){
		if(w1.textWord.text !== w2.textWord.text
			|| w1.textWord.belong !== w2.textWord.belong
		){
			throw new Error(
`${w1.textWord.text}\t${w1.textWord.belong}\
\n${w2.textWord.text}\t${w2.textWord.belong}\n\
w1 and w2 is not the same word`
			)
		}

		for(let i = 0; i < w2.propertys.length; i++){
			if(w1.propertys[i] == void 0){
				w1.propertys[i] = w2.propertys[i]
				continue
			}
			if(Tempus.diff_mills(
				w1.propertys[i].mt,
				w2.propertys[i].mt
			)<0){ // 若w2.propertys[i].mt之修改時間更晚
				w1.propertys[i] = w2.propertys[i]
			}
		}
		// for(let i = 0; i < w2.learns.length; i++){
		// 	if(w1.learns[i] == void 0){
		// 		w1.learns[i] = w2.learns[i]
		// 		continue
		// 	}
		// 	if(Tempus.diff_mills(
		// 		w1.learns[i].mt,
		// 		w2.learns[i].mt
		// 	)<0){ // 若w2.propertys[i].mt之修改時間更晚
		// 		w1.learns[i] = w2.learns[i]
		// 	}
		// }
	}

}
