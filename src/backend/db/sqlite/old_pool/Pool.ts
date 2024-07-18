import OldSqlite, { SqliteType } from "@backend/db/OldSqlite";

export class SqlitePool{

	protected constructor(){}

	static new(){
		const o = new this()
		return o
	}

	protected static instance:SqlitePool|undefined
	// static getInstance(){
	// 	// if( SqlitePool.instance == void 0 ){
	// 	// 	SqlitePool.instance = SqlitePool.new()
	// 	// }
	// 	// return SqlitePool.instance
	// 	return SqlitePool.new()
	// }

	path__connect:Map<string, SqliteType.Database> = new Map()

	async connect(path:string, mode?:number){
		const s = this
		let conne = s.path__connect.get(path)
		if( conne != void 0 ){
			return conne
		}else{
			conne = await OldSqlite.newDatabase(path, mode)
			s.path__connect.set(path, conne)
		}
		return conne
	}
}