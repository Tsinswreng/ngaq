import { I_Tbl } from './I_Tbl'
export interface I_Tbls extends kvobj<str, I_Tbl<any>> {
	[key:str]:I_Tbl<any>
}