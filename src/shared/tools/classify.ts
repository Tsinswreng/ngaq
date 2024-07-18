/**
 * 
 * @param arr 
 * @param keyOfMap 返ᵗ值ˋ作Map之鍵
 * @returns 
 */
export function classify<Ele,Key>(arr:Ele[], keyOfMap:(ele:Ele)=>Key){
	const ans = new Map<Key, Ele[]>()
	for(const e of arr){
		const key = keyOfMap(e)
		let got = ans.get(key)
		if(got == void 0){
			ans.set(key, [e])
		}else{
			got.push(e)
			ans.set(key, got)
		}
	}
	return ans
}