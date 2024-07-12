export class Accessor{
	protected constructor(){}
	//static items = Items.inst
	static getRaw(item:Item<any>):str|null{
		const key = item.key
		const ans = localStorage.getItem(key)
		return ans
	}
	static setRaw(item:Item<any>, value:string){
		const key = item.key
		localStorage.setItem(key, value)
	}
}

interface I_ItemNewOpt<T>{
	//dflt:str
	encode?(val:T):str
	decode?(str:str):T
}

export class Item<T=any>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Item.new>){
		const z = this
		z.key = args[0]
		const opt = args[1]
		z.encode = opt?.encode??z.encode
		//@ts-ignore
		z.decode = opt?.decode??z.decode
		//z.dfltStr = opt?.dflt
		return z
	}

	static new<T>(key:str, opt?:I_ItemNewOpt<T>):Item<T>
	static new<T>(...args:any[]):Item<T>
	static new<T>(key:str, opt?:I_ItemNewOpt<T>){
		const z = new this<T>()
		z.__init__(key, opt)
		return z
	}

	get This(){return Item}
	protected _key:str
	get key(){return this._key}
	protected set key(v){this._key = v}

	// protected _dfltStr:str
	// get dfltStr(){return this._dfltStr}
	// protected set dfltStr(v){this._dfltStr = v}

	getRaw():str|undef{
		return Accessor.getRaw(this)??void 0
	}

	setRaw(v:str){
		Accessor.setRaw(this, v)
	}

	get():T|undef{
		const z = this
		const raw = z.getRaw()
		if(raw == void 0){
			return
		}
		return z.decode(raw)
	}

	set(v:T){
		const z = this
		const raw = z.encode(v)
		return z.setRaw(raw)
	}

	/** @virtual */
	decode(str:str):T{
		return str as T
	}

	/** @virtual */
	encode(val:T):str{
		return val as str
	}
}


/* 
类静态侧“typeof NumItem”错误扩展基类静态侧“typeof Item”。
  属性“new”的类型不兼容。
    不能将类型“(key: string, opt?: I_ItemNewOpt<number> | undefined) => NumItem”分配给类型“<T>(key: string, opt?: I_ItemNewOpt<T> | undefined) => Item<T>”。
      参数“opt”和“opt” 的类型不兼容。
        不能将类型“I_ItemNewOpt<T> | undefined”分配给类型“I_ItemNewOpt<number> | undefined”。
          不能将类型“I_ItemNewOpt<T>”分配给类型“I_ItemNewOpt<number>”。
            不能将类型“T”分配给类型“number”。ts(2417)
Item.ts(34, 13): 此类型参数可能需要 `extends number` 约束。
*/
export class NumItem extends Item<number>{

	protected constructor(){super()}

	static override new(key:str, opt?:I_ItemNewOpt<num>):NumItem
	static new(key:str, opt?:I_ItemNewOpt<num>){
		const z = new this()
		z.__init__(key, opt)
		return z
	}

	override encode(val: number): str {
		return val+''
	}

	override decode(str: str): number {
		return parseFloat(str)
	}
}

export class JsonItem<T> extends Item<T>{

	static override new<T>(key:str, opt?:I_ItemNewOpt<num>):JsonItem<T>
	static new(key:str, opt?:I_ItemNewOpt<num>){
		const z = new this()
		z.__init__(key, opt)
		return z
	}

	override encode(val: T): str {
		return JSON.stringify(val)
	}

	override decode(str: str): T {
		return JSON.parse(str) as T
	}
}

// class T{
// 	fn(){
// 		return 't'
// 	}
// }

// let a = new T()
// let b = new T()
// a.fn === b.fn //true
// b.fn = function(){
// 	return 'b'
// }
// a.fn() //t



// class LocalStorage{
// 	protected constructor(){}
// 	protected __init__(...args: Parameters<typeof LocalStorage.new>){
// 		const z = this
// 		return z
// 	}

// 	static new(){
// 		const z = new this()
// 		z.__init__()
// 		return z
// 	}

// 	get This(){return LocalStorage}

// }
