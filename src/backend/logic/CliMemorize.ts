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

const configInst = Config.getInstance()
const config = configInst.config



/** 業務理則層 */
export class CliMemorize extends Abs_MemorizeLogic{
	override readonly This = CliMemorize
	protected constructor(){
		super()
	}

	static override async New(){
		// const f = await Abs_MemorizeLogic.New()
		// const c = new this()
		// const o = inherit(c,f)
		const o = new this()
		return o
	}

	protected override async __init__(): Promise<void> {
		const o = this
		await super.__init__()
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

	async on_load() {
		const z = this
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
		} catch (error) {
			z.emitErr(error)
		}
		
	}
	on_calcWeight() {
		const z = this
		try {
			if(!z._status.load){
				throw Exception.for(errR.didnt_load)
			}

			for(let i = 0; i < z.wordsToLearn.length; i++){
				const u = z.wordsToLearn[i]
				u.weight = 0
				u.word.table
				
			}

			z._status.calcWeight = true
		} catch (error) {
			z.emitErr(error)
		}
		
	}
	on_sort() {
		const z = this
		try {
			z._status.sort = true
		} catch (error) {
			
		}
		
	}
	on_start() {
		const z = this
		z._status.start = true
	}
	on_save() {
		const z = this
		z._status.save = true
		z._status.start = false
	}
	on_restart() {
		
	}
}
const errR = CliMemorize.errReasons