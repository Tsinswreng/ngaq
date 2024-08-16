/** 
 * Type Util
 * 專門放純ts類型與常用接口、只通過import type導入
 */



/**
 * InstanceType_<typeof MyClass>
 * 適用于類芝厥ʹ構造函數ˋ非公開
 */
export type InstanceType_<T extends { prototype: any }> = T["prototype"];


/**
 * T是實例類型
 */
export type PubAbsConstructor<T = {}> = abstract new (...args: any[]) => T;
// ts似不支持ProctectedConstructor<T>
//export type Constructor<T> = T extends InstanceType_<infer C> ? C : never;

//export type InstanceType_<T> = T["prototype"];


/** 
 * 從字串字面量解析類型
 * type a = ParseType<'number'>
 * a -> number
 */
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

/** @deprecated */
export interface I_GetN<T>{
	GetN(n:int):T
}

/** @deprecated */
export interface I_perBatch{
	perBatch:num
}

export interface I_WrapFn<Arg extends any[], Ret>{
	fn(...args:Arg):Ret
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
 * @notWork
 * 取一個類之setter
 * 實際上getter亦可被取、非唯setter
 */
export type SetterKeys<T> = {
	[K in keyof T]: T[K] extends { set(value: infer V): void } ? K : never
}[keyof T];

/**
 * @notWork
 */
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
	[K in keyof T & str]: K
}

/**
 * 创建一个新的类型，将指定的属性变为可选
 * type MyType = { name: string; age: number };
 * 使用 MakeOptional 类型将 MyType 中的 name 属性变为可选
 * type Got = MakeOptional<MyType, 'name'>;
 */
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * declare let arr:NullableEleArr<number>
 * arr[0] -> number|undefined
 */
export type NullableEleArr<T> = (T|undef)[]

export type Deferrable<T> = T|Promise<T>

export interface I_belong<T>{
	belong: T
}

export interface I__<T=any>{
	_:T
}

export interface I_data<T>{
	data:T
}

export interface I_id<T>{
	id:T
}

export type Pair<A,B> = [A,B]