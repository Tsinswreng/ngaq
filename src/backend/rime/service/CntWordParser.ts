import Tempus from "@shared/Tempus"
import { CntWordBelong, CntWordRow } from "../models/CntWord/CntWordRows"
import { I_CntWordParser } from "./I_CntWordParser"
import { $ } from "@shared/Common"


//[ '/', '193\t1723379724\t1718015361' ],
/** key, cnt, mt(秒), ct(秒) */

function secStrToMillsInt(str:str):int|undef{
	const sec = parseInt(str)
	if(Number.isNaN(sec)){
		return
	}
	return sec * 1000
}

class CntWordParser implements I_CntWordParser{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof CntWordParser.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return CntWordParser}

	/** @pure */
	parse(key:str, v: string): CntWordRow|undef {
		if(key.startsWith('\x01')){ //metadata
			return
		}
		const [cnt, mt ,ct] = v.split('\t')
		const ans = new CntWordRow()
		ans.text = key
		ans.cnt = parseInt(cnt)||0
		ans.mt = $(secStrToMillsInt(mt), 'secStrToMillsInt(mt)')
		ans.ct = secStrToMillsInt(ct)??Tempus.new('2024-05-01T00:00:00.000+08:00').value
		ans.belong = CntWordBelong.commitHistory
		ans.id = NaN
		return ans
	}


}

export const cntWordParser = CntWordParser.new()