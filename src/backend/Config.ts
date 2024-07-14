import Path from "path";
import { clearObj, lodashMerge } from "@shared/Ut"
import * as fs from 'fs'
import * as fse from 'fs-extra'
type IConfig = typeof Config.defaultConfig

/**
 * 用來作 他ʹ配置類ʹ父
 * 姑留空
 */
class BaseConfig{

}


/**
 * 單項權重配置
 */
class WordWeightSchema{
	/** 此配置項ʹ名 */
	name:string = ''
	/** 代碼文件ʹ路徑、定utf8編碼 */
	path?:string 
	/** 代碼ˉ叶。path與code至少有一ˋ不潙空。若皆不潙空則以code潙準 */
	code?:string
	
	/** ʃ用ʹ代碼 是何語. */
	lang:string = ''
	/** 權重參數 */
	params:string[] = []
}

/**
 * 䀬ʹ單詞權重配置方案
 */
class WordWeightConfig extends BaseConfig{
	schemas:WordWeightSchema[] = []
}

class OldServerConfig extends BaseConfig{
	dbPath= './db/server.db'
	userTableName: 'user'
}

class ServerConfig extends BaseConfig{
	dbPath = "./db/server.sqlite"
	port = 6324
	jwtKey = "TsinswrengGw'ang"
}

class DefaultUserConfig extends BaseConfig{
	uniqueName: 'ngaq'
	password: 'ngaq'
	userDbPath: './db/userDb/ngaq.sqlite'
	wordWeightConfig = new WordWeightConfig()
}

class UserDb extends BaseConfig{
	baseDir: './db/userDb'
	prefix: 'user-'
	suffix: '.sqlite'
}

class Ngaq extends BaseConfig{
	
	defaultUser = new DefaultUserConfig()
	wordWeight = new WordWeightConfig()
	server = new ServerConfig()
	userDb = new UserDb()
}

class DefaultConfig extends BaseConfig{
	dbPath= './db/voca.db'
	port= 1919
	outerConfig= Path.resolve(process.cwd(), 'config.js')
	randomImgDir= [] as string[]
	backupDbPath= `./db/vocaBackup.db`
	tables=[] as string[]
	server= new OldServerConfig()
	wordWeight = new WordWeightConfig()
	ngaq = new Ngaq()
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

	protected __init__(){
		const z = this
		const config = Config.readOuterConfig(Config.defaultConfig.outerConfig)
		z.merge(config)
		return z
	}

	protected static new(){
		const z = new this()
		z.__init__()
		return z
	}
	
	/**
	 * 重新讀配置文件
	 */
	reload(){
		const outer = Config.readOuterConfig(Config.defaultConfig.outerConfig)
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

