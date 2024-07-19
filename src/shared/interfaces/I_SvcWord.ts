import type { LearnBelong } from "@shared/model/word/NgaqRows"
import type Tempus from "@shared/Tempus"
import type { RMB_FGT, RMB_FGT_nil } from "@shared/logic/memorizeWord/LearnEvents";
import type { Learn } from "@shared/model/word/NgaqModels";
import type * as Mod from "@shared/model/word/NgaqModels";
import type * as Row from "@shared/model/word/NgaqRows"

export interface I_Status{
	memorize: RMB_FGT_nil
	date:Tempus|undef
}

export interface I_id{
	id:str
}

export interface I_index{
	index:int|undef
}

export interface I_weight{
	weight:number
}

export interface I_id_weight extends I_id, I_weight{

}

export interface I_id_index_weight extends I_id, I_index, I_weight{

}

export interface I_WordWithStatus extends
	I_id, I_index, I_weight
{
	status:I_Status
	reInit()
	clearStatus()
	setInitEvent(ev:LearnBelong.rmb|LearnBelong.fgt)
	undo()
	selfMerge()
}




export interface I_Tempus_Event{
	tempus:Tempus
	event:LearnBelong
}

export interface I_LearnBl__Learns{
	learnBl__learns: Map<LearnBelong, Learn[]>
}

export interface I_PropertyBl_Propertys{
	propertyBl__propertys: Map<Row.PropertyBelong, Mod.Property[]>
}


export interface I_learns{
	learns: Mod.Learn[]
}

export interface I_propertys{
	propertys: Mod.Property[]
}

export interface I_WordForCalcWeight extends
	I_id, I_weight, I_LearnBl__Learns
{
	id:str
	tempus_event_s:I_Tempus_Event[]
	weight:number
	//times_add:int
}




/**
 * @deprecated 改用 @see I_LearnBl__Learns
 */
export interface I_event__times{
	event__times:Map<LearnBelong, int>
}

