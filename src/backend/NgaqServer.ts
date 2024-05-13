import express from 'express'

class Opt{
	_port:int = 6324
}

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

	initRoutes(){
		const z = this
		z.app.get('/', (req, res)=>{
			res.setHeader('content-type','text;charset=utf-8')
			res.sendFile('./out/frontend/dist/index.html')
		})
		z.app.use((req,res,next)=>{
			res.status(404).send('<h1>404 mitukerarenai</h1>')
		})
	}

	async start(){
		const z = this
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