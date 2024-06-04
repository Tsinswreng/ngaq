
export class MetaTbl{
	protected constructor(){}
	protected __init__(...args:Parameters<typeof MetaTbl.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		return z
	}

	/** 在數據庫中ʹ表ʹ名、未必同dict.yaml之名 */
	protected _table_name:str
	get table_name(){return this._table_name}
	protected set table_name(v){this._table_name = v}


	/** 本名。即dict.yaml之名 */
	protected _primitive_name:str
	get primitive_name(){return this._primitive_name}
	protected set primitive_name(v){this._primitive_name = v}

	/** 元數據字串 */
	protected _meta_text:str
	get meta_text(){return this._meta_text}
	set meta_text(v){this._meta_text = v}
	
	
}