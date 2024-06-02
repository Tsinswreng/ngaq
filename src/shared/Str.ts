
/**
 * 中 -> 4E2D
 * 𠂇 -> 20087
 * @param char 
 * @returns 
 */
export function getHexCodePoint(char:str) {
	if (char.length === 0) {
		throw new Error("Input cannot be an empty string.");
	}

	const codePoint = char.codePointAt(0);
	if (codePoint === undefined) {
		throw new Error("Invalid input character.");
	}

	return codePoint.toString(16).toUpperCase();
}

/**
 * '中𠂇' -> ['4E2D', '20087']
 * @param chars 
 */
export function charsGetCodePoint(chars:str){
	const charArr = split(chars, '')
	return charArr.map(e=>getHexCodePoint(e))
}

/**
 * fn('a中𠂇', '') -> ['a', '中', '𠂇']
 * 'a中𠂇'.split('') -> ['a', '中', '\uD840', '\uDC87']
 * @param str 
 * @param delimiter
 * @returns 
 */
export function split(str:str, delimiter:str){
	if(delimiter === ''){
		return [...str]
	}
	return str.split(delimiter)
}