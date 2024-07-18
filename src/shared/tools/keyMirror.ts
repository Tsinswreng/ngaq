import type * as Ty from '@shared/Type'

export function keyMirror<T extends kvobj>(obj:T){
	const ans = {}
	const keys = Object.keys(obj)
	for(const k of keys){
		ans[k] = k
	}
	return ans as Ty.KeyMirror<T>
}