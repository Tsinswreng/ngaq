import 'tsconfig-paths/register'
import { Abs_MemorizeLogic } from "@shared/logic/memorizeWord/MemorizeWordLogic";
import Sqlite from "@backend/db/Sqlite";
import Config from '@shared/Config';
import { WordTable } from "@backend/db/sqlite/Word/Table";
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import { I_EventEmitter } from '@shared/linkedEvent';
import EventEmitter3 from 'eventemitter3';
import * as Le from '@shared/linkedEvent'
import { WordDbSrc } from '@backend/db/sqlite/Word/DbSrc';
import { WordDbRow } from '@shared/dbRow/Word';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';
import { Exception } from '@shared/Exception';
import * as fs from 'fs'
import { WeightCodeParser } from '@shared/WordWeight/Parser/WeightCodeParser';
import { I_WordWeight } from '@shared/interfaces/I_WordWeight';
import { $ } from '@shared/Ut';

const configInst = Config.getInstance()
const config = configInst.config



/** 業務理則層 */
export class CliMemorize extends Abs_MemorizeLogic{
	override readonly This = CliMemorize
	protected constructor(){
		super()
	}

	static override async New(){
		const o = new this()
		await o.__Init__()
		return o
	}

	protected override async __Init__(): Promise<void> {
		const o = this
		await super.__Init__()
		o._dbSrc = await WordDbSrc.New({
			_dbPath: config.dbPath
		})
		o.addListeners()
	}

	protected _configInst = configInst
	get configInst(){return this._configInst}

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}

	protected _dbSrc:WordDbSrc
	get dbSrc(){return this._dbSrc}

	protected _weightCodeParser:WeightCodeParser|undefined
	get weightCodeParser(){return this._weightCodeParser}

	//TODO 潙空旹 用 默認算法
	protected _weightAlgo: I_WordWeight|undefined
	get weightAlgo(){return this._weightAlgo}

	emitErr(err?){
		const z = this
		z.emitter.emit(z.This.events.error,err)
	}

/* 	addListener_testError(){
		const z = this
		z.emitter.on(Le.Event.new('testError'), z.testError.bind(z))
	}

	async testError(){
		const z = this
		try {
			throw new Error('test')
		} catch (error) {
			z.emitter.emit(z.This.events.error, error)
		}
	} */
	exput(v){
		console.log(v)
	}

	

	/**
	 * 試、只取配置中首個權重算法方案
	 */
	initWeightAlgo(){
		const z = this
		const first = z._configInst.config.wordWeight.schemas[0]
		let code:string
		if(first == void 0){
			throw new Error(`config.wordWeight.schemas[0] == void 0`)
		}
		if(first.code == void 0){
			if(first.path == void 0){
				throw new Error(`code and path are all empty`)
			}
			const srcCode = fs.readFileSync(first.path, {encoding: 'utf-8'})
			code = srcCode
		}else{
			code = first.code
		}
		const weiPar = WeightCodeParser.new(code)
		z._weightCodeParser = weiPar
		try {
			z._weightAlgo = $(weiPar.parse())()
			return z._weightAlgo
		} catch (error) {
			//console.error(weiPar.jsCode)
			//console.error(error)
			const err = error as Error
			err.message = weiPar.jsCode +'\n\n'+ err.message
			throw err
		}
		
	}

	async on_load(params:string[]) {
		const z = this
		// z.exput('on_load')
		// z.exput(`z.exput(params)`)
		// z.exput(params)
		async function oneTbl(tblName:string){
			const tbl = z.dbSrc.loadTable(tblName)
			const rows = await tbl.selectAll()
			const words = rows.map(e=>WordDbRow.toEntity(e))
			const mWords = words.map(e=>MemorizeWord.new(e))
			return mWords
		}
		try {
			const tblNames = z.configInst.config.tables
			const mWords = [] as MemorizeWord[]
			for(const tblN of tblNames){
				if(tblN == void 0 || tblN.length === 0){continue}
				const um = await oneTbl(tblN)
				mWords.push(...um)
			}
			//z._wordsToLearn.length = 0
			z._wordsToLearn.push(...mWords)
			z._status.load = true
			z.exput(`load done`)
		} catch (error) {
			z.emitErr(error)
		}
		
	}
	async on_calcWeight() {
		const z = this
		z.exput(`on_calcWeight`)
		const outErr = new Error()
		try {
			if(!z._status.load){
				throw Exception.for(errR.didnt_load)
			}
			z.initWeightAlgo()
			z._wordsToLearn = await $(z.weightAlgo).run(z.wordsToLearn)
			z._status.calcWeight = true
			z.exput(`calcWeight done`)
		} catch (error) {
			const err = error as Error
			const jsCode = z.weightCodeParser?.jsCode??''
			err.message = '\n' + jsCode + err.message
			err.stack += '\n\n' + outErr.stack +'\n\n'
			z.emitErr(err)
		}
		
	}

	/** @deprecated */
	// on_sort() {
	// 	const z = this
	// 	z.exput('sort')
	// 	try {
	// 		z._status.sort = true
	// 	} catch (error) {
			
	// 	}
		
	// }
	on_start(param:string[]) {
		const z = this
		z._status.start = true
		z.exput('start')
	}
	on_save() {
		const z = this
		z.exput(`save`)
		z._status.save = true
		z._status.start = false
		z.exput(`save done`)
	}
	on_restart() {
		
	}
}
const errR = CliMemorize.errReasons