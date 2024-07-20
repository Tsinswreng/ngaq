/**
 * fn(`abc||de||fg`, `||`) -> ['abc', 'de||fg']
 * @param str 
 * @param sep 
 * @returns 
 */
export function splitByFirstSep(str:str, sep:str):[str, str]{
	const index = str.indexOf(sep);
	if (index === -1) {
		return [str, ''];
	}
	const beforeSep = str.substring(0, index);
	const afterSep = str.substring(index + sep.length);
	return [beforeSep, afterSep];
}