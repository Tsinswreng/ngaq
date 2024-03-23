import { inherit } from "@shared/Ut"
import { Abs_Table } from "../../_base/Table"
import { RunResult } from "sqlite3"
import { WordTmd as Entity_WordTmd } from "@backend/entities/WordTmd"
import { DbRow_WordTmd } from "@backend/interfaces/WordTmd"


export class WordTmdTable extends Abs_Table{
	protected constructor(){
		super()
	}

	static new(...props:Parameters<typeof Abs_Table.new>){
		const f = Abs_Table.new(...props)
		const c = new this()
		return inherit(c,f)
	}

	addNewCreatedTable(tableName:string){
		const s = this
		const entity = Entity_WordTmd.new({_tableName:tableName})
		const row = DbRow_WordTmd.toDbRow(entity)
		return s.addRecords([row])
	}

}


/* class Student{
	courses: string[]
	name:string
}

class Student_DbRow{
	courses: string
	name:string
}


function toDbRow(o:Student){
	const ans = {
		courses : JSON.stringify(o.courses)
		,name : o.name
	}
}

function xxx(o:Student_DbRow){
	const ans = new Student()
	ans.name = o.name
	ans.courses = JSON.parse(o.courses)
} */