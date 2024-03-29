import 'tsconfig-paths/register'
import { Abs_MemorizeLogic } from "@shared/logic/reciteWord/MemorizeWordLogic";
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

const configInst = Config.getInstance()
const config = configInst.config


export class CliRecite extends Abs_MemorizeLogic{
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
		z._wordsToLearn.length = 0
		z._wordsToLearn.push(...words)
	}
	on_calcWeight() {
		throw new Error("Method not implemented.");
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