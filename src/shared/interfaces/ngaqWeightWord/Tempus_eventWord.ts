import type { LearnBelong } from "@shared/dbRow/NgaqRows";
import type Tempus from "@shared/Tempus";

/**
 * 單例
 */
// export interface I_EnumWordEvent{
// 	add:I_WordEvent
// 	rmb:I_WordEvent
// 	fgt:I_WordEvent
// }

export interface I_Tempus_Event{
	tempus:Tempus
	event:LearnBelong
}

export interface I_Tempus_EventWord{
	id:str
	tempus_event_s:I_Tempus_Event[]
	weight:number
	//times_add:int
	event__times:Map<LearnBelong, int>
}