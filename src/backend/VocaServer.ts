import WordDbSrc_, { WordDbSrc } from "./db/sqlite/Word/DbSrc";
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
import { $, absPath, compileTs, fileToBase64, lodashMerge, measurePromiseTime } from "@shared/Ut";
import session from 'express-session'
import RandomImg from "./Img";
import Config from "@shared/Config";
import Sqlite from "@backend/db/Sqlite";
import json5 from 'json5'
import * as fs from 'fs'
import merge from "merge-stream";
import { Readable } from "stream";
import jwt from 'jsonwebtoken'
import { WordTable } from "./db/sqlite/Word/Table";
import EventEmitter from "eventemitter3";
const secretKey = '114514'

Error.stackTraceLimit = 99
const config = Config.getInstance()
//const bodyParser = require('body-parser')
//import * as bodyParser from 'bodyParser'
//const rootDir:string = require('app-root-path').path
const rootDir = process.cwd()
const tempUserName = '114'
const tempPassword = '514'
const oneDaySec = 3600*24

const dirs:string[] = []
dirs.push(...(config.config.randomImgDir??[]))

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


export default class VocaServer{
	//static vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語
	public static readonly app = express();
	public static wordDbSrc:WordDbSrc
	public static session
	
	//static pagePath:string = path.resolve(process.cwd())+'/frontend/src/browser'

	public static async main(){
		C.wordDbSrc = await WordDbSrc_.New({
			_dbPath:config.config.dbPath
			, _backupDbPath:config.config.backupDbPath
			,_mode: Sqlite.openMode.DEFAULT_CREATE
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
		
		// await Sqlite.prepare(VocaServer.sqltDbObj, 's')
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
			secret: 'hocEstMeusSecretusKeyus114514810893shitJeanPinkGetDown',
			cookie: {maxAge: oneDaySec},
			saveUninitialized:true,
			resave: false
		}))
		VocaServer.app.use(cookieParser())
		//VocaServer.app.use(cors)
		
		//eng.addSingleWordsToDb()
	


		// VocaServer.app.get('/eng', (req, res)=>{ //待改:此處ᵗ「/eng」ˋ還昰ᵣ寫死ₐ。
		// 	const db = VocaServer.vocaObjs[0].getDbConnection()
		// 	db.query(`SELECT * FROM ${VocaServer.vocaObjs[0].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
		// 		//console.log('results:'+results)//RowDataPacket
		// 		res.setHeader('content-type','text/html;charset=utf-8')
		// 		res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
		// 		//console.log(results['600']['wordShape'])
		// 		//return results//蜮不效
		// 	})
		// })
		
		// VocaServer.app.get('/jap', (req:any, res:any)=>{
		// 	let path = req.path
		// 	console.log('path:'+path)//t
		// 	const db = VocaServer.vocaObjs[1].getDbConnection()
		// 	db.query(`SELECT * FROM ${VocaServer.vocaObjs[1].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
				
		// 		//console.log('results:'+results)//RowDataPacket
		// 		res.setHeader('content-type','text/html;charset=utf-8')
		// 		res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
		// 		//console.log(results['600']['wordShape'])
		// 		//return results//蜮不效
		// 	})
		// })

		/**
		 * deprecated
		 */
		// this.app.get('/english', async (req,res)=>{
			
		// 	try {
		// 		let path = req.path
		// 		console.log('path:'+path)//t
		// 		let eng = VocaSqlite.new({_tableName:'english'})
		// 		//console.log(eng.tableName)//t *
		// 		let words = await eng.getAllWords()
		// 		//console.log(words)
		// 		//console.log(JSON.stringify(words))
		// 		res.setHeader('content-type','text/html;charset=utf-8')
		// 		res.end(JSON.stringify(words))
		// 	} catch (error) {
		// 		const err = error as Error
		// 		console.error(err)
		// 	}
			
		// })
		
		/**
		 * deprecated
		 */
		// this.app.get('/japanese', async (req,res)=>{
		// 	let path = req.path
		// 	console.log('path:'+path)//t
		// 	let sqlt = VocaSqlite.new({_tableName:'japanese'})
		// 	let words = await sqlt.getAllWords()
		// 	res.setHeader('content-type','text/html;charset=utf-8')
		// 	res.end(JSON.stringify(words))
		// })

/* 		VocaServer.app.get('/', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile('/index.html')
		}) */


		// VocaServer.app.post('/post', (req, res)=>{
		// 	console.log(req.body)
		// 	VocaRaw.updateDb(req.body)
		// 	//VocaRaw.updateDb(JSON.parse(req.body))
		// 	const timeNow = Tempus.new().iso
		// 	res.send('成功接收到数据'+timeNow)
		// })

		VocaServer.app.post('/saveWords',post(async(req,res)=>{
			//let rows:IVocaRow[] = JSON.parse(req.body)
			let sws:Word[] = Word.toJsObj(req.body as IVocaRow[])
			const prms = await WordDbSrc_.saveWords(this.wordDbSrc.db, sws)
			// const fn = ()=>{
			// 	return Promise.all(prms)
			// }
			// await Sqlite.transaction(C.sqlt.db, fn)
			const nunc = Tempus.new()
			console.log(nunc)//t
			res.send(nunc.iso)
			// for(const p of prms){
			// 	await p
			// }//並行則有transaction嵌套之謬?
		}))

