import { NgaqDbSrc } from "./ngaq4/NgaqDbSrc"
import { SqliteDb } from "./sqlite/Sqlite"

class Opt{
	ngaqSqliteDbPath = './ngaq.sqlite'

}


const opt = new Opt()
class Env{
	opt = opt
	db = SqliteDb.fromPath(opt.ngaqSqliteDbPath)
	ngaqDbSrc = NgaqDbSrc.new(this.db)
}

export const env = new Env()