import type { CntWordRow } from "../models/CntWord/CntWordRows";

export interface I_CntWordParser{
	parse(key:str, v:string):CntWordRow|undef
}