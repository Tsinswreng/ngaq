import type { PubNonFuncProp } from "@shared/Type"

/**
 * 實現類 成員字段名須同於列名
 * 約定 始以$號之字段 不入列名
 */
export interface I_Row{

}

export interface I_IdBlCtMtRow extends I_Row{
	id
	/**所屬 */
	bl:str
	/**建立時間 */
	ct:int
	/**修改時間 */
	mt:int
}

/** 程序對象實例 */
export interface I_Inst<Row extends I_Row>{
	get Row():Row
	toRow():Row
	/** inst轉row旹逐字段assign後修正 */
	correctRow():Row
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
	col:kvobj<str, str>
	emptyRow:kvobj
	new:(prop:PubNonFuncProp<InstT>)=>InstT
	fromRow(row:RowT):InstT
	correctInst(inst:InstT):InstT
}



