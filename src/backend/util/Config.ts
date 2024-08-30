import {merge} from '@shared/tools/merge'
import { Deferrable } from "@shared/Type"
import { I_Config } from "@shared/interfaces/I_Config"
import { $a } from '@shared/Common'
import json5 from 'json5'
import * as fs from 'fs'
//import { ConfigManager } from "./ConfigManager"

export class Config implements I_Config {
	protected constructor(){}

	protected async __Init__(...args: Parameters<typeof Config.New>){
		const z = this
		await z.MergeOuterConfig()
		return z
	}

	protected static async New(){
		//@ts-ignore
		const z = new this()
		await z.__Init__()
		return z
	}
	outerConfigPath: string
	encoding = 'utf-8'
	config: kvobj<string, any> = {}


	merge(...args: Parameters<typeof merge>){
		return merge(...args)
	}

	mergeIn(other: kvobj) {
		const z = this
		z.config = z.merge(z.config, other)
	}

	parse(text:str){
		return json5.parse(text)
	}


	async MergeOuterConfig() {
		const z = this
		if (z.outerConfigPath === ''){
			return
		}
		const outerConfigStr = await z.ReadOuterConfigStr()
		if (outerConfigStr === undefined) {
			return
		}
		const outerConfig = z.parse(outerConfigStr)
		z.mergeIn(outerConfig)
		return true
	}

	ReadOuterConfigStr(): Deferrable<str>{
		const z = this
		//@ts-ignore
		return (fs.promises.readFile(z.outerConfigPath, {encoding: z.encoding??'utf-8'}))
	}

	Reload() {
		return this.MergeOuterConfig()
	}

	//get This(){return Abs_Config}
}
