import { VocaTableMetadata as Entity_VocaTableMetadata } from "@backend/entities/VocaTableMetadata"
import Tempus from "@shared/Tempus"

class _DbRow_VocaTableMetadata{
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

	static toEntity(o:_DbRow_VocaTableMetadata){
		const ans = Entity_VocaTableMetadata.new({
			_id: o.id
			,_tableName: o.tableName
			,_createDate: Tempus.new(o.createDate)
			,_weightAlgoJs: o.weightAlgoJs
		})
		return ans
	}

	static toPlain(o:Entity_VocaTableMetadata){
		const ans:_DbRow_VocaTableMetadata = {
			id: o.id
			,tableName: o.tableName
			,createDate: o.createDate.iso
			,weightAlgoJs: o.weightAlgoJs
		}
		return ans
	}
	
	
}

export type DbRow_VocaTableMetadata = _DbRow_VocaTableMetadata
export const DbRow_VocaTableMetadata = _DbRow_VocaTableMetadata 