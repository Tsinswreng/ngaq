import Tempus from "@shared/Tempus"


export class WordTmd{
	protected constructor(){
	}

	static new(prop:{
		_id?:number|string
		,_tableName:string
		,_createDate?:Tempus
		,_type?:string
		,_weightAlgoJs?:string
	}){
		const o = new this()
		Object.assign(o, prop)
		o._createdDate = prop._createDate??o._createdDate
		o._modifiedDate = o._createdDate
		return o
	}
	protected _id?:number|string
	get id(){return this._id}

	protected _tableName:string
	get tableName(){return this._tableName}

	protected _type:string = ''
	get type(){return this._type}

	protected _createdDate:Tempus = Tempus.new()
	get createDate(){return this._createdDate}

	protected _modifiedDate:Tempus
	get modifiedDate(){return this._modifiedDate}
	set modifiedDate(v){this._modifiedDate = v}

	/** @deprecated */
	protected _weightAlgoJs:string = ''
	/** @deprecated */
	get weightAlgoJs(){return this._weightAlgoJs}

}

