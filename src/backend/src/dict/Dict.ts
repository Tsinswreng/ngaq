//const sqlite3 = require("sqlite3").verbose();
require('tsconfig-paths/register'); //[23.07.16-2105,]{不寫這句用ts-node就不能解析路徑別名}
import 'module-alias/register';
import { Database } from 'sqlite3';
import * as sqlite3Temp from 'sqlite3'
const sqlite3 = sqlite3Temp.verbose()
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
//import 'module-alias/register';
//import Txt from '../../../shared/Txt';
import Txt from "@shared/Txt"
import Util from '@shared/Util';
import ContinuousRegExp from './ContinuousRegExp';
import {Duplication,DictDbRow,SqliteTableInfo,DictRawConfig, cn} from './DictType'
import * as DictType from './DictType'

//const Txt = require('../../../my_modules/Txt')
//const Txt = require("@my_modules/Txt")
//const Txt = require('Txt')

class OcSyllable {

}

/**
 * 音節
 */
class Syllable{
	protected _whole?:string //整個音節
	protected _phoneme?:string[] //音素
	protected _fragments?:string[] //片段
}

/**
 * 音節內的片段
 */
class FragmentSyllable{
	protected _whole?:string //整個片段
	protected _phoneme?:string[] //音素
}

/**
 * 漢字
 */
class Kanji{
	private _glyph?:string //字形
	private _pronounce?:string //碼
	private _freq?:string //出現頻率
}

export class Dict{
	public static readonly L_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
	private _name:string = ''
	private _dbObj:DictDb = new DictDb({dbName:this.name})
	private _無重複漢字數?:number
	private _無重複音節數?:number
	private _字頻總和?:number
	private _加頻重碼率?:number
	private _重碼頻數?:number

	public constructor(props:Partial<Dict>){
		Object.assign(this, props)
	}
	public get name(){
		return this._name
	}
	public set name(v){
		this._name = v
		this._dbObj.tableName = this.name
	}

	public get dbObj(){
		return this._dbObj
	}

	public get 重碼頻數(){return this._重碼頻數;}
	
	public get 無重複漢字數(){
		return this._無重複漢字數
	}

	public get 無重複音節數(){
		return this._無重複音節數
	}

	public get 字頻總和(){
		return this._字頻總和
	}

	
	public get 加頻重碼率(){
		return this._加頻重碼率
	}

	public async assign_重碼頻數(){
		let objs = await DictDb.get重碼頻數(this.dbObj.db, this.name)
		let sum = 0
		for(let i = 0; i < objs.length; i++){
			sum += objs[i].freq_of_homo
		}
		this._重碼頻數 = sum
	}


	public async countAll(){
		//<待做>{驗ᵣ重複項、濾除 碼潙空字串 者}
		await DictDb.castNull(this.dbObj.db, this.name, DictType.cn.freq, 0)
		await DictDb.deleteDuplication(this.dbObj.db, this.name)
		console.log(await DictDb.getDuplication(this.dbObj.db, this.name))
		this._無重複漢字數 = await DictDb.countDistinct(this.dbObj.db!, this.name, DictType.cn.char)
		this._無重複音節數 = await DictDb.countDistinct(this.dbObj.db!, this.name, DictType.cn.code)
		this._字頻總和 = await DictDb.getSum(this.dbObj.db, this.name, DictType.cn.freq)
		await this.assign_重碼頻數()
		this._加頻重碼率 = Util.nonFalseGet(this.重碼頻數) / Util.nonFalseGet(this.字頻總和)
	}

	public async putInfo(){
		// let keys:string[] = Object.keys(this)
		// for(let i = 0; i < keys.length; i++){
		// 	//let fun = eval()
		// 	console.log(keys[i])
		// }
		//console.log(this.無重複音節數)
		//console.log(this._無重複音節數)
	}

	public async 各排列ˋ轄字ᵗ分析(){

	}
	
