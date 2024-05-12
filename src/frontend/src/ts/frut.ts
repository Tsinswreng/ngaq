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


export function u8ArrToBase64(u8Arr:Uint8Array){
	const decoder = new TextDecoder('utf8')
	const ans = btoa(decoder.decode(u8Arr))
	return ans
}