require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import { Database } from 'sqlite3';
import Sqlite from '@shared/db/Sqlite';
import _ from 'lodash';
import SingleWord2 from '@shared/SingleWord2';
import VocaRaw2 from '@shared/VocaRaw2';
import { IVocaRow } from '@shared/SingleWord2';
import { $ } from '@shared/Ut';
import Tempus from '@shared/Tempus';
const rootDir:string = require('app-root-path').path
const Ut = {
	nng:$
}



/**
 * 單詞表中每列的列名。蔿 保持統一 和 方便改名 、sql語句中通過此類中的列名常量間接訪問類名而非直接用寫死的字符串字面量
 * 畀表增字段: 改VocaTableColumnName, 改IVocaRow, 改SingleWord2字段, 改SingleWord2構造器, 改 創表之sql函數, 改 parse與stringfy, VocaRaw2ʸ改getWordInWordUnit, 改ᵣ既存ᵗ表, 同步 shared
 */
export class VocaTableColumnName{
	public static readonly id='id'
	public static readonly wordShape='wordShape'
	public static readonly pronounce='pronounce'
	public static readonly mean='mean'
	public static readonly annotation='annotation'
	public static readonly tag='tag'
	public static readonly times_add='times_add'
	public static readonly dates_add='dates_add'
	public static readonly times_rmb='times_rmb'
	public static readonly dates_rmb='dates_rmb'
	public static readonly times_fgt='times_fgt'
	public static readonly dates_fgt='dates_fgt'
	public static readonly ling='ling' //此字段ˋ實ˋ不存。
	public static readonly source='source'
}




export default class VocaSqlite{

	constructor(props:{
		_dbName?:string,
		_dbPath?:string,
		_tableName:string
	}){
		Object.assign(this, props)
	}

	private _dbName = 'voca';
	public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}

	private _dbPath = rootDir+'/db/'+this._dbName+'.db' 
	;public get dbPath(){return this._dbPath;};;public set dbPath(v){this._dbPath=v;};

	private _tableName:string = ''
	;public get tableName(){return this._tableName;};;public set tableName(v){this._tableName=v;};


	private _db:Database = new Database(this.dbPath, (err)=>{
		if(err){throw err}
	})
	;public get db(){return this._db;};

	/**
	 * 創建單詞表
	 * @param db 
	 * @param table 
	 * @returns 
	 */
	public static creatTable(db:Database, table:string){
		function getSql(table:string){
			let c = VocaTableColumnName
			return `
			CREATE TABLE '${table}' (
				${c.id} INTEGER PRIMARY KEY,
				${c.wordShape} TEXT NOT NULL,
				${c.pronounce} TEXT NOT NULL,
				${c.mean} TEXT NOT NULL,
				${c.annotation} TEXT NOT NULL,
				${c.tag} TEXT NOT NULL,
				${c.times_add} INTEGER DEFAULT 0,
				${c.dates_add} TEXT NOT NULL,
				${c.times_rmb} INTEGER DEFAULT 0,
				${c.dates_rmb} TEXT NOT NULL,
				${c.times_fgt} INTEGER DEFAULT 0,
				${c.dates_fgt} TEXT NOT NULL,
				${c.source} TEXT NOT NULL,
			);
			`
		}
		return Sqlite.all(db, getSql(table))
	}public creatTable(){
		let table:string = this.tableName
		return VocaSqlite.creatTable(this.db, table)
	}

	/**
	 * 備份表、默認表名 newName=table+Ut.YYYYMMDDHHmmssSSS()
	 * @param db 
	 * @param table 
	 * @param newName 
	 * @returns 
	 */
	public static backupTable(db:Database, table:string, newName=table+new Tempus().time){
		return Sqlite.copyTable(db, newName, table)
	}public backupTable(newName=this.tableName+new Tempus().time){
		let table:string = this.tableName
		return VocaSqlite.backupTable(this.db, table, newName)
	}




	/**
	 * 添加單詞數組。返回變更˪ᵗid數組。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @returns 
	 */
	public static async addWords(db:Database, table:string, words:SingleWord2[]){
		//const prms:Promise<number|void>[] = []
		const neoIds:number[] = []
		words = VocaRaw2.merge(words)
		for(const e of words){
			//prms.push(VocaSqlite.addOneWord(db, table, e).catch((e)=>{console.error(e)}))
			let id = await VocaSqlite.addOneWord(db, table, e)
			if(id===undefined){continue;}
			neoIds.push(id)
		}
		return neoIds
	}public addWords(words:SingleWord2[]){
		return VocaSqlite.addWords(this.db, this.tableName, words)
	}

	/**
	 * 添加單詞數組。返回Promise對象數組。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @returns 
	 */
	/* public static deprecated_addWords(db:Database, table:string, words:SingleWord2[]){
		const prms:Promise<any>[] = []
		words = VocaRaw2.merge(words)
		for(const e of words){
			prms.push(VocaSqlite.addOneWord(db, table, e).catch((e)=>{console.error(e)}))
		}
		return prms
	} */



	/* public static deprecated_addWords(db:Database, table:string, words:Tp.IVocaRow[]){
		const prms:Promise<any>[] = []
		for(const e of words){
			prms.push(VocaSqlite.deprecated_addOneWord(db, table, e).catch((e)=>{console.error(e)}))
		}
		return prms
	} */

	/**
	 * 由詞形查詢單詞。返回ᵗ單詞數組中ling字段與表名 同。
	 * @param db 
	 * @param table 
	 * @param wordShape 
	 * @returns 
	 */
	public static async qryWordByWordShape(db:Database, table:string, wordShape:string){
		const sql = `SELECT * FROM '${table}' WHERE ${VocaTableColumnName.wordShape}=?`
		let r = await Sqlite.all<IVocaRow>(db, sql, wordShape)
		VocaSqlite.attachLing(r, table)
		return r
	}

	/**
	 * 畀words增ling字段。直ᵈ改原數組、無返。
	 * @param words 
	 * @param ling 
	 */
	public static attachLing(words:IVocaRow[], ling:string){
		let lingField = VocaTableColumnName.ling
		for(let i = 0; i < words.length; i++){
			words[i][lingField] = ling
		}
	}

	/**
	 * 添加一個單詞。若所加之詞既存于數據庫則取併集。
	 * @param db 
	 * @param table 
	 * @param word 
	 * @returns 返 數據庫中改˪ᵗid。若 欲加ᵗ詞 與 數據庫中既存ᵗ詞ˋ併ᵣ後相同、則返undefined
	 */
	private static async addOneWord(db:Database, table:string, word:SingleWord2):Promise<number|undefined>{
		let existedWordArr:IVocaRow[]|null = await VocaSqlite.qryWordByWordShape(db, table, word.wordShape)
		// 從數據庫中取出詞旹當補ling字段、首次添旹不能併重複ᐪ、鈣緣非待一詞加畢後再加他ᵗ詞。。
		if(existedWordArr.length===0){//若此詞未嘗被加入過數據庫
			let r = await initAddOneWord(db, table, word)
			return r.lastID
		}else if(existedWordArr.length!==1){
			console.error(existedWordArr)
			throw new Error(`${existedWordArr[0].wordShape}在數據庫中有重複項`)
		}else{//若數據庫中既存此詞、則合併
			
			let exsistedWord:IVocaRow|null = existedWordArr[0];existedWordArr = null
			// //若兩單詞全同 (不會入此支)
			// if(SingleWord2.isRowObjEqual(exsistedWord,SingleWord2.fieldStringfy([word])[0])){
			// 	return
			// }
			let oldSw:SingleWord2|null=SingleWord2.parse(exsistedWord);exsistedWord=null
			//let swToBeAdd:SingleWord2|null=SingleWord2.soloParse(word)
			let swToBeAdd:SingleWord2|null=word
			let united:SingleWord2|null=SingleWord2.intersect(oldSw,swToBeAdd);swToBeAdd=null
			//let row = SingleWord2.soloFieldStringfy(united);united=null
			if(SingleWord2.isWordsEqual(united, oldSw)){
				return
			}
			await VocaSqlite.setWordByOneId(db, table, united, Ut.nng(united.id))
			return Ut.nng(united.id)
		}

		function initAddOneWord(db:Database, table:string, word:SingleWord2){
			let copy = SingleWord2.fieldStringfy([word])[0]
			delete copy.id
			delete (copy as any).ling
			let m = Sqlite.getSql_insert(table, copy)
			return Sqlite.run(db, m[0], m[1])
		}

	}

	/**
	 * 在數據庫中覆蓋指定id處之單詞
	 * @param db 
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	private static setWordByOneId(db:Database, table:string, word:SingleWord2, id:number){
		let copy = SingleWord2.fieldStringfy([word])[0]
		delete copy.id
		delete (copy as any).ling
		let m = Sqlite.getSql_updateById(table, copy, id)
		return Sqlite.all(db, m[0], m[1])
	}


	/**
	 * 用transaction批量ᵈ由id蔿行重設詞。
	 * @param db 
	 * @param table 
	 * @param words 
	 * @param ids 
	 * @returns 
	 */
	public static setWordsByIds(db:Database, table:string, words:SingleWord2[], ids:number[]){

		if(words.length !== ids.length){
			throw new Error(`words.length !== ids.length`)
		}
		
		let sql = VocaSqlite.getUpdateByIdSql(table, words[0], ids[0])[0]
		const values:any[][] = []
		for(let i = 0; i  <words.length; i++){
			let w = words[i]; let id = ids[i]
			let v = VocaSqlite.getUpdateByIdSql(table, w, id)[1]
			values.push(v)
		}
		
		return Sqlite.transaction(db, sql, values)
	}public setWordsByIds(words:SingleWord2[], ids:number[]){
		let table:string=this.tableName
		return VocaSqlite.setWordsByIds(this.db, table, words, ids)
	}

	/**
	 * 由詞ˉ對象生成 改ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @param id 
	 * @returns 
	 */
	public static getUpdateByIdSql(table: string, word:SingleWord2,id: number){
		let obj = SingleWord2.fieldStringfy([word])[0]
		delete obj.id; delete (obj as any).ling
		return Sqlite.getSql_updateById(table, obj, id)
	}

	/**
	 * 由詞ˉ對象生成 增ᵗsql語句。
	 * @param table 
	 * @param word 
	 * @returns 
	 */
	public static getInsertSql(table: string, word:SingleWord2){
		let obj = SingleWord2.fieldStringfy([word])[0]
		delete obj.id; delete (obj as any).ling
		return Sqlite.getSql_insert(table, obj)
	}



	public static async getAllWords(db:Database, table:string){
		const sql = `SELECT * FROM '${table}'`
		let r = await Sqlite.all<IVocaRow>(db, sql)
		VocaSqlite.attachLing(r, table)
		return r
	}public getAllWords(){
		let table=this.tableName
		return VocaSqlite.getAllWords(this.db, table)
	}

	

}