	public async saffes韻母轄字統計(newTableName:string){
		let seto = Util.getCombinationsWithRepetition(Dict.L_ALPHABET.split(''), 2)
		let creatSql = `CREATE TABLE '${newTableName}' AS SELECT * FROM '${this.name}';`
		//await DictDb.alterIntoAllowNull(this.dbObj.db, this.name, newTableName)
		let objs:DictDbRow[] = []
		for(let i = 0; i < seto.length; i++){
			let obj:DictDbRow = {char:'temp', code:seto[i].join('')}
			objs.push(obj)
		}
		await this.dbObj.insert(objs)
	}



}


/**
 * [23.07.08-2146,]
 * 用于處理字表、如rime輸入法之dict.yaml, 音韻學/方言字表等
 */
export class DictRaw {
	private _singleCharMode:boolean = true
	private _name?:string
	private _srcPath?:string //源碼表文件路徑
	private _splitter:string = '\t' //源碼表中分割字與碼之符號
	private _srcStr:string = ''
	private _srcLines:string[] = [] //按行分割原字表
	//private _char:string[] = [] //字
	//private _code:string[] = [] //碼、形碼或音碼

	//private _tableArr:string[][] = [] //行,列 整個文件
	private _header = '' //表頭、在.dict.yaml中對應...及其之前的部分
	private _indexOfHeader: number = -1 //表的起始索引、即「...」的下一行 在 整個tableArr數組中對應的索引。
	private _validBody:string[][] = [] //處理過的表身、無空行

	public set srcLines(v){
		this._srcLines = v
	}

	public get srcLines(){
		return this._srcLines
	}

	public set validBody(v){
		this._validBody = v
	}

	public get validBody(){
		return this._validBody
	}

	public set srcStr(v){
		this._srcStr = v
	}

	public get srcStr(){
		return this._srcStr
	}

	public set indexOfHeader(v){
		this._indexOfHeader = v
	}

	public get indexOfHeader(){
		return this._indexOfHeader
	}

/* 	public set tableArr(v){
		this._tableArr = v
	}

	public get tableArr(){
		return this._tableArr
	} */

	public set header(v){
		this._header = v
	}

	public get header(){
		return this._header
	}

	public set name(v){
		this._name = v
	}

	public get name(){
		return this._name
	}

	public set splitter(v){
		this._splitter = v
	}

	public get splitter(){
		return this._splitter
	}
	public set srcPath(v){
		this._srcPath = v
		
		this.assign_srcStr()
		
		this.assign_srcLines()
		
		this.assign_name()
		this.get_indexOfHeader()
		this.assign_validBody()
	}

	public get srcPath(){
		return this._srcPath
	}

	//public constructor(srcPath:string)
	public constructor(config:DictRawConfig)

	/* public constructor(srcPath:string){
		this.srcPath = srcPath
	} */
	public constructor(data:Partial<DictRaw>) {
		/* this.srcPath = data.srcPath??this.srcPath
		this.name = data.name??this.name
		this._singleCharMode = data.singleCharMode??this._singleCharMode */
		Object.assign(this,data)
	}

	public assign_srcStr(path=this.srcPath){
		if(!path){throw new Error('!path')}
		this.srcStr = fs.readFileSync(Util.pathAt(path), 'utf-8')
	}
	
/* 	public assign_tableArrByPath(path=this.srcPath){
		if(!path){throw new Error('!path')}
		this.tableArr = Txt.getTableFromStr(fs.readFileSync(path, 'utf-8'))
	} */

	public assign_tableArr(){
		//this.tableArr = 
	}

	public get_indexOfHeader(){
		if(!this.srcLines){throw new Error('!this.srcLines')}
		/* for(let i = 0; i < this.tableArr.length; i++){
			let cur = Util.arrAt(this.tableArr, i)
			if(cur.length !== 1){continue}
			let curStr:string = Util.arrAt(cur, 0)
			if(curStr === '...'){
				this.indexOfHeader = i
			}
		} */

		for(let i = 0; i < this.srcLines.length; i++){
			let curStr = this.srcLines[i]
			if(curStr === '...'){
				this.indexOfHeader = i
				return i;
			}
		}
		let msg = `in ${this.srcPath} , "..." Not found`
		//throw new Error(msg)
		console.log(msg)
		return null
	}

	public get_header(){
		this.get_indexOfHeader()
		let headerLines:string[] = this.srcLines.slice(0, this.indexOfHeader+1)
		this.header = Txt.mergeArrIntoStr(headerLines)
		return this.header
	}

	public getOriginNameInDictYaml():string|undefined{
		if(!this.srcLines){throw new Error('!this.srcLines')}
		for(let i = 0; i < this.srcLines.length; i++){
			let curStr = this.srcLines[i]
			let caught = curStr.match(/^name:(.*)$/g)
			if(!caught){continue}
			
			//let name:string =  Util.arrAt(caught, 0).replace(/^name:(.*)$/g, '$1')
			let name:string =  caught[0].replace(/^name:(.*)$/g, '$1')
			name = name.trim()
			//若首尾是引號則除ᶦ
			let b1:boolean = (name.at(0) === '"' && name.at(name.length-1) === '"')
			let b2:boolean = (name.at(0) === "'" && name.at(name.length-1) === "'")
			if(b1 || b2){
				name = name.slice(1, name.length-1)
			}
			//this.name = name
			return name
		}
	}

	public assign_name(){
		if(this._name){return}
		this.name = this.getOriginNameInDictYaml()
	}

	/**
	 * 取 有效表身
	 */
	public assign_validBody(singleCharMode=this._singleCharMode){

		
		//this.validBody = []
		let bodyLines:string[] = []
		let body:string = ''
		let validBodyStr = ''
		//let excluded:string[] = []//t
		//if(this._singleCharMode){ //_singleCharMode未實現
			for(let i = this.indexOfHeader+1; i < this.srcLines.length; i++){
				//bodyLines.push(this.srcLines[i])
				body += (this.srcLines[i]+'\n')
			}
			body = Txt.removeSingleLineComments_s(body, '#')
			//console.log(bodyLines)
			bodyLines = Txt.spliteStrByNewline_s(body)
			let blankRe = new RegExp(/^(\s)+$/g)
			if(singleCharMode){
				for(let i = 0; i < bodyLines.length; i++){
					blankRe.lastIndex=0
					let left = bodyLines[i].split(this.splitter)[0]
					if(Txt.countChar(left)!==1){}
					else if( bodyLines[i] === '' && blankRe.test(bodyLines[i])){ //!bodyLines[i].match(/(\s)*/g)
					}
					else{
						validBodyStr += (bodyLines[i]+'\n')
					}
				}
			}else{
				for(let i = 0; i < bodyLines.length; i++){
					blankRe.lastIndex=0
	
					if( bodyLines[i] === '' && blankRe.test(bodyLines[i])){ //!bodyLines[i].match(/(\s)*/g)
						
					}
					else{
						validBodyStr += (bodyLines[i]+'\n')
					}
				}
			}

			//console.log(excluded)//t

			validBodyStr = validBodyStr.slice(0, validBodyStr.length-1)
			this.validBody = Txt.getTableFromStr(validBodyStr)
		
	}

	public assign_srcLines(){
		if(!this.srcStr){throw new Error('!this.srcStr')}
		this.srcLines = Txt.spliteStrByNewline_s(this.srcStr)
	}


	public static getDictYamlPaths(userPath:string='D:/Program Files/Rime/User_Data'):string[]{
		const fileNames:string[] = fs.readdirSync(userPath)
		let dictyamlFullPath:string[] = Txt.getFilted(fileNames, '^.*\\.dict\\.ya?ml$')
		for(let i = 0; i < dictyamlFullPath.length; i++){
			dictyamlFullPath[i] = userPath+'/'+dictyamlFullPath[i]
		}
		return dictyamlFullPath
	}

	
	/**
	 * 把有效表身存進數據庫
	 *//* 
	public async saveInDb(){
		if(!this.name){throw new Error("!this.name");}
		let db = new DictDb(this.name)
		db.insert(this.validBody).then((data)=>{
			console.log(data)
		})
	} */

}





export class DictDb{

