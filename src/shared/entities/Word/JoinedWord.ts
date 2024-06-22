import type { JoinedRow } from "@backend/ngaq3/DbRows/JoinedRow"
import * as Objs from '@shared/entities/Word/Word3'

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

}
