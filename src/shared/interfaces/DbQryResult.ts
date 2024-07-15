import type { N4 } from "@shared/Sros"
export type NumId_t = N4


export interface I_data<T>{
	data:T
}

export interface I_lastId{
	lastId:NumId_t|undef
}

/**
 * 受影响的行数（对于 INSERT、UPDATE 和 DELETE 操作）
 * sqlite 的 changes 对应 mysql2 的 affectedRows。
 */
export interface I_affectedRows{
	affectedRows:int|undef
}

/**
 * 实际修改的行数（特定于 UPDATE 操作）。
 */
export interface I_changedRows{
	changedRows:int|undef
}


// export interface I_qryRecord{

// }