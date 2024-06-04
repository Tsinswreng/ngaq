import { $ } from "@shared/Ut"
import { Abs_Table } from "../../_base/Table"
import { WordTmd as Entity_WordTmd, WordTmd } from "@backend/entities/WordTmd"
import { WordTmdDbRow as WordTmdDbRow } from "@backend/dbRow/WordTmd"
import Sqlite from "@backend/db/Sqlite"
import { WordDbRow } from "@shared/dbRow/Word"
import { Word } from "@shared/entities/Word/Word"
import Tempus from "@shared/Tempus"
import { WordTmdDbSrc } from "./DbSrc"
import { I_DbSrc } from "../../_base/DbSrc"

export class WordTmdTable extends Abs_Table{
	protected constructor(){
		super()
	}

	static new(...props:Parameters<typeof Abs_Table.new>){
		const o = new this()
		o.__init__(...props)
		return o
	}

	protected __init__(props: { _dbSrc: I_DbSrc; _tableName: string; }): void {
		super.__init__(props)
	}

	addNewCreatedTable(tableName:string){
		const s = this
		const entity = Entity_WordTmd.new({_tableName:tableName})
		const row = WordTmdDbRow.toDbRow(entity)
		return s.addRecords([row])
	}

	/**
	 * 先於元數據表存在之詞表、厥訊ˇ添入元數據表。建表ᵗ期ˋ以首條記錄ᵗ 諸添詞日期ᵗ首元素潙準。
	 * @returns 
	 */
	async addOldCreatedTable(){
		const z = this
		const db = z.dbSrc.dbRaw
		const masters = await Sqlite.meta.querySqlite_master_unsafeInt(db)
		//sqlite_master中諸表之名
		const tableNames:string[] = []
		for(const row of masters){
			if( row.type === 'table' && row.tbl_name !== WordTmdDbSrc.metadataTableName ){
				tableNames.push(row.tbl_name)
			}
		}
		function minIdRow_sql(tableName:string){
			return `SELECT * FROM ${tableName} WHERE id = (SELECT MIN(id) FROM ${tableName});`
			//return `SELECT * FROM ${tableName} WHERE id = 0;`
		}
		//表__首行
		const table__row = new Map<string, WordDbRow>()

		const firstRows = [] as (WordDbRow|undefined)[]
		for(const table of tableNames){
			const stmt = await Sqlite.prepare(db, minIdRow_sql(table))
			const row = await Sqlite.stmtGet<WordDbRow>(stmt)
			firstRows.push(row)
			if(row != void 0){
				table__row.set(table, row)
			}
		}
		//表名__首詞
		const table__word = new Map<string, Word>()
		const table__createDate = new Map<string, Tempus>()
		for(const [table, row] of table__row){
			const word = WordDbRow.toEntity(row)
			table__word.set(table, word)
			const firstTempus = $(word.dates_add[0])
			// const strDate = Tempus.toISO8601(firstTempus)
			table__createDate.set(table, firstTempus)
		}

		//console.log(table__createDateStr)
		const selectAll = `SELECT * from ${WordTmdDbSrc.metadataTableName}`
		await z.dbSrc.createTable(WordTmdDbSrc.metadataTableName, {ifNotExists: true})
		const tmdRows =  await Sqlite.all(db, selectAll) as WordTmdDbRow[]

		const addedTables = new Set<string>()
		for(const row of tmdRows){
			addedTables.add(row.tableName)
		}

		//const unaddedTable__date = new Map<string, Tempus>()
		const unaddedTable__date = [] as [string,Tempus][]
		for(const [table, date] of table__createDate){
			if(addedTables.has(table)){

			}else{
				//unaddedTable__date.set(table,date)
				unaddedTable__date.push([table, date])
			}
		}

		unaddedTable__date.sort((a,b)=>{
			const d1 = a[1]
			const d2 = b[1]
			return Tempus.diff_mills(d1, d2)
		})

		//console.log(unaddedTable__date)

		const mdToAdd = [] as WordTmd[]
		for(const[table, date] of unaddedTable__date){
			const md = WordTmd.new({
				_tableName: table
				,_createDate: date
			})
			mdToAdd.push(md)
		}

		const rowsToAdd = mdToAdd.map(e=>WordTmdDbRow.toDbRow(e))
		if (rowsToAdd.length === 0){
			return
		}
		return z.addRecords(rowsToAdd)
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