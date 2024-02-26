import 'tsconfig-paths/register'
import { UserDbSrc } from "@backend/db/sqlite/User/DbSrc";
import Config from "@shared/Config";
import Sqlite from '@backend/db/Sqlite';


const configInst = Config.getInstance()
const config = configInst.config
async function main(){
	
	const manager = await UserDbSrc.New({
		_dbPath: config.server?.dbPath
		,_mode: Sqlite.openMode.DEFAULT_CREATE
	})

	await manager.createTable(config.server.userTableName, true)
	console.log('done')
}
main()