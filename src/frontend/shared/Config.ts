import path from "path";
import { lodashMerge } from "@shared/Ut"
import * as fs from 'fs'
type IConfig = typeof Config.defaultConfig

export default class Config{

	private static _instance:Config
	public static getInstance(){
		if(Config._instance === void 0){
			Config._instance = Config.new()
		}
		return Config._instance
	}

	private constructor(){
		
	}

	private static new(){
		const o = new this()
		const config = Config.readOuterConfig(Config.defaultConfig.outerConfig)
		o.merge(config)
		//console.log(o.config.backupDbPath)//t
		//console.log(o)
		return o
	}
	

	static defaultConfig = 
	{
		dbPath: './db/voca.db'
		,port: 1919
		,outerConfig: path.resolve(process.cwd(), 'config.js')
		,randomImgDir: [] as string[]
		,backupDbPath: `./db/vocaBackup.db`
	}

	private _config:Partial<IConfig> = lodashMerge(Config.defaultConfig)
	;public get config(){return this._config;};

	public static readOuterConfig(path:string){
		//
		const outerConfigStr = fs.readFileSync(path, 'utf-8')
		const outerConfig = eval(`(${outerConfigStr})`)
		return outerConfig
	}

	public merge(config:Object){
		lodashMerge(this.config, config)
	}


	
}

