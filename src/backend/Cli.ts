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
	const cli = await Cli.New()
	cli.main()
}
main()
