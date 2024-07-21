export class Row{

}

export class IdBlCtMt extends Row{
	id:int
	belong:str
	ct:int
	mt:int
}


export class WidRow extends IdBlCtMt{
	wid:int
}

export class TextWord extends IdBlCtMt{
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

// class LearnBelong_{
// 	readonly add='add'
// 	readonly rmb='rmb'
// 	readonly fgt='fgt'
// }

// const LearnBelong = new LearnBelong_()
// type LearnBelong = LearnBelong_

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
	declare belong:PropertyBelong|str
}

export enum WordRelationBelong{
	/** 變體: 如 realize, realise  */
	variant='variant'
	/** 詞族: 如 realize, real, realization */
	,family='family'
}

export class Relation extends IdBlCtMt{
	name:str
	declare belong: WordRelationBelong
}

export class WordRelation extends WidRow{
	rid:int
}
