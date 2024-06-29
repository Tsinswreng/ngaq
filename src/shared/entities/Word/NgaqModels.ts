import { JoinedRow } from '@shared/dbRow/JoinedRow'
import * as Rows from '@shared/dbRow/wordDbRowsOld'
import Tempus from '@shared/Tempus'
import type { InstanceType_, PubNonFuncProp, SetterProp } from '@shared/Type'
import { As } from '@shared/Ut';

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
		//return ans
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
