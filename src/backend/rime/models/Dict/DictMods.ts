import { BaseFactory, factMixin, IdBlCtMtFact, IdBlCtMtInst, instMixin } from "@shared/dbFrame/Models";
import * as Row from "@backend/rime/models/Dict/DictRows";
import { PubAbsConstructor } from "@shared/Type";

// class StrToStrInst extends IdBlCtMtInst<Row.StrToStrRow> {
// 	get Row() { return Row.StrToStrRow }
// 	key:str
// 	keyBl:str
// 	value:str
// 	valueBl:str
// }

class StrToStrInst extends instMixin(
	IdBlCtMtInst<Row.StrToStrRow>
	, Row.StrToStrRow
){
	key:str
	keyBl:str
	value:str
	valueBl:str
}


class StrToStrFact extends IdBlCtMtFact<StrToStrInst, Row.StrToStrRow> {
	Row = Row.StrToStrRow
	//@ts-ignore
	Inst = StrToStrInst
}

export const StrToStr = StrToStrFact.new() as unknown as StrToStrFact
export type StrToStr = StrToStrInst



class StrToNumInst extends instMixin(IdBlCtMtInst<Row.StrToNumRow>, Row.StrToNumRow){
	key:str
	keyBl:str
	value:num
	valueBl:str
}

class StrToNumFact extends factMixin(
	IdBlCtMtFact<StrToNumInst>
	, StrToNumInst
){

}

export const StrToNum = StrToNumFact.new() as unknown as StrToNumFact
export type StrToNum = StrToNumInst



// abstract class A{
// 	protected constructor(){}
// 	a
// }

// type ACls = typeof A
// type ACstrct = Constructor<A>
// let a:ACls = A
// let b:ACstrct


