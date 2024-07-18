import Word from "@shared/SingleWord2"
import { WordDbSrc } from "@backend/db/sqlite/OldWord/DbSrc"
import type { WordTable } from "@backend/db/sqlite/OldWord/Table"
import { WordDbRow } from "@shared/old_dbRow/Word"
import { WordToRows } from "./WordToRowsOld"
import { NgaqDbSrcOld } from "./NgaqDbSrcOld"
import sqlite3 from 'sqlite3'
import { SqliteDb } from "@backend/sqlite/Sqlite"
class Migrate{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Migrate.new>){
		const z = this
		z._oldDbSrc = args[0]
		z._ngaqDbSrc = args[1]
		z._tblNames = args[2]
		return z
	}

	static new(oldDbSrc:WordDbSrc, neoDbSrc:NgaqDbSrcOld, tblNames:str[]){
		const z = new this()
		z.__init__(oldDbSrc, neoDbSrc, tblNames)
		return z
	}

	get This(){return Migrate}

	protected _oldDbSrc:WordDbSrc
	get oldDbSrc(){return this._oldDbSrc}
	protected set oldDbSrc(v){this._oldDbSrc = v}

	protected _ngaqDbSrc:NgaqDbSrcOld
	get ngaqDbSrc(){return this._ngaqDbSrc}
	protected set ngaqDbSrc(v){this._ngaqDbSrc = v}
	

	protected _tblNames:str[]
	get tblNames(){return this._tblNames}
	protected set tblNames(v){this._tblNames = v}
	
	

	async selectAllFromOneTbl(tblName:str){
		const z = this
		const dbSrc = z.oldDbSrc
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
		const joinedRows = words.map(e=>{
			const wtr = WordToRows.new(e)
			return wtr.geneJoinedRow()
		})
		//await z.ngaqDbSrc.test_addJoinedRows_deprecated(joinedRows)
		const fn = await z.ngaqDbSrc.fn_addJoinedRows()
		z.ngaqDbSrc.db.BeginTrans()
		await fn(joinedRows)
		z.ngaqDbSrc.db.Commit()
		// z.ngaqDbSrc.db.beginTrans()
		// for(const row of joinedRows){
		// 	await z.ngaqDbSrc.test_addJoinedRows(row)
		// }
		// z.ngaqDbSrc.db.commit()
		return true
	}
}


async function main(){
	console.log('start')
	const oldDbPath = './db/voca.db'
	const oldDbSrc = await WordDbSrc.New({
		_dbPath: oldDbPath
	})
	const neoDbPath = './ngaq.sqlite'
	const neoDbRaw = new sqlite3.Database(neoDbPath)
	const neoDb = SqliteDb.new(neoDbRaw)
	const neoDbSrc = NgaqDbSrcOld.new(neoDb)
	const mig = Migrate.new(oldDbSrc, neoDbSrc, [
		'english' , 'japanese'
	])
	const ans = await mig.migrate()
	console.log(ans)
}

main()