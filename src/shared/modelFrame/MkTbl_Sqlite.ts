import * as IF from "./IF/I_MkTbl"

class TblOpt implements IF.I_TblOpt{
	name:string = ""
	ifNotExists:boolean = false
	cols:IF.Opt_Col[] = []
	indexes:IF.Opt_Index[] = []
	foreignKeys:IF.Opt_FK[] = []
}

export class MkTbl implements IF.I_MkTbl{
	constructor(){if(arguments.length === 0){return}}
	protected __init__(...args: Parameters<typeof MkTbl.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	_tblOpt:TblOpt = new TblOpt()

	//get This(){return MkTbl_Sqlite}

	createTable(name: str, opt?: any): this {
		const z = this
		z._tblOpt.name = name
		return z
	}

	ifNotExists(): this {
		const z = this
		z._tblOpt.ifNotExists = true
		return z
	}

	addCol(name: str, type: str, opt?: IF.Opt_Col): this {
		const z = this
		const col = opt??{}
		col.name = name
		col.type = type
		z._tblOpt.cols.push(col)
		return z
	}

	foreignKey(colName: str, refTbl: str, refCol: str, opt?: IF.Opt_FK): this {
		const z = this
		const fk = opt??{}
		fk.colName = colName
		fk.refTbl = refTbl
		fk.refCol = refCol
		z._tblOpt.foreignKeys.push(fk)
		return z
	}

	index(name: str, cols: str[], opt?: IF.Opt_Index): this {
		const z = this
		const index = opt??{}
		index.name = name
		index.cols = cols
		z._tblOpt.indexes.push(index)
		return z
	}

	getTblOpt(): IF.I_TblOpt {
		const z = this
		return z._tblOpt
	}

	
}
