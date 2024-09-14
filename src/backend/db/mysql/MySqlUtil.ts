import * as DbQry from '@shared/IF/db/DbQryResult'

export class MysqlQryResult<T> implements
DbQry.I_data<T>
,DbQry.I_lastId
,DbQry.I_affectedRows
,DbQry.I_changedRows
{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof MysqlQryResult.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	//get This(){return SqliteQryResult}
	protected _data:T
	get data(){return this._data}
	protected set data(v){this._data = v}

	protected _lastId:int
	get lastId(){return this._lastId}
	protected set lastId(v){this._lastId = v}
	
	protected _affectedRows:int
	get affectedRows(){return this._affectedRows}
	protected set affectedRows(v){this._affectedRows = v}

	protected _changedRows:int
	get changedRows(){return this._changedRows}
	protected set changedRows(v){this._changedRows = v}
}

