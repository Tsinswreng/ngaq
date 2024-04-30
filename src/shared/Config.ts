import Path from "path";
import { clearObj, lodashMerge } from "@shared/Ut"
import * as fs from 'fs'
type IConfig = typeof Config.defaultConfig

class BaseConfig{

}

class ServerConfig extends BaseConfig{
	dbPath= './db/server.db'
	userTableName: 'user'
}

class DefaultConfig extends BaseConfig{
	dbPath= './db/voca.db'
	port= 1919
	outerConfig= Path.resolve(process.cwd(), 'config.js')
	randomImgDir= [] as string[]
	backupDbPath= `./db/vocaBackup.db`
	tables=[] as string[]
	server= new ServerConfig()
	wordWeight= []
}


export default class Config{

	protected static _instance:Config
	static getInstance(){
		if(Config._instance === void 0){
			Config._instance = Config.new()
		}
		return Config._instance
	}

	protected constructor(){
		
	}

	protected static new(){
		const o = new this()
		const config = Config.readOuterConfig(Config.defaultConfig.outerConfig)
		o.merge(config)
		//console.log(o.config.backupDbPath)//t
		//console.log(o)
		return o
	}
	
	/**
	 * 重新讀配置文件
	 */
	reload(){
		const outer = Config.readOuterConfig(Config.defaultConfig.outerConfig)
		//clearObj(this._config)
		//this.merge(outer)
		Object.assign(this._config, outer)
	}

	static defaultConfig = new DefaultConfig()
	// {
	// 	dbPath: './db/voca.db'
	// 	,port: 1919
	// 	,outerConfig: Path.resolve(process.cwd(), 'config.js')
	// 	,randomImgDir: [] as string[]
	// 	,backupDbPath: `./db/vocaBackup.db`
	// 	,tables:[] as string[]
	// 	,server:{
	// 		dbPath: './db/server.db'
	// 		,userTableName: 'user'
	// 	}
	// 	,wordWeight: []
	// }

	//private _config:Partial<IConfig> = lodashMerge(Config.defaultConfig)
	protected _config:IConfig = lodashMerge(Config.defaultConfig)
	get config(){return this._config;};

	static readOuterConfig(path:string){
		//
		const outerConfigStr = fs.readFileSync(path, 'utf-8')
		const configFn = new Function(`return (${outerConfigStr})`)
		const outerConfig = configFn()
		return outerConfig
	}

	merge(config:Object){
		lodashMerge(this.config, config)
	}


	
}

