/**
 * 取差集 支持 Map 和 Set
 * 比较两个 Map，并返回一个新的 Map，该 Map 包含在第一个 Map 中但不在第二个 Map 中的键值对。
 * @param map1 
 * @param map2 
 * @returns 
 */
export function diffMapByKey<K, V>(map1: Map<K, V>, map2: Map<K, V>|Set<K>): Map<K, V> 
export function diffMapByKey<K, V>(map1: Set<K>, map2: Map<K, V>|Set<K>): Set<K> 
export function diffMapByKey<K, V>(map1: Map<K, V>|Set<K>, map2: Map<K, V>|Set<K>): Map<K, V>|Set<K> {
	if (map1 instanceof Set) {
		return diffSet(map1, map2 as Set<K>);
	}
	const ans = new Map<K, V>();
	map1.forEach((value, key) => {
		if (!map2.has(key)) {
			ans.set(key, value);
		}
	});
	return ans;
}

function diffSet<T>(s1:Set<T>, s2:Set<T>){
	const ans = new Set<T>();
	s1.forEach(value => {
		if (!s2.has(value)) {
			ans.add(value);
		}
	});
	return ans;
}