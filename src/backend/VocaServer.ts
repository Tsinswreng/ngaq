//import express from 'express'
/*TODO:{
  日誌模塊
  數據庫中null作0
}*/

//require('tsconfig-paths/register');
require('module-alias/register');
//import VocaRaw from "./VocaRaw";//導包之後會立即執行某語句?
import VocaSqlite from "./VocaSqlite";

//import Util from "../../shared/Util";
//import Ut from "Ut"
//const moment = require('moment')

//const cors = require('cors')
//const express = require('express')
import express, { raw, Request, Response } from 'express'
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser'
import path from "path";
import dayjs from "dayjs";
import Tempus from "@shared/Tempus";
import SingleWord2 from "@shared/SingleWord2";
import { IVocaRow } from "@shared/SingleWord2";
import { $ } from "@shared/Ut";
import { VocaRawConfig } from "@shared/VocaRaw2";
import session from 'express-session'

//const bodyParser = require('body-parser')
//import * as bodyParser from 'bodyParser'

const rootDir:string = require('app-root-path').path
const tempUserName = '114'
const tempPassword = '514'
const oneDaySec = 3600*24

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

export default class VocaServer{
	//static vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語
	public static readonly app = express();
	public static sqlt = new VocaSqlite({})
	public static sqltDbObj = VocaServer.sqlt.db
	public static session
	//static pagePath:string = path.resolve(process.cwd())+'/frontend/src/browser'

	public static main(){
		
		VocaServer.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			next()
		})
		//VocaServer.app.use(express.static('browser'));
		//VocaServer.app.use(express.static(Ut.pathAt(rootDir+'/src/frontend/dist')));
		//console.log(path.resolve('./out/frontend/dist'))
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
		this.app.get('/english', async (req,res)=>{
			
			let path = req.path
			console.log('path:'+path)//t
			let eng = new VocaSqlite({_tableName:'english'})
			let words = await eng.getAllWords()
			//console.log(words)
			//console.log(JSON.stringify(words))
			res.setHeader('content-type','text/html;charset=utf-8')
			res.end(JSON.stringify(words))
			
		})
		
		this.app.get('/japanese', async (req,res)=>{
			let path = req.path
			console.log('path:'+path)//t
			let sqlt = new VocaSqlite({_tableName:'japanese'})
			let words = await sqlt.getAllWords()
			res.setHeader('content-type','text/html;charset=utf-8')
			res.end(JSON.stringify(words))
		})

/* 		VocaServer.app.get('/', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile('/index.html')
		}) */


		VocaServer.app.post('/post', (req, res)=>{
			console.log(req.body)
			VocaRaw.updateDb(req.body)
			//VocaRaw.updateDb(JSON.parse(req.body))
			const timeNow = dayjs().format(`YYYY.MM.DD-HH:mm:ss`)
			res.send('成功接收到数据'+timeNow)
		})

		VocaServer.app.post('/saveWords',(req,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			//console.log(req.body)
			//let rows:IVocaRow[] = JSON.parse(req.body)
			let sws:SingleWord2[] = SingleWord2.parse(req.body as IVocaRow[])
			VocaSqlite.saveWords(this.sqltDbObj, sws)
			res.send('receive successfully'+nunc.time)
		})

		VocaServer.app.post('/addWords',async (req,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			//console.log(req.body)
			//let rows:IVocaRow[] = JSON.parse(req.body)
			//let sws:SingleWord2[] = SingleWord2.parse(req.body)
			//const [rows, config] = req.body
			try{
				const rows:IVocaRow[] = $(req.body[0])
				const config:VocaRawConfig = $(req.body[1])
				const sws = SingleWord2.parse(rows)
				//console.log(sws[0])//t
				await VocaSqlite.backupTable(VocaServer.sqltDbObj, sws[0].table) //每加詞則備份表
				const [init, modified] = await VocaSqlite.addWordsOfSameTable(VocaServer.sqltDbObj, sws)
				
				 //<待改>{config.dbPath等ˇ皆未用、實則猶存于 VocaServer.sqltDbObj處。}
				console.log(init)
				console.log(modified)//t
				const addedWords_init:string[] = await VocaSqlite.getWordShapesByIds(VocaServer.sqlt.db, sws[0].table, init)
				const addedWords_modified:string[] = await VocaSqlite.getWordShapesByIds(VocaServer.sqlt.db, sws[0].table, modified)
				const addedWords = [...addedWords_init,...addedWords_modified]
				res.send(addedWords+'\nreceive successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				//console.log(114514)
				res.send('add failed\n'+Tempus.format(nunc)) //t
			}

		})

		VocaServer.app.post('/backupAll',async (req,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				await this.sqlt.backAllTables()
				res.send('backup successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('backup failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post('/backup',async (req,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				const tableName:string = $((req.body).tableName)
				//await this.sqlt.creatTable(tableName, false)
				//res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		VocaServer.app.post('/creatTable',async (req,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			try{
				const tableName:string = $((req.body).tableName)
				await this.sqlt.creatTable(tableName, false)
				res.send('creat table successfully\n'+Tempus.format(nunc)) //t
			}catch(e){
				console.error(e)
				res.send('creat table failed\n'+Tempus.format(nunc)) //t
			}
		})

		// VocaServer.app.get('/login',async (req:MyReq,res)=>{
		// 	const nunc = new Tempus()
		// 	console.log(req.path+' '+Tempus.format(nunc))
		// 	res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
		// })


		VocaServer.app.post('/user/login',async (req:MyReq,res)=>{
			const nunc = new Tempus()
			console.log(req.path+' '+Tempus.format(nunc))
			console.log(req.body)
			console.log(req.body.username)
			console.log(req.body.password)
			if(req.body.username === tempUserName && req.body.password === tempPassword){
				VocaServer.session = req.session
				VocaServer.session.userid = req.body.username
				res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
			}else{
				res.send('Invalid username or password');
			}
		})

		VocaServer.app.get('*', (req:MyReq, res)=>{
			VocaServer.session=req.session??''
			if(VocaServer.session.userid && req.path==='/login'){
				console.log(114514)//t
				res.setHeader('content-type','text;charset=utf-8')
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
			}else{
				res.sendFile(rootDir+'/out/frontend/dist/index.html')
				//res.redirect('/login')
				//console.log(`res.redirect('/login')`)//t
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
		
		VocaServer.app.listen(1919, ()=>{
			console.log('at\nhttp://127.0.0.1:1919')
		})
		
		
	}
	
}
VocaServer.main()

async function getWordShapesByIds(){

}



