import { JoinedRow } from "@backend/ngaq3/DbRows/JoinedRow"
import * as Objs from '@shared/entities/Word/Word3'
import Tempus from "@shared/Tempus"
import { classify } from "@shared/Ut"
import * as Rows from '@backend/ngaq3/DbRows/wordDbRows'
import { Word } from "@shared/entities/Word/Word"

export class JoinedWord{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof JoinedWord.new>){
		const z = this
		const row = args[0]
		z.word = Objs.Word.fromRow(row.word)
		z.propertys = row.propertys.map(e=>Objs.Property.fromRow(e))
		z.learns = row.learns.map(e=>Objs.Learn.fromRow(e))
		return z
	}

	static new(row:JoinedRow){
		const z = new this()
		z.__init__(row)
		return z
	}

	get This(){return JoinedWord}
	protected _word:Objs.Word
	get word(){return this._word}
	protected set word(v){this._word = v}

	protected _propertys:Objs.Property[]
	get propertys(){return this._propertys}
	protected set propertys(v){this._propertys = v}

	protected _learns:Objs.Learn[]
	get learns(){return this._learns}
	protected set learns(v){this._learns = v}

	static toRow(j:JoinedWord):JoinedRow{
		const ans = JoinedRow.new({
			word: j.word.toRow()
			,learns: j.learns.map(e=>e.toRow())
			,propertys: j.propertys.map(e=>e.toRow())
		})
		return ans
	}

	toRow(){
		const z = this
		return z.This.toRow(z)
	}



	static toOldWord(jw:JoinedWord){
		const propMap = classify(jw.propertys, (e)=>e.belong)
		const learnMap = classify(jw.learns, (e)=>e.belong)
		const ans = Word.new({
			id: jw.word.id
			,table: jw.word.belong
			,wordShape: jw.word.text
			,mean: (propMap.get(Rows.PropertyBelong.mean)??[]).map(e=>e.text)
			,tag: (propMap.get(Rows.PropertyBelong.tag)??[]).map(e=>e.text)
			,annotation: (propMap.get(Rows.PropertyBelong.annotation)??[]).map(e=>e.text)
			,dates_add: (learnMap.get(Rows.LearnBelong.add)??[]).map(e=>e.mt)
			,dates_rmb: (learnMap.get(Rows.LearnBelong.rmb)??[]).map(e=>e.mt)
			,dates_fgt: (learnMap.get(Rows.LearnBelong.fgt)??[]).map(e=>e.mt)
		})
		ans.joinedWord = jw
		return ans
	}

	//TODO
	static intersect(w1:JoinedWord, w2:JoinedWord){
		for(let i = 0; i < w2.propertys.length; i++){
			if(w1.propertys[i] == void 0){
				w1.propertys[i] = w2.propertys[i]
				continue
			}
			if(Tempus.diff_mills(
				w1.propertys[i].mt,
				w2.propertys[i].mt
			)<0){ // w2.propertys[i].mt之修改時間更晚
				w1.propertys[i] = w2.propertys[i]
			}
		}
	}

}
