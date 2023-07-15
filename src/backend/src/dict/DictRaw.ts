//const sqlite3 = require("sqlite3").verbose();
import { Database } from 'sqlite3';
import * as sqlite3Temp from 'sqlite3'
const sqlite3 = sqlite3Temp.verbose()
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
import 'module-alias/register';
//import Txt from '../../../shared/Txt';
import Txt from "@shared/Txt"
import Util from '../../../shared/Util';
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


/**
 * [23.07.08-2146,]
 * 用于處理字表、如rime輸入法之dict.yaml, 音韻學/方言字表等
 */
export class DictRaw{
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
		this.srcStr = fs.readFileSync(path, 'utf-8')
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
			this.name = name
		}
	}

/* 	public get_body():string[][]{
		return this.tableArr.slice(this._indexOfHeader+1)
	} */

	public assign_validBody(){

		
		//this.validBody = []
		let bodyLines:string[] = []
		let body:string = ''
		let validBodyStr = ''
		if(this._singleCharMode){
			for(let i = this.indexOfHeader+1; i < this.srcLines.length; i++){
				//bodyLines.push(this.srcLines[i])
				body += (this.srcLines[i]+'\n')
			}
			body = Txt.removeSingleLineComments_s(body, '#')
			//console.log(bodyLines)
			bodyLines = Txt.spliteStrByNewline_s(body)
			for(let i = 0; i < bodyLines.length; i++){
				if( bodyLines[i] !== ''){ //!bodyLines[i].match(/(\s)*/g)
					validBodyStr += (bodyLines[i]+'\n')
				}
			}
			validBodyStr.slice(0, validBodyStr.length-1)
			this.validBody = Txt.getTableFromStr(validBodyStr)
		}else{
			throw new Error()
		}
	}

	public assign_srcLines(){
		if(!this.srcStr){throw new Error('!this.srcStr')}
		this.srcLines = Txt.spliteStrByNewline_s(this.srcStr)
	}

	

	public async saveInDb(){
		let db = new DictDb(this.name)
		db.insert(this.validBody).then((data)=>{
			console.log(data)
		})
	}

	

}

export class DictDb{
/* 	private _db = new sqlite3.Database('db.sqlite', (err)=>{
		if(err){throw err}
	}); */
	//public static dbPath:string = rootDir + '/db'

	public static readonly dbName = 'DictDb'
	public static readonly dbPath = rootDir+'/db/'+DictDb.dbName+'.db'
	public static readonly db:Database = new sqlite3.Database(DictDb.dbPath, (err)=>{
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

	public async isTableExists(tableName = this.tableName){
		//写一个同步的typescript函数、判断一个sqlite数据库是否含有某表
		let sql = `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`
		return new Promise<boolean>((resolve, reject)=>{
			DictDb.db.get(sql, (err, result:any)=>{
				if(err){
					console.log('<sql>')
					console.error(sql)
					console.log('</sql>')
					throw err
				}
				//console.log(result)
				if(result.name === tableName){
					resolve(true)
					//return true
				}else{
					console.log('<result>')
					console.log(result)
					console.log('</result>')
					console.log('<tableName>')
					console.log(tableName)
					console.log('</tableName>')
					resolve(false)
					//return false
				}
				//resolve(result as string)
			})
			
		})
	}


	public creatTable(tableName = this.tableName){
		//IF NOT EXISTS 
		let sql:string = `CREATE TABLE ${tableName} (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			kanji VARCHAR(64) NOT NULL,
			pronounce VARCHAR(64) NOT NULL
		)`
		DictDb.db.run(sql, (err)=>{
			if(err){throw err}
			console.log('at\t'+DictDb.dbPath)
		})
		//this.db.exec(testCreat)
	}

	

	


	public testInsert(tableName=this.tableName){
		let sql = `INSERT INTO ${tableName} (kanji, pronounce) VALUES (?,?)` 
		let v = ['我', 'waq']
		DictDb.db.run(sql, v, (err)=>{
			if(err){throw err}
		})
	}

	public async insert(vstr:string[][]){
		let sql = `INSERT INTO ${this.tableName} (kanji, pronounce) VALUES (?,?)` 
		return new Promise<any>(async (resolve, reject)=>{
			let index:number|undefined;
			try{
				for(let i = 0; i < vstr.length; i++){
					index = i
					let v = [Util.arrAt(vstr, i, 0), Util.arrAt(vstr, i, 1)]
					
					await DictDb.db.run(sql, v, (err)=>{
						if(err){throw err}
					})
				}
				resolve('添加成功')
			}catch(e){
				console.error('<index>')
				console.error(index)
				console.error('</index>')
				console.error(vstr[index!])
				console.error(e)
				reject(e)
			}
			
		})
		
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

