export class Row{

}

export class Row4 extends Row{
	id?:int
	belong:str
	ct:int
	mt:int
}


export class WidRow extends Row4{
	wid:int
}

export class TextWord extends Row4{
	/** english, japanese, etc. */
	/** 詞形 */
	text:str
	/** 增 新ʹ learnStatus行 或 property行 旹、視潙更改 */
}

export enum LearnBelong{
	/** add */
	add='add'
	/** remember */
	,rmb='rmb'
	/** forget */
	,fgt='fgt'
}

export class Learn extends WidRow{
	declare belong:LearnBelong
}

export enum PropertyBelong{
	mean='mean'
	,tag='tag'
	,annotation='annotation'
	/** from what book, etc */
	,source='source'
	,pronounce='pronounce'
}

/** 單詞ʹ屬性 */
export class Property extends WidRow{
	text:str
	declare belong:PropertyBelong
}

export enum WordRelationBelong{
	/** 變體: 如 realize, realise  */
	variant='variant'
	/** 詞族: 如 realize, real, realization */
	,family='family'
}

export class RelationRow extends Row4{
	name:str
	declare belong: WordRelationBelong
}

export class WordRelationRow extends WidRow{
	rid:int
}
