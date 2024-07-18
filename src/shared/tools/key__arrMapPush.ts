export function key__arrMapPush<K,VEle>(map:Map<K,VEle[]>, k:K ,ele:VEle){
	const gotV = map.get(k)
	if(gotV == void 0){
		map.set(k, [ele])
	}else{
		gotV.push(ele)
		map.set(k, gotV)
	}
}
