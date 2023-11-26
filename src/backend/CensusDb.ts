import { $a, delKeys } from '@shared/Ut';
import {Db_VocaTempus} from '@shared/VocaTempus'
import Sqlite, {SqliteType} from '@shared/db/Sqlite';
import lodash from 'lodash'

export default class CensusDb{
	private constructor(){}

	/**
	 * 異步構造函數則W大寫?
	 * @returns 
	 */
	static async neW(props:{
		_dbName?:string,
		_dbPath?:string,
		_tableName?:string
		,mode?:number
	}){
		const o = new this()
		Object.assign(o,props)
		o._db = await Sqlite.newDatabase(o.dbPath)
		return o
	}

	private _dbName = 'voca';
	public get dbName(){return this._dbName}public set dbName(v){this._dbName=v}

	private _dbPath = process.cwd()+'/db/'+this._dbName+'.db' 
	;public get dbPath(){return this._dbPath;};

	private _tableName?:string 
	;get tableName(){return this._tableName;};;set tableName(v){this._tableName=v;};

	private _db = Sqlite.newDatabaseAsync(this.dbPath)
	;public get db(){return this._db;};

	public static creatTable(db:SqliteType.Database, table:string, ifNotExists=false){
		function getSql(table:string){
			let isExist = ''
			if(ifNotExists){
				isExist = 'IF NOT EXISTS'
			}
			let c = Db_VocaTempus
			return `
			CREATE TABLE ${isExist} '${table}' (
				${c.id} INTEGER PRIMARY KEY,
				${c.word_id} TEXT NOT NULL,
				${c.unix_time} INTEGER NOT NULL,
				${c.table} TEXT NOT NULL,
				${c.event} TEXT NOT NULL
			);
			`
		}
		return Sqlite.all(db, getSql(table))
	}

	public creatTable(table=$a(this.tableName), ifNotExists=false){
		return C.creatTable(this.db, table, ifNotExists)
	}

	public static genSql_insert(table:string, obj:Db_VocaTempus, ignoredKeys:string[]=[Db_VocaTempus.id]){
		return Sqlite.sql.genSql_insert(table, obj, ignoredKeys)
	}

	public static insert(db:SqliteType.Database, table:string, objs:Db_VocaTempus[], ignoredKeys:string[]=[Db_VocaTempus.id]){
		//let objsCopy = lodash.cloneDeep(objs)
		//objsCopy.map(e=>delKeys(e,ignoredKeys))
		return Sqlite.transactions.dbInsertObjs(db, table, objs, ignoredKeys)
	}
	

}
const C = CensusDb

