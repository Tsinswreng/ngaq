import type Tempus from "@shared/Tempus"
import type { KeyMirror, PubNonFuncProp } from "@shared/Type"
import type { I_Row } from "./I_Rows"

/**
 * 實現類 成員字段名須同於列名
 * 約定 始以$號之字段 不入列名
 */

/** 程序對象實例 */
export interface I_Inst<Row extends I_Row>{
	get Row() // :typeof Row
	toRow():Row
	/** inst轉row旹逐字段assign後修正 */
	correctRow(row:Row):Row
}



/** 程序對象工廠 */
export interface I_Fact<
	InstT extends I_Inst<I_Row>
	,RowT extends I_Row
>{
	/** 類 */
	Inst
	/** 類 */
	Row
	/** 列名 */
	col:KeyMirror<RowT>
	emptyRow:RowT
	new:(prop:PubNonFuncProp<InstT>)=>InstT
	fromRow(row:RowT):InstT
	correctInst(inst:InstT):InstT
}

export interface I_IdBlCtMtInst<RowT extends I_Row> extends I_Inst<RowT>{
	id
	belong:str
	ct:Tempus
	mt:Tempus
}

export interface I_IdBlCtMtFact<InstT extends I_IdBlCtMtInst<I_Row>, RowT extends I_Row> 
extends I_Fact<InstT, RowT>{
	
}



// class Cl{}

// type Cl_t = Cl


// 如果我使用typeof、我可以通過type target = typeof Cl來獲取Cl的類型(不是Cl的實例)
// 不能使用typeof旹、如何通過Cl_t 取得Cl本身的類型(不是Cl的實例)? 
