export interface I_GetN<T>{
	GetN(n:int):T
}

export interface I_reset{
	reset()
}

export interface I_perBatch{
	perBatch:num
}

export interface I_pos{
	pos:int
}