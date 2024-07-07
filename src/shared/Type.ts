/** Type Util */


/**
 * 最小對立對
 */
export interface MinimalPair{
	pair:[string, string], ids1:number[], ids2:number[]
}


export interface MultiMinimalPairs{
	pair:[string, string] //音位
	proportion:[number, number] //字頻佔比
}

// <>{TypeORM?}

export interface Duplication{
	kanji:string
	pronounce:string
	freq:string|null
	count:number
	/* SELECT kanji, pronounce, freq, COUNT(*) AS count
FROM kana
GROUP BY kanji, pronounce, freq
HAVING COUNT(*) > 1; */
}

/* export interface DictDbRow{
	kanji:string
	pronounce:string
	freq?:string|null
	essay_id?:number|null
	freq_num?:number|null
} */

export interface DictDbRow{
	id?:number, //從數據庫中取數據時id不會undefined
	char:string
	code?:string
	ratio?:string
	freq?:number|null
	essay_id?:number|null
}

export const cn ={ //column name
	id:'id',
	char:'char',
	code:'code',
	ratio:'ratio',
	freq:'freq',
	essay_id:'essay_id'
}


export interface DictRawConfig{
	srcPath?:string, 
	name?:string, 
	singleCharMode?:boolean
}


/**
 * InstanceType_<typeof MyClass>
 */
export type InstanceType_<T extends { prototype: any }> = T["prototype"];
//export type InstanceType_<T> = T["prototype"];


/** 從字串字面量解析類型 */
export type ParseType<T extends string> =
	T extends 'string' ? string :
	T extends 'number' ? number :
	T extends 'boolean' ? boolean :
	T extends 'bigint' ? bigint :
	T extends 'symbol' ? symbol :
	T extends 'undefined' ? undefined :
	T extends 'object' ? object :
	T extends 'function' ? Function :
	never;

/** 基本數據類型 */
export type PrimitiveTypeStr = 'number' | 'string' | 'boolean' | 'null' | 'undefined' | 'bigint' | 'symbol';

export interface I_readN<T>{
	read(n:int):T
}

export interface I_perBatch{
	perBatch:num
}


/* 
除函數外、取對象ʹ䀬ʹ鍵ʹ聯合類型
for(const K of T){
	if(T[K] extends Function){
		return never
	}else{
		return K
	}
}
最後 [keyof T] 用于提取映射类型中的值并形成联合类型 卒得 "key1"|"key2"...
只取公開者
含 訪問器與修改器
*/
export type PubNonFuncKeys<T> = {
	/* for */[K in keyof T]: //{
		/* if */T[K] extends Function ? 
		/* then return */never 
		/* else return */: K
	//}
}[keyof T];

/** 
 * 除函數外、對象ʹ䀬ʹ鍵ˋʃ成對象ʹ類型ˇ取
 * 只取公開者
 * 含 訪問器與修改器
 */
export type PubNonFuncProp<T> = Pick<T, PubNonFuncKeys<T>>;


/**
 * 取一個類之setter
 * 實際上getter亦可被取、非唯setter
 */
export type SetterKeys<T> = {
	[K in keyof T]: T[K] extends { set(value: infer V): void } ? K : never
}[keyof T];

export type SetterProp<T> = Pick<T, SetterKeys<T>>

/** 
 *
 * class A{
	a
	b
	c
	d
}
type Result = KeyAsValue<A>
Result === {a:'a', b:'b', c:'c', d:'d'}
 */
export type KeyMirror<T> = {
	[K in keyof T]: K;
}


/**
 * 创建一个新的类型，将指定的属性变为可选
 * type MyType = { name: string; age: number };
 * 使用 MakeOptional 类型将 MyType 中的 name 属性变为可选
 * type Got = MakeOptional<MyType, 'name'>;
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;