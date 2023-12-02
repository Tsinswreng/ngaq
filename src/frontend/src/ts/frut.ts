/**
 * frontend util
 * 
 */

/**
 * alert and throw
 * 若傳入之msg潙Error對象則alert後直ᵈ抛
 * @param msg 
 */
export function alertEtThrow(msg?:any|Error){
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