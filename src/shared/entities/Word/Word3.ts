import { JoinedRow } from '@backend/ngaq3/DbRows/JoinedRow'
import * as Rows from '@backend/ngaq3/DbRows/wordDbRows'
import Tempus from '@shared/Tempus'
import { NonFuncProp, SetterProp } from '@shared/Type'
import { As } from '@shared/Ut';


export function assignExisting(a:kvobj,b:kvobj){
	for(let key in a){
		if(b.hasOwnProperty(key)){
			a[key] = b[key];
		}
	}
	return a;
}


function assign(a:kvobj, b:kvobj){
	return Object.assign(a,b)
}

type id_t = int

export interface I_id{
	id:id_t
}

export interface I_ct{
	ct:Tempus
}

export interface I_mt{
	mt:Tempus
}

export interface I_belong{
	belong:str
}

export interface I_ctMt extends I_ct, I_mt{

}

export interface I_idCtMt extends I_id, I_ctMt{

}

export interface I_idBelongCtMt extends I_idCtMt, I_belong{

}

export interface DbObj extends I_idBelongCtMt{
	
}


export class IdCtMt{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof IdCtMt.new>){
		const z = this
		return z
	}

	static new(...args:any[]):IdCtMt
	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return IdCtMt}

	protected [Rows.Row.col.id]:id_t
	get id_(){return this.id}
	protected set id_(v){this.id = v}
	
	
	protected [Rows.Row.col.ct]:Tempus
	get ct_(){return this.ct}
	protected set ct_(v){this.ct = v}

	protected [Rows.Row.col.mt]:Tempus
	get mt_(){return this.mt}
	protected set mt_(v){this.mt = v}

}


class Base<RowType extends Rows.Row = Rows.Row> extends IdCtMt{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Base.new>){
		const z = this
		return z
	}

	static new(...args:any[]):IdCtMt
	static new(){
		//@ts-ignore
		const z = new this()
		z.__init__()
		return z
	}

	//@ts-ignore
	get This(){return Base}

	protected [Rows.Row.col.belong]:str
	get belong_(){return this.belong}
	protected set belong_(v){this.belong = v}

	static correctObj(w:Base){
		w.ct = Tempus.new(As(w.ct, 'number'))
		w.ct = Tempus.new(As(w.mt, 'number'))
		return w
	}


	correctObj(w:Parameters<typeof Base.correctObj>[0]):this
	correctObj(w:Parameters<typeof Base.correctObj>[0]){
		const z = this
		return z.This.correctObj(w)
	}

	static correctRow(row:Rows.Row){
		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return row
	}

	correctRow(row:Parameters<typeof Base.correctRow>[0]):RowType
	correctRow(row:Parameters<typeof Base.correctRow>[0]){
		const z = this
		return z.This.correctRow(row)
	}

}

class Pa{
	fn(prop:{foo:str}){

	}
}

class Ch extends Pa{
	override fn(prop:{foo:str, bar:number}){

	}
}


export class Word extends Base<Rows.WordRow>{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Word.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(...args:any[]):never
	static new(prop:{
		id?:int
		,belong:str
		,text:str
		,ct:Tempus
		,mt:Tempus
	}){
		const z = new this()
		z.__init__(prop)
		return z
	}


	//@ts-ignore
	get This(){return Word}

	// protected [Rows.WordRow.col.id]?:int
	// get id_(){return this.id}
	// set id_(v){this.id = v}
	
	// protected [Rows.WordRow.col.belong]:str
	// get belong_(){return this.belong}
	// set belong_(v){this.belong = v}

	protected [Rows.WordRow.col.text]:str
	get text_(){return this.text}
	protected set text_(v){this.text = v}

	static correctObj(w:Word):Word
	static correctObj(word:Word){
		return super.correctObj(word as Base) as Word
		//return super.correctObj(As(word, Base)) as Word
	}

	static correctRow(row:Rows.WordRow):Rows.WordRow
	static correctRow(row:Rows.WordRow){
		// row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		// row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return super.correctRow(row)
		//return row
	}

	static fromRow(r:Rows.WordRow){
		const c = Rows.WordRow.col
		const ans = new Word()
		assign(ans,r)
		Word.correctObj(ans)
		return ans
		// const word = Word.new({
		// 	[c.id] : r.id
		// 	,[c.belong]:r.belong
		// 	,[c.text]:r.text
		// 	,[c.ct]:Tempus.new(r.ct)
		// 	,[c.mt]:Tempus.new(r.mt)
		// })
		// return word
	}

	fromRow(...args:Parameters<typeof Word.fromRow>){
		return Word.fromRow(...args)
	}

	static toRow(w:Word){
		const c = Rows.WordRow.col
		const ans = new Rows.WordRow
		assign(ans, w)
		Word.correctRow(ans)
		return ans
		// const r:Rows.WordRow={
		// 	[c.id]: w.id
		// 	,[c.belong]: w.belong
		// 	,[c.text]: w.text
		// 	,[c.ct]: Tempus.toUnixTime_mills(w.ct)
		// 	,[c.mt]: Tempus.toUnixTime_mills(w.mt)
		// }
		// return r
	}

	toRow(){
		return Word.toRow(this)
	}
}

export class Learn extends Base<Rows.LearnRow>{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Learn.new>){
		const z = this
		return z
	}

	static new(...args:any[]):never
	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//@ts-ignore
	get This(){return Learn}

	static correctRow(row:Rows.LearnRow){
		return super.correctRow(row)
	}

	//static correctObj(obj:Learn):Learn
	static correctObj(obj:Learn){
		return super.correctObj(obj as Base) as Learn
	}

	static fromRow(row:Rows.LearnRow){
		const ans = new this()
		assign(ans, row)
		return this.correctObj(ans)
	}

	static toRow(z:Learn){
		const row = new Rows.LearnRow()
		assign(row, z)
		return this.correctRow(row)
	}
	
	toRow(z=this){
		return z.This.toRow(z)
	}

}

export class Property extends Base<Rows.PropertyRow>{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Property.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}

	static new(prop:{
		id?:int
		,belong:Rows.PropertyBelong
		,wid?:int
	}){
		const z = new this()
		z.__init__(prop)
		return z
	}


	//@ts-ignore
	get This(){return Property}

	static correctRow(row: Rows.Row): Rows.PropertyRow
	static correctRow(row: Rows.Row){
		return super.correctRow(row)
	}

	static correctObj(w: Base):Property
	static correctObj(w: Base){
		return super.correctObj(w as Base) as Property
	}

	static toRow(z:Property){
		const row = new Rows.PropertyRow()
		assign(row, z)
		return this.correctRow(row)
	}

	static fromRow(){
		
	}
}





/* 
class C{
	_xxx='xxx'
	set foo(v){this._xxx = v}
}

const c = new C()
const o = {foo:'bars'}
Object.assign(c,o)
console.log(c) */