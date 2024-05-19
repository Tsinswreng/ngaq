import 'tsconfig-paths/register'
import { NgaqSvc as NgaqSvc } from "@shared/logic/memorizeWord/NgaqSvc";
import Config from '@shared/Config';
import { WordTable } from "@backend/db/sqlite/Word/Table";
//import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import EventEmitter3 from 'eventemitter3';
import * as Le from '@shared/linkedEvent'
import { WordDbSrc } from '@backend/db/sqlite/Word/DbSrc';
import { WordDbRow } from '@shared/dbRow/Word';
import { SvcWord, RMB_FGT } from '@shared/entities/Word/SvcWord';
import { Exception, Reason } from '@shared/Exception';
import * as fs from 'fs' //TODO remove
import { WeightCodeProcessor } from '@shared/WordWeight/Parser/WeightCodeProcessor';
import { I_WordWeight } from '@shared/interfaces/I_WordWeight';
import { $ } from '@shared/Ut';
import { WordEvent } from '@shared/SingleWord2';
import { RMB_FGT_nil } from '@shared/entities/Word/SvcWord';
import { Word } from '@shared/entities/Word/Word';

const configInst = Config.getInstance()
const config = configInst.config




// let emt3 = new EventEmitter3()
// emt3.emit<>('')

/** 業務理則層 */
export class FileNgaqSvc extends NgaqSvc{

	readonly This = FileNgaqSvc
	protected constructor(){
		super()
	}

	static async New(){
		const o = new this()
		await o.__Init__()
		return o
	}

	protected async __Init__(){
		const z = this
		await super.__Init__()
		z._dbSrc = await WordDbSrc.New({
			_dbPath: config.dbPath
		})
		return z
		//o.addListeners()
	}

	/** 全局配置實例 */
	protected _configInst = configInst
	get configInst(){return this._configInst}

