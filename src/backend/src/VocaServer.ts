//import express from 'express'
/*TODO:{
  日誌模塊
  數據庫中null作0
}*/

require('tsconfig-paths/register');
import VocaRaw from "./VocaRaw";//導包之後會立即執行某語句?
//import Util from "../../shared/Util";
import Ut from "Ut"
//const moment = require('moment')
import moment from 'moment'
//const cors = require('cors')
//const express = require('express')
import express from 'express'
import bodyParser from "body-parser";
//const bodyParser = require('body-parser')
//import * as bodyParser from 'bodyParser'

const rootDir:string = require('app-root-path').path

//console.log(path.dirname(path.dirname(__dirname)))輸出項目根文件夾
/*const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'*/

//let vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語

export default class VocaServer{
	static vocaObjs:VocaRaw[] = VocaRaw.getObjsByConfig() //第0個昰英語 第1個是日語
	static app = express();
	//static pagePath:string = path.resolve(process.cwd())+'/frontend/src/browser'

	public static main(){
		
		VocaServer.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			next()
		})
		//VocaServer.app.use(express.static('browser'));
		VocaServer.app.use(express.static(Ut.pathAt(rootDir+'/src/frontend/dist')));
		//VocaServer.app.use(express.static('frontend\\src\\browser'))
		VocaServer.app.use(bodyParser.json());//??{}??
		VocaServer.app.use(express.json({limit: '65536mb'}))
		VocaServer.app.use(express.urlencoded({limit: '65536mb', extended:true}))
		//VocaServer.app.use(cors)
		
		//eng.addSingleWordsToDb()
	


		VocaServer.app.get('/eng', (req:any, res:any)=>{ //待改:此處ᵗ「/eng」ˋ還昰ᵣ寫死ₐ。
			const db = VocaServer.vocaObjs[0].getDbConnection()
			db.query(`SELECT * FROM ${VocaServer.vocaObjs[0].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
				//console.log('results:'+results)//RowDataPacket
				res.setHeader('content-type','text/html;charset=utf-8')
				res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
				//console.log(results['600']['wordShape'])
				//return results//蜮不效
			})
		})
		
		VocaServer.app.get('/jap', (req:any, res:any)=>{
			let path = req.path
			console.log('path:'+path)//t
			const db = VocaServer.vocaObjs[1].getDbConnection()
			db.query(`SELECT * FROM ${VocaServer.vocaObjs[1].tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
				
				//console.log('results:'+results)//RowDataPacket
				res.setHeader('content-type','text/html;charset=utf-8')
				res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
				//console.log(results['600']['wordShape'])
				//return results//蜮不效
			})
		})
		
/* 		VocaServer.app.get('/', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile('/index.html')
		}) */

		VocaServer.app.get('*', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile(rootDir+'/src/frontend/dist/index.html')
			//res.sendFile('D:/_/mmf/PROGRAM/_Cak/voca/src/frontend/dist/index.html')
			//res.send('<h1>1919</h1>')
		})
		VocaServer.app.post('/post', (req:any, res:any)=>{
			console.log(req.body)
			VocaRaw.updateDb(req.body)
			//VocaRaw.updateDb(JSON.parse(req.body))
			const timeNow = moment().format(`YYYY.MM.DD-HH:mm:ss`)
			res.send('成功接收到数据'+timeNow)
		})
		
		
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



