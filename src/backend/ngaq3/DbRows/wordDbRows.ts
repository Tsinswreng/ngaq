

class WordCol{
	readonly id='id'
	readonly belong='belong'
	readonly text='text'
	readonly createdTime = 'createdTime'
	readonly modifiedTime = 'modifiedTime'
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
	[wordCol.createdTime]:int
	/** 增 新ʹ learnStatus行 或 property行 旹、視潙更改 */
	[wordCol.modifiedTime]:int
}

class LearnCol{
	readonly id='id'
	readonly wid='wid'
	readonly time='time'
	readonly status='status'
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
	static col = learnCol
	protected constructor(){}
	[learnCol.id]?:int
	[learnCol.wid]:int
	[learnCol.time]:int
	[learnCol.status]:LearnStatus
}

class PropertyCol{
	readonly id='id'
	readonly belong='belong'
	readonly wid='wid'
	readonly text='text'
	readonly createdTime='createdTime'
}


enum PropertyBelong{
	tag='tag'
	,annotation='annotation'
	/** from what book, etc */
	,source='source'
	,pronounce='pronounce'
}

const propertyCol = new PropertyCol()

/** 單詞ʹ屬性 */
export class PropertyRow{
	static col = propertyCol
	protected constructor(){}
	[propertyCol.id]?:int
	[propertyCol.belong]:PropertyBelong
	[propertyCol.wid]:int
	[propertyCol.text]:str
	[propertyCol.createdTime]:int
}

class RelationCol{
	readonly id='id'
	readonly belong='belong'
	readonly name='name'
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
}

class WordRelationCol{
	readonly id='id'
	readonly wid='wid'
	readonly rid='rid'
}

const wordRelationCol = new WordRelationCol()

export class WordRelationRow{
	static col = wordRelationCol
	protected constructor(){}
	[wordRelationCol.id]?:int
	[wordRelationCol.wid]:int
	[wordRelationCol.rid]:int
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