		VocaServer.app.post('/addWords',async (req,res)=>{
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
				const backupDb = await WordDbSrc_.New({
						_dbPath:(config.config.backupDbPath)
						, _mode:Sqlite.openMode.DEFAULT_CREATE
				})
				await WordDbSrc_.backupTable(VocaServer.wordDbSrc.db, sws[0].table, backupDb.db) //* 無調用堆棧
				//throw new Error('mis')
				//const stmt = await Sqlite.prepare(backupDb.db, `SELECT * FROM 'a'`) 
				const [init, modified] = await Sqlite.transaction(
					VocaServer.wordDbSrc.db
					, await WordDbSrc_.addWordsOfSameTable_fn(VocaServer.wordDbSrc.db, sws)
				)
				 //<待改>{config.dbPath等ˇ皆未用、實則猶存于 VocaServer.sqltDbObj處。}
				console.log(init)
				console.log(modified)//t
				const addedWords_init:string[] = await WordDbSrc_.getWordShapesByIds(VocaServer.wordDbSrc.db, sws[0].table, init)
				const addedWords_modified:string[] = await WordDbSrc_.getWordShapesByIds(VocaServer.wordDbSrc.db, sws[0].table, modified)
				const addedWords = [...addedWords_init,...addedWords_modified]
				res.send(addedWords+'\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.log(`console.error(e)`)//t
				console.error(e)
				res.send('add failed\n'+Tempus.format(nunc)) //t
			}
		})

		

		VocaServer.app.post('/backupAll',async (req,res)=>{
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

		VocaServer.app.post('/backup',async (req,res)=>{
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

		VocaServer.app.post('/creatTable',async (req,res)=>{
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
		VocaServer.app.post('/compileTs', post(async(req, res)=>{
			//const [tsCode, tsconfigStr] = req.body
			//const body = JSON.parse(req.body)
			const body = req.body
			const tsCode:string = $( body[0] )
			const tsconfig0_str:string = $( body[1] )
			const tsconfig1_str = await fs.promises.readFile('./tsconfig.json', 'utf-8')
			const tsconfig0 = json5.parse(tsconfig0_str)
			const tsconfig1 = json5.parse(tsconfig1_str)
			const tsconfig:any = lodashMerge({}, tsconfig1, tsconfig0)
			const jsCode = compileTs(tsCode, tsconfig.compilerOptions)
			res.send(jsCode)
	}))

		// C.app.get('/tables',async(req, res)=>{
		// 	const nunc = Tempus.new()
		// 	console.log(req.path+' '+Tempus.format(nunc))
		// 	try {
		// 		config.reload()
		// 		res.send(
		// 			JSON.stringify(
		// 				config.config.tables
		// 			)
		// 		)
		// 	} catch (error) {
		// 		const err = error as Error
		// 		console.error(err)
		// 		res.send(Tempus.format(nunc)+'\n'+err.message)
		// 	}
		// })

		C.app.get('/tables', get(async(req, res)=>{
			const tables_ = config.config.tables
			const tables = $(tables_)
			
			const nonNullTables:string[] = []
			for(const u of tables){
				const b = await Sqlite.isTableExist(C.wordDbSrc.db,u)
				if(b){nonNullTables.push(u)}
			}
			
			config.reload()
			res.send(
				JSON.stringify(
					nonNullTables
				)
			)
		}))


		C.app.get('/words', get(async(req, res)=>{
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
		C.app.get('/allTableWords', get(async(req, res)=>{
			//const table0 = req.query.table
			// if(typeof table0 !== 'string'){
			// 	throw new Error(`typeof table0 !== 'string'`)
			// }
			// const table:string = table0
			//const vsqlt = await VocaSqlite.neW({_tableName:table})
			config.reload()
			
			const tables = await Sqlite.filterExistTables(C.wordDbSrc.db, config.config.tables??[])
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

		// VocaServer.app.get('/login',async (req:MyReq,res)=>{
		// 	const nunc = Tempus.new()
		// 	console.log(req.path+' '+Tempus.format(nunc))
		// 	res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
		// })


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



		// C.app.get('/testStream', async(req, res)=>{
		// 	const nunc = Tempus.new()
		// 	console.log(req.path+' '+Tempus.format(nunc))
		// 	try {
		// 		const vsqlt = await WordDbSrc_.New({_tableName:'english'})
		// 		const stream = await vsqlt.readStream()
		// 		res.setHeader('Content-Type', 'application/octet-stream');
		// 		stream.pipe(res)
		// 	} catch (error) {
		// 		const err = error as Error
		// 		console.error(err)
		// 		res.send(Tempus.format(nunc)+'\n'+err.message)
		// 	}
			
		// })

		
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


			//res.send(`<h1>404</h1>`)
			//res.sendFile('./out/frontend/dist') 叵、只能用絕對路徑
			//res.sendFile('D:/_/mmf/PROGRAM/_Cak/voca/src/frontend/dist/index.html')
			//res.send('<h1>1919</h1>')
		
		/* VocaServer.app.get('/login', (req:any, res:any)=>{
			console.log(req.body)
			if(req.body.tempPwd === '一'){
				console.log('密碼正確')
			}else{
				console.log('密碼錯誤')
			}
		}) */

		/**
		 * 此須寫于䀬之末
		 */
		VocaServer.app.get('*', (req:MyReq, res)=>{
			VocaServer.session=req.session??''
			if(VocaServer.session.userid && req.path==='/login'){
				res.setHeader('content-type','text;charset=utf-8')
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
			}else{
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
				//res.redirect('/login')
			}
		})
		VocaServer.app.listen(config.config.port, ()=>{
			console.log(`at\nhttp://127.0.0.1:${config.config.port}`)
		})
	}
	
}
const C = VocaServer
type C = VocaServer