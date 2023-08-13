
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

