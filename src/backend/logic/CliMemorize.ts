import 'tsconfig-paths/register'
import { Abs_MemorizeLogic } from "@shared/logic/memorizeWord/MemorizeWordLogic";
import { inherit } from "@shared/Ut";
import Sqlite from "@backend/db/Sqlite";
import Config from '@shared/Config';
import { WordTable } from "@backend/db/sqlite/Word/Table";
import { createInterface as createInterface, question_fn } from '@backend/util/readLine';
import { I_EventEmitter } from '@shared/linkedEvent';
import EventEmitter3 from 'eventemitter3';
import * as Le from '@shared/linkedEvent'
import { WordDbSrc } from '@backend/db/sqlite/Word/DbSrc';
import { WordDbRow } from '@shared/DbRow/Word';
import { MemorizeWord } from '@shared/entities/Word/MemorizeWord';

const configInst = Config.getInstance()
const config = configInst.config




export class CliMemorize extends Abs_MemorizeLogic{
	protected constructor(){
		super()
	}

	static async New(){
		const f = await Abs_MemorizeLogic.New()
		const c = new this()
		const o = inherit(c,f)
		o._dbSrc = await WordDbSrc.New({
			_dbPath: config.dbPath
		})
		return o
	}

	

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}

	protected _dbSrc:WordDbSrc
	get dbSrc(){return this._dbSrc}




	async on_load() {
		const z = this
		const tbl = z.dbSrc.loadTable('english')
		const rows = await tbl.selectAll()
		const words = rows.map(e=>WordDbRow.toEntity(e))
		const mWords = words.map(e=>MemorizeWord.new(e))
		z._wordsToLearn.length = 0
		z._wordsToLearn.push(...mWords)
		z._status.load = true
	}
	on_calcWeight() {
		const z = this
		if(!z._status.load){
			throw new Error()
		}
		for(let i = 0; i < z.wordsToLearn.length; i++){
			z.wordsToLearn[i].weight = 0
		}
		z._status.calcWeight = true
	}
	on_sort() {
		throw new Error("Method not implemented.");
	}
	on_start() {
		throw new Error("Method not implemented.");
	}
	on_save() {
		throw new Error("Method not implemented.");
	}
	on_restart() {
		throw new Error("Method not implemented.");
	}

}