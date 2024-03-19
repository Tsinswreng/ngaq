import Tempus from "@shared/Tempus"


export class VocaTableMetadata{
	protected constructor(){
	}

	static new(prop:{
		_id?:number|string
		,_tableName:string
		,_createDate:Tempus
		,_weightAlgoJs:string
	}){
		const o = new this()
		Object.assign(o, prop)
		return o
	}
	protected _id?:number|string
	protected _tableName:string
	protected _weightAlgoJs:string
}

