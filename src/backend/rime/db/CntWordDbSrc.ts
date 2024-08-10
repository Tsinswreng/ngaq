

import type { InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import { Tbl } from '@backend/db/sqlite/dbFrame/Tbl'
import * as Mod from '@backend/rime/models/CntWord/CntWordMods'
import { I_DbSrc } from '@shared/dbFrame/I_DbSrc'
import { Index } from '@shared/dbFrame/Index'

const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>
type Id_t = int|str
const TBL = Tbl.new.bind(Tbl)
class Tbls{
	protected constructor(){}
	static tbls = new Tbls()
	cntWord = TBL('cnt_word', Mod.CntWord)
}
const IDX = Index.IDX.bind(Index)
const tbls = Tbls.tbls
class Indexs{
	protected constructor(){}
	static idxs = new Indexs()
	idx_text_belong = IDX('idx_text_belong', tbls.cntWord, e=>[e.text, e.belong])
}



class DbSrc implements I_DbSrc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof DbSrc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return DbSrc}
	static tbls = Tbls.tbls
	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	protected _tbls = DbSrc.tbls
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}
	
	
}

