import {Config} from "@backend/util/Config"
import { ConfigManager } from "@shared/infra/ConfigManager"

export class RimeConfig extends Config{
	protected constructor(){super()}
	protected async __Init__(...args: Parameters<typeof RimeConfig.New>){
		const z = this
		await super.__Init__(...args)
		return z
	}

	static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}

	protected static inst?: RimeConfig
	static async GetInst(){
		const z = this
		if(RimeConfig.inst == void 0){
			RimeConfig.inst = await RimeConfig.New()
		}
		return RimeConfig.inst
	}

	//get This(){return RimeConfig}
	override outerConfigPath: string = './rimeOpt.json5'
	override config = new DefaultConfig()
}

class DefaultConfig{
	commitHistory: CommitHistory = new CommitHistory()
}

class CommitHistory{
	sqlitePath = 'commitHistory.sqlite'
	levelDbPath = ''
}

