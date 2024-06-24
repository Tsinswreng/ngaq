import Tempus from '@shared/Tempus'
import express from 'express'
import bodyParser from "body-parser";

import { SqliteDb } from './sqlite/Sqlite';
import { NgaqDbSrc } from './ngaq3/NgaqDbSrc';
class Opt{
	_port:int = 6324
	
}

class ModOpt{
	dbPath = './ngaq.sqlite'
}
const modOpt = new ModOpt()
class Mod{
	db = SqliteDb.fromPath(modOpt.dbPath)
	dbSrc = NgaqDbSrc.new(this.db)
}
const mod = new Mod()

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
			next()
		})
		z.app.use(express.static('./out/frontend/dist'));
		z.app.use(bodyParser.json({limit:'64MB'}))
	}

	initRoutes(){
		const z = this
		z.app.get('/unixMills',(req,res)=>{
			const tem = Tempus.new()
			res.send(Tempus.toISO8601(tem))
		})
		z.app.get('/allJoinedRows', async(req,res)=>{
			const rows = await mod.dbSrc.getAllJoinedRow()
			res.json(rows)
		})
		z.app.get('*', (req, res)=>{
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile(cwd+'/out/frontend/dist/index.html')
		})
		z.app.use((req,res,next)=>{
			res.status(404).send('<h1>404 mitukerarenai</h1>')
		})
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
	const server = Server.new({_port:6324})
	server.start()
}
main()

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