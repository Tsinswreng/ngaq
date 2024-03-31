import { WordTmd as Entity_WordTmd } from "@backend/entities/WordTmd"
import Tempus from "@shared/Tempus"

export class WordTmdDbRow{
	static id = 'id'
	static tableName = 'tableName'
	static type = 'type'
	static createDate = 'createDate'
	static modifiedDate = 'modifiedDate'
	/** @deprecated */
	static weightAlgoJs = 'weightAlgoJs'
	protected constructor(
		public tableName:string
		,public type:string
		,public createDate: string
		/** @deprecated */
		,public weightAlgoJs: string
		,public modifiedDate: string
		,public id?:number|string
	){}

	static toEntity(o:WordTmdDbRow){
		const ans = Entity_WordTmd.new({
			_id: o.id
			,_tableName: o.tableName
			,_type: o.type
			,_createDate: Tempus.new(o.createDate)
			,_weightAlgoJs: o.weightAlgoJs
		})
		ans.modifiedDate = Tempus.new(o.modifiedDate)
		return ans
	}

	static toDbRow(o:Entity_WordTmd){
		const ans:WordTmdDbRow = {
			id: o.id
			,tableName: o.tableName
			,type: o.type
			,createDate: o.createDate.iso
			,modifiedDate: Tempus.toISO8601(o.modifiedDate)
			,weightAlgoJs: o.weightAlgoJs
		}
		return ans
	}
	
	
}

