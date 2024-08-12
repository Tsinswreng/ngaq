import { CntWordDbSrc } from "../db/CntWord/CntWordDbSrc"
import type { I_StrmCntWord } from "./I_StrmCntWord"

import { Level } from "level"
import { LdbIter } from "@backend/util/LdbIter"
import type { I_CntWordParser } from "./I_CntWordParser"
import * as Row from '@backend/rime/models/CntWord/CntWordRows'
import { cntWordParser } from "./CntWordParser"
import { StrmCntWordImpl } from "../impl/StrmCntWordImpl"

export  class CntWordSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof CntWordSvc.new>){
		const z = this
		z.dbSrc = args[0]
		return z
	}

	static new(dbSrc:CntWordDbSrc){
		const z = new this()
		z.__init__(dbSrc)
		return z
	}

	get This(){return CntWordSvc}

	protected _dbSrc:CntWordDbSrc
	get dbSrc(){return this._dbSrc}
	protected set dbSrc(v){this._dbSrc = v}

	async Add(strm:I_StrmCntWord){
		const z = this
		const Add = await z.dbSrc.Fn_Add(e=>e.cntWord)
		strm.reset()
		await z.dbSrc.db.BeginTrans()
		for(;;){
			const bat = await strm.GetN(128)
			if(bat.length === 0){
				break
			}
			for(const row of bat){
				await Add(row)
			}
		}
		await z.dbSrc.db.Commit()
	}


	
}
