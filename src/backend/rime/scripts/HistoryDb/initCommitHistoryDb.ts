import * as rimeEnv from '@backend/rime/ENV'
import { DbIniter_CntWord } from '@backend/rime/db/CntWord/DbIniter_CntWord'
import { DbErr } from '@backend/sqlite/Sqlite'

const initer = DbIniter_CntWord.new()
try {
	await initer.MkSchema(rimeEnv.commitHistorySqliteDb)
} catch (err) {
	if(err instanceof DbErr){
		console.error(err)
		console.error(err.sql)
	}
}
