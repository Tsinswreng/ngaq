import type { Deferrable } from "@shared/Type";
import { I_GetN, I_reset } from "@shared/IF/StreamIf";
import type { CntWordRow } from "../models/CntWord/CntWordRows";
export interface I_StrmCntWord 
	extends I_GetN<Deferrable<CntWordRow[]>>, I_reset
{

}