

class WordCol{
	readonly id='id'
	readonly belong='belong'
	readonly text='text'
	readonly ct = 'ct'
	readonly mt = 'mt'
}
const wordCol = new WordCol()

export class WordRow{
	static col = wordCol
	protected constructor(){}
	[wordCol.id]?:int
	/** english, japanese, etc. */
	[wordCol.belong]:str
	/** 詞形 */
	[wordCol.text]:str
	[wordCol.ct]:int
	/** 增 新ʹ learnStatus行 或 property行 旹、視潙更改 */
	[wordCol.mt]:int
}

class LearnCol{
	readonly id='id'
	readonly wid='wid'
	readonly status='status'
	readonly ct='ct'
	readonly mt='mt'
}

export enum LearnStatus{
	/** add */
	add='add'
	/** remember */
	,rmb='rmb'
	/** forget */
	,fgt='fgt'
}

const learnCol = new LearnCol()

export class LearnRow{
	static col = learnCol;
	//protected constructor(){}
	[learnCol.id]?:int
	[learnCol.wid]:int
	[learnCol.status]:LearnStatus
	[learnCol.ct]:int
	[learnCol.mt]:int
}

class PropertyCol{
	readonly id='id'
	readonly belong='belong'
	readonly wid='wid'
	readonly text='text'
	readonly ct='ct'
	readonly mt='mt'
}


export enum PropertyBelong{
	mean='mean'
	,tag='tag'
	,annotation='annotation'
	/** from what book, etc */
	,source='source'
	,pronounce='pronounce'
}

const propertyCol = new PropertyCol()

/** 單詞ʹ屬性 */
export class PropertyRow{
	static col = propertyCol
	;//protected constructor(){}
	[propertyCol.id]?:int
	[propertyCol.belong]:PropertyBelong
	[propertyCol.wid]:int
	[propertyCol.text]:str
	[propertyCol.ct]:int
	[propertyCol.mt]:int
}

class RelationCol{
	readonly id='id'
	readonly belong='belong'
	readonly name='name'
	readonly ct='ct'
	readonly mt='mt'
}

export enum WordRelationBelong{
	/** 變體: 如 realize, realise  */
	variant='variant'
	/** 詞族: 如 realize, real, realization */
	,family='family'
}

const relationCol = new RelationCol()

export class RelationRow{
	static col = relationCol
	protected constructor(){}
	[relationCol.id]?:int
	[relationCol.belong]: WordRelationBelong
	[relationCol.name]:str
	[relationCol.ct]:int
	[relationCol.mt]:int
}

class WordRelationCol{
	readonly id='id'
	readonly wid='wid'
	readonly rid='rid'
	readonly ct='ct'
	readonly mt='mt'
}

const wordRelationCol = new WordRelationCol()

export class WordRelationRow{
	static col = wordRelationCol
	protected constructor(){}
	[wordRelationCol.id]?:int
	[wordRelationCol.wid]:int
	[wordRelationCol.rid]:int
	[wordRelationCol.ct]:int
	[wordRelationCol.mt]:int
}



// class MeanCol{
// 	readonly id='id'
// 	readonly wid='wid'
// 	readonly text='text'
// }

// const meanCol = new MeanCol()
// export class MeanRow{
// 	static col = meanCol
// 	protected constructor(){}
// 	[meanCol.id]?:int
// 	[meanCol.wid]?:int
// 	[meanCol.text]:str
// }

// class TagCol{
// 	readonly id='id'
// 	readonly wid='wid'
// 	readonly text='text'
// 	readonly createdTime='createdTime'
// }

// const tagCol = new TagCol()

// export class TagRow{
// 	static col = tagCol
// 	protected constructor(){}
// 	[tagCol.id]?:int
// 	[tagCol.wid]:int
// 	[tagCol.text]:str
// 	[tagCol.createdTime]:int
// }

// export class AnnotationCol{
// 	readonly id='id'
// 	readonly wid='wid'
// 	readonly text='text'
// 	readonly createdTime='createdTime'
// }
