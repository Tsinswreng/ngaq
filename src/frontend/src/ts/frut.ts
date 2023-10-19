/**
 * frontend util
 * 
 */

/**
 * alert and throw
 * @param msg 
 */
export function alertEtThrow(msg?:any){
	alert(msg)
	throw new Error(msg)
}

export function alert(msg?:any){
	window.alert(msg);
}