import { WordTmd as Entity_WordTmd } from "@backend/entities/WordTmd"
import Tempus from "@shared/Tempus"

class _DbRow_WordTmd{
	static id = 'id'
	static tableName = 'tableName'
	static createDate = 'createDate'
	static weightAlgoJs = 'weightAlgoJs'
	protected constructor(
		public tableName:string
		,public createDate: string
		,public weightAlgoJs: string
		,public id?:number|string
	){}

	static toEntity(o:_DbRow_WordTmd){
		const ans = Entity_WordTmd.new({
			_id: o.id
			,_tableName: o.tableName
			,_createDate: Tempus.new(o.createDate)
			,_weightAlgoJs: o.weightAlgoJs
		})
		return ans
	}

	static toDbRow(o:Entity_WordTmd){
		const ans:_DbRow_WordTmd = {
			id: o.id
			,tableName: o.tableName
			,createDate: o.createDate.iso
			,weightAlgoJs: o.weightAlgoJs
		}
		return ans
	}
	
	
}

export type DbRow_WordTmd = _DbRow_WordTmd
export const DbRow_WordTmd = _DbRow_WordTmd 