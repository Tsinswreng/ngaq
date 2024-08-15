import type {I_Inst, I_IdBlCtMtInst, I_Fact } from "./I_Models"
import type {I_Row, I_IdBlCtMtRow } from "./I_Rows"
import { BaseRow, IdBlCtMtRow } from "./Rows"
import Tempus from "@shared/Tempus"
import { As } from "@shared/Common"
import { Constructor, InstanceType_, KeyMirror, PubNonFuncProp } from "@shared/Type"
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
	InstT extends IdBlCtMtInst<any>, RowT extends IdBlCtMtRow
> extends BaseFactory<InstT, RowT>{
	abstract Row// = IdBlCtMtRow
	abstract Inst//=IdBlCtMtInst
	override correctInst(inst) {
		inst.ct = Tempus.new(As(inst.ct, 'number'))
		inst.mt = Tempus.new(As(inst.mt, 'number'))
		return inst as InstT
	}
}

//type Constructor_<T = {}> = abstract new (...args: any[]) => T;
export function instMixin<I, R>(BaseInst:I, Row:R){
	return class extends (BaseInst as any){
		get Row(){return Row}
	}
}

export function factMixin<
// 若寫 extends (typeof BaseFactory) 則col報錯
	B extends {prototype:any}
	, I extends I_Inst<any>
	, R extends I_Row
>(
	Base:B, Inst:Constructor<I>, Row:Constructor<R>, correctInst?: (this:InstanceType_<B>, inst:I)=>I
){
	return class extends (Base as unknown as (typeof BaseFactory))<I, R>{
		Inst = Inst
		Row = Row
		correctInst = correctInst??super.correctInst
		// correctInst(inst:I){
		// 	if(correctInst){
		// 		return correctInst(inst)
		// 	}else{
		// 		return super.correctInst(inst)
		// 	}
		// }
	}
}



// import type {MyInstance} from 'xxx'
//type GetConstructor<T> = T extends InstanceType<infer C> ? Constructor<C> : never;


// export class MkFact<Inst_t extends I_Inst<any>, Row_t extends I_Row>{
// 	protected constructor(){}
// 	protected __init__(...args: Parameters<typeof MkFact.new>){
// 		const z = this
// 		return z
// 	}

// 	static new<Inst_t extends I_Inst<any>, Row_t extends I_Row>
// 	(
// 		Inst:Constructor<Inst_t>
// 		, Row:Constructor<Row_t>
// 	){
// 		const z = new this<Inst_t, Row_t>()
// 		z.__init__(Inst, Row)
// 		return z
// 	}

	
// 	//get This(){return MkCls}
// 	Row:Constructor<Row_t>
// 	Inst:Constructor<Inst_t>
// 	// out
// 	mkFact(){
// 		const z = this
// 		return class extends BaseFactory<Inst_t, Row_t> {
// 			get Inst() {
// 				return z.Inst
// 			}
// 			get Row() {
// 				return z.Row
// 			}
// 			// new(prop: PubNonFuncProp<Inst_t>){
// 			// 	//@ts-ignore
// 			// 	return new z.Inst()
// 			// }
// 			// fromRow(row: Row_t){
// 			// 	//@ts-ignore
// 			// 	return new z.Inst()
// 			// }
// 			// correctInst(inst){
// 			// 	return inst
// 			// }
// 		}
// 		//return z.Fact
// 	}
// }
