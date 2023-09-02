import { type } from "os"

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

/**
 * 單詞表中每列的列名。蔿 保持統一 和 方便改名 、sql語句中通過此類中的列名常量間接訪問類名而非直接用寫死的字符串字面量
 */
export class VocaTableColumnName{
	public static readonly id='id'
	public static readonly wordShape='wordShape'
	public static readonly mean='mean'
	public static readonly annotation='annotation'
	public static readonly times_add='times_add'
	public static readonly dates_add='dates_add'
	public static readonly times_rmb='times_rmb'
	public static readonly dates_rmb='dates_rmb'
	public static readonly times_fgt='times_fgt'
	public static readonly dates_fgt='dates_fgt'
}

/**
 * 㕥約束數據庫中的行
 */
export interface IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	mean:string
	annotation:string //
	times_add:number
	dates_add:string
	times_rmb:number
	dates_rmb:string
	times_fgt:number
	dates_fgt:string
}

export type Lings = 'english'|'japanese'|'latin'|'italian'|'french'|'spanish'|'esperanto'

export interface VocaRawConfig{
	dbName:string,
	dbPath:string,
	url:string,
	dateFormat:string,
	dateRegex:string
	dateBlock: [string, string]
	wordBlock: [string, string]
	annotation: [string, string]
	txtTables:{
		ling:Lings,
		path:string
	}[]
}


/**
 * 舊版ᵗ詞表
 */
export interface Old_IVocaRow{
	id?:number //從數據庫中取數據時id必不潙空
	ling:string //數據庫中本無此字段、㕥存表名。
	wordShape:string
	fullComments:string[]
	//annotation:string //
	addedTimes:number
	addedDates:string[]
	reviewedDates:string[] //皆 空數組也
	reviewedTimes:number // 皆 0
	rememberedTimes:number
	rememberedDates:string[]
	forgottenTimes:number
	forgottenDates:string[]
}


export class UserColumnName{
	public static readonly id='id'
	public static readonly strId='strId'
	public static readonly userName='userName'
	public static readonly password='password'
	public static readonly mail='mail'
	public static readonly date='date'
}

export interface IUser{
	id?:number,
	strId:string,
	userName:string,
	password:string,
	mail:string
	date:string
}