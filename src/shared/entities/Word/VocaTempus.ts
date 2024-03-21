
import Tempus from "@shared/Tempus";
//import SingleWord2, {VocaDbTable} from "@shared/SingleWord2"
import { Word } from "@shared/entities/Word/Word";
import { VocaDbTable } from "@shared/interfaces/Word";
import { $ } from "../../Ut";

//VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt

export class Db_VocaTempus{
	private constructor(
		public id				:number|undefined
		//要不要加Tempus?
		,public word_id			:number
		,public unix_time		:string //int64
		,public table			:string
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
	public static new(
		props:{
			tempus:Tempus,
			table:string,
			word_id:number,
			event: string
			id?:number //id
		}
	){
		let o = new this(props.tempus, props.table, props.word_id, props.event, props.id)
		return o
	}
	
	private constructor(
		public tempus:Tempus,
		public table:string,
		public word_id:number, //單詞ᵗid
		/**
		 * 必潙 @see VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt 三者之一
		 */
		public event: string
		,public id?:number
	){} // what is this constructor for?


	public static toDbObj(jsObj:C):Db_VocaTempus
	public static toDbObj(jsObj:C[]):Db_VocaTempus[]
	public static toDbObj(jsObj:C|C[]){
		function forOne(jso:C){
			const ans:Db_VocaTempus = {
				id: jso.id
				,unix_time: Tempus.toUnixTime(jso.tempus, 'bigint')+''
				,word_id:jso.word_id
				,table:jso.table
				,event: C.checkEvent(jso.event)
			}
			return ans
		}
		if(Array.isArray(jsObj)){
			return jsObj.map(e=>forOne(e))
		}else{
			return forOne(jsObj)
		}
	}

	public static toJsObj(dbObj:Db_VocaTempus):C
	public static toJsObj(dbObj:Db_VocaTempus[]):C[]
	public static toJsObj(dbObj:Db_VocaTempus|Db_VocaTempus[]){
		function forOne(dbObj:Db_VocaTempus){
			const ans = C.new({
				tempus: Tempus.new(
					BigInt(dbObj.unix_time)
				)
				,id: dbObj.id
				,table: dbObj.table
				,word_id: dbObj.word_id
				,event: dbObj.event
			})
			return ans
		}
		if(Array.isArray(dbObj)){
			return dbObj.map(e=>forOne(e))
		}else{
			return forOne(dbObj)
		}
	}

	public static checkEvent(event:string):string
	public static checkEvent(event:string[]):string[]
	public static checkEvent(event:string|string[]){
		function forOne(event:string){
			if(event === VocaDbTable.dates_add || event === VocaDbTable.dates_rmb || event===VocaDbTable.dates_fgt){}
			else{throw new Error()}
			return event as string
		}
		if(typeof event === 'string'){
			return forOne(event)
		}else{
			return event.map(e=>forOne(e))
		}
		
	}

	public static analyse(singleWord2s:Word[]){
		const result:VocaTempus[] = []

		function add(sw:Word){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_add){
				
				let unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					word_id:$(sw.id),
					event:VocaDbTable.dates_add
				}
				partResult.push(unus)
			}
			return partResult
		}

		function rmb(sw:Word){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_rmb){
				
				const unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					word_id:$(sw.id),
					event:VocaDbTable.dates_rmb
				}
				partResult.push(unus)
			}
			return partResult
		}

		function fgt(sw:Word){
			const partResult:VocaTempus[] = []
			for(const tempus of sw.dates_fgt){
				
				let unus:VocaTempus = 
				{
					tempus:tempus,
					table:sw.table,
					word_id:$(sw.id),
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
const C = VocaTempus
type C = VocaTempus