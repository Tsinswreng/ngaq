import Tempus from "@shared/Tempus"


export class WordTmd{
	protected constructor(){
	}

	static new(prop:{
		_id?:number|string
		,_tableName:string
		,_createDate?:Tempus
		,_weightAlgoJs?:string
	}){
		const o = new this()
		Object.assign(o, prop)
		return o
	}
	protected _id?:number|string
	get id(){return this._id}

	protected _tableName:string
	get tableName(){return this._tableName}

	protected _createdDate:Tempus = Tempus.new()
	get createDate(){return this._createdDate}

	protected _weightAlgoJs:string = ''
	get weightAlgoJs(){return this._weightAlgoJs}


}