	/** 背單詞ʹ程ʸʹ事件、如蔿一單詞添加憶抑忘ˡ事件,撤銷 等 */
	//protected _svcEvents = new SvcEvent()
	//get svcEvents(){return this._svcEvents}

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}

	protected _dbSrc:WordDbSrc
	get dbSrc(){return this._dbSrc}

	protected _weightCodeParser:WeightCodeProcessor|undefined
	get weightCodeParser(){return this._weightCodeParser}


	protected async _loadWeightAlgo(): Promise<I_WordWeight> {
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
		const weiPar = WeightCodeProcessor.new(code)
		z._weightCodeParser = weiPar
		try {
			z._weightAlgo = $(weiPar.parse())()
			return z._weightAlgo
		} catch (error) {
			const err = error as Error
			err.message = weiPar.jsCode +'\n\n'+ err.message
			throw err
		}
		
	}



	/**
	 * 試、只取配置中首個權重算法方案
	 */
	// initWeightAlgo(){
		
	// }



	// async _load() {
	// 	const z = this
	// 	async function oneTbl(tblName:string){
	// 		const tbl = z.dbSrc.loadTable(tblName)
	// 		const rows = await tbl.selectAllWithTblName()
	// 		const words = rows.map(e=>WordDbRow.toEntity(e))
	// 		const mWords = words.map(e=>SvcWord.new(e))
	// 		return mWords
	// 	}
	// 	try {
	// 		const tblNames = z.configInst.config.tables
	// 		const mWords = [] as SvcWord[]
	// 		for(const tblN of tblNames){
	// 			if(tblN == void 0 || tblN.length === 0){continue}
	// 			const um = await oneTbl(tblN)
	// 			mWords.push(...um)
	// 		}
	// 		z._wordsToLearn.length = 0
	// 		z._wordsToLearn.push(...mWords)
	// 		z._svcStatus.load = true
	// 		return true
	// 	} catch (error) {
	// 		z.emitErr(error)
	// 	}
	// 	return false
	// }

	protected async _load(){
		const z = this
		async function oneTbl(tblName:string){
			const tbl = z.dbSrc.loadTable(tblName)
			const rows = await tbl.selectAllWithTblName()
			const words = rows.map(e=>WordDbRow.toEntity(e))
			const mWords = words.map(e=>SvcWord.new(e))
			return mWords
		}
		const tblNames = z.configInst.config.tables
		const mWords = [] as SvcWord[]
		for(const tblN of tblNames){
			if(tblN == void 0 || tblN.length === 0){continue}
			const um = await oneTbl(tblN)
			mWords.push(...um)
		}
		z._wordsToLearn.length = 0
		z._wordsToLearn.push(...mWords)
		return true
		// try {

		// } catch (error) {
		// 	z.emitErr(error)
		// }
		// return false
	}

	protected async _sortWords(svcWords: SvcWord[]){
		const z = this
		const outErr = new Error()
		try {
			// if(!z._svcStatus.load){
			// 	throw Exception.for(z.svcErrReasons.didnt_load)
			// }
			z.initWeightAlgo()
			const ans = await $(z.weightAlgo).run(svcWords)
			// z._svcStatus.sort = true
			return ans
		} catch (error) {
			const err = error as Error
			const jsCode = z.weightCodeParser?.jsCode??''
			err.message = '\n' + jsCode + err.message
			err.stack += '\n\n' + outErr.stack +'\n\n'
			z.emitErr(err)
			throw err
		}
	}

	// protected async _sort() {
	// 	const z = this
	// 	const outErr = new Error()
	// 	try {
	// 		if(!z._svcStatus.load){
	// 			throw Exception.for(z.svcErrReasons.didnt_load)
	// 		}
	// 		// z.initWeightAlgo()
	// 		// z._wordsToLearn = await $(z.weightAlgo).run(z.wordsToLearn)
	// 		z._sortWords(z.wordsToLearn)
	// 		z._svcStatus.sort = true
	// 		return true
	// 	} catch (error) {
	// 		const err = error as Error
	// 		// const jsCode = z.weightCodeParser?.jsCode??''
	// 		// err.message = '\n' + jsCode + err.message
	// 		err.stack += '\n\n' + outErr.stack +'\n\n'
	// 		z.emitErr(err)
	// 		throw err
	// 	}
	// 	return false
	// }

	protected override _resort(): Promise<boolean> {
		const z = this
		return z.sort()
	}

	protected async _start(){
		return true
	}

	start(): Promise<boolean> {
		return super.start()
	}



	/** @deprecated */
	learnByMWord(mword:SvcWord, event:RMB_FGT){
		const z = this
		const ans = mword.setInitEvent(event)
		if(ans){
			z.emitter.emit(z.events.learnBySvcWord, mword, event)
		}
		return Promise.resolve(ans)
	}

	// learnByIndex(index:integer, event:RMB_FGT){
	// 	const z = this
	// 	if(index +1 > z.wordsToLearn.length){
	// 		return Promise.resolve(false)
	// 	}
	// 	const ans = z.wordsToLearn[index].setInitEvent(event)
	// 	if(ans){
	// 		z.emitter.emit(z.svcEvents.learnByIndex, index, z.wordsToLearn[index], event)
	// 	}
	// 	return Promise.resolve(ans)
	// }


	// async save(){
	// 	const z = this
	// 	z._svcStatus.start = false
	// 	//merge all //TODO 没背ʹ詞ˇ不用merge
	// 	for(let i = 0; i < z.wordsToLearn.length; i++){
	// 		z.wordsToLearn[i].merge()
	// 	}
	// 	const words = z.wordsToLearn.map(e=>e.word)
	// 	//const fn = await z.dbSrc.addWordsOfSameTable(words)
	// 	const ans = await z.dbSrc.saveWords(words)
	// 	z.emitter.emit(z.svcEvents.save, ans)
	// 	z._svcStatus.save = true
	// 	return true
	// }

	protected override async _save(words:Word[]){
		//console.log('file save')//t + 
		// console.log(`console.log(words)`)
		// console.log(words) //+
		const z = this
		const ans = await z.dbSrc.saveWords(words)
		return ans
	}

	async save(){
		return super.save()
	}

	// sort(): Promise<boolean> {
	// 	const z = this
	// 	return z._sort()
	// }
	protected async _restart(): Promise<boolean> {
		return true
	}



	/**
	 * 只在成功旹觸發事件
	 */
	// neo(mw:MemorizeWord, event:RMB_FGT_nil){
	// 	const z = this
	// 	const bol = mw.setInitEvent(event)
	// 	if(bol){
	// 		z.emitter.emit(z.events.neoEvent, mw, event)
	// 		return bol
	// 	}else{
	// 		return bol
	// 	}
	// }



}
