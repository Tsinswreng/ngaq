//import express from 'express'
/*TODO:{
  日誌模塊
  數據庫中null作0
}*/
import VocaRaw from "./VocaRaw";//導包之後會立即執行某語句?
const moment = require('moment')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const eng = new VocaRaw();
eng.dbName = 'voca'
eng.tableName = 'eng'
const jap = new VocaRaw()
jap.dbName = 'voca'
jap.tableName = 'jap'

class VocaServer{
	static app = express();

	public static main(){
		
		VocaServer.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			next()
		})
		VocaServer.app.use(express.static('browser'));
		VocaServer.app.use(bodyParser.json());//??{}??
		VocaServer.app.use(express.json({limit: '65536mb'}))
		VocaServer.app.use(express.urlencoded({limit: '65536mb', extended:true}))
		//VocaServer.app.use(cors)
		
		//eng.addSingleWordsToDb()
		VocaServer.app.get('/eng', (req:any, res:any)=>{
			const db =  eng.getDbObj()
			db.query(`SELECT * FROM ${eng.tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
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
			const db = jap.getDbObj()
			db.query(`SELECT * FROM ${jap.tableName}`, (error, results, fields)=>{//第二個被中括號包圍ᵗ參數即㕥代佔位符ˉ「?」
				
				//console.log('results:'+results)//RowDataPacket
				res.setHeader('content-type','text/html;charset=utf-8')
				res.end(JSON.stringify(results))//TypeError [ERR_INVALID_ARG_TYPE]: The "chunk" argument must be of type string or an instance of Buffer or Uint8Array. Rceived an instance of Array
				//console.log(results['600']['wordShape'])
				//return results//蜮不效
			})
		})
		
		VocaServer.app.get('/', (req:any, res:any)=>{
			console.log(req.ip)
			let path = req.path
			console.log('path:'+path)//t
			
			//eng.addSingleWordsToDb()
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile(__dirname+'/browser/Voca.html')
			//res.end('114514')
		})
		VocaServer.app.post('/post', (req:any, res:any)=>{
			console.log(req.body)
			VocaRaw.updateDb(req.body)
			//VocaRaw.updateDb(JSON.parse(req.body))
			const timeNow = moment().format(`YYYY.MM.DD-HH:mm:ss`)
			res.send('成功接收到数据'+timeNow)
		})
		
		VocaServer.app.listen(1919, ()=>{
			console.log('at\nhttp://127.0.0.1:1919')
		})
	}
	
}
VocaServer.main()

