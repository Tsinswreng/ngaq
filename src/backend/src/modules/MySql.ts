import * as mysql from 'mysql';

export default class MySql{

	private _connect = mysql.createConnection(
		{

		}
	)
	;public get connect(){return this._connect;};

	public static query(){}

}