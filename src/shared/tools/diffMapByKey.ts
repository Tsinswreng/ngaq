/**
 * 取差集
 * 比较两个 Map，并返回一个新的 Map，该 Map 包含在第一个 Map 中但不在第二个 Map 中的键值对。
 * @param map1 
 * @param map2 
 * @returns 
 */
export function diffMapByKey<K, V>(map1: Map<K, V>, map2: Map<K, V>): Map<K, V> {
	const ans = new Map<K, V>();
	map1.forEach((value, key) => {
		if (!map2.has(key)) {
			ans.set(key, value);
		}
	});
	return ans;
}