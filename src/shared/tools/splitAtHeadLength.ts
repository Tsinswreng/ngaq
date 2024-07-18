/**
 * const got = fn('Bearer 114514', 'Bearer ')
 * -> [ 'Bearer ', '114514' ]
 * 只按head長度截取、不檢查是否匹配
 * @param str 
 * @param head 
 * @returns 
 * @deprecated 改用 @see splitAtLength
 */
export function splitAtHeadLength(str:str, head:str){
	const gotHead = str.slice(0, head.length)
	const rest = str.slice(head.length)
	return [gotHead, rest]
}