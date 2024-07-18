import Config from "./Config"
import { UserDbSrc } from "./db/sqlite/user/UserDbSrc"
import { NgaqDbSrc } from "./ngaq4/ngaqDbSrc/NgaqDbSrc"
import { SqliteDb } from "./sqlite/Sqlite"
const configInst = Config.getInstance()
const config = configInst.config
class Opt{
	ngaqSqliteDbPath = './ngaq.sqlite'
	serverDbPath = config.ngaq.server.dbPath
}


const opt = new Opt()
class Env{
	opt = opt
	dfltNgaqDb = SqliteDb.fromPath(opt.ngaqSqliteDbPath)
	serverDb = SqliteDb.fromPath(opt.serverDbPath)
	ngaqDbSrc = NgaqDbSrc.new(this.dfltNgaqDb)
	serverDbSrc = UserDbSrc.new(this.serverDb)
}

export const env = new Env()