import type { I_Tbl } from "./I_Tbl"

export interface I_DbSrc {
	db
	tbls//:kvobj<str, I_Tbl<any>>
}