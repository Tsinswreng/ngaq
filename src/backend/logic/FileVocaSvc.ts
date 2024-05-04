import 'tsconfig-paths/register'
import { VocaSvc as VocaSvc } from "@shared/logic/memorizeWord/VocaSvc";
import Config from '@shared/Config';
import { WordTable } from "@backend/db/sqlite/Word/Table";
//import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import EventEmitter3 from 'eventemitter3';
import * as Le from '@shared/linkedEvent'
import { WordDbSrc } from '@backend/db/sqlite/Word/DbSrc';
import { WordDbRow } from '@shared/dbRow/Word';
import { MemorizeWord, RMB_FGT } from '@shared/entities/Word/MemorizeWord';
import { Exception } from '@shared/Exception';
import * as fs from 'fs' //TODO remove
import { WeightCodeParser } from '@shared/WordWeight/Parser/WeightCodeParser';
import { I_WordWeight } from '@shared/interfaces/I_WordWeight';
import { $ } from '@shared/Ut';
import { WordEvent } from '@shared/SingleWord2';
import { RMB_FGT_nil } from '@shared/entities/Word/MemorizeWord';

const configInst = Config.getInstance()
const config = configInst.config


const EV = Le.Event.new.bind(Le.Event)

class MemorizeEvent extends Le.Events{
	/** 
	 * MemorizeWord: ʃ蔿ˋ何詞。
	 */
	//neoEvent = EV<[MemorizeWord, RMB_FGT_nil]>('neoEvent')
	/** RMB_FGT_nil: 撤銷前ʹ事件 */
	undo = EV<[MemorizeWord, RMB_FGT_nil]>('undo')
	start = EV<[]>('start')
	//test=EV('')
	learnByMWord = EV<[MemorizeWord, RMB_FGT]>('learnByWord')

	/** 在wordsToLearn中ʹ索引, 詞ˉ自身, 新ʹ事件 */
	learnByIndex = EV<[integer, MemorizeWord, RMB_FGT]>('learnByIndex')
	save = EV('save')
}

// let emt3 = new EventEmitter3()
// emt3.emit<>('')

/** 業務理則層 */
export class FileVocaSvc extends VocaSvc{

	readonly This = FileVocaSvc
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
	protected _events = new MemorizeEvent()
	get events(){return this._events}

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}

	protected _dbSrc:WordDbSrc
	get dbSrc(){return this._dbSrc}

	protected _weightCodeParser:WeightCodeParser|undefined
	get weightCodeParser(){return this._weightCodeParser}

	//TODO 潙空旹 用 默認算法
	protected _weightAlgo: I_WordWeight|undefined
	get weightAlgo(){return this._weightAlgo}


	/**
	 * 試、只取配置中首個權重算法方案
	 * //TODO 移到ui類
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
			const err = error as Error
			err.message = weiPar.jsCode +'\n\n'+ err.message
			throw err
		}
		
	}

	async load() {
		const z = this
		async function oneTbl(tblName:string){
			const tbl = z.dbSrc.loadTable(tblName)
			const rows = await tbl.selectAllWithTblName()
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
			z._wordsToLearn.length = 0
			z._wordsToLearn.push(...mWords)
			z._processStatus.load = true
			return true
		} catch (error) {
			z.emitErr(error)
		}
		return false
	}

	async sort() {
		const z = this
		const outErr = new Error()
		try {
			if(!z._processStatus.load){
				throw Exception.for(z.processErrReasons.didnt_load)
			}
			z.initWeightAlgo()
			z._wordsToLearn = await $(z.weightAlgo).run(z.wordsToLearn)
			z._processStatus.sort = true
			return true
		} catch (error) {
			const err = error as Error
			const jsCode = z.weightCodeParser?.jsCode??''
			err.message = '\n' + jsCode + err.message
			err.stack += '\n\n' + outErr.stack +'\n\n'
			z.emitErr(err)
		}
		return false
	}


	override start(){
		const z = this
		if(!z.processStatus.load){
			throw Exception.for(z.processErrReasons.didnt_load)
		}
		if(!z.processStatus.save){
			throw Exception.for(z.processErrReasons.cant_start_when_unsave)
		}
		z.processStatus.start = true
		z.emitter.emit(z.events.start)
		return Promise.resolve(true)
	}

	learnByMWord(mword:MemorizeWord, event:RMB_FGT){
		const z = this
		const ans = mword.setInitEvent(event)
		if(ans){
			z.emitter.emit(z.events.learnByMWord, mword, event)
		}
		return Promise.resolve(ans)
	}

	learnByIndex(index:integer, event:RMB_FGT){
		const z = this
		if(index +1 > z.wordsToLearn.length){
			return Promise.resolve(false)
		}
		const ans = z.wordsToLearn[index].setInitEvent(event)
		if(ans){
			z.emitter.emit(z.events.learnByIndex, index, z.wordsToLearn[index], event)
		}
		return Promise.resolve(ans)
	}

	async save(){
		const z = this
		z._processStatus.start = false
		//merge all
		for(let i = 0; i < z.wordsToLearn.length; i++){
			z.wordsToLearn[i].merge()
		}
		const words = z.wordsToLearn.map(e=>e.word)
		//const fn = await z.dbSrc.addWordsOfSameTable(words)
		const ans = await z.dbSrc.saveWords(words)
		z.emitter.emit(z.events.save, ans)
		z._processStatus.save = true
		return true
	}

	async restart() {
		const z = this
		const ans = await z.start()
		return ans
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

	undo(mw:MemorizeWord){
		const z = this
		const old = mw.undo()
		z.emitter.emit(z.events.undo, mw, old)
	}

}
