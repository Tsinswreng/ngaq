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
