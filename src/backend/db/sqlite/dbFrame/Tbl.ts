import { BaseTbl } from "@shared/dbFrame/BaseTbl";
import { I_Fact } from "@shared/dbFrame/I_Models";
import type { SqliteDb } from "@backend/sqlite/Sqlite";
import { InstanceType_ } from "@shared/Type";
import * as SqliteUtil from "@backend/sqlite/sqliteUtil";
import { BaseInst } from "@shared/dbFrame/Models";

const ObjSql = SqliteUtil.Sql.obj
type AddInstOpt = Parameters<typeof ObjSql.new>[1]
const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>
type Id_t = int|str

export class Tbl<FactT extends I_Fact<any, any>> extends BaseTbl<FactT>{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Tbl.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new<FactT extends I_Fact<any, any>>(name, factory: FactT){
		const z = new this<FactT>()
		z.__init__(name, factory)
		return z
	}

	
	//@ts-ignore
	get This(){return Tbl}


	async Fn_AddInst(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const row = tbl.factory.emptyRow
		const objsql = ObjSql.new(row, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const ans = async(inst:InstanceType_<FactT['Inst']>)=>{
			const row = inst.toRow()
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}

	async Fn_AddRow(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const row = tbl.factory.emptyRow
		const objsql = ObjSql.new(row, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const ans = async(row:InstanceType_<FactT['Row']>)=>{
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return ans
	}


	/**
	 * 運行旹判斷 是row抑inst
	 * @param db 
	 * @param opt 
	 * @returns 
	 */
	async Fn_Add(db:SqliteDb, opt?:AddInstOpt){
		const z = this
		const tbl = z
		if(opt == void 0){
			opt = {ignoredKeys: [tbl.col.id]}
		}

		const emptyRow = tbl.factory.emptyRow
		const objsql = ObjSql.new(emptyRow, opt)
		const sql = objsql.geneFullInsertSql(tbl.name)
		const stmt = await db.Prepare(sql)
		const Ans = async(
			target:InstanceType_<FactT['Row']>
				|InstanceType_<FactT['Inst']>
		)=>{
			let row:InstanceType_<FactT['Row']>
			if( (target as BaseInst<any>).Row != void 0 ){
				row = (target as BaseInst<any>).toRow()
			}else{
				row = target
			}
			const params = objsql.getParams(row)
			const runRes = await stmt.Run(params)
			const ans = QryAns.fromRunResult(runRes)
			return ans
		}
		return Ans
	}
}


