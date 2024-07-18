import type { NgaqDbSrc } from "@backend/db/sqlite/ngaq/NgaqDbSrc"

export class UserDb{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof UserDb.new>){
		const z = this
		z.dbSrc = args[0]
		return z
	}

	static new(dbSrc:NgaqDbSrc){
		const z = new this()
		z.__init__(dbSrc)
		return z
	}

	//get This(){return UserDb}
	protected _dbSrc:NgaqDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}
	
}