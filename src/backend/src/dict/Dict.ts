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
	private _name:string = ''
	private _dbObj:DictDb = new DictDb()
	private _無重複漢字數?:number
	private _無重複音節數?:number
	private _字頻總和?:number
	private _加權重複率?:number

	public constructor(name:string){
		this.name = name
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
	
	public get 無重複漢字數(){
		return this._無重複漢字數
	}

	public get 無重複音節數(){
		return this._無重複音節數
	}

	public get 字頻總和(){
		return this._字頻總和
	}

	
	public get 加權重複率(){
		return this._加權重複率
	}

	public async assign_無重複(){
		this._無重複漢字數 = await DictDb.countDistinct(this.name, 'kanji')
		this._無重複音節數 = await DictDb.countDistinct(this.name, 'pronounce')
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

	constructor(srcPath:string){
		this.srcPath = srcPath
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
		throw new Error(msg)
	}

	public get_header(){
		this.get_indexOfHeader()
		let headerLines:string[] = this.srcLines.slice(0, this.indexOfHeader+1)
		this.header = Txt.mergeArrIntoStr(headerLines)
		return this.header
	}

	public assign_name(){
		/* for(let i = 0; i < this.tableArr.length; i++){
			let cur = Util.arrAt(this.tableArr, i)
			if(cur.length !== 1){continue}
			let curStr:string = Util.arrAt(cur, 0)
			//let regex = /^name:(.*)$/g
			let caught = curStr.match(/^name:(.*)$/g)
			if(!caught){continue}
			
			let name:string =  Util.arrAt(caught, 0).replace(/^name:(.*)$/g, '$1')
			name = name.trim()
			this.name = name
		} */
		if(!this.srcLines){throw new Error('!this.srcLines')}
		for(let i = 0; i < this.srcLines.length; i++){
			let curStr = this.srcLines[i]
			let caught = curStr.match(/^name:(.*)$/g)
			if(!caught){continue}
			
			let name:string =  Util.arrAt(caught, 0).replace(/^name:(.*)$/g, '$1')
			name = name.trim()
			//若首尾是引號則除ᶦ
			let b1:boolean = (name.at(0) === '"' && name.at(name.length-1) === '"')
			let b2:boolean = (name.at(0) === "'" && name.at(name.length-1) === "'")
			if(b1 || b2){
				name = name.slice(1, name.length-1)
			}
			this.name = name
		}
	}

/* 	public get_body():string[][]{
		return this.tableArr.slice(this._indexOfHeader+1)
	} */

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

	
	/**
	 * 把有效表身存進數據庫
	 */
	public async saveInDb(){
		let db = new DictDb(this.name)
		db.insert(this.validBody).then((data)=>{
			console.log(data)
		})
	}

}

interface DictDbRow{
	kanji:string
	pronounce:string
	freq?:string
}

interface SqliteTableInfo{
	cid:number
	name:string
	type:string
	notnull: 0|1
	dflt_value:number|null//默認值
	pk:0|1 //主鍵
}

export class DictDb{
/* 	private _db = new sqlite3.Database('db.sqlite', (err)=>{
		if(err){throw err}
	}); */
	//public static dbPath:string = rootDir + '/db'


	public static _dbName = 'DictDb'
	public static _dbPath = rootDir+'/db/'+DictDb._dbName+'.db' //<待改>{改成成員變量}

	public static essayPath = rootDir+'/db/essay.txt'
	
	public static readonly db:Database = new sqlite3.Database(DictDb._dbPath, (err)=>{
		if(err){throw err}
	})
	private _tableName?:string
	private _db?:Database

	constructor(tableName?:string){
		this.tableName = tableName
	}

	public set tableName(v){
		this._tableName = v
	}

	public get tableName(){
		return this._tableName
	}

	public get db(){
		return this._db
	}

	public static async isTableExist(tableName:string){
		let sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
		
		return new Promise<boolean>((resolve, reject)=>{
			
			DictDb.db.get(sql, (err, result:any)=>{
				
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
		if(!tableName){return false}
		return DictDb.isTableExist(tableName)
	}


	public async creatTable(tableName = this.tableName){
		let sql:string = `CREATE TABLE [${tableName}] ( \
id INTEGER PRIMARY KEY AUTOINCREMENT, \
kanji VARCHAR(64) NOT NULL, \
pronounce VARCHAR(64) NOT NULL, \
freq VARCHAR(64) \
)`

		return new Promise((s,j)=>{
			
			DictDb.db.run(sql, (err)=>{
				if(err){j(err);return}
				console.log('at\t'+DictDb._dbPath)
				s(sql+'成功')
			})
			
		})
		//IF NOT EXISTS 
		
		//this.db.exec(testCreat)
	}

	public testInsert(tableName=this.tableName){
		let sql = `INSERT INTO ${tableName} (kanji, pronounce) VALUES (?,?)` 
		let v = ['我', 'waq']
		DictDb.db.run(sql, v, (err)=>{
			if(err){throw err}
		})
	}

	

	public async insert2(objArr:DictDbRow[]){
		DictDb.db.serialize(()=>{
			DictDb.db.run('BEGIN TRANSACTION')
			const stmt = DictDb.db.prepare(`INSERT INTO '${this.tableName}' (kanji, pronounce) VALUES (?,?)`)
			for(let i = 0; i < objArr.length; i++){
				stmt.run(objArr[i].kanji, objArr[i].pronounce)
			}
			DictDb.db.run('COMMIT')
		})
		/* DictDb.db.close((err)=>{
			if(err){throw err}
		}) */
	}

	public async insert(vstr:string[][]){
		//return new Promise(async(s,j)=>{
			let sql = `INSERT INTO "${this.tableName}" (kanji, pronounce) VALUES (?,?)` 
			let v:any[];
			let index:number|undefined;
				try{
					new Promise((ss, jj)=>{
						/* for(let i = 0; i < vstr.length; i++){
							index = i
							v = [Util.arrAt(vstr, i, 0), Util.arrAt(vstr, i, 1)]
								DictDb.db.run(sql, v, (err)=>{
									
									if(err){
										console.log(err)
										throw err
									}
									//console.log(sql)//t
									//ss(null)
								})
							
							
							//不能直接await DictDb.db.run 、如是則await不効。
						} */


						//console.log(sql+'成功')
						//ss(sql+'成功')
								DictDb.db.run(sql, vstr, (err)=>{
									
									if(err){
										console.log(err)
										throw err
									}
									//console.log(sql)//t
									//ss(null)
								})
					})
				}catch(e){
					let msg = `
<sql>\n${sql}\n</sql>
\n<tableName>\n${this.tableName}\n</tableName>
\n<current 1D index>\n${index}\n</current 1D index>
\n<vstr[index!]>\n${vstr[index!]}\n</vstr[index!]>
`
					console.error(msg)
					console.error(e)//<待務>{完善日誌信息輸出}
					//reject(e)
				}
				
				
			// const prms = async (resolve, reject)=>{
				
			// }
			// return new Promise<any>(prms)
			//Promise.resolve('insert 成功')
			//return sql+'成功2'
		//})
	}


	public attachFreq(essayTableName='essay'){
		if(!this.tableName){throw new Error('this.tableName')}
		return new Promise(async (s,j)=>{
			
			let b = await DictDb.isColumnExist(this.tableName! ,'freq')
			if(!b){
				let altSql = `ALTER TABLE '${this.tableName}' ADD COLUMN 'freq' VARCHAR(64)`
				await new Promise((s,j)=>{
					DictDb.db.run(altSql,(err)=>{
						if(err){j(err);return}
						s(0)
				})})
			}
			let attachSql = `UPDATE '${this.tableName}' \
\ SET freq = COALESCE(${essayTableName}.pronounce, '') \
\ FROM ${essayTableName} \
\ WHERE '${this.tableName}'.kanji = ${essayTableName}.kanji;`
			DictDb.db.run(attachSql, (err)=>{if(err){console.error(attachSql);j(err);return}s(0)})
		})
	}

	public static toObjArr(strArr:string[][]):DictDbRow[]{
		let result:DictDbRow[] = []
		for(let i = 0; i < strArr.length; i++){
			let obj = {"kanji": Util.arrAt(strArr,i,0), "pronounce": strArr[i][1]??''}
			result.push(obj)
		}
		return result
	}

	public static getTableInfo(tableName:string){
		let result:SqliteTableInfo[] = []
		return new Promise<SqliteTableInfo[]>((s,j)=>{
			const sql = `PRAGMA table_info('${tableName}')`
			DictDb.db.all(sql, (err, rows:SqliteTableInfo[])=>{
				if(err){console.error(sql);j(err);return}
				result = rows
				s(result)
			})
		})

	}

	public static async isColumnExist(tableName:string, columnName:string){
		let tableInfo = await DictDb.getTableInfo(tableName)
		for(let i = 0; i < tableInfo.length; i++){
			if(tableInfo[i].name === columnName){
				return true
			}
		}
		return false
	}

	

	public static leftJoin_on_(_1tableName:string, _2tableName:string, _1columnName:string, _2columnName:string, newColumnName:string){
		throw new Error()
		return new Promise(async (s,j)=>{
			let b = await DictDb.isColumnExist(_2tableName ,newColumnName)
			if(!b){
				let altSql = `ALTER TABLE ${_2tableName} ADD COLUMN ${newColumnName} VARCHAR(64)`
				await new Promise((s,j)=>{DictDb.db.run(altSql,(err)=>{console.error(err)})})
			}
			//DictDb.db.run()
		})
	}


	/**
	 * 把整個User_Data下的.dict.yaml文件 字表的有效部分添進數據庫
	 * @param userPath User_Data的絕對路徑
	 */
	public static async run(userPath:string='D:/Program Files/Rime/User_Data'){
		return new Promise(async(s,j)=>{
		const dictRaws:DictRaw[] = []
		const dictDbs:DictDb[] = []
		const fileNames:string[] = fs.readdirSync(userPath)
		//console.dir(fileNames)//t
		let dictyamlFullPath:string[] = Txt.getFilted(fileNames, '^.*\\.dict\\.ya?ml$')
		for(let i = 0; i < dictyamlFullPath.length; i++){
			dictyamlFullPath[i] = userPath+'/'+dictyamlFullPath[i]
			//console.log(dictyamlFullPath[i])//t
		}

		await DictDb.putEssay()

		for(let i = 0; i < dictyamlFullPath.length; i++){
			//try{/* await */ Dict.quickStart(dictyamlFullPath[i])}catch(e){console.error(e)}
			//console.log('i='+i)//t
			DictDb.quickStart(dictyamlFullPath[i]).catch((e)=>{console.error(e)})
			//let t = new Dict(dictyamlFullPath[i])
			//console.log(t.name)
		}
		for(let i = 0; i < dictyamlFullPath.length;i++){
			let dictDb = new DictDb()
		}


		
		/* if(dictyamlFullPath.length === 0){throw new Error('dictyamlFullPath.length === 0')}
		for(let i = 0; i < dictyamlFullPath.length; i++){
			
			let unusDictRaw = new Dict(dictyamlFullPath[i])
			
			let unusDictDb = new DictDb();
			dictRaws.push(unusDictRaw)
			dictDbs.push(unusDictDb)
		}
		
		let result;
		if(dictRaws.length !== dictDbs.length){throw new Error('dictRaws.length !== dictDbs.length')}
		for(let i = 0; i < dictRaws.length; i++){
			console.log('i='+i)//t
			if(dictRaws[i].name === undefined){continue}
			//if(dictRaws[i].name === '3dgx'){continue}//t
			
			console.log(dictyamlFullPath[i])
			dictRaws[i].srcPath = dictyamlFullPath[i]
			dictDbs[i].tableName = dictRaws[i].name

			let isExist:boolean = await dictDbs[i].isTableExists()
			console.log(isExist)//t
			if(!isExist){
				let creatResult = await dictDbs[i].creatTable() // await?
				console.log('creatResult:')//t
				console.log(creatResult)
			}
			s
			//dictDbs[i].insert(dictRaws[i].validBody)
			let dbObjs = DictDb.toObjArr(dictRaws[i].validBody)
			//console.log(dbObjs)//t
			try{dictDbs[i].insert2(dbObjs)}catch(e){console.error(e)}
			//console.log(114514)//t *
			//console.log(result)
		}
		for(let i = 0; i < dictRaws.length; i++){
			console.log(dictRaws[i].srcPath)
		}
		for(let i = 0; i < dictDbs.length; i++){

		}
		
		return result */

		})
		
	}

	public static async quickStart(path:string, name?:string){
		return new Promise(async(s,j)=>{
			//console.log(path)//t
			let dictRaw:DictRaw|undefined
			try{dictRaw = new DictRaw(path)}catch(e){console.error(e)}
			if(!dictRaw){
				console.error('for '+path+' , dictRaw failed to constructor')
				return
			}
			if(name){dictRaw.name=name}
			if(!dictRaw.name){
				//throw new Error('!dictRaw.name')
				j('!dictRaw.name')
				return
			}
			//if(dictRaw.name !== 'essay'){await DictDb.putEssay()}
			let dictDb = new DictDb(dictRaw.name)
			let b = await dictDb.isTableExists()
			if(!b){await dictDb.creatTable().catch((e)=>{console.error(e)})}
			let rows = DictDb.toObjArr(dictRaw.validBody)
			await dictDb.insert2(rows)
			//if(dictRaw.name !== 'essay'){await dictDb.attachFreq()}
			s(dictRaw.name+'成功')
		})
		
	}

	/**
	 * 把八股文(字頻表)加進數據庫裏、表名命名爲essay
	 * @param path 
	 */
	public static async putEssay(path=DictDb.essayPath){
		return new Promise(async(s,j)=>{
			let b = await DictDb.isTableExist('essay')
			if(!b){await DictDb.quickStart(path,'essay')}
			s(0)
		})
	}

	/**
	 * 統計表的某列中不重樣的值的數量
	 * @param tableName 
	 * @param columnName 不填列名則每一列都會被統計
	 * @returns 
	 */
	public static async countDistinct(tableName:string):Promise<{column_name:string, distinct_count:number}[]>
	public static async countDistinct(tableName:string, columnName:string):Promise<number>;
	
	public static async countDistinct(tableName:string, columnName?:string){
		if(columnName){
			let sql = `SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
			return new Promise<number>((s,j)=>{
				
				DictDb.db.all(sql, (err, rows:any)=>{
					if(err){j(err);return}
					s(rows[0].distinct_count)
					//console.log(sql)
				})
			})
		}else{
			let tableInfo = await DictDb.getTableInfo(tableName)
			let sql = ''
			//`SELECT COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
			for(let i = 0; i < tableInfo.length; i++){
				//console.log(i)
				//console.log(tableInfo[i])
				columnName = tableInfo[i].name
				sql += `SELECT '${columnName}' AS column_name, COUNT(DISTINCT ${columnName}) AS distinct_count FROM ${tableName}`
				if(i !== tableInfo.length-1){sql += ' UNION '}
				else{/* sql += ORDER BY column_name; */}
			}
			
			return new Promise<{column_name:string, distinct_count:number}[]>((s,j)=>{
				
				DictDb.db.all(sql, (err, rows:{column_name:string,distinct_count:number}[])=>{
					if(err || rows.length !== tableInfo.length){
						console.error('<sql>');console.error(sql);console.error('</sql>')
						console.error('<tableInfo>');console.error(tableInfo);console.error('</tableInfo>')
						console.error('<rows>');console.error(rows);console.error('</rows>')
						j(err+'|| rows.length !== tableInfo.length');
						return
					}
					//s(rows)
					/* let result:{columnName:string, distinct_count:number}[] = []
					for(let i = 0; i < rows.length; i++){
						let obj = {columnName: tableInfo[i].name, distinct_count: rows[i].distinct_count}
						result.push(obj)
					}
					 */
					//console.log(sql)
					s(rows)
				})
			})
		}
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

