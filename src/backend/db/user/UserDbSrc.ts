import type { InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>

/**
 * 用""引起來
 * @param text 
 * @returns 
 */
const qt = (text:str)=>{
	return `"${text}"`
}

type AddInstOpt = Parameters<typeof ObjSql.new>[1]

class Tbl<FactT extends Mod.BaseFactory<any, any>>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Tbl.new>){
		const z = this
		z.name = args[0]
		//@ts-ignore
		z.factory = args[1]
		//z._col = z.factory.col
		//z._objSql = SqliteUitl.Sql.obj.new(new z.factory.Row())
		return z
	}

	static new<FactT>(name:str, factory:FactT){
		//@ts-ignore
		const z = new this<FactT>()
		z.__init__(name, factory)
		return z
	}

	//get This(){return Tbl}
	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}

	protected _factory:FactT
	get factory(){return this._factory}
	protected set factory(v){this._factory = v}
	
	//protected _col:FactT['col']
	get col():FactT['col']{
		return this.factory.col
	}

	get emptyRow(){
		return this.factory.emptyRow
	}

	async Fn_addInst(db:SqliteDb, opt?:AddInstOpt){
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


}
const TBL = Tbl.new.bind(Tbl)
class Tbls{
	user = TBL('user', Mod.User)
	password = TBL('password', Mod.Password)
	session = TBL('session', Mod.Session)
	profile = TBL('profile', Mod.Profile)
	userDb = TBL('userDb', Mod.UserDb)
	user__db = TBL('user__db', Mod.User__db)
}
const tbls = new Tbls()


class SchemaItem extends SqliteUtil.SqliteMaster{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof SchemaItem.new>){
		const z = this
		z.name = args[0]
		z.type = args[1]
		if(z.type === SMT.table){
			z.tbl_name = z.name
		}else{
			z.tbl_name = $(args[2])
		}
		return z
	}

	static new(name:str, type:SqliteUtil.SqliteMasterType.table):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str):SchemaItem
	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str){
		const z = new this()
		z.__init__(name, type, tbl_name)
		return z
	}

	get This(){return SchemaItem}
}

class Trigger extends SchemaItem{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Trigger.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Trigger}
}

class Index extends SchemaItem{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof Index.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected _cols:str[]
	get cols(){return this._cols}
	set cols(v){this._cols = v}
	
	protected _tbl:Tbl<any>
	get tbl(){return this._tbl}
	set tbl(v){this._tbl = v}
	

	//get This(){return Index}
}
const SI = SchemaItem.new.bind(SchemaItem)
const SMT = SqliteUtil.SqliteMasterType

const IDX = <Fact>(
	name:str
	//@ts-ignore
	, tbl:Tbl<Fact>
	//@ts-ignore
	, fn: (e:Tbl<Fact>['col'])=>str[]
)=>{
	const ans = Index.new()
	ans.name = name
	ans.type = SMT.index
	ans.tbl = tbl
	ans.tbl_name = tbl.name
	ans.cols = fn(ans.tbl.col)
	//SI(name, SMT.index, tbl.name)
	return ans
}

class SchemaItems{
	//tbls=tbls
	idx_sessionFid = IDX('idx_sessionFid', tbls.session, c=>[c.userId])
}

const schemaItems = new SchemaItems()


export class UserDbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserDbSrc.new>){
		const z = this
		z.db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	static tbls = tbls

	//get This(){return UserDbSrc}
	protected _tbls = tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}


	/* 
	已知 如果tbl是Tbl<User>類型的、那麼tbl.Fn_addInst返回函數 (inst:User)=>any
	下面的方法 如何推斷出傳入fn的tbl的泛型類型、使得返回正確類型的函數?
	如 GetFn_addInst(e=>e.user) 則返回(inst:User)=>any、
	傳入GetFn_addInst(e=>e.password) 則返回(inst:Password)=>any 已解決
	*/
	async GetFn_addInst<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const ans = await tbl.Fn_addInst(z.db, opt)
		return ans as ReturnType<T['Fn_addInst']>
	}

	async Fn_seekPasswordByUserId(){
		const z = this
		const tbl = z.tbls.password
		const sql = `SELECT * FROM ${tbl.name} WHERE ${tbl.col.fid}=?`
		const stmt = await z.db.Prepare(sql)
		return async(userId:int|str)=>{
			const ans = await stmt.All<Row.Password>([userId])
			return QryAns.fromPair(ans)
		}
	}

	async Fn_seekIdByUniqueName(colAlias='_'){
		const z = this
		const tbl = z.tbls.user
		const sql = 
`SELECT ${tbl.col.id} AS ${qt(colAlias)} FROM ${tbl.name} WHERE ${tbl.col.uniqueName}=?`
		const stmt = await z.db.Prepare(sql)
		return async(uniqueName:str)=>{
			const ans = await stmt.All<{_:int}>([uniqueName])
			return QryAns.fromPair(ans)
		}
	}

	async Fn_seekPasswordByUniqueName(){
		const z = this
		const SeekIdByUniqueName = await z.Fn_seekIdByUniqueName()
		const SeekPasswordByUserId = await z.Fn_seekPasswordByUserId()
		const ans = async(uniqueName:str)=>{
			const qry = await SeekIdByUniqueName(uniqueName)
			const id = qry.data[0]?._
			if(id == void 0){
				return null
			}
			const pswd = await SeekPasswordByUserId(id)
			return pswd
		}
		return ans
	}

}


