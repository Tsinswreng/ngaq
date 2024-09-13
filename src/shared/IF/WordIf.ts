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
	weight:number|undef
}

export interface I_id_weight extends I_id, I_weight{

}

export interface I_id_index_weight extends I_id, I_index, I_weight{

}

/**
 * 宜拆分
 */
export interface I_WordWithStatus extends
	I_id, I_index, I_weight, I_hasBeenLearnedInLastRound
{
	status:I_Status
	reInit()
	resetStatus()
	setInitEvent(ev:LearnBelong.rmb|LearnBelong.fgt)
	undo():RMB_FGT_nil
	mergeNeoLearnRec():Mod.Learn|null
	statusToLearnObj():Mod.Learn|null
	addLearnRec(learn:Mod.Learn)
}



export interface I_Tempus_Event{
	tempus:Tempus
	event:LearnBelong
}

export interface I_LearnBl__Learns{
	learnBl__learns: Map<LearnBelong, Learn[]>
}

export interface I_hasBeenLearnedInLastRound{
	/** 可讀寫 */
	hasBeenLearnedInLastRound:bool
}

export interface I_PropertyBl_Propertys{
	propertyBl__propertys: Map<Row.PropertyBelong|str, Mod.Property[]>
}

export interface I_textWord{
	textWord:Mod.TextWord
}

export interface I_learns{
	learns: Mod.Learn[]
}

export interface I_propertys{
	propertys: Mod.Property[]
}

/**
 * 從txt單詞表中讀入ʹ詞
 */
export interface I_WordFromTxt extends
	I_textWord, I_propertys
{
	
}

export interface I_WordForCalcWeight extends
	I_id, I_weight, I_LearnBl__Learns, I_hasBeenLearnedInLastRound, I_index
{
	id:str
	tempus_event_s:I_Tempus_Event[]
	weight:number|undef
	//times_add:int
}



