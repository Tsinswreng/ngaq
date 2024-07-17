import type { LearnBelong } from "@shared/dbRow/NgaqRows"
import type Tempus from "@shared/Tempus"
import type { RMB_FGT, RMB_FGT_nil } from "@shared/entities/Word/LearnEvents";

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


export interface I_SvcWord extends
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

export interface I_event__times{
	event__times:Map<LearnBelong, int>
}

export interface I_WordForCalcWeight extends
	I_id, I_weight, I_event__times
{
	id:str
	tempus_event_s:I_Tempus_Event[]
	weight:number
	//times_add:int
	
}