	private _dbName = 'DictDb';public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}
	private _dbPath = rootDir+'/db/'+this._dbName+'.db' 
	private _essayPath = rootDir+'/db/essay.txt'  ;public get essayPath(){return this._essayPath;};;public set essayPath(v){this._essayPath=v;};
	private _tableName?:string
	private _essayName='essay' ;public get essayName(){return this._essayName;};;public set essayName(v){this._essayName=v;};

	// public static column_type = new Map<string, string>([
	// 	["char", "VARCHAR(64)"],
	// 	["code", "VARCHAR(64)"],

	// ])
	private _db:Database = new sqlite3.Database(this.dbPath, (err)=>{
		if(err){throw err}
	})

	constructor(props:Partial<DictDb>){
		Object.assign(this, props)
	}

	;public get dbPath(){return this._dbPath;};;
	public set dbPath(v){
		this._dbPath=v;
		this._db = new sqlite3.Database(this.dbPath, (err)=>{
			if(err){throw err}
		})
	};

	public set tableName(v){
		this._tableName = v
	}

	public get tableName(){
		return this._tableName
	}

	public get db(){
		return this._db
	}



	public static async isTableExist(db:Database, tableName:string){
		let sql = `SELECT name FROM sqlite_master WHERE  type='table' AND name='${tableName}';`
		
		return new Promise<boolean>((resolve, reject)=>{
			
			db.get(sql, (err, result:any)=>{
				
				if(err){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw err
				}
				if(!result){
					resolve(false)
					return false
				}
				console.log(result)
				//console.log(result)
				/* if(!result || !result.hasOwnProperty('name')){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw new Error(`!result.hasOwnProperty('name')`)
				} */
				if(result.name === tableName){
					resolve(true)
					return true
					//return true
				}else{
					console.log('<result>')
					console.log(result)
					console.log('</result>')
					console.log('<tableName>')
					console.log(tableName)
					console.log('</tableName>')
					throw new Error('意外')
					//return false
				}
				//resolve(result as string)
			})
			
		})
	}

	public async isTableExists(tableName = this.tableName){
		//写一个同步的typescript函数、判断一个sqlite数据库是否含有某表
		if(!this.db){throw new Error('!this.db')}
		if(!tableName){return false}
		return DictDb.isTableExist(this.db, tableName)
	}


	public async creatTable(tableName = this.tableName){
		
		let sql:string = `CREATE TABLE [${tableName}] ( \
${cn.id} INTEGER PRIMARY KEY AUTOINCREMENT, \
${cn.char} VARCHAR(64) NOT NULL, \
${cn.code} VARCHAR(64) NOT NULL, \
${cn.ratio} VARCHAR(64) \
)`

		return new Promise((s,j)=>{
			
			Util.nonFalseGet(this.db).run(sql, (err)=>{
				if(err){j(err);return}
				console.log('at\t'+this.dbPath)
				s(sql+'成功')
			})
			
		})
		//IF NOT EXISTS 
		
		//this.db.exec(testCreat)
	}

	/**
	 * 手動封裝的TRANSACTION
	 * @param db 
	 * @param sql 
	 * @param values 
	 * @returns 
	 */
	public static async transaction<T>(db:Database, sql:string, values:any[]){
		let result:T[]
		return new Promise<T[]>((s,j)=>{
			db.serialize(()=>{
				db.run('BEGIN TRANSACTION')
			})
			const stmt = db.prepare(sql, (err)=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return} //<坑>{err+''後錯ᵗ訊會丟失行號 勿j(sql+'\n'+err)}
			})
			for(let i = 0; i < values.length; i++){
				stmt.each(values[i], (err, row:T)=>{
					if(err){console.error(sql+'\n'+err+'\n');j(err);return}
					result.push(row)
				})
			}
			db.all('COMMIT', (err,rows)=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(result)
			})
		})
		
	}

	
	

	public async insert(data:DictDbRow[]|string[][]){
		return new Promise((s,j)=>{
			Util.nonFalseGet(this.db)
		let rowObjs:DictDbRow[] = []
		if(cn.char in data[0] && cn.code in data[0]){
			rowObjs = data as DictDbRow[]
		}else{
			rowObjs = DictDb.toObjArr(data as string[][])
		}
		let sql = `INSERT INTO '${this.tableName}' (${cn.char}, ${cn.code}) \
VALUES (?,?)`

		this.db!.serialize(()=>{
			this.db!.run('BEGIN TRANSACTION')
			const stmt = this.db!.prepare(`INSERT INTO '${this.tableName}' (${cn.char}, ${cn.code}) \
VALUES (?,?)`)
			for(let i = 0; i < data.length; i++){
				stmt.run(rowObjs[i].char, rowObjs[i].code)
			}
			this.db!.run('COMMIT')
		})
		})
		
		//DictDb.transaction(this.db, sql, )
		/* DictDb.db.close((err)=>{
			if(err){throw err}
		}) */
	}

	public async attachFreq(/* essayTableName='essay' */){
		Util.nonFalseGet(this.db)
		if(!this.tableName){throw new Error('this.tableName')}
		DictDb.attachFreq(this.db!, this.tableName)
	}

	/**
	 * 依照八股文 在表中爲每個字附上字頻
	 * @param db 
	 * @param tableName 
	 * @param essayTableName 
	 */
	public static async attachFreq(db:Database, tableName:string ,essayTableName='essay'){
		let b1 = await DictDb.isColumnExist(db, tableName ,cn.freq)
		let b2 = await DictDb.isColumnExist(db,tableName ,cn.essay_id)
		if(!b1 || !b2){
			let altSql = new Array<string>()
			altSql[0] = `ALTER TABLE '${tableName}' ADD COLUMN '${cn.freq}' INTEGER`
			altSql[1] = `ALTER TABLE '${tableName}' ADD COLUMN ${cn.essay_id} INTEGER REFERENCES ${essayTableName}(id) ON DELETE SET NULL`
			await DictDb.all(db, altSql[0])
			await DictDb.all(db, altSql[1])
			
		}
		let attachSql = `UPDATE '${tableName}' \
\ SET ${cn.freq} = CAST(COALESCE(${essayTableName}.${cn.code}, '') AS INTEGER) \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`//不使用外鍵、已棄用

		let attachSql2 = `UPDATE '${tableName}' \
\ SET ${cn.essay_id} = COALESCE(${essayTableName}.${cn.id}, '') \
\ FROM ${essayTableName} \
\ WHERE '${tableName}'.${cn.char} = ${essayTableName}.${cn.char};`
		DictDb.all(db, attachSql)
		DictDb.all(db, attachSql2)
	
	}

	public static async putNewTable(dictRaw:DictRaw){
		if(!dictRaw.name){throw new Error("!dictRaw.name");}
		let dictDb = new DictDb({tableName:dictRaw.name})
		let b:boolean = await dictDb.isTableExists()
		if(!b){await dictDb.creatTable()}
		dictDb.insert(dictRaw.validBody).catch((e)=>{console.error(e)})
	}

	public static toObjArr(strArr:string[][]):DictDbRow[]{
		let result:DictDbRow[] = []
		for(let i = 0; i < strArr.length; i++){
			//let obj = {columnName.char: Util.arrAt(strArr,i,0), "pronounce": strArr[i][1]??''}
			//let obj:DictDbRow = {char:Util.arrAt(strArr,i,0), code: strArr[i][1]??''}
			let obj:DictDbRow = {char:Util.nonFalseGet(strArr[i][0]), code: strArr[i][1]??''} //[23.07.31-0931,]
			result.push(obj)
		}
		return result
	}

	public static async getTableInfo(db:Database, tableName:string, columnName:string):Promise<SqliteTableInfo|undefined>
	public static async getTableInfo(db:Database, tableName:string):Promise<SqliteTableInfo[]>
	public static async getTableInfo(db:Database, tableName:string, columnName?:string){
		const sql = `PRAGMA table_info('${tableName}')`
		let prms = DictDb.all<SqliteTableInfo>(db,sql)
		if(columnName){
			let infos = await prms
			for(let i = 0; i < infos.length; i++){
				if(infos[i].name === columnName){
					return infos[i]
				}
			}
			return undefined
		}else{
			
			return prms
		}

	}

	public static async isColumnExist(db:Database, tableName:string, columnName:string){
		let tableInfo = await DictDb.getTableInfo(db, tableName)
		for(let i = 0; i < tableInfo.length; i++){
			if(tableInfo[i].name === columnName){
				return true
			}
		}
		return false
	}

	public static async qureySqlite_sequence(db:Database){
		let sql = `SELECT * FROM sqlite_sequence`
		return /* await */ DictDb.all<DictType.Sqlite_sequence>(db, sql)
	}

	public static async querySqlite_master(db:Database){
		let sql = `SELECT * FROM sqlite_master`
		return /* await */ DictDb.all<DictType.Sqlite_master>(db, sql)
	}

	public static async DropAllTables(db:Database){
		let tableNames:string[] = []
		let info = await DictDb.querySqlite_master(db)
		//let prms:Promise<any>[] = []
		for(let i = 0; i < info.length;i++){
			//prms.push(DictDb.DropTable(db,seqs[i].name))
			if(info[i].type === 'table' && info[i].name !== 'sqlite_sequence' && info[i].name !== 'sqlite_master')
			{tableNames.push(info[i].name)}
		}
		return DictDb.DropTable(db,tableNames)
		//return Promise.all(prms)
	}

	public static async DropTable(db:Database, tableName:string|string[]){
		if(Array.isArray(tableName)){
			// let sql = `DROP TABLE ?;`
			// let v:string[] = tableName
			// return DictDb.transaction(db, sql, v) <坑>{蓋佔位符ˉ?皆不可㕥代表名}
			let prms:Promise<any>[] = []
			for(let i = 0; i < tableName.length; i++){
				let sql = `DROP TABLE '${tableName[i]}';`
				//console.log(sql)
				//DictDb.all(db,sql).then(()=>{})//t
				prms.push(DictDb.all(db,sql))
			}
			//console.log(114514)

			return Promise.all(prms)
		}else{
			let sql = `DROP TABLE ${tableName};`
			return DictDb.all(db, sql)
		}
	}

	/**
	 * 先盡刪表、然後把整個User_Data下的.dict.yaml文件 字表的有效部分添進數據庫
	 * @param userPath User_Data的絕對路徑
	 */
	public static async testAll(db:Database, userPath:string='D:/Program Files/Rime/User_Data'){
		await DictDb.DropAllTables(db)
		await DictDb.putEssay(db)
		let paths:string[] = DictRaw.getDictYamlPaths(userPath)
		let names:string[] = []
		for(let i = 0; i < paths.length; i++){
			let temp = new DictRaw({srcPath:paths[i]})
			let name = temp.getOriginNameInDictYaml()
			if(name){names.push(name)}
		}

		//let prms:Promise<any>[] = []
		for(let i = 0; i < paths.length;i++){
			let pro = i+'/'+paths.length
			console.log(pro)
			await DictDb.putNewTable(new DictRaw({srcPath:paths[i]})).catch((e)=>{
				console.error(paths[i])
				console.log(e)
			})
			//await temp // 防 sqlite busy
			//prms.push(temp)
		}
	}

	/**
	 * 把八股文(字頻表)加進數據庫裏、表名命名爲essay
	 * @param path 
	 */
	public static async putEssay(db:Database, path=new DictDb({}).essayPath, essayName='essay'){
		return new Promise(async(s,j)=>{
			let b = await DictDb.isTableExist(db, essayName)
			//if(!b){await DictDb.quickStart(path,essayName)}
			if(!b){await DictDb.putNewTable(new DictRaw({srcPath:path, name:essayName}))}
			s(0)
		})
	}

	/**
	 * 統計表的某列中不重樣的值的數量
	 * @param tableName 
	 * @param columnName 不填列名則每一列都會被統計
	 * @returns 
	 */
	public static async countDistinct(db:Database,tableName:string):Promise<{column_name:string, distinct_count:number}[]>
	public static async countDistinct(db:Database,tableName:string, columnName:string):Promise<number>;
	
	public static async countDistinct(db:Database, tableName:string, columnName?:string){
		if(columnName){
			let sql = `SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
			let r = (await DictDb.all<{distinct_count:number}>(db, sql))[0].distinct_count
			return r
		}else{
			let tableInfo = await DictDb.getTableInfo(db, tableName)
			let sql = ''
			//`SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
			for(let i = 0; i < tableInfo.length; i++){
				//console.log(i)
				//console.log(tableInfo[i])
				columnName = tableInfo[i].name
				sql += `SELECT '${columnName}' AS column_name, COUNT(DISTINCT ${columnName}) AS distinct_count FROM '${tableName}'`
				if(i !== tableInfo.length-1){sql += ' UNION '}
				else{/* sql += ORDER BY column_name; */}
			}
			
			return await new Promise<{column_name:string, distinct_count:number}[]>((s,j)=>{
				
				db.all(sql, (err, rows:{column_name:string,distinct_count:number}[])=>{
					if(err || rows.length !== tableInfo.length){
						console.error('<sql>');console.error(sql);console.error('</sql>')
						console.error('<tableInfo>');console.error(tableInfo);console.error('</tableInfo>')
						console.error('<rows>');console.error(rows);console.error('</rows>')
						console.error('|| rows.length !== tableInfo.length')
						j(err);
						return
					}
					s(rows)
				})
			})
		}
	}

	public static async get重碼頻數(db:Database, tableName:string){
		/* 
這是一個複雜的 SQL 查詢，它使用了子查詢和窗口函數來計算每個 code 對應的非最大頻率的總和。
讓我們逐步解釋這個查詢：
首先，內部的子查詢選擇了 saffes 表中的 code 和 freq 字段，並使用窗口函數 ROW_NUMBER() 來為每個 code 分組，並按照 freq 的降序進行排序。ROW_NUMBER() 函數為每個分組的行分配一個連續的整數值，最大的 freq 對應的行會得到 rn 為 1，第二大的 freq 對應的行會得到 rn 為 2，以此類推。
然後，外部的主查詢（SELECT）對內部子查詢得到的結果集 s 進行過濾，只保留 rn > 1 的行，即保留非最大頻率的行。
接著，對過濾後的結果進行分組（GROUP BY），按照 code 字段進行分組，並對每個 code 分組計算 freq 的總和，並將結果作為新的 total_freq 列返回。
總體來說，這個查詢的目的是計算每個 code 對應的非最大頻率的總和，並將結果返回。這個查詢中使用了子查詢和窗口函數來實現這個功能，因此比較複雜，但在特定的業務場景中可能會很有用。
		*/
		let sql1 = `SELECT
		${DictType.cn.code},
		SUM(${DictType.cn.freq}) AS freq_of_homo
	  FROM (
		SELECT
		${DictType.cn.code},
		${DictType.cn.freq},
		  ROW_NUMBER() OVER (PARTITION BY ${DictType.cn.code} ORDER BY ${DictType.cn.freq} DESC) AS rn
		FROM
		  '${tableName}'
	  ) AS s
	  WHERE
		rn > 1
	  GROUP BY
	  ${DictType.cn.code};`

		//sql1幾乎瞬間出結果、sql2要等幾十秒
	  let sql2 = `SELECT 
	  ${DictType.cn.code},
	  SUM(${DictType.cn.freq}) AS freq_of_homo
	FROM
	  ${tableName} s1
	WHERE
	${DictType.cn.freq} < (SELECT MAX(${DictType.cn.freq}) FROM ${tableName} s2 WHERE s1.${DictType.cn.code} = s2.${DictType.cn.code})
	GROUP BY
	${DictType.cn.code};`
		return DictDb.all<{code:string, freq_of_homo:number}>(db, sql1)

		/*
  亦可、然更慢*/
	}


	/**
	 * 取 重複項。若char,code,ratio皆同則視爲重複。
	 * @param db 
	 * @param tableName 
	 * @returns 
	 */
	public static async getDuplication(db:Database, tableName:string){
		let sql = 
`SELECT ${cn.char}, ${cn.code}, ${cn.ratio}, COUNT(*) AS count \
FROM '${tableName}' \
GROUP BY ${cn.char}, ${cn.code}, ${cn.ratio} \
HAVING COUNT(*) > 1;`
		return new Promise<Duplication[]>((s,j)=>{
			db.all(sql, (err, rows:Duplication[])=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(rows)
			})
		})
	}

	/**
	 * 刪除重複項、只保留id最大者。若char,code,ratio皆同則視爲重複。
	 * @param db 
	 * @param tableName 
	 * @returns 
	 */

	public static async deleteDuplication(db:Database, tableName:string){
		let sql = 
`DELETE FROM '${tableName}' WHERE ID NOT IN (SELECT MAX(ID) FROM '${tableName}' GROUP BY ${cn.char}, ${cn.code}, ${cn.ratio})`
		return new Promise((s,j)=>{
			db.all(sql, (err)=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				s(0)
			})
		})
	}

	/**
	 * 對某列求和、支持字符串轉數字
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @returns 
	 */
	public static async getSum(db:Database, tableName:string, columnName:string):Promise<number>{
		let sql = `SELECT SUM(CASE \
WHEN '${tableName}' NOT NULL AND ${columnName} GLOB '*[0-9]*' \
THEN CAST(${columnName} AS INTEGER) \
ELSE 0 \
END) AS sum_result \
FROM '${tableName}';`
		return (await DictDb.all<{sum_result:number}>(db, sql))[0].sum_result
	}

	/**
	 * 把一列中的null值轉爲指定值
	 * @param db 
	 * @param tableName 
	 * @param columnName 
	 * @param target 
	 * @returns 
	 */
	public static async castNull(db:Database, tableName:string, columnName:string, target:any){
		let sql = `UPDATE '${tableName}' SET ${columnName} = \ 
CASE WHEN ${columnName} IS NULL THEN ${target} ELSE ${columnName} END;`
		return DictDb.all(db, sql)
	}


	/**
	 * 封在Promise裏的db.all()、方便在異步函數裏用await取值。
	 * @param db Database 實例
	 * @param sql 
	 * @param params 
	 * @returns 
	 */
	public static all<T>(db:Database, sql:string, params?:any){
		//console.log(sql)//t
		return new Promise<T[]>((s,j)=>{
			db.all(sql, params,(err,rows:T[])=>{
				if(err){console.error(sql+'\n'+err+'\n');j(err);return}
				//console.log(rows)//t
				s(rows)
			})
		})
	}

	public static async alterIntoAllowNull(db:Database, tableName:string, columnName:string){
		let info = await DictDb.getTableInfo(db, tableName, columnName)
		let type = Util.nonUndefGet(info).type
		let sql = `ALTER TABLE '${tableName}' MODIFY COLUMN ${columnName} ${type}`
		return DictDb.all(db, sql)
	}

}



function t20230618094140(){
	
	let input = fs.readFileSync(__dirname+'/input.txt', 'utf-8')
	input = input.replace(/./g, (match)=>{
		return match.toLowerCase()
	}) 
	//console.log(input)
	let rawRegex = fs.readFileSync(__dirname+'/regex.txt', 'utf-8')
	rawRegex = Txt.unifyNewline_s(rawRegex)
	//const regexEachLine:string[] = ContinuousRegExp.spliteStrBy_(rawRegex, '\n')
	//console.log(regexEachLine)
	let regex:string[][] = Txt.getRegExp(rawRegex, '\t')
	//console.log(regex)
	/* for(let i = 0; i < regex.length; i++){
		console.log(regex[i][0])
	} */
	const output:string = ContinuousRegExp.replace(input, regex)
	//console.log(output)
	fs.writeFile(__dirname+'/output.txt', output, {encoding:'utf-8'}, (err)=>{
		if(err){throw err}
	})
	//const newStr = ContinuousRegExp.replace(oldFile,)

}

//t20230618094140()

