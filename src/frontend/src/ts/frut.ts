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
	if(typeof msg === 'string'){
		throw new Error(msg)
	}else{
		throw msg
	}

}

export function alert(msg?:any){
	window.alert(msg);
}