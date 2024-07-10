import { KeyMirror } from "@shared/Type";
import { As } from "@shared/Ut";
import Tempus from "@shared/Tempus";
import * as Row from "@shared/dbRow/user/UserRows"
import { keyMirror } from "@shared/algo";

function assign(a,b){
	return Object.assign(a,b)
}


export class BaseInst<RowT extends Row.Row>{
	get Row(){return Row.Row}

	toRow():RowT{
		const z = this
		const ans = new z.Row()
		assign(ans, z)
		//@ts-ignore
		z.correctRow(ans)
		return ans as RowT
	}

	correctRow(row:RowT):RowT{
		return row
	}
}

export class BaseFactory<
	InstT extends BaseInst<Row.Row>
	, RowT extends Row.Row
>
{
	Inst:typeof BaseInst = BaseInst
	Row:typeof Row.Row = Row.Row
	//col = keyAsValue(neow this.Row()) as KeyAsValue<RowT>
	//繼承時 先初始化父類中 直接賦值ʹ字段
	col:KeyMirror<RowT>
	/** 空行、用于生成sql等 */
	emptyRow:RowT
	protected constructor(){}
	protected __init__(){
		const z = this
		z.emptyRow = new this.Row() as RowT
		z.col = keyMirror(z.emptyRow) as KeyMirror<RowT> //晚初始化
	}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	new(prop:InstT):InstT{
		const z = this
		const ans = new z.Inst()
		assign(ans, prop)
		return ans as InstT
	}
	fromRow(row:RowT):InstT{
		const z = this
		let ans = new z.Inst()
		assign(ans, row)
		z.correctInst(ans as InstT)
		return ans as InstT
	}
	correctInst(inst:InstT):InstT{
		return inst
	}
}

class IdBlCtMtInst<Row extends Row.IdCtMtBl> extends BaseInst<Row>{
	get Row(){return Row.IdCtMtBl}
	id:int|undef
	belong:str
	ct:Tempus
	mt:Tempus
	override correctRow(row: Row.IdCtMtBl){
		row.ct = Tempus.toUnixTime_mills(As(row.ct, Tempus))
		row.mt = Tempus.toUnixTime_mills(As(row.mt, Tempus))
		return row as Row
	}
}

class IdBlCtMtFact<
	InstT extends IdBlCtMtInst<Row.IdCtMtBl>, RowT extends Row.IdCtMtBl
> extends BaseFactory<InstT, RowT>{
	override Row=Row.IdCtMtBl
	//@ts-ignore
	override Inst=IdBlCtMtInst
	override correctInst(inst) {
		inst.ct = Tempus.new(As(inst.ct, 'number'))
		inst.mt = Tempus.new(As(inst.mt, 'number'))
		return inst as InstT
	}
}


class UserInst extends IdBlCtMtInst<Row.User>{
	override get Row(){return Row.User}
	text:str
}
class UserFact extends IdBlCtMtFact<UserInst, Row.User>{
	Row = Row.User
	//@ts-ignore
	Inst = UserInst
}
export const User = UserFact.new() as UserFact
export type User = UserInst
