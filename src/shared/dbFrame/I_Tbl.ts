import { I_Fact } from "./I_Entity"

export interface I_Tbl<FactT extends I_Fact<any, any>>{
	/** The name of the table */
	get name():str
	/** The factory of inst */
	get factory():FactT
	/** The columns of the table */
	get col():FactT['col']
	/** The empty row of the table */
	get emptyRow():FactT['emptyRow']
}


export interface I_Fn_Add{
	
}
