require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import SingleWord2 from "@shared/SingleWord2";
import VocaMysql from "./VocaMysql";
import VocaRaw2 from "@shared/VocaRaw2";
import VocaSqlite from "./VocaSqlite";
import Log from "@shared/Log";
import { readLine } from "@shared/Ut";
const l = new Log()

export default class VocaCmd{


	public static async addWords(){
		const inputStr = await readLine(`Please input the path of your words table`)

	}
	

	public static async run(){
		let cf=VocaRaw2.defaultConfig
		let ling = cf.txtTables[0].ling
		let path = cf.txtTables[0].path
		let raw = new VocaRaw2({
			_table: ling,
			_srcFilePath: path
		})
		
		

		
		let words = await raw.getAllWords()
		
		let db = new VocaSqlite({
			_tableName: ling
		})
		//await db.creatTable(ling)

		let ids = await db.addWords_old(words)
		console.log(ids)

	}

	public static async testOldVocaDb(){
		const db = new VocaMysql({
			host:'localhost',
			user:'root',
			password: 'admin',
			database: 'voca'
		})

		let liteDb = new VocaSqlite({
			_tableName: 'english'
		})

		db.toSqliteTable_forOld('eng', liteDb)
	}

	/* public static async testReturnId(){
		let w = new SingleWord2({
			ling: 'english',
			wordShape: 'fuck',
			mean: [],
			annotation: [],
			dates_add: []
		})

		let w2 = new SingleWord2({
			ling: 'english',
			wordShape: 'fuckme',
			mean: ['114514'],
			annotation: [],
			dates_add: []
		})

		let liteDb = new VocaSqlite({
			_tableName: 'english'
		})

		liteDb.setWordsByIds(w.ling, [w,w2], [1,2])
		//VocaSqlite.test_addOneWordDirect(liteDb.db, 'english', w)

	}
 */
}

//VocaCmd.testOldVocaDb()
//VocaCmd.run()
//VocaCmd.testReturnId()
//測試謬ᵗ日期、試用他ᵗ代碼塊標記。

