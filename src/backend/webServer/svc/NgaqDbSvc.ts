import { NgaqDbSrc } from "@backend/ngaq4/ngaqDbSrc/NgaqDbSrc"
import { JoinedRow } from '@shared/dbRow/JoinedRow'
import { JoinedWord } from '@shared/entities/Word/JoinedWord'
import * as Rows from '@shared/dbRow/NgaqRows'
import * as Mod from '@shared/model/NgaqModels'

import {env} from '@backend/ENV'


export class NgaqDbSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof NgaqDbSvc.new>){
		const z = this
		z.dbSrc = args[0]
		return z
	}

	static new(dbSrc:NgaqDbSrc){
		const z = new this()
		z.__init__(dbSrc)
		return z
	}

	static inst = NgaqDbSvc.new(env.ngaqDbSrc)


	get This(){return NgaqDbSvc}

	protected _dbSrc:NgaqDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}
	

	async GetAllWords(){
		const z = this
		const ans = await z.dbSrc.GetAllJoinedRow()
		return ans
	}

	async Save(){

	}
	
}
