import { Deferrable } from "@shared/Type"

export interface I_Config {
	outerConfigPath:str
	encoding?:str
	config:kvobj
	mergeIn(other:kvobj)
	ReadOuterConfigStr():Deferrable<str>
	MergeOuterConfig()
	parse(text:str):kvobj
	Reload()

}