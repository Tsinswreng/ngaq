import type { MakeAllOptional } from "@shared/Type"

export interface I_MkTbl_Raw {
	createTable(name:str, opt?:any):this
	ifNotExists():this
	addCol(name:str, type:str, constrains:str[]):this
	foreignKey(colName:str, refTable:str, refCol:str, constrains:str[]):this
	index(name:str, cols:str[]):this
	toSql():str
}

export interface I_MkTbl{
	createTable(name:str, opt?:any):this
	ifNotExists():this
	addCol(name:str, type:str, opt?:Opt_Col):this
	foreignKey(colName:str, refTable:str, refCol:str, opt?:Opt_FK):this
	index(name:str, cols:str[], opt?:Opt_Index):this
	getTblOpt():I_TblOpt
}

interface I_constrains{
	constrains:str[]
}

interface _Opt_Col extends I_constrains{
	name:str
	type:str
	default:str
	notNull:bool
	unique:bool
	primaryKey:bool
	autoIncrement:bool
	check:str
	comment:str
}

export interface Opt_Col extends MakeAllOptional<_Opt_Col>{

}

type FK_ON = "CASCADE" | "RESTRICT" | "SET NULL" | "NO ACTION"

interface _Opt_FK extends I_constrains{
	colName:str
	refTbl:str
	refCol:str
	onUpdate: FK_ON
	onDelete: FK_ON
	deferrable: bool|undef
}

export interface Opt_FK extends MakeAllOptional<_Opt_FK>{

}

interface _Opt_Index extends I_constrains{
	name:str
	cols:str[]
	unique:bool
	using:str
	where:str
}

export interface Opt_Index extends MakeAllOptional<_Opt_Index>{

}

export interface I_TblOpt{
	name:str
	ifNotExists:boolean
	cols:Opt_Col[]
	indexes:Opt_Index[]
	foreignKeys:Opt_FK[]
}

