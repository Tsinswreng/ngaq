import Tempus from "@shared/Tempus";
import SingleWord2, {VocaDbTable} from "@shared/SingleWord2"
import { $ } from "./Ut";
//VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt

export default class VocaTempus{
	public constructor(
		public tempus:Tempus,
		public table:string,
		public id:number,
		/**
		 * 必潙 @see VocaDbTable.dates_add|VocaDbTable.dates_rmb|VocaDbTable.dates_fgt 三者之一
		 */
		public event: string
	){}

	public static checkEvent(events:string[]){
		for(const event of events){
			if(event === VocaDbTable.dates_add || event === VocaDbTable.dates_rmb || event===VocaDbTable.dates_fgt){}
			else{throw new Error()}
		}
	}

	public static parse(singleWord2s:SingleWord2[]){
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
}