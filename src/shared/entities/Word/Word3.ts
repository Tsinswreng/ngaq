import { JoinedRow } from '@backend/ngaq3/DbRows/JoinedRow'
import * as Rows from '@backend/ngaq3/DbRows/wordDbRows'
import Tempus from '@shared/Tempus'
import type { InstanceType_, PubNonFuncProp, SetterProp } from '@shared/Type'
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
	[Rows.Row.col.id]:id_t
}

export interface I_ct{
	[Rows.Row.col.ct]:Tempus
}

export interface I_mt{
	[Rows.Row.col.mt]:Tempus
}

export interface I_belong{
	[Rows.Row.col.belong]:str
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

interface I_BaseInst extends I_idBelongCtMt{
	__init__():I_BaseInst
	This
}

interface I_BaseStatic<RowT extends Rows.Row>{
	new :(...args:any[])=>I_BaseInst
	correctObj(obj:I_BaseInst):I_BaseInst
	correctRow(row:RowT):RowT
	fromRow(row:RowT):I_BaseInst
	Row:typeof Rows.Row
}

class BaseInst<RowType extends Rows.Row = Rows.Row> implements I_BaseInst{
	__init__(...args:any[]){
		return this
	}
	This=BaseInst;
	Static=Base
	;[Rows.Row.col.id]: number;
	get id_(){return this.id}
	protected set id_(v){this.id = v}
	
	[Rows.Row.col.ct]: Tempus;
	get ct_(){return this.ct}
	protected set ct_(v){this.ct = v}

	[Rows.Row.col.mt]: Tempus;
	get mt_(){return this.mt}
	protected set mt_(v){this.mt = v}

	[Rows.Row.col.belong]: string;
	get belong_(){return this.belong}
	protected set belong_(v){this.belong = v}

	//toRow():RowType
	//TODO  <RowType extends Rows.Row = Rows.Row> 斷言爲RowType則後ʸ報錯
	toRow<T=this>(){
		const z = this
		//@ts-ignore
		const ans = z.Static.toRow(z)// as RowType
		return ans as T
	}
}

class BaseStatic<
	InstType extends BaseInst = BaseInst
	,RowType extends Rows.Row = Rows.Row
>
implements I_BaseStatic<Rows.Row>{

	new(...args:any[]):InstType
	new(...args:any[]){
		const z = new BaseInst()
		z.__init__()
		return z as InstType
	}
	Row=Rows.Row
	Inst=BaseInst
	correctObj(obj: I_BaseInst): I_BaseInst {
		obj.ct = Tempus.new(As(obj.ct, 'number'))
		obj.ct = Tempus.new(As(obj.mt, 'number'))
		return obj
	}
	correctRow(row: Rows.Row): Rows.Row {
		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return row
	}
	fromRow(row: Rows.Row): InstType {
		const z = this
		const ans = new z.Inst()
		assign(ans, row)
		z.correctObj(ans)
		return ans as InstType
	}
	toRow(inst:InstType){
		const z = this
		const ans = new z.Row()
		assign(ans, inst)
		z.correctRow(ans)
		return ans as RowType
	}
}
const Base = new BaseStatic()

// class Mk<RowType extends Rows.Row = Rows.Row>{
// 	protected constructor(){}
// 	protected __init__(){
// 		const z = this
// 		z.mkStatic()
// 		z.mkInst()
// 		return z
// 	}
// 	static new<RowType extends Rows.Row = Rows.Row>(){
// 		const z = new this<RowType>()
// 		z.__init__()
// 		return z
// 	}

// 	Row:Rows.Row
// 	InstCls:typeof BaseInst
// 	staticObj:BaseStatic
// 	protected mkStatic(){
// 		const z = this
// 		const Ans = class extends BaseStatic{

// 		}
// 		const ans = new Ans()
// 		z.staticObj = ans
// 	}
// 	protected mkInst(){
// 		const z = this
// 		z.InstCls = class extends BaseInst<RowType>{

// 		}
// 		z.staticObj.Inst = z.InstCls
// 	}
// }

// const MkT = Mk.new<Rows.WordRow>()
// const W2 = MkT.staticObj


class WordInst extends BaseInst<Rows.WordRow>{
	override Static = Word;
	[Rows.WordRow.col.text]:str
}

class WordStatic extends BaseStatic<WordInst, Rows.WordRow>{
	override Inst=WordInst
	override Row = Rows.WordRow
}

export const Word = new WordStatic()
export type Word = WordInst



class PropertyInst extends BaseInst<Rows.PropertyRow>{
	override Static = Property;
	[Rows.PropertyRow.col.text]:str
}

class PropertyStatic extends BaseStatic<PropertyInst, Rows.PropertyRow>{
	override Inst=PropertyInst
	override Row = Rows.PropertyRow
}

export const Property = new PropertyStatic()
export type Property = PropertyInst
class LearnInst extends BaseInst<Rows.LearnRow>{
	override Static = Learn
	__init__(...args:Parameters<typeof LearnStatic.prototype.new>): this {
		const z = this
		Object.assign(z, ...args)
		return z
	}
}

class LearnStatic extends BaseStatic<LearnInst, Rows.LearnRow>{
	override Inst = LearnInst
	override Row = Rows.LearnRow
	
	override new(prop:{
		[Rows.LearnRow.col.wid]:int
		,[Rows.LearnRow.col.belong]:Rows.LearnBelong
		,[Rows.LearnRow.col.ct]:Tempus
		,[Rows.LearnRow.col.mt]:Tempus
	}):LearnInst{
		const z = new LearnInst()
		z.__init__(prop)
		return z
	}
}

export const Learn = new LearnStatic()
export type Learn = LearnInst



class Pa1{
	pa1
}

class Ch1 extends Pa1{
	ch1
}

class Pa<T>{
	pa
	fn(){
		let a
		return a as T
	}
}

class Ch extends Pa<Ch1>{
	ch
	fn(){
		let a 
		return a as Ch1
	}
}




// class Cl{
// 	fn(){
// 		const o = new Cl()
// 	}
// }

// class Test{
// 	public pub
// 	get pub_(){return this.pub}
// 	protected pro
// 	get pro_(){return this.pro}
// 	private pri
// }

// type Te = {[k in keyof Test]:Test[k]}
// declare let te:Te

// class Base_0<RowType extends Rows.Row = Rows.Row> extends IdCtMt{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof Base_0.new>){
// 		const z = this
// 		return z
// 	}

// 	static new(...args:any[]):IdCtMt
// 	static new(){
// 		//@ts-ignore
// 		const z = new this()
// 		z.__init__()
// 		return z
// 	}

// 	//@ts-ignore
// 	get This(){return Base_0}

// 	protected [Rows.Row.col.belong]:str
// 	get belong_(){return this.belong}
// 	protected set belong_(v){this.belong = v}

// 	static correctObj(w:Base_0){
// 		w.ct = Tempus.new(As(w.ct, 'number'))
// 		w.ct = Tempus.new(As(w.mt, 'number'))
// 		return w
// 	}


// 	correctObj(w:Parameters<typeof Base_0.correctObj>[0]):this
// 	correctObj(w:Parameters<typeof Base_0.correctObj>[0]){
// 		const z = this
// 		return z.This.correctObj(w)
// 	}

// 	static correctRow(row:Rows.Row){
// 		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
// 		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
// 		return row
// 	}

// 	correctRow(row:Parameters<typeof Base_0.correctRow>[0]):RowType
// 	correctRow(row:Parameters<typeof Base_0.correctRow>[0]){
// 		const z = this
// 		return z.This.correctRow(row)
// 	}

// }

// class Pa{
// 	fn(prop:{foo:str}){

// 	}
// }

// class Ch extends Pa{
// 	override fn(prop:{foo:str, bar:number}){

// 	}
// }


// export class Word_0 extends Base_0<Rows.WordRow>{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof Word_0.new>){
// 		const z = this
// 		const prop = args[0]
// 		Object.assign(z, prop)
// 		return z
// 	}

// 	static new(...args:any[]):never
// 	static new(prop:{
// 		id?:int
// 		,belong:str
// 		,text:str
// 		,ct:Tempus
// 		,mt:Tempus
// 	}){
// 		const z = new this()
// 		z.__init__(prop)
// 		return z
// 	}


// 	//@ts-ignore
// 	get This(){return Word_0}

// 	// protected [Rows.WordRow.col.id]?:int
// 	// get id_(){return this.id}
// 	// set id_(v){this.id = v}
	
// 	// protected [Rows.WordRow.col.belong]:str
// 	// get belong_(){return this.belong}
// 	// set belong_(v){this.belong = v}

// 	protected [Rows.WordRow.col.text]:str
// 	get text_(){return this.text}
// 	protected set text_(v){this.text = v}

// 	static correctObj(w:Word_0):Word_0
// 	static correctObj(word:Word_0){
// 		return super.correctObj(word as Base_0) as Word_0
// 		//return super.correctObj(As(word, Base)) as Word
// 	}

// 	static correctRow(row:Rows.WordRow):Rows.WordRow
// 	static correctRow(row:Rows.WordRow){
// 		// row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
// 		// row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
// 		return super.correctRow(row)
// 		//return row
// 	}

// 	static fromRow(r:Rows.WordRow){
// 		const c = Rows.WordRow.col
// 		const ans = new Word_0()
// 		assign(ans,r)
// 		Word_0.correctObj(ans)
// 		return ans
// 		// const word = Word.new({
// 		// 	[c.id] : r.id
// 		// 	,[c.belong]:r.belong
// 		// 	,[c.text]:r.text
// 		// 	,[c.ct]:Tempus.new(r.ct)
// 		// 	,[c.mt]:Tempus.new(r.mt)
// 		// })
// 		// return word
// 	}

// 	fromRow(...args:Parameters<typeof Word_0.fromRow>){
// 		return Word_0.fromRow(...args)
// 	}

// 	static toRow(w:Word_0){
// 		const c = Rows.WordRow.col
// 		const ans = new Rows.WordRow
// 		assign(ans, w)
// 		Word_0.correctRow(ans)
// 		return ans
// 		// const r:Rows.WordRow={
// 		// 	[c.id]: w.id
// 		// 	,[c.belong]: w.belong
// 		// 	,[c.text]: w.text
// 		// 	,[c.ct]: Tempus.toUnixTime_mills(w.ct)
// 		// 	,[c.mt]: Tempus.toUnixTime_mills(w.mt)
// 		// }
// 		// return r
// 	}

// 	toRow(){
// 		return Word_0.toRow(this)
// 	}
// }

// export class Learn_0 extends Base_0<Rows.LearnRow>{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof Learn_0.new>){
// 		const z = this
// 		return z
// 	}

// 	static new(...args:any[]):never
// 	static new(){
// 		const z = new this()
// 		z.__init__()
// 		return z
// 	}

// 	//@ts-ignore
// 	get This(){return Learn_0}

// 	static correctRow(row:Rows.LearnRow){
// 		return super.correctRow(row)
// 	}

// 	//static correctObj(obj:Learn):Learn
// 	static correctObj(obj:Learn_0){
// 		return super.correctObj(obj as Base_0) as Learn_0
// 	}

// 	static fromRow(row:Rows.LearnRow){
// 		const ans = new this()
// 		assign(ans, row)
// 		return this.correctObj(ans)
// 	}

// 	static toRow(z:Learn_0){
// 		const row = new Rows.LearnRow()
// 		assign(row, z)
// 		return this.correctRow(row)
// 	}
	
// 	toRow(z=this){
// 		return z.This.toRow(z)
// 	}

// }

// export class Property_0 extends Base_0<Rows.PropertyRow>{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof Property_0.new>){
// 		const z = this
// 		const prop = args[0]
// 		Object.assign(z, prop)
// 		return z
// 	}

// 	static new(prop:{
// 		id?:int
// 		,belong:Rows.PropertyBelong
// 		,wid?:int
// 	}){
// 		const z = new this()
// 		z.__init__(prop)
// 		return z
// 	}


// 	//@ts-ignore
// 	get This(){return Property_0}

// 	static correctRow(row: Rows.Row): Rows.PropertyRow
// 	static correctRow(row: Rows.Row){
// 		return super.correctRow(row)
// 	}

// 	static correctObj(w: Base_0):Property_0
// 	static correctObj(w: Base_0){
// 		return super.correctObj(w as Base_0) as Property_0
// 	}

// 	static toRow(z:Property_0){
// 		const row = new Rows.PropertyRow()
// 		assign(row, z)
// 		return this.correctRow(row)
// 	}

// 	static fromRow(){

// 	}
// }








/* 
class C{
	_xxx='xxx'
	set foo(v){this._xxx = v}
}

const c = new C()
const o = {foo:'bars'}
Object.assign(c,o)
console.log(c) */