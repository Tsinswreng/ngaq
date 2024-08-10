

export interface I_DbIniter {
	MkSchema(...args:any[]):Task<bool>
	getAllTblSql():str[]
	getAllIdxSql():str[]
	getAllTrigSql():str[]

}