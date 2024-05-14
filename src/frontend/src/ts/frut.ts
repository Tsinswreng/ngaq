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
	// //@ts-ignore
	// const ans = btoa(String.fromCharCode.apply(null, u8Arr));
	return ans
}

export function numArrToBase64(array:int[]){
	// 将数组中的每个元素转换为字符
	const chars = array.map(byte => String.fromCharCode(byte));
	// 将字符数组连接为字符串
	const binaryString = chars.join('');

	// 使用 btoa() 将二进制字符串转换为 base64 编码
	const base64String = btoa(binaryString);
	return base64String
}