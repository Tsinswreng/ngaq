import type {I_Inst, I_IdBlCtMtInst, I_Fact } from "./I_Models"
import type {I_Row, I_IdBlCtMtRow } from "./I_Rows"
import { BaseRow, IdBlCtMtRow } from "./Rows"
import Tempus from "@shared/Tempus"
import { As } from "@shared/Common"
import { KeyMirror, PubNonFuncProp } from "@shared/Type"
import { keyMirror } from "@shared/algo"
/* 
㕥約束 取出ʹ實體ʹ接口
程序對象實例
表結構ʹ訊、各列ʹ列名
建表sql
建觸發器及索引sql
封裝ʹsql操作
*/

export function assign(a,b){
	return Object.assign(a,b)
}


export abstract class BaseInst<RowT extends I_Row> implements I_Inst<RowT>{
	abstract get Row()//{return BaseRow}
	toRow(): RowT {
		const z = this
		const ans = new z.Row()
		assign(ans, z)
		z.correctRow(ans)
		return ans as RowT
	}

	correctRow(row: BaseRow): RowT {
		return row as RowT
	}
}

export abstract class BaseFactory<InstT extends I_Inst<RowT>, RowT extends I_Row>
	implements I_Fact<InstT, RowT>
{
	abstract Inst// = BaseInst
	abstract Row// = BaseRow
	/** @lateinit */
	col:KeyMirror<RowT>
	/** @lateinit */
	emptyRow: RowT
	new(prop: PubNonFuncProp<InstT>):InstT{
		const z = this
		const ans = new z.Inst()
		assign(ans, prop)
		return ans
	}
	fromRow(row: RowT): InstT {
		const z = this
		const ans = new z.Inst()
		assign(ans, row)
		//console.log(0)
		z.correctInst(ans as InstT)
		//console.log(1) -
		return ans as InstT
	}
	correctInst(inst: InstT): InstT {
		return inst
	}
	
	protected constructor(){}
	protected __init__(){
		const z = this
		z.emptyRow = new z.Row() as RowT
		z.col = keyMirror(z.emptyRow)
	}
	static new(){
		//@ts-ignore
		const z = new this()
		z.__init__()
		return z
	}
	
}


export abstract class IdBlCtMtInst<RowT extends I_IdBlCtMtRow>
	extends BaseInst<RowT>
	implements I_Inst<RowT>
{
	abstract get Row()//{return IdBlCtMtRow}
	id:int|undef
	belong:str
	ct:Tempus
	mt:Tempus
	correctRow(row: RowT){
		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return row
	}
}

export abstract class IdBlCtMtFact<
	InstT extends I_IdBlCtMtInst<any>, RowT extends I_IdBlCtMtRow
> extends BaseFactory<InstT, RowT>{
	abstract Row// = IdBlCtMtRow
	abstract Inst//=IdBlCtMtInst
	override correctInst(inst) {
		inst.ct = Tempus.new(As(inst.ct, 'number'))
		inst.mt = Tempus.new(As(inst.mt, 'number'))
		return inst as InstT
	}
}