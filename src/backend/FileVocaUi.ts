import 'tsconfig-paths/register'
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@shared/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';
import * as Le from '@shared/linkedEvent'
// import { ProcessEvents } from '@shared/logic/memorizeWord/Event';
import { FileVocaSvc as FileVocaSvc } from './logic/FileVocaSvc';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';
import { Exception, Reason } from '@shared/Exception';
import chalk from 'chalk'
import util from 'util'
import * as fs from 'fs'
import { WordEvent } from '@shared/SingleWord2';

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

const RN = Reason.new.bind(Reason)
class UiErrReasons{
	no_such_word = RN('no_such_word')
	bad_input = RN<string[][]>('bad_input')
}


/** 表示層 */
export class FileVocaUi{

	protected constructor(){

	}

	//static helpPrompt = helpPrompt
	
	static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		z._svc = await FileVocaSvc.New()
		z.svc.emitter.on(z.svc.svcEvents.error, (error)=>{
			z.handleErr(error)
		})
		return z
	}

	readonly This = FileVocaUi

	protected _errReasons = new UiErrReasons()
	get errReasons(){return this._errReasons}

	strToMemorizeEvent(str:string){
		const z = this
		if(str === 'r'){
			return WordEvent.RMB
		}else if(str === 'f'){
			return WordEvent.FGT
		}else{
			
		}
	}

	/**
	 * 生成rime候選詞ʹcomment
	 * @param mw 
	 */
	geneCandComment(mw:MemorizeWord):string{
		let ans = mw.word.times_add + ':' + mw.word.times_rmb + ':' + mw.word.times_fgt
		if(mw.word.times_add>=3){
			ans = '*'+ans
		}
		return ans
	}

	/** cli 之命令、直ᵈ輸入 成員方法ʹ名 */
	static get Cmd(){
		class Cmd{
			protected constructor(){}
			static new(cli:FileVocaUi){
				const o = new this()
				o.ui = cli
				return o
			}
			ui:FileVocaUi
			echoConfig(){
				const z = this.ui
				z.exput(
					util.inspect(z.configInst.config, true, 32)
				)
			}
			reloadConfig(){
				const z = this.ui
				z._configInst.reload()
			}
			wordCnt(){
				const z = this.ui
				z.exput(z.svc.wordsToLearn.length+'')
			}
			help(){
				const z = this.ui
				const fns = Object.keys(this)
				z.exput(JSON.stringify(fns))//TOFIX
				
			}
			async load(){
				const z = this.ui
				const es = await z.svc.load()
				return es
			}
			async sort(){
				const z = this.ui
				const es = await z.svc.sort()
				return es
			}
			async prepare(){
				const c = this
				await c.load()
				await c.sort()
				return true
			}
			async start(args:string[]){
				const z = this.ui
				const bol = await z.svc.start()
				if(!bol){
					z.exput('start failed')
				}
				const cnt = FileVocaUi.argToIntAt(args, 1)??64
				// const ansWords = [] as MemorizeWord[]
				// for(let i = 0; i < cnt; i++){
				// 	const w = z.svc.wordsToLearn[i]
				// 	ansWords.push(w)
				// }
				// z.exput(
				// 	JSON.stringify(ansWords)
				// )
				
				let tab = '\t\t'
				const delimiter = '\t'
				let ans = ''
				for(let i = 0; i < cnt; i++){
					const mw = z.svc.wordsToLearn[i]
					ans += mw.word.wordShape
					ans += delimiter
					ans += z.geneCandComment(mw)
					if(i===cnt-1){break}
					ans += '\n'
				}
				z.exput(ans)
			}

			async learnByIndex(args:string[]){
				const z = this.ui
				const index = z.This.argToIntAt(args, 1)
				
				if(index == void 0){
					throw Exception.for(z.errReasons.bad_input)
				}
				const event = z.strToMemorizeEvent(args[2]??'')
				if(event == void 0){
					throw Exception.for(z.errReasons.bad_input, args)
				}
				z.svc.learnByIndex(index, event)
				return true
			}

			async save(){
				const z = this.ui
				const ans = await z.svc.save()
				z.exput(ans+'')
				return ans
			}
			async restart(){
				const z = this.ui
				const es = await z.svc.restart()
			}

		}
		return Cmd
	}

	protected _cmd = this.This.Cmd.new(this)
	get cmd(){return this._cmd}

	protected _configInst = configInst
	get configInst(){return this._configInst}

	protected _svc: FileVocaSvc
	get svc(){return this._svc}


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
				await cmd(segs)
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
		z.svc.emitter.on(z.svc.svcEvents.error, (error)=>{
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
	const cli = await FileVocaUi.New()
	// 監視文件變化
	//const testFile = `D:/_code/voca/out/test.txt`
	let watcher: fs.FSWatcher
	// fs.open(fileIn, 'r', (err,fd)=>{
	// 	if(err){
	// 		console.error(err)
	// 		return
	// 	}
	watcher = fs.watch(fileSignal, async(eventType, filename) => {
		if (eventType === 'change') {
			const imput = fs.readFileSync(fileIn, {encoding:'utf-8'})
			//cli.exput(imput)
			console.log(imput)//t
			try {
				await cli.exec(imput)
			} catch (error) {
				const err = error as Error
				const text = err.name+'\n'+err.message+'\n'+err.stack
				cli.exput(text)
			}
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
// esno "D:\_code\voca\src\backend\FileVocaUi.ts" "D:\Program Files\Rime\User_Data\voca\signal" "D:\Program Files\Rime\User_Data\voca\in" "D:\Program Files\Rime\User_Data\voca\out"