import { I_Config } from "../IF/I_Config"

export class ConfigManager{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof ConfigManager.new>){
		const z = this
		z.configInst = args[0]
		return z
	}

	static new(configInst?:I_Config){
		const z = new this()
		z.__init__(configInst)
		return z
	}

	get This(){return ConfigManager}
	
	configInst?:I_Config
	GetInst(){

	}


}



