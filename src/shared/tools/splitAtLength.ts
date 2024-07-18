/**
 * const got = fn('Bearer 114514', 'Bearer '.length)
 * -> [ 'Bearer ', '114514' ]
 * 只按len長度截取、不檢查是否匹配
 * @param str 
 * @param head 
 * @returns 
 */
export function splitAtLength(str:str, len:int){
	const gotHead = str.slice(0, len)
	const rest = str.slice(len)
	return [gotHead, rest]
}
