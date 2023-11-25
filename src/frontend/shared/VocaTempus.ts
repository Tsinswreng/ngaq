import Tempus from "@shared/Tempus";
import SingleWord2, {VocaDbTable} from "@shared/SingleWord2"
import { $ } from "./Ut";
//VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt

export class Db_VocaTempus{
	public constructor(
		public id				:number
		//要不要加Tempus?
		,public unix_time		:string //int64
		,public table			:string
		,public word_id			:number
		,public event			:string
	){}
	static readonly id = `id`
	static readonly unix_time = `unix_time`
	static readonly table = `table`
	static readonly word_id = `word_id`
	static readonly event = `event`
}

/**
 * 統計。主ᵈ考察時間與事件。
 */
export default class VocaTempus{

	/**
	 * 㕥代構造函數、蔿方便此類增減字段。
	 */
	public static VocaTempus(
		tempus:Tempus,
		table:string,
		id:number,
		event: string
	){
		let o = new this(tempus, table, id, event)
		return o
	}
	
	private constructor(
		public tempus:Tempus,
		public table:string,
		public id:number,
		/**
		 * 必潙 @see VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt 三者之一
		 */
		public event: string
	){} // what is this constructor for?

	public static checkEvent(events:string[]){
		for(const event of events){
			if(event === VocaDbTable.dates_add || event === VocaDbTable.dates_rmb || event===VocaDbTable.dates_fgt){}
			else{throw new Error()}
		}
	}

	public static analyse(singleWord2s:SingleWord2[]){
		const result:VocaTempus[] = []

		function add(sw:SingleWord2){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_add){
				
				let unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					id:$(sw.id),
					event:VocaDbTable.dates_add
				}
				partResult.push(unus)
			}
			return partResult
		}

		function rmb(sw:SingleWord2){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_rmb){
				
				let unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					id:$(sw.id),
					event:VocaDbTable.dates_rmb
				}
				partResult.push(unus)
			}
			return partResult
		}

		function fgt(sw:SingleWord2){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_fgt){
				
				let unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					id:$(sw.id),
					event:VocaDbTable.dates_fgt
				}
				partResult.push(unus)
			}
			return partResult
		}

		for(const sw of singleWord2s){
			const a = add(sw)
			const r = rmb(sw)
			const f = fgt(sw)
			result.push(...a,...r,...f)
		}
		return result
	}

	public static sort(insts:VocaTempus[]){
		insts.sort((a,b)=>{
			return Tempus.diff_mills(a.tempus,b.tempus)
		})
	}

	public static groupByDay(insts:VocaTempus[]){
		const day__vocaTempus = new Map<string, VocaTempus[]>()
		for(const u of insts){
			let tempus = u.tempus.iso
			tempus = tempus.replace(/^(.*)T(.*)$/g, '$1') //2023-11-17T00:05:25.000Z -> 2023-11-17
			const v = day__vocaTempus.get(tempus)
			if(v == void 0){
				day__vocaTempus.set(tempus, [u])
			}else{
				v.push(u)
				day__vocaTempus.set(tempus, v)
			}
		}
		return day__vocaTempus
	}

}