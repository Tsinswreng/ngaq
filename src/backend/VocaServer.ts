process.on('uncaughtException', (err) => {
	console.error('Global uncaught exception handler:', err);
	//main()
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Global unhandled rejection handler:', reason);
});


import { WordDbSrc } from "./db/sqlite/OldWord/DbSrc";
//const cors = require('cors')
//const express = require('express')
import express, { Request, Response } from 'express'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
//import path from "path";
import Tempus from "@shared/Tempus";
//import SingleWord2 from "@shared/SingleWord2";
import { Word } from "@shared/entities/Word/Word";
import { IVocaRow } from "@shared/SingleWord2";
import { $, compileTs_deprecated, fileToBase64, lodashMerge, measurePromiseTime } from "@shared/Ut";
import session from 'express-session'
import RandomImg from "./Img";
import Config from "@backend/Config";
import OldSqlite from "@backend/db/OldSqlite";
import json5 from 'json5'
import * as fs from 'fs'
import merge from "merge-stream";
import { Readable } from "stream";
import jwt from 'jsonwebtoken'
import { WordTable } from "./db/sqlite/OldWord/Table";
import EventEmitter from "eventemitter3";
import { WeightCodeProcessor } from "@shared/WordWeight/Parser/WeightCodeProcessor";
const secretKey = '114514'

Error.stackTraceLimit = 99
const configInst = Config.getInstance()
//const bodyParser = require('body-parser')
//import * as bodyParser from 'bodyParser'
//const rootDir:string = require('app-root-path').path
const rootDir = process.cwd()
const tempUserName = '114'
const tempPassword = '514'
const oneDaySec = 3600*24

const dirs:string[] = []
dirs.push(...(configInst.config.randomImgDir??[]))

//<{}, any, any, QueryString.ParsedQs, Record<string, any>>
// type a = Express.Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>
// interface Req extends Express.Request<{}, any, any, QueryString.ParsedQs, Record<string, any>>{
// 	session?:string
// }

interface MyReq extends Request{
	session?:string
}


//console.log(path.dirname(path.dirname(__dirname)))輸出項目根文件夾
/*const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'*/

//let vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語

// const dc = <This, Args extends any[], Return>(
// 	old: (this: This, ...args: Args) => Return
// 	,neo: typeof old
// )=>{
	
// }

/**
 * 処 get請求之回調
 * @param old 
 * @returns 
 */
const get = <R>(old:(req:Request, res:Response)=>R)=>{
	const neoFn = async(req:Request, res:Response)=>{
		const nunc = Tempus.new()
		console.log(req.path+' '+Tempus.format(nunc))
		try {
			const ans: Awaited<R> = await old(req, res)
			return ans
		} catch (error) {
			const err = error as Error
			console.error(err)
			console.error(nunc.iso)
			res.send(err)
			throw err
		}
	}
	return neoFn
}

const post = <R>(old:(req:Request, res:Response)=>R)=>{
	const neoFn = async(req:Request, res:Response)=>{
		const nunc = Tempus.new()
		console.log(req.path+' '+Tempus.format(nunc))
		try {
			const ans: Awaited<R> = await old(req, res)
			return ans
		} catch (error) {
			const err = error as Error
			console.error(err)
			console.error(nunc.iso)
			res.send(err)
			throw err
		}
	}
	return neoFn
}

import { routes } from "@shared/Routes";
import { BlobWithText } from "@shared/tools/BlobWithText";
const RT = routes
//console.log(RT)

export default class VocaServer{
	//static vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語
	public static readonly app = express();
	public static wordDbSrc:WordDbSrc
	public static session
	
	//static pagePath:string = path.resolve(process.cwd())+'/frontend/src/browser'

	/**
	 * 忽略 空槽及數據庫ʸ不存ʹ表
	 * @returns 
	 */
	static async getAllExistingTablesInConfig(){
		const tables0 = configInst.config.tables
		const ans = [] as string[]
		for(const tbl of tables0){
			if(tbl == void 0){
				continue
			}
			const b = await OldSqlite.isTableExist(C.wordDbSrc.dbRaw, tbl)
			if(!b){continue}
			ans.push(tbl)
		}
		return ans
	}

