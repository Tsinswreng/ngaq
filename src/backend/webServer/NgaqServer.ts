import Tempus from '@shared/Tempus'
import express from 'express'
import bodyParser from "body-parser";
import { SqliteDb } from '../sqlite/Sqlite';
import { NgaqDbSrc } from '../db/sqlite/ngaq/NgaqDbSrc';
import { NgaqCtrl } from './ctrl/NgaqCtrl';
import { UserCtrl } from './ctrl/UserCtrl';
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import Config from '@backend/Config';

dotenv.config()
Config.readOuterConfig(process.env['CONFIG_PATH'] as str)
const configJsStr = fs.readFileSync(
	process.env['CONFIG_PATH'] as str
	, {encoding:'utf-8'}
)
const configInst = Config.getInstance()
const config = configInst.config
class Opt{
	_port:int = 6324
	
}



const cwd = process.cwd()

class Server{
	static new(opt:Opt){
		const z = new this()
		z.__init__(opt)
		return z
	}

	protected __init__(...args:Parameters<typeof Server.new>){
		const z = this
		Object.assign(z, ...args)
		return z
	}

	protected _app = express()
	get app(){return this._app}

	protected _port = 6324
	get port(){return this._port}


	initUse(){
		const z = this
		//const VocaServer = z
		z.app.use((req:any, res:any, next:any)=>{
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "*");
			res.header("Access-Control-Allow-Headers", "*");
			// 处理预检请求
			if (req.method === 'OPTIONS') {
				res.sendStatus(200); // 直接返回 HTTP 200 状态
				return
			}
			next()
		})
		z.app.use(bodyParser.json({limit:'64MB'}))
		z.app.use(express.static('./out/frontend/dist')); //會攔截請求
	}

	initRoutes(){
		const z = this

		z.app.get('/tempus',(req,res)=>{
			const tem = Tempus.new()
			res.send(Tempus.toISO8601(tem))
		})


		// z.app.get('/allJoinedRows', async(req,res)=>{
		// 	const rows = await mod.dbSrc.GetAllJoinedRow()
		// 	res.json(rows)
		// })
		
		z.app.use('/api/user', UserCtrl.inst.router)
		z.app.use('/api/ngaq', NgaqCtrl.inst.router)


		// 在末
		z.app.get('*', (req, res)=>{
			console.log(`*`)
			try {
				res.setHeader('content-type','text;charset=utf-8')
				res.sendFile(cwd+'/out/frontend/dist/index.html')
			} catch (err) {
				console.error(err)
				console.error(`*`)
			}
		})


		// z.app.use((req,res,next)=>{
		// 	res.status(404).send('<h1>404 mitukerarenai</h1>')
		// })
	}

	async start(){
		const z = this
		z.initUse()
		z.initRoutes()
		z.app.listen(z.port, ()=>{
			console.log(z.port)
		})
	}
}

export function main(){
	process.on('uncaughtException', (err) => {
		console.error('Global uncaught exception handler:', err);
		//main()
	});
	
	process.on('unhandledRejection', (reason, promise) => {
		console.error('Global unhandled rejection handler:', reason);
	});
	
	try {
		const server = Server.new({_port:config.ngaq.server.port})
		server.start()
	} catch (err) {
		console.error(err)
		console.error(`Uncaught Error`)
	}

}


/* 
// app.ts

import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/