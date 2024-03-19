import { SqliteType } from "@backend/db/Sqlite";
import { Database } from "sqlite3";

export interface SqliteDbSrc{
	get db():SqliteType.Database
	get dbName():string
	get dbPath():string
	get backupDbPath():string|undefined
	createTable(table:string, config:CreateTableConfig):Promise<unknown>
	//createTable: (table:string, config:CreateTableConfig)=>Promise<unknown>
}

export class CreateTableConfig{
	static new(){
		return new this()
	}
	ifNotExists = false
}

