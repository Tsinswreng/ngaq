import type { I_Tbl } from "./I_Tbl"
import { I_Tbls } from "./I_Tbls"
export interface I_DbSrc {
	db
	tbls:I_Tbls
}
