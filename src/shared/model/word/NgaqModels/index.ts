import type { KeyMirror, PubNonFuncProp } from "@shared/Type";
import { As } from "@shared/Common";
import Tempus from "@shared/Tempus";
import * as Row from "@shared/model/word/NgaqRows"
import { keyMirror } from "@shared/tools/keyMirror";
import type * as WordIf from '@shared/IF/WordIf'
import * as Mods from '@shared/dbFrame/Models'

function assign(a,b){
	return Object.assign(a,b)
}



class TextWordInst extends Mods.instMixin(
	Mods.IdBlCtMtInst<Row.TextWord>,
	Row.TextWord,
){
	text:str
}

class TextWordFact extends Mods.factMixin(
	Mods.IdBlCtMtFact<TextWordInst>
	,TextWordInst
){

}


export const TextWord = TextWordFact.new() as TextWordFact
export type TextWord = TextWordInst

const IdBlCtMtInst = Mods.IdBlCtMtInst
const IdBlCtMtFact = Mods.IdBlCtMtFact

class PropertyInst extends IdBlCtMtInst<Row.Property>{
	override get Row(){return Row.Property}
	wid:int
	text:str
	declare belong: Row.PropertyBelong|str
}
class PropertyFact extends IdBlCtMtFact<PropertyInst>{
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
class LearnFact extends IdBlCtMtFact<LearnInst>{
	//@ts-ignore
	Inst = LearnInst
}
export const Learn = LearnFact.new() as LearnFact
export type Learn = LearnInst



class RelationInst extends IdBlCtMtInst<Row.Relation>{
	override get Row(){return Row.Relation}
	text:str
}
class RelationFact extends IdBlCtMtFact<RelationInst>{
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
class WordRelationFact extends IdBlCtMtFact<WordRelationInst>{
	//@ts-ignore
	Inst = WordRelationInst
}
export const WordRelation = WordRelationFact.new() as WordRelationFact
export type WordRelation = WordRelationInst


import * as IntProp_ from './IntProp'
export const IntProp = IntProp_.IntPropFact
export type IntProp = IntProp_.IntPropInst

// function isNumber(value: any): value is number {
//     return typeof value === 'number';
// }
// let a = isNumber('') //推斷出a是boolean類型
