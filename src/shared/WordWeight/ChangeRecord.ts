// import * as _ENV from "./_lib"
// import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
// import { InstanceType_ } from "@shared/Type"

// type Tempus = InstanceType_<typeof _ENV.Tempus>
// type WordEvent = InstanceType_<typeof _ENV.Word_.WordEvent>
// type Tempus_Event = InstanceType_<typeof _ENV.Word_.Tempus_Event>
// type N2S = _ENV.Sros_.N2S

import Tempus from "@shared/Tempus"
import { WordEvent } from "@shared/SingleWord2"
import { N2S } from "@shared/Sros"
import { Tempus_Event } from "@shared/entities/Word/Word"
import * as Ut from "@shared/Ut"

/** 㕥錄ᵣ 每次迭代中 權重ᵗ變 */

export class ChangeRecord{

	protected constructor(){}


	//protected __init__(...args:Parameters<typeof ChangeRecord.new>):ChangeRecord
	protected __init__(...args:any[]):any
	protected __init__(...args:Parameters<typeof ChangeRecord.new>){
		const z = this
		z.after = args[0]
		z.annotation = args[1]!
		return z
	}

	static new(after:N2S, annotation:str):ChangeRecord
	static new(...args:any[]):never
	static new(after:N2S, annotation=''){
		const z = new this()
		z.__init__(after, annotation)
		return z
	}

	annotation:str = ''
	/** 變後ᵗ權重 */
	after:N2S

	static push<K,VEle>(map:Map<K,VEle[]>, k:K, ele:VEle){
		Ut.key__arrMapPush(map, k, ele)
	}
}


export class TempusEventRecord extends ChangeRecord{

	protected constructor(){
		super()
	}


	static new(tempus:Tempus, event:WordEvent, after:N2S, dateWeight?:N2S, debuff?:N2S):TempusEventRecord
	static new(...args:any[]):never
	static new(tempus:Tempus, event:WordEvent, after:N2S, dateWeight?:N2S, debuff?:N2S){
		const z = new this()
		z.__init__(tempus, event, after, dateWeight, debuff)
		return z
	}

	static new1(tempus__event:Tempus_Event, after:N2S, dateWeight?:N2S, debuff?:N2S){
		const tempus = tempus__event.tempus
		const event = tempus__event.event
		const z = new this()
		z.__init__(tempus, event, after, dateWeight, debuff)
		return z
	}

	
	protected __init__(tempus:Tempus, event:WordEvent, after:N2S, dateWeight?:N2S, debuff?:N2S){ //...param:Parameters<typeof ChangeRecord.new>
		const o = this
		o.after = after
		o.tempus = tempus
		o.event = event
		o.dateWeight = dateWeight
		o.debuff = debuff
		return o
	}

	// protected __init__1(tempus__event:Tempus_Event, after:N2S, dateWeight?:N2S, debuff?:N2S){
	// 	const o = this
	// 	o.after = after
	// 	o.tempus = tempus__event.tempus
	// 	o.event = tempus__event.event
	// 	o.dateWeight = dateWeight
	// 	o.debuff = debuff
	// 	return o
	// }

	/** 彼 單詞事件ˋ發旹ᵗ時刻 */
	tempus:Tempus
	event: WordEvent
	/** 以時間差 算得之權重 */
	dateWeight?:N2S
	/** 憶ˡ事件 之 權重加成 */
	debuff?:N2S


}