	public static async main(){
		C.wordDbSrc = await WordDbSrc.New({
			_dbPath:configInst.config.dbPath
			, _backupDbPath:configInst.config.backupDbPath
			,_mode: OldSqlite.openMode.DEFAULT_CREATE
		})


		C.wordDbSrc.linkedEmitter.eventEmitter.on(C.wordDbSrc.events.createTable_before.name, (...args)=>{
			const table = args[0]['0']
			//console.log(`before create table ${table}`)
		})

		C.wordDbSrc.linkedEmitter.eventEmitter.on(C.wordDbSrc.events.createTable_after.name, (...args)=>{
			/* console.log(args)
			console.log(args[0]) */
			//console.log(`create table done ${args[0]}`)
		})

		C.wordDbSrc.linkedEmitter.on(C.wordDbSrc.events.createTable_after, (...args)=>{
			const table = args[0]['0']
			console.log(`after create table ${table}`)
			const inEmt = C.wordDbSrc.tmdDbSrc.linkedEmitter.eventEmitter as EventEmitter
			console.log(
				inEmt.eventNames()
			)
		})

		C.wordDbSrc.tmdTable.addOldCreatedTable().then((d)=>{
			console.log('created old tmdTable')
		})
		
		// await OldSqlite.prepare(VocaServer.sqltDbObj, 's')
		let ri :RandomImg|undefined = undefined
		try{
			ri = await RandomImg.konstructor(dirs)
		}catch(e){
			console.error(`尋不見路徑`)
		}
		
		VocaServer.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			next()
		})
		//VocaServer.app.use(express.static('browser'));
		//VocaServer.app.use(express.static(Ut.pathAt(rootDir+'/src/frontend/dist')));
		VocaServer.app.use(express.static('./out/frontend/dist'));
		//VocaServer.app.use(express.static('frontend\\src\\browser'))
		
		VocaServer.app.use(express.json({limit: '65536mb'}))
		VocaServer.app.use(express.urlencoded({limit: '65536mb', extended:true}))
		VocaServer.app.use(bodyParser.json({limit:'64MB'}))
		//VocaServer.app.use(express.bodyParser({limit: '50mb'}));
		VocaServer.app.use(bodyParser.json());//??{}??
		VocaServer.app.use(session({
			secret: 'hocEstMeusSecretusKeyus114514810893',
			cookie: {maxAge: oneDaySec},
			saveUninitialized:true,
			resave: false
		}))
		VocaServer.app.use(cookieParser())
		//VocaServer.app.use(cors)
		
		//eng.addSingleWordsToDb()
	

		VocaServer.app.post(RT.saveWords,post(async(req,res)=>{
			//let rows:IVocaRow[] = JSON.parse(req.body)
			let sws:Word[] = Word.toJsObj(req.body as IVocaRow[])
			const prms = await WordDbSrc.saveWords(this.wordDbSrc.dbRaw, sws)
			// const fn = ()=>{
			// 	return Promise.all(prms)
			// }
			// await OldSqlite.transaction(C.sqlt.db, fn)
			const nunc = Tempus.new()
			console.log(nunc)//t
			res.send(nunc.iso)
			// for(const p of prms){
			// 	await p
			// }//並行則有transaction嵌套之謬?
		}))

		VocaServer.app.post(RT.addWords,async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//console.log(req.body)
			//let rows:IVocaRow[] = JSON.parse(req.body)
			//let sws:SingleWord2[] = SingleWord2.parse(req.body)
			//const [rows, config] = req.body
			try{
				const rows:IVocaRow[] = $(req.body[0])
				//const config2:VocaRawConfig = $(req.body[1])
				const sws = Word.toJsObj(rows)
				//await VocaSqlite.backupTableInDb(VocaServer.sqltDbObj, sws[0].table) //每加詞則備份表
				//const vsqlt = VocaSqlite.new({_tableName: sws[0].table})
				const backupDb = await WordDbSrc.New({
						_dbPath:(configInst.config.backupDbPath)
						, _mode:OldSqlite.openMode.DEFAULT_CREATE
				})
				await WordDbSrc.backupTable(VocaServer.wordDbSrc.dbRaw, sws[0].belong, backupDb.dbRaw) //* 無調用堆棧
				//throw new Error('mis')
				//const stmt = await OldSqlite.prepare(backupDb.db, `SELECT * FROM 'a'`)
				const [init, modified] = await OldSqlite.transaction(
					VocaServer.wordDbSrc.dbRaw
					, await WordDbSrc.addWordsOfSameTable_fn(VocaServer.wordDbSrc.dbRaw, sws)
				)
				 //<待改>{config.dbPath等ˇ皆未用、實則猶存于 VocaServer.sqltDbObj處。}
				console.log(init)
				console.log(modified)//t
				const addedWords_init:string[] = await WordDbSrc.getWordShapesByIds(VocaServer.wordDbSrc.dbRaw, sws[0].belong, init)
				const addedWords_modified:string[] = await WordDbSrc.getWordShapesByIds(VocaServer.wordDbSrc.dbRaw, sws[0].belong, modified)
				const addedWords = [...addedWords_init,...addedWords_modified]
				res.send(addedWords+'\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.log(`console.error(e)`)//t
				console.error(e)
				res.send('add failed\n'+Tempus.format(nunc)) //t
			}
		})

		

		VocaServer.app.post(RT.backupAll,async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				await this.wordDbSrc.backAllTables()
				res.send('backup successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('backup failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post(RT.backup,async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				//const tableName:string = $((req.body).tableName)
				//await this.sqlt.creatTable(tableName, false)
				//res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post(RT.createTable,async (req,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				const tableName:string = $((req.body).tableName)
				//await this.wordDbSrc.creatTable_deprecated(tableName, false)
				await this.wordDbSrc.createTable(tableName, {ifNotExists:false}).then(()=>{
				})
				res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		//請求頭潙'Content-Type': 'application/json'旹 res.body潙 解析json˪ᵗ js對象、無需再手動解析
		VocaServer.app.post(RT.compileTs, post(async(req, res)=>{
			//const [tsCode, tsconfigStr] = req.body
			//const body = JSON.parse(req.body)
			const body = req.body
			const tsCode:string = $( body[0] )
			const tsconfig0_str:string = $( body[1] )
			const tsconfig1_str = await fs.promises.readFile('./tsconfig.json', 'utf-8')
			const tsconfig0 = json5.parse(tsconfig0_str)
			const tsconfig1 = json5.parse(tsconfig1_str)
			const tsconfig:any = lodashMerge({}, tsconfig1, tsconfig0)
			const jsCode = compileTs_deprecated(tsCode, tsconfig.compilerOptions)
			res.send(jsCode)
		}))


		/**
		 * 表ˋ既存于數據庫且于配置中
		 */
		C.app.get(RT.wordsFromAllTables, async(req,res)=>{
			const recErr = new Error()
			const existingTbls = await C.getAllExistingTablesInConfig()
			const rows = [] as IVocaRow[]
			for(const tbl of existingTbls){
				const tblObj = C.wordDbSrc.loadTable(tbl)
				const urows = await tblObj.selectAllWithTblName()
				rows.push(...urows)
			}
			res.send(
				JSON.stringify(rows)
			)
		})

		/**
		 * 返 用戶config.js中䀬ʹ表
		 */
		C.app.get(RT.tables, get(async(req, res)=>{
			const tables_ = configInst.config.tables
			const tables = $(tables_)
			
			const nonNullTables:string[] = []
			for(const u of tables){
				const b = await OldSqlite.isTableExist(C.wordDbSrc.dbRaw,u)
				if(b){nonNullTables.push(u)}
			}
			configInst.reload()
			res.send(
				JSON.stringify(
					nonNullTables
				)
			)
		}))


		/**
		 * ?table=english
		 */
		C.app.get(RT.words, get(async(req, res)=>{
			const table0 = req.query.table
			console.log(table0)
			if(typeof table0 !== 'string'){
				throw new Error(`typeof table0 !== 'string'`)
			}
			const table:string = table0
			//const vsqlt = await VocaSqlite.neW({_tableName:table})
			const stream = await C.wordDbSrc.readStream(table)
			//const stream = await vsqlt.readStream()
			res.setHeader('Content-Type', 'application/octet-stream');
			stream.pipe(res)
		}))

		/**
		 * @deprecated 以merge合併流後 前端每次迭代讀取則json蜮被截斷
		 */
		C.app.get(RT.allTableWords, get(async(req, res)=>{
			//const table0 = req.query.table
			// if(typeof table0 !== 'string'){
			// 	throw new Error(`typeof table0 !== 'string'`)
			// }
			// const table:string = table0
			//const vsqlt = await VocaSqlite.neW({_tableName:table})
			configInst.reload()
			
			const tables = await OldSqlite.filterExistTables(C.wordDbSrc.dbRaw, configInst.config.tables??[])
			const streams:Readable[] = new Array(tables.length)
			for(let i = 0; i < tables.length; i++){
				const ua = await C.wordDbSrc.readStream(tables[i])
				streams[i] = ua
			}
			const stream = merge(...streams)
			//const stream = await C.sqlt.readStream(table)
			//const stream = await vsqlt.readStream()
			res.setHeader('Content-Type', 'application/octet-stream');
			stream.pipe(res)
		}))

		VocaServer.app.post('/user/login',async (req:MyReq,res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			console.log(req.body)
			console.log(req.body.username)
			console.log(req.body.password)
			if(req.body.username === tempUserName && req.body.password === tempPassword){
				VocaServer.session = req.session
				VocaServer.session.userid = req.body.username
				const token = jwt.sign({ username: req.body.username }, secretKey);
				//res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
				res.send(token)
			}else{
				res.send('Invalid username or password');
			}
		})

		VocaServer.app.post('/randomImg', async (req,res)=>{
			if(!ri){return}
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//res.sendFile(ri.oneRandomFile())
			const path = ri.oneRandomFile()
			const [time, base64] = await measurePromiseTime(fileToBase64(path))
			console.log(`fileToBase64 耗時: `+time)
			const pair:[string, string] = [path, base64]
			//res.send(JSON.stringify(pair))
			res.json(pair)
		})

		C.app.get('/randomImg2', async(req,res)=>{
			if(!ri){return}
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//res.sendFile(ri.oneRandomFile())
			const path = ri.oneRandomFile()
			const bin = fs.readFileSync(path)
			res.send({
				blob:bin
				,text:path
			})
		})

		C.app.get('/randomImg3', async(req,res)=>{
			if(!ri){return}
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//res.sendFile(ri.oneRandomFile())
			const path = ri.oneRandomFile()
			const bin = fs.readFileSync(path)
			res.send({
				blob:bin
				,text:path
			})
			
		})

		C.app.get('/randomImg4', async(req,res)=>{
			if(!ri){return}
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			//res.sendFile(ri.oneRandomFile())
			const path = ri.oneRandomFile()
			const bin = fs.readFileSync(path)
			const pack = BlobWithText.pack(path, bin)
			const u8arr = pack.toUint8Arr()
			res.setHeader('Content-Type', 'application/octet-stream')
			res.setHeader('Content-Length', u8arr.byteLength.toString())
			res.send(Buffer.from(u8arr.buffer))
		})

		/** test */
		C.app.get('/r3', async(req, res)=>{
			const path = ri!.oneRandomFile()
			const bin = fs.readFileSync(path)
			const base64Image = Buffer.from(bin).toString('base64');
			// 构建HTML响应，将base64图像嵌入其中
			const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Image Rendering</title>
				</head>
				<body>
					<img src="data:image/jpeg;base64,${base64Image}" alt="Image">
				</body>
				</html>
			`;
	
			// 发送HTML响应
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(html);
			res.end();
		})

		C.app.get('/testWasm', async(req, res)=>{
			const nunc = Tempus.new()
			console.log(req.path+' '+Tempus.format(nunc))
			try {
				const ans = fs.readFileSync('D:\\_code\\voca\\src\\c/index.html', {encoding: 'utf-8'})
				res.send(ans)
			} catch (error) {
				const err = error as Error
				console.error(err)
				res.send(Tempus.format(nunc)+'\n'+err.message)
			}
		})

		/** 返 首個權重算法方案ʹjs代碼。臨時 */
		C.app.get('/weightAlgoJs0', async(req,res)=>{
			const first = configInst.config.wordWeight.schemas[0]
			let code:string
			if(first == void 0){
				//throw new Error(`config.wordWeight.schemas[0] == void 0`)
				res.status(400)
				return
			}
			if(first.code == void 0){
				if(first.path == void 0){
					//throw new Error(`code and path are all empty`)
					res.status(400)
					return
				}
				const srcCode = fs.readFileSync(first.path, {encoding: 'utf-8'})
				code = srcCode
			}else{
				code = first.code
			}
			const jsCode = WeightCodeProcessor.process(code)
			console.log(jsCode.length)//t
			res.send(jsCode)
		})

		/**
		 * 此須寫于䀬之末
		 */
		VocaServer.app.get('*', (req:MyReq, res)=>{
			VocaServer.session=req.session??''
			//console.log(req.hostname)
			if(VocaServer.session.userid && req.path==='/login'){
				res.setHeader('content-type','text;charset=utf-8')
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
			}else{
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
				//res.redirect('/login')
			}
		})
		VocaServer.app.listen(configInst.config.port, ()=>{
			console.log(`at\nhttp://127.0.0.1:${configInst.config.port}`)
		})
	}
	
}
const C = VocaServer
type C = VocaServer
