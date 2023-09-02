import User from "./User";
import mysql2 from 'mysql2/promise'
import * as Tp from 'Type'

export default class UserMysql{
	public constructor(pool:mysql2.PoolOptions){
		this._pool = mysql2.createPool(pool)
	}

	private _pool:mysql2.Pool =  mysql2.createPool({
		host: 'localhost',
		user: 'root',
	})
	;public get pool(){return this._pool;};

	public static creatTable(pool:mysql2.Pool, tableName='user'){
		const c = Tp.UserColumnName
		let sql = `CREATE TABLE ${tableName} (
			${c.id} INT AUTO_INCREMENT PRIMARY KEY,
			${c.strId} VARCHAR(32),
			${c.userName} VARCHAR(32),
			${c.password} VARCHAR(32),
			${c.mail} VARCHAR(128),
			${c.date} CHAR(17) 
		)`// 20230902161018000

	}
}