require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import SingleWord2 from "./SingleWord2";
import VocaRaw2 from "./VocaRaw2";
import VocaSqlite from "./VocaSqlite";

export default class VocaCmd{
	public static readonly config = VocaRaw2.config

	public static async run(cf=this.config){

		let ling = cf.txtTables[0].ling
		let path = cf.txtTables[0].path
		let raw = new VocaRaw2({
			_ling: ling,
			_srcFilePath: path
		})
		
		let words = await raw.getAllWords()
		let db = new VocaSqlite({
			_tableName: ling
		})
		//await db.creatTable(ling)

		let prms = db.addWords(words)
		Promise.all(prms).then((d)=>{console.log('done')}).catch((e)=>{
			console.error(e)
			console.log(`輟辣`)
		})
	}
}

VocaCmd.run()
