import type { KeyMirror, PubNonFuncProp } from "@shared/Type";
import { As } from "@shared/Common";
import Tempus from "@shared/Tempus";
import * as Row from "@shared/model/word/NgaqRows"
import { keyMirror } from "@shared/tools/keyMirror";
import type * as WordIf from '@shared/IF/WordIf'

function assign(a,b){
	return Object.assign(a,b)
}


export class BaseInst<RowT extends Row.Row>{
	get Row(){return Row.Row}

	toRow():RowT{
		const z = this
		const ans = new z.Row()
		assign(ans, z)
		//@ts-ignore
		z.correctRow(ans)
		return ans as RowT
	}

	correctRow(row:RowT):RowT{
		return row
	}
}

export class BaseFactory<
	InstT extends BaseInst<Row.Row>
	, RowT extends Row.Row
>
{
	Inst:typeof BaseInst = BaseInst
	Row:typeof Row.Row = Row.Row
	//col = keyAsValue(neow this.Row()) as KeyAsValue<RowT>
	//繼承時 先初始化父類中 直接賦值ʹ字段
	col:KeyMirror<RowT>
	/** 空行、用于生成sql等 */
	emptyRow:RowT
	protected constructor(){}
	protected __init__(){
		const z = this
		z.emptyRow = new this.Row() as RowT
		z.col = keyMirror(z.emptyRow) as KeyMirror<RowT> //晚初始化
	}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	new(prop:PubNonFuncProp<InstT>):InstT{
		const z = this
		const ans = new z.Inst()
		assign(ans, prop)
		return ans as InstT
	}
	fromRow(row:RowT):InstT{
		const z = this
		let ans = new z.Inst()
		assign(ans, row)
		z.correctInst(ans as InstT)
		return ans as InstT
	}
	correctInst(inst:InstT):InstT{
		return inst
	}
}

class IdBlCtMtInst<Row extends Row.IdBlCtMt> extends BaseInst<Row>{
	get Row(){return Row.IdBlCtMt}
	id:int
	belong:str
	ct:Tempus
	mt:Tempus
	override correctRow(row: Row.IdBlCtMt){
		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return row as Row
	}
}

class IdBlCtMtFact<
	InstT extends IdBlCtMtInst<Row.IdBlCtMt>, RowT extends Row.IdBlCtMt
> extends BaseFactory<InstT, RowT>{
	override Row=Row.IdBlCtMt
	//@ts-ignore
	override Inst=IdBlCtMtInst
	override correctInst(inst) {
		inst.ct = Tempus.new(As(inst.ct, 'number'))
		inst.mt = Tempus.new(As(inst.mt, 'number'))
		return inst as InstT
	}
}


class TextWordInst extends IdBlCtMtInst<Row.TextWord>{
	override get Row(){return Row.TextWord}
	text:str
}
class TextWordFact extends IdBlCtMtFact<TextWordInst, Row.TextWord>{
	Row = Row.TextWord
	//@ts-ignore
	Inst = TextWordInst
}
export const TextWord = TextWordFact.new() as TextWordFact
export type TextWord = TextWordInst



class PropertyInst extends IdBlCtMtInst<Row.Property>{
	override get Row(){return Row.Property}
	wid:int
	text:str
	declare belong: Row.PropertyBelong|str
}
class PropertyFact extends IdBlCtMtFact<PropertyInst, Row.Property>{
	Row = Row.Property
	//@ts-ignore
	Inst = PropertyInst
}
export const Property = PropertyFact.new() as PropertyFact
export type Property = PropertyInst


class LearnInst extends IdBlCtMtInst<Row.Learn>{
	override get Row(){return Row.Learn}
	wid:int
	declare belong: Row.LearnBelong
}
class LearnFact extends IdBlCtMtFact<LearnInst, Row.Learn>{
	Row = Row.Learn
	//@ts-ignore
	Inst = LearnInst
}
export const Learn = LearnFact.new() as LearnFact
export type Learn = LearnInst



class RelationInst extends IdBlCtMtInst<Row.Relation>{
	override get Row(){return Row.Relation}
	text:str
}
class RelationFact extends IdBlCtMtFact<RelationInst, Row.Relation>{
	Row = Row.Relation
	//@ts-ignore
	Inst = RelationInst
}
export const Relation = RelationFact.new() as RelationFact
export type Relation = RelationInst


class WordRelationInst extends IdBlCtMtInst<Row.WordRelation>{
	override get Row(){return Row.WordRelation}
	wid:int
	rid:int
}
class WordRelationFact extends IdBlCtMtFact<WordRelationInst, Row.WordRelation>{
	Row = Row.WordRelation
	//@ts-ignore
	Inst = WordRelationInst
}
export const WordRelation = WordRelationFact.new() as WordRelationFact
export type WordRelation = WordRelationInst




// function isNumber(value: any): value is number {
//     return typeof value === 'number';
// }
// let a = isNumber('') //推斷出a是boolean類型
