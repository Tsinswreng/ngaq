export class DbQryResult<DataT=unknown>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof DbQryResult.new>){
		const z = this
		z.data = args[0] as DataT
		return z
	}

	static new<DataT=unknown>(data:DataT){
		const z = new this()
		z.__init__(data)
		return z
	}

	//get This(){return DbQryResult}

	protected _data:DataT
	get data(){return this._data}
	protected set data(v){this._data = v}
	
}
