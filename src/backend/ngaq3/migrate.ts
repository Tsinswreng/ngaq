import Word from "@shared/SingleWord2"
import { WordDbSrc } from "@backend/db/sqlite/Word/DbSrc"
import type { WordTable } from "@backend/db/sqlite/Word/Table"
import { WordDbRow } from "@shared/dbRow/Word"
import { WordToRows } from "./WordToRows"


class Migrate{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Migrate.new>){
		const z = this
		z._dbSrc = args[0]
		z._tblNames = args[1]
		return z
	}

	static new(dbSrc:WordDbSrc, tblNames:str[]){
		const z = new this()
		z.__init__(dbSrc, tblNames)
		return z
	}

	get This(){return Migrate}

	protected _dbSrc:WordDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}

	protected _tblNames:str[]
	get tblNames(){return this._tblNames}
	protected set tblNames(v){this._tblNames = v}
	
	

	async selectAllFromOneTbl(tblName:str){
		const z = this
		const dbSrc = z.dbSrc
		const tbl = dbSrc.loadTable(tblName)
		const ans = await tbl.selectAllWithTblName()
		return ans
	}

	async getRowsOfAllTbl(){
		const z = this
		const ans = [] as WordDbRow[]
		for(const tbl of z.tblNames){
			const ua = await z.selectAllFromOneTbl(tbl)
			ans.push(...ua)
		}
		return ans
	}



	async migrate(){
		const z = this
		const rows = await z.getRowsOfAllTbl()
		const words = rows.map(e=>WordDbRow.toEntity(e))
		const ans = words.map(e=>{
			const wtr = WordToRows.new(e)
			return wtr.geneJoinedRow()
		})
		return ans
	}
}


async function main(){
	const dbPath = './db/voca.db'
	const dbSrc = await WordDbSrc.New({
		_dbPath: dbPath
	})
	const mig = Migrate.new(dbSrc, [
		'english', 'japanese'
	])
	const ans = await mig.migrate()
	console.log(ans)
}

main()