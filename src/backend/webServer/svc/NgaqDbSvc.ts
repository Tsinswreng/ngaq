import { NgaqDbSrc } from "@backend/ngaq3/NgaqDbSrc"
import { JoinedRow } from '@shared/dbRow/JoinedRow'
import { JoinedWord } from '@shared/entities/Word/JoinedWord'
import * as Rows from '@shared/dbRow/NgaqRows'
import * as Mod from '@shared/model/NgaqModels'



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

	get This(){return NgaqDbSvc}

	protected _dbSrc:NgaqDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}
	

	async getAllWords(){
		const z = this
		const ans = await z.dbSrc.getAllJoinedRow()
	}

	async save(){

	}
	
}
