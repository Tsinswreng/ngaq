import type { LearnBelong } from "@shared/model/word/NgaqRows";
import type { I_Tempus_Event } from "@shared/interfaces/I_SvcWord";
import type { I_ChangeRecord, Num_t } from "@shared/interfaces/I_WordWeight";
import type Tempus from "@shared/Tempus";

export class ChangeReason{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof ChangeReason.new>){
		const z = this
		z.tempus = args[0]
		z.event = args[1]
		z.comment = args[2]!
		return z
	}

	static new(tempus:Tempus, event:LearnBelong, comment=""){
		const z = new this()
		z.__init__(tempus, event, comment)
		return z
	}

	static fromTempusEvent(tempus_event:I_Tempus_Event, comment=""){
		const z = ChangeReason.new(tempus_event.tempus, tempus_event.event, comment)
		return z
	}

	//get This(){return ChangeReason}
	comment = ""
	tempus:Tempus
	event: LearnBelong
}


export class StatisticsReason extends ChangeReason{
	protected constructor(){super()}
	protected __init__(...args: Parameters<typeof StatisticsReason.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args:Parameters<typeof ChangeReason.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}
	
	dateWeight?:Num_t
	debuff?:Num_t
}


export class TempusEventRecord implements I_ChangeRecord{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof TempusEventRecord.new>){
		const z = this
		z.after = args[0]
		z.reason = args[1]
		return z
	}

	static new(after: Num_t, reason:StatisticsReason){
		const z = new this()
		z.__init__(after, reason)
		return z
	}
	
	static new1(tempus_event:I_Tempus_Event, after:Num_t, dateWeight?:Num_t, debuff?:Num_t){
		const reason = StatisticsReason.new(
			tempus_event.tempus, tempus_event.event
		)
		reason.dateWeight = dateWeight
		reason.debuff = debuff
		const z = TempusEventRecord.new(after, reason)
		return z
	}

	after:Num_t
	reason: StatisticsReason;

	//get This(){return TempusEventRecord}
	get event(){return this.reason.event}
	get tempus(){return this.reason.tempus}
	// get dateWeight(){return this.reason.dateWeight}
	// get debuff
}

