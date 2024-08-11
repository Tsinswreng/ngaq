import Path from "path";
import {merge} from '@shared/tools/merge'


export class ConfigManager{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof ConfigManager.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return ConfigManager}

	protected _outerConfigPath?:str
	get outerConfigPath(){return this._outerConfigPath}
	protected set outerConfigPath(v){this._outerConfigPath = v}
	
	merge(...args: Parameters<typeof merge>){
		return merge(...args)
	}

	

}



