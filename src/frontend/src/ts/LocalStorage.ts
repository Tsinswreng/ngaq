import { Priority } from "@shared/SingleWord2"
class Item{
	protected constructor(){}
	static new(prop:{_key:string, _default_?:string}){
		const z	 = new Item()
		z.__init__(prop)
		//Object.defineProperty(o, 'key', {writable:false})
		return z
	}
	protected __init__(...args:Parameters<typeof Item.new>){
		const z = this
		const prop = args[0]
		Object.assign(z, prop)
		return z
	}
	protected _key:string = ''
	get key(){return this._key}

	protected _default_?:string
	get default_(){return this._default_}
	set default_(v){this._default_ = v}
	
	public get(){
		return LocalStorage.get(this)
	}
	public set(v:string){
		return LocalStorage.set(this, v)
	}
}

class Items{
	protected constructor(){
	}

	protected static new(){
		return new Items()
	}

	static inst = Items.new()

	readonly multiModePaging:Item=Item.new({
		_key:'multiModePaging'
		,_default_: '0,64'
	})
	readonly debuffNumerator:Item=Item.new({
		_key:'debuffNumerator'
		,_default_: Priority.defaultConfig.debuffNumerator+''
	})
	//...
}

export default class LocalStorage{
	protected constructor(){}
	static items = Items.inst
	static get(item:Item){
		const key = item.key
		const ans = localStorage.getItem(key)??item.default_
		return ans
	}
	static set(item:Item, value:string){
		const key = item.key
		localStorage.setItem(key, value)
	}
}

//LocalStorage.items.multiModePaging.key=''
