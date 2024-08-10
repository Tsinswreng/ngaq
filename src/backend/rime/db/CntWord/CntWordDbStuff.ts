

import type { InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Ut'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import { Tbl } from '@backend/db/sqlite/dbFrame/Tbl'
import * as Mod from '@backend/rime/models/CntWord/CntWordMods'
import { Index } from '@shared/dbFrame/Index'
import { Trigger } from '@shared/dbFrame/Trigger'

const ObjSql = SqliteUtil.Sql.obj
const ifNE = SqliteUtil.IF_NOT_EXISTS

const QryAns = SqliteUtil.SqliteQryResult
type QryAns<T> = SqliteUtil.SqliteQryResult<T>
type Id_t = int|str
const TBL = Tbl.new.bind(Tbl)
export class Tbls{
	protected constructor(){}
	static tbls = new Tbls()
	cntWord = TBL('cnt_word', Mod.CntWord)
}
const IDX = Index.IDX.bind(Index)
const tbls = Tbls.tbls
export class Indexs{
	protected constructor(){}
	static idxs = new Indexs()
	idx_text_belong = IDX('idx_text_belong', tbls.cntWord, e=>[e.text, e.belong])
}


const TRIG = Trigger.new.bind(Trigger)
export class Triggers{
	protected constructor(){}
	static trigs = new Triggers()
	trig_chkMt = TRIG('chkModifiedTime')
	trig_earlierDuplicate = TRIG('earlierDuplicate')
	trig_laterDuplicate = TRIG('laterDuplicate')
}

