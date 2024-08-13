
import type { I__, InstanceType_, PubNonFuncKeys } from '@shared/Type'
import type { RunResult } from 'sqlite3'

import * as SqliteUtil from '@backend/sqlite/sqliteUtil'
import { $ } from '@shared/Common'
import { SqliteDb } from '@backend/sqlite/Sqlite'
import type * as Sqlite from '@backend/sqlite/Sqlite'

import { JoinedRow } from '@shared/model/word/JoinedRow'
import { JoinedWord } from '@shared/model/word/JoinedWord'
import * as Row from '@shared/model/word/NgaqRows'
import * as Mod from '@shared/model/word/NgaqModels'
import Tempus from '@shared/Tempus'
import { Index } from '@shared/dbFrame/Index'
import { Trigger } from '@shared/dbFrame/Trigger'


const ObjSql = SqliteUtil.Sql.obj

type AddInstOpt = Parameters<typeof ObjSql.new>[1]

import { Tbl } from '../dbFrame/Tbl'
import { I_Tbls } from '@shared/dbFrame/I_Tbls'
const TBL = Tbl.new.bind(Tbl)

export class Tbls implements I_Tbls{
	protected constructor(){}
	static inst = new Tbls()
	textWord = TBL('textWord', Mod.TextWord)
	property = TBL('property', Mod.Property)
	learn = TBL('learn', Mod.Learn)
	relation = TBL('relation', Mod.Relation)
	wordRelation = TBL('wordRelation', Mod.WordRelation)
	;[key:str]:Tbl<any>
}
const tbls = Tbls.inst


// export class SchemaItem extends SqliteUtil.SqliteMaster{
// 	protected constructor(){super()}
// 	protected __init__(...args: Parameters<typeof SchemaItem.new>){
// 		const z = this
// 		z.name = args[0]
// 		z.type = args[1]
// 		if(z.type === SMT.table){
// 			z.tbl_name = z.name
// 		}else{
// 			z.tbl_name = $(args[2])
// 		}
// 		return z
// 	}

// 	static new(name:str, type:SqliteUtil.SqliteMasterType.table):SchemaItem
// 	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str):SchemaItem
// 	static new(name:str, type:SqliteUtil.SqliteMasterType, tbl_name?:str){
// 		const z = new this()
// 		z.__init__(name, type, tbl_name)
// 		return z
// 	}

// 	get This(){return SchemaItem}
// }



//const SI = SchemaItem.new.bind(SchemaItem)
const TRIG = Trigger.new.bind(Trigger)
const SMT = SqliteUtil.SqliteMasterType
const IDX = Index.IDX.bind(Index)

export class Indexs{
	protected constructor(){}
	static inst = new Indexs()
	idx_wordText = IDX('idx_wordText', tbls.textWord, c=>[c.text])
	idx_wordCt = IDX('idx_wordCt', tbls.textWord, c=>[c.ct])
	idx_wordMt = IDX('idx_wordMt', tbls.textWord, c=>[c.mt])
	idx_learnWid = IDX('idx_learnWid', tbls.learn, c=>[c.wid])
	idx_learnCt = IDX('idx_learnCt', tbls.learn, c=>[c.ct])
	//idx_learnMt = IDX('idx_learnMt', tbls.learn, c=>[c.mt])
	idx_propertyWid = IDX('idx_propertyWid', tbls.property, c=>[c.wid])
}

export class Triggers{
	//tbls=tbls
	protected constructor(){}
	static inst = new Triggers()
	trig_aftIns_learnAltWordMt = TRIG('aftIns_learnAltWordMt', tbls.learn)
	trig_aftIns_propertyAltWordMt = TRIG('aftIns_propertyAltWordMt', tbls.property)
	trig_aftUpd_propertyAltWordMt = TRIG('aftUpd_propertyAltWordMt', tbls.property)
}



