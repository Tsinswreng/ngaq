//const sqlite3 = require("sqlite3").verbose();
import { Database } from 'sqlite3';
import * as sqlite3Temp from 'sqlite3'
const sqlite3 = sqlite3Temp.verbose()
import * as fs from 'fs'
const rootDir:string = require('app-root-path').path
import 'module-alias/register';
import Txt from '../../../shared/Txt';

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
	private _name?:string
	private _srcPath?:string //源碼表文件路徑
	private _splitter:string = '\t' //源碼表中分割字與碼之符號
	//private _char:string[] = [] //字
	//private _code:string[] = [] //碼、形碼或音碼

	private _tableArr:string[][] = [] //行,列

	public set tableArr(v){
		this._tableArr = v
	}

	public get tableArr(){
		return this._tableArr
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
	}

	public get srcPath(){
		return this._srcPath
	}
	
	public assignTableArrByPath(path=this.srcPath){
		if(!path){throw new Error('!path')}
		this.tableArr = Txt.getTableFromStr(fs.readFileSync(path, 'utf-8'))
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

