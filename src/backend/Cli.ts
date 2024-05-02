import 'tsconfig-paths/register'
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import {WordDbSrc} from './db/sqlite/Word/DbSrc';
import { Word } from '@shared/entities/Word/Word';
import Config from '@shared/Config';
import { WordTable } from './db/sqlite/Word/Table';
import Sqlite from './db/Sqlite';
import * as Le from '@shared/linkedEvent'
import { MemorizeEvents } from '@shared/logic/memorizeWord/Event';
import { CliMemorize } from './logic/CliMemorize';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';
import { Exception } from '@shared/Exception';
import chalk from 'chalk'
import util from 'util'
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
		const o = new this()
		o._cliMemorize = await CliMemorize.New()
		//o.initEvents()
		return o
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
				z.exput(z.cliMemorize.wordsToLearn.length)
			}
			help(){
				const z = this.cli
				z.exput(z.This.helpPrompt)
			}
			load(){
				const z = this.cli
				const es = z.cliMemorize.This.events
				z.cliMemorize.emitter.emit(es.load)
			}
			calc(){
				const z = this.cli
				const es = z.cliMemorize.This.events
				z.cliMemorize.emitter.emit(es.calcWeight)
			}
			start(){
				const z = this.cli
				const es = z.cliMemorize.This.events
				z.cliMemorize.emitter.emit(es.start)
			}
			restart(){
				const z = this.cli
				const es = z.cliMemorize.This.events
				z.cliMemorize.emitter.emit(es.restart)
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

	//str__fn = new Map<string, Function>()
	//str__event = new Map<string, Le.Event>()

	//str__fn = new Map<string, Function>()

	protected _delimiter = ','
	get delimiter(){return this._delimiter}
	
	// /**
	//  * 亦可作潙命令
	//  */
	// initEvents(){
	// 	const z = this
	// 	//z.str__fn.set
	// 	const es = z.cliMemorize.This.events
	// 	z.str__event = new Map([
	// 		['load', es.load]
	// 		,['start', es.start]
	// 		,['calcWeight', es.calcWeight]
	// 		,['sort', es.sort]
	// 		//,['start']
	// 	])
	// }

	initCmd(){
		const z = this
	}


	exput(v?){
		console.log(v)
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

	async main(){
		const z = this
		console.log(process.argv)
		let rl = createInterface()
		const question = question_fn(rl, '')
		z.cliMemorize.emitter.on(z.cliMemorize.This.events.error, (error)=>{
			console.error(`on Error`)//t
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
				// const event = z.str__event.get(cmdName)
				// if(event == void 0){
				// 	z.exput('illegal input')
				// 	continue
				// }
				// z.cliMemorize.emitter.emit(event, segs)
			} catch (error) {
				z.handleErr(error)
			}
		}
	}
}

async function main(){
	const cli = await Cli.New()
	cli.main()
}
main()


/* 
"d:\_code\voca\src\backend\Cli.ts"
"d:\_code\voca\out\backend\Cli.js"
*/