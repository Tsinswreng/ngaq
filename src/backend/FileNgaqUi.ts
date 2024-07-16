import 'tsconfig-paths/register'
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@backend/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';
import * as Le from '@shared/linkedEvent'
// import { ProcessEvents } from '@shared/logic/memorizeWord/Event';
import { FileNgaqSvc as FileNgaqSvc } from './logic/FileNgaqSvc';
import { SvcWord3 } from '@shared/entities/Word/SvcWord3';
import { Exception, Reason } from '@shared/error/Exception';
import chalk from 'chalk'
import util from 'util'
import * as fs from 'fs'
import { WordEvent } from '@shared/SingleWord2';

const fileSignal = process.argv[2]??''
const fileIn = process.argv[3]??''
const fileOut = process.argv[4]??''
if(fileSignal === '' || fileIn === '' || fileOut === ''){
	console.error(`fileSignal === '' || fileIn === '' || fileOut === ''`)
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
export class FileNgaqUi{

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
		z._svc = await FileNgaqSvc.New()
		z.svc.emitter.on(z.svc.events.error, (error)=>{
			z.handleErr(error)
		})
		z._initListeners()
		return z
	}

	readonly This = FileNgaqUi

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
	geneCandComment(mw:SvcWord3):string{
		const z = this
		let ans = mw.word.times_add + ':' + mw.word.times_rmb + ':' + mw.word.times_fgt
		if(mw.word.times_add>=3){
			ans = '*'+ans
		}
		ans = z.getFinalEventSymbol(mw)+ans
		return ans
	}

	getFinalEventSymbol(mw:SvcWord3){
		switch(mw.date__event.at(-1)?.event){
			case WordEvent.ADD:
				return '🤔'
			break;
			case WordEvent.RMB:
				return '✅'
			break;
			case WordEvent.FGT:
				return '❌'
		}
		throw new Error(`unexpected default`)
	}

	protected _initListeners(){
		const z = this
		const ev = z.svc.events
		z.svc.emitter.on(ev.save, (sws:SvcWord3[])=>{
			console.log(sws.map(e=>e.word.wordShape)) //t
		})
	}

	/** cli 之命令、直ᵈ輸入 成員方法ʹ名 */
	static get Cmd(){
		class Cmd{
			protected constructor(){}
			static new(cli:FileNgaqUi){
				const o = new this()
				o.ui = cli
				return o
			}
			ui:FileNgaqUi
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
				z.exput('load') // 覆蓋寫文件、防 上次異常退出後out文件中猶有舊詞
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
			async putWordsToLearn(args:string[]){
				const ui = this.ui
				const svc = this.ui.svc
				if(!svc.status.start){
					throw Exception.for(svc.errReasons.cant_learn_when_unstart)
				}
				const cnt = FileNgaqUi.argToIntAt(args, 1)??64
				// const ansWords = [] as MemorizeWord[]
				// for(let i = 0; i < cnt; i++){
				// 	const w = z.svc.wordsToLearn[i]
				// 	ansWords.push(w)
				// } 
				// z.exput(
				// 	JSON.stringify(ansWords)
				// )
				
				const delimiter = '\t'
				const sb = [] as string[]
				for(let i = 0; i < cnt && i < ui.svc.wordsToLearn.length; i++){
					const mw = ui.svc.wordsToLearn[i]
					sb.push(mw.word.wordShape)
					sb.push(delimiter)
					sb.push(ui.geneCandComment(mw))
					sb.push(delimiter)
					sb.push(JSON.stringify(mw.word.annotation))
					sb.push(',')
					sb.push(JSON.stringify(mw.word.mean[0]))
					if(i===cnt-1){break}
					sb.push('\n')
				}
				let ans = sb.join('')
				// for(let i = 0; i < cnt; i++){
				// 	const mw = ui.svc.wordsToLearn[i]
				// 	ans += mw.word.wordShape
				// 	ans += delimiter
				// 	ans += ui.geneCandComment(mw)
				// 	if(i===cnt-1){break}
				// 	ans += '\n'
				// }
				return ui.exput(ans)
			}
			async start(args:string[]){
				const z = this.ui
				z.exput('start')
				const bol = await z.svc.start()
				if(!bol){
					z.exput('start failed')
				}
				await this.putWordsToLearn(args)
				return true
			}

			discardChange(){
				const z = this.ui
				const ans = z.svc.discardChangeEtEnd()
				z.exput(ans+'')
			}
			// async learnByIndex(args:string[]){
			// 	const z = this.ui
			// 	const index = z.This.argToIntAt(args, 1)
				
			// 	if(index == void 0){
			// 		throw Exception.for(z.errReasons.bad_input)
			// 	}
			// 	const event = z.strToMemorizeEvent(args[2]??'')
			// 	if(event == void 0){
			// 		throw Exception.for(z.errReasons.bad_input, args)
			// 	}
			// 	z.svc.learnByIndex(index, event)
			// 	return true
			// }

			async learnByIndexOrUndo(args:string[]){
				const z = this.ui
				const index = z.This.argToIntAt(args, 1)
				
				if(index == void 0){
					throw Exception.for(z.errReasons.bad_input)
				}
				const event = z.strToMemorizeEvent(args[2]??'')
				if(event == void 0){
					throw Exception.for(z.errReasons.bad_input, args)
				}
				// const sword = z.svc.wordsToLearn[index]
				// if(sword.status.memorize == void 0){
				// 	const ok = z.svc.learnByIndex(index, event)
				// 	if(!ok){
				// 		z.svc.undo(sword)
				// 	}
				// }else{
				// 	z.svc.undo(sword)
				// }
				return z.svc.learnOrUndoByIndex(index, event)
				//return true
			}

			async save(){
				const z = this.ui
				const ans = await z.svc.saveOld()
				z.exput(ans+'')
				return ans
			}
			async restart(...args:string[]){
				const z = this.ui
				z.exput('restart')
				const es = await z.svc.restart()
				z.exput(es+'')
				return this.putWordsToLearn(args)
			}
			reloadWeightAlgo(){
				const z = this.ui
				return z.svc.reloadWeightAlgo()
			}
			

		}
		return Cmd
	}

	protected _cmd = this.This.Cmd.new(this)
	get cmd(){return this._cmd}

	protected _configInst = configInst
	get configInst(){return this._configInst}

	protected _svc: FileNgaqSvc
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
		const z = this
		const e = err as Error
		if(e instanceof Exception){
			console.error(e)
			console.error('Exception')
			z.exput(e.reason.name)
		}else{
			console.error(e)
			z.exput(e.message)
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
				console.log(cmd)
				z.exput(
					`!(cmd != void 0 && typeof cmd === 'function')`
				)
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
		z.svc.emitter.on(z.svc.events.error, (error)=>{
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
	static argToIntAt(args:string[], index:int){
		let ans:int|undefined
		if(args != void 0 && args[index] != void 0){
			let p = parseInt(args[index])
			ans = Number.isNaN(p)? void 0 : p
		}
		return ans
	}

}

async function main(){
	console.log(process.argv)//t
	const ui = await FileNgaqUi.New()
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
				await ui.exec(imput)
			} catch (error) {
				const err = error as Error
				const text = err.name+'\n'+err.message+'\n'+err.stack
				ui.exput(text)
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
// esno "D:\_code\voca\src\backend\FileNgaqUi.ts" "D:\Program Files\Rime\User_Data\voca\signal" "D:\Program Files\Rime\User_Data\voca\in" "D:\Program Files\Rime\User_Data\voca\out"
// 