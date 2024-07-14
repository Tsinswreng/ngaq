import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import { UserDbSrc } from './UserDbSrc'
import * as Mod from '@shared/model/user/UserModel'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

export class InitSql{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof InitSql.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return InitSql}

	protected _tbls = UserDbSrc.tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	async MkSchema(db:SqliteDb){
		const z = this
		await db.BeginTrans()
		const sqls = z.getAllSql()
		const ans = [] as RunResult[]
		for(const sql of sqls){
			const ua = await db.Run(sql)
			ans.push(ua)
		}
		await db.Commit()
		return ans
	}

	getAllSql():str[]{
		const z = this
		return [
			...z.mkAllTbl()
		]
	}


	mkAllTbl(){
		const z = this
		return [
			z.mkTbl_user()
			,z.mkTbl_password()
			,z.mkTbl_session()
			,z.mkTbl_profile()
			,z.mkTbl_ngaqSchema()
			,z.mkTbl_user__ngaqDb()
		]
	}

	mkTbl_user(){
		const z = this
		const tbl = z.tbls.user
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.belong} ${ty.text}
	,${c.ct} ${ty.int}
	,${c.mt} ${ty.int}
	,${c.uniqueName} ${ty.text} ${sn.unique}
)`
		return ans
	}

	mkTbl_password(){
		const z = this
		const tbl = z.tbls.password
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.fid} ${ty.int} ${sn.notNull}
	,${c.belong} ${ty.text} ${sn.notNull}
	,${c.ct} ${ty.int} ${sn.notNull}
	,${c.mt} ${ty.int} ${sn.notNull}
	,${c.salt} ${ty.text} ${sn.notNull}
	,${c.text} ${ty.text} ${sn.notNull}
	,${sn.foreignKey(c.fid, z.tbls.user.name, z.tbls.user.col.id)}
)`
		return ans
	}

	mkTbl_session(){
		const z = this
		const tbl = z.tbls.session
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.userId} ${ty.int} ${sn.notNull}
	,${c.belong} ${ty.text} ${sn.notNull}
	,${c.ct} ${ty.int} ${sn.notNull}
	,${c.mt} ${ty.int} ${sn.notNull}
	,${c.expirationTime} ${ty.int} ${sn.notNull}
	,${c.token} ${ty.text} ${sn.notNull}
	,${sn.foreignKey(c.userId, z.tbls.user.name, z.tbls.user.col.id)}
)`
		return ans
	}

	mkTbl_profile(){
		const z = this
		const tbl = z.tbls.profile
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.fid} ${ty.int} ${sn.notNull}
	,${c.belong} ${ty.text} ${sn.notNull}
	,${c.ct} ${ty.int} ${sn.notNull}
	,${c.mt} ${ty.int} ${sn.notNull}
	,${c.nickName} ${ty.text} ${sn.notNull}
	,${c.sex} ${ty.text} ${sn.notNull}
	,${c.birth} ${ty.int}
	,${c.email} ${ty.text}
	,${sn.foreignKey(c.fid, z.tbls.user.name, z.tbls.user.col.id)}
)`
		return ans
	}

	mkTbl_ngaqSchema(){
		const z = this
		const tbl = z.tbls.userDb
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.belong} ${ty.text} ${sn.notNull}
	,${c.ct} ${ty.int} ${sn.notNull}
	,${c.mt} ${ty.int} ${sn.notNull}
	,${c.name} ${ty.text} ${sn.notNull}
	,${c.path} ${ty.text} ${sn.notNull}
)`
		return ans
	}

	mkTbl_user__ngaqDb(){
		const z = this
		const tbl = z.tbls.user__db
		const c = tbl.col
		const sn = SqliteUtil.snippet
		const ty = sn.colType
		const ans = 
`CREATE TABLE ${ifNE} ${tbl.name}(
	${c.id} ${sn.integerPrimaryKey}
	,${c.userId} ${ty.int} ${sn.notNull}
	,${c.dbId} ${ty.int} ${sn.notNull}
	,${c.belong} ${ty.text} ${sn.notNull}
	,${c.ct} ${ty.int} ${sn.notNull}
	,${c.mt} ${ty.int} ${sn.notNull}
	,${sn.foreignKey(c.userId, z.tbls.user.name, z.tbls.user.col.id)}
	,${sn.foreignKey(c.dbId, z.tbls.userDb.name, z.tbls.userDb.col.id)}
)`
		return ans
	}


}
