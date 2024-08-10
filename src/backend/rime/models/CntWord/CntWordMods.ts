import { BaseFactory, IdBlCtMtFact, IdBlCtMtInst } from "@shared/dbFrame/Models";
import * as Row from "@backend/rime/models/CntWord/CntWordRows";

class CntWordInst extends IdBlCtMtInst<Row.CntWordRow> {
	get Row() { return Row.CntWordRow }
	text:str
	cnt:int
}

class CntWordFact extends IdBlCtMtFact<CntWordInst, Row.CntWordRow> {
	Row = Row.CntWordRow
	//@ts-ignore
	Inst = CntWordInst
}

export const CntWord = CntWordFact.new() as unknown as CntWordFact
export type CntWord = CntWordInst