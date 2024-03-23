import { inherit } from "@shared/Ut"
import { Abs_Table } from "../../_base/Table"

export class WordTmdTable extends Abs_Table{
	protected constructor(){
		super()
	}

	static new(...props:Parameters<typeof Abs_Table.new>){
		const f = Abs_Table.new(...props)
		const c = new this()
		return inherit(c,f)
	}


}