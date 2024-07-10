import type { PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import { UserDbSrc } from './UserDbSrc'
import * as Mod from '@shared/model/user/UserModel'
const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

class InitSql{
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
		
	}


	mkAllTbl(){
		const z = this
		return [
			z.mkTbl_user()
			,z.mkTbl_password()
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
	,${c.uniqueName} ${ty.text}
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
	,${c.hash} ${ty.text} ${sn.notNull}
	${sn.foreignKey(c.fid, tbl.name, z.tbls.user.name)}
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
	${sn.foreignKey(c.userId, tbl.name, z.tbls.user.name)}
)`
		return ans
	}

	
}
