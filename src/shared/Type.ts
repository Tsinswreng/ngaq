
/**
 * 正則表達式替換組。
 */
export interface RegexReplacePair{
	regex:RegExp,
	replacement:string
}

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

export interface SqliteTableInfo{
	cid:number
	name:string
	type:string
	notnull: 0|1
	dflt_value:number|null//默認值
	pk:0|1 //主鍵
}

export interface Sqlite_sequence{
	name:string
	seq:number
}

export interface Sqlite_master{
	type:string
	name:string
	tbl_name:string
	rootpage:number
	sql:string
}

export interface DictRawConfig{
	srcPath?:string, 
	name?:string, 
	singleCharMode?:boolean
}