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

const configInst = Config.getInstance()
const config = configInst.config

export class Cli{

	protected _wordsToLearn: Word[]
	get wordsToLearn(){return this._wordsToLearn}

	protected _wordDbSrc:WordDbSrc
	get wordDbSrc(){return this._wordDbSrc}

	protected constructor(){

	}
	
	static async New(){
		const o = new this()
		o._cliMemorize = await CliMemorize.New()
		o.initEvents()
		return o
	}

	protected _cliMemorize: CliMemorize
	get cliMemorize(){return this._cliMemorize}

	//str__fn = new Map<string, Function>()
	str__event = new Map<string, Le.Event>()

	initEvents(){
		const z = this
		//z.str__fn.set
		const es = z.cliMemorize.This.events
		z.str__event = new Map([
			['load', es.load]
			,['start', es.start]
		])
		
	}

	async init(){
		const z = this
		z._wordDbSrc = await WordDbSrc.New({
			_dbPath: config.dbPath
		})
	}

	exput(v?){
		console.log(v)
	}

	async main(){
		const z = this
		console.log(process.argv)
		let rl = createInterface()
		const question = question_fn(rl, '')
		z.cliMemorize.emitter.eventEmitter.on('error',(error)=>{
			z.exput(error)
		})
		for(let i = 0; ; i++){
			//TODO 每次輸te、輸出之Error之量都加一
			try {
				let imput = await question('')
				if(imput === 'pr'){
					z.exput(
`${z.cliMemorize.wordsToLearn.length}個單詞`
					)
					continue
				}
				if(imput === 'te'){
					z.cliMemorize.addListener_testError()
					z.cliMemorize.emitter.eventEmitter.emit('testError')
					continue
				}
				const event = z.str__event.get(imput)
				if(event == void 0){
					z.exput('illegal input')
					continue
				}
				z.cliMemorize.emitter.emit(event)
			} catch (error) {
				z.exput(error)
			}
		}
	}

	async main_old(){
		const z = this
		console.log(
			process.argv
		)
		let rl = createInterface()
		const question = question_fn(rl, '')
		
		for(let i = 0;;i++){
			try {
				let str = await question('')
				z.exput(str)
				if(str === 'loadEng'){
					const engTbl = z.wordDbSrc.loadTable('english')
					const ans = await engTbl.selectAll()
					ans.map(e=>{z.exput(e)})
					//z.exput(ans)
				}
				if(str == 'err'){
					const engTbl = z.wordDbSrc.loadTable('english00')
					// engTbl.selectAll().then((d)=>{
					
					// }).catch((e)=>{
					// 	//throw e
					// 	console.error(e)
					// })
					await engTbl.selectAll()
				}
			} catch (error) {
				console.error(error)
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