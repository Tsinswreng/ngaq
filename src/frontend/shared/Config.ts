import path from "path";
import { lodashMerge } from "./Ut"
import * as fs from 'fs'
type IConfig = typeof Config.defaultConfig

export default class Config{

	private static _instance:Config
	public static getInstance(){
		if(Config._instance === void 0){
			Config._instance = new Config()
		}
		return Config._instance
	}

	private constructor(){
		const config = Config.readOuterConfig(Config.defaultConfig.outerConfig)
		this.merge(config)
	}
	

	static defaultConfig = 
	{
		dbPath: './db/voca.db'
		,port: 1919
		,outerConfig: path.resolve(process.cwd(), 'config.js')
	}

	private _config:Partial<IConfig> = {}
	;public get config(){return this._config;};

	public static readOuterConfig(path:string){
		//
		const outerConfigStr = fs.readFileSync(path)
		const outerConfig = eval(`(${outerConfigStr})`)
		return outerConfig
	}

	public merge(config:Object){
		lodashMerge(this.config, config)
	}


	
}

