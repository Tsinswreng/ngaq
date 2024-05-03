import 'tsconfig-paths/register'
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@shared/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';
import * as Le from '@shared/linkedEvent'
import { ProcessEvents } from '@shared/logic/memorizeWord/Event';
import { CliMemorize } from './logic/CliMemorize';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';
import { Exception } from '@shared/Exception';
import chalk from 'chalk'
import util from 'util'
import * as fs from 'fs'

const fileSignal = process.argv[2]??''
const fileIn = process.argv[3]??''
const fileOut = process.argv[4]??''
if(fileSignal === '' || fileIn === '' || fileOut == ''){
	console.error(`fileSignal === '' || fileIn === '' || fileOut == ''`)
	console.log(`example:\nnode xxx.js "fileSignal.txt" "fileIn.txt" "fileOut.txt"`)
	process.exit(-1)
}




// const pipeTest = 'C:/Users/lenovo/Desktop/mypipe'
// fs.open(pipeTest, 'r', (err,fd)=>{
// 	if (err) {
// 		if (err.code === 'ENOENT') {
// 			console.error('Pipe does not exist');
// 			return;
// 		}
// 		throw err;
// 	}

// 	const buffer = Buffer.alloc(1024);
// 	fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead, buffer) => {
// 		if (err) throw err;
// 		console.log('Received data:', buffer.slice(0, bytesRead).toString());
// 	});
// })

const configInst = Config.getInstance()
const config = configInst.config

const helpPrompt = 
`
echoConfig
reloadConfig
wordCnt

load
start
calcWeight
help
`

/** 表示層 */
export class Cli{

	protected constructor(){

	}

	static helpPrompt = helpPrompt
	
	static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		z._cliMemorize = await CliMemorize.New()
		z.cliMemorize.emitter.on(z.cliMemorize.events.error, (error)=>{
			z.handleErr(error)
		})
		return z
	}

	readonly This = Cli

	/** cli 之命令、直ᵈ輸入 成員方法ʹ名 */
	static get Cmd(){
		class Cmd{
			protected constructor(){}
			static new(cli:Cli){
				const o = new this()
				o.cli = cli
				return o
			}
			cli:Cli
			echoConfig(){
				const z = this.cli
				z.exput(
					util.inspect(z.configInst.config, true, 32)
				)
			}
			reloadConfig(){
				const z = this.cli
				z._configInst.reload()
			}
			wordCnt(){
				const z = this.cli
				z.exput(z.cliMemorize.wordsToLearn.length+'')
			}
			help(){
				const z = this.cli
				z.exput(z.This.helpPrompt)
			}
			async load(){
				const z = this.cli
				const es = await z.cliMemorize.load()
			}
			async sort(){
				const z = this.cli
				const es = await z.cliMemorize.sort()
			}
			async start(args:string[]){
				const z = this.cli
				const bol = await z.cliMemorize.start()
				if(!bol){
					z.exput('start failed')
				}
				const cnt = Cli.argToIntAt(args, 1)??10
				let tab = '\t\t'
				for(let i = 0; i < cnt; i++){
					const mw = z.cliMemorize.wordsToLearn[i]
					z.exput(
						i
						+tab+mw.word.wordShape
						+tab+mw.weight
					)
				}
			}
			async restart(){
				const z = this.cli
				const es = await z.cliMemorize.restart()
			}
		}
		return Cmd
	}

	protected _cmd = this.This.Cmd.new(this)
	get cmd(){return this._cmd}

	protected _configInst = configInst
	get configInst(){return this._configInst}

	protected _cliMemorize: CliMemorize
	get cliMemorize(){return this._cliMemorize}


	protected _delimiter = ','
	get delimiter(){return this._delimiter}
	

	initCmd(){
		const z = this
	}


	async exput(v:string){
		const z = this
		console.log(v)
		fs.promises.writeFile(fileOut, v).then()
	}

	handleErr(err){
		console.error(`handleErr`)//t
		const e = err as Error
		if(e instanceof Exception){
			console.error(e)
			console.error('Exception')
		}else{
			console.error(e)
		}
	}

	async exec(imput:string){
		const z = this
		//console.log(process.argv) //t
		const segs = imput.split(z.delimiter)
		const cmdName = segs[0]
		let cmd = z.cmd[cmdName]
		try {
			if(cmd != void 0 && typeof cmd === 'function'){
				cmd = cmd.bind(z.cmd)
				cmd(segs)
			}else{
				z.exput('-1')
			}
		} catch (error) {
			z.handleErr(error)
		}
		
	}

	/** command line */
	async main_deprecated(){
		const z = this
		console.log(process.argv)
		let rl = createInterface()
		const question = question_fn(rl, '')
		z.cliMemorize.emitter.on(z.cliMemorize.events.error, (error)=>{
			z.handleErr(error)
		})
		for(let i = 0; ; i++){
			try {
				let imput = await question('')
				const segs = imput.split(z.delimiter)
				const cmdName = segs[0]
				let cmd = z.cmd[cmdName]
				if(cmd != void 0 && typeof cmd === 'function'){
					cmd = cmd.bind(z.cmd)
					cmd(segs)
					continue
				}else{
					z.exput('illegal input')
				}
				
			} catch (error) {
				z.handleErr(error)
			}
		}
	}

	/**
	 * index處ʹ參數ˇ轉整數
	 * @args args 
	 * @param index 
	 * @returns 
	 */
	static argToIntAt(args:string[], index:integer){
		let ans:integer|undefined
		if(args != void 0 && args[index] != void 0){
			let p = parseInt(args[index])
			ans = Number.isNaN(p)? void 0 : p
		}
		return ans
	}

}

async function main(){
	console.log(process.argv)//t
	const cli = await Cli.New()
	// 監視文件變化
	//const testFile = `D:/_code/voca/out/test.txt`
	let watcher: fs.FSWatcher
	// fs.open(fileIn, 'r', (err,fd)=>{
	// 	if(err){
	// 		console.error(err)
	// 		return
	// 	}
	watcher = fs.watch(fileSignal, (eventType, filename) => {
		if (eventType === 'change') {
			const imput = fs.readFileSync(fileIn, {encoding:'utf-8'})
			//cli.exput(imput)
			console.log(imput)//t
			cli.exec(imput)
			//
			// fs.readFile(fileIn, {encoding:'utf-8'}, (err, imput)=>{
			// 	if(err != void 0){
			// 		console.error(err)
			// 		return
			// 	}
			// 	console.log(imput)//t
			// 	//cli.exput(imput)
			// })
		}
	});
	// })
	// if(watcher! != void 0){
	watcher.on('error', (error) => {
		console.error('Error occurred while watching file:', error);
	});
	// }
	// 監聽錯誤
	
	//cli.main_deprecated()
}
main()

/* 
esno "D:\_code\voca\src\backend\Cli.ts" "filesignal" "filein" "fileout"
*/
