
export class Col{
	readonly id='id'
	readonly belong='belong'
	readonly ct = 'ct'
	readonly mt = 'mt'
}

const col = new Col

export class Row{
	static col = col;
	[col.id]?:int
	[col.belong]:str
	[col.ct]:int
	[col.mt]:int
}

export class WidCol extends Col{
	readonly wid='wid'
}
const widCol = new WidCol()
export class WidRow extends Row{
	static col = widCol;
	[widCol.wid]?:int
}

class WordCol extends Col{
	// readonly [col.id]=col.id
	// readonly [col.belong]=col.belong
	// readonly [col.ct] = col.ct
	// readonly [col.mt] = col.mt
	readonly text='text'
}
const wordCol = new WordCol()

export class WordRow extends Row{
	static col = wordCol;
	//protected constructor(){}
	
	/** english, japanese, etc. */
	
	/** 詞形 */
	[wordCol.text]:str
	/** 增 新ʹ learnStatus行 或 property行 旹、視潙更改 */
}

class LearnCol extends WidCol{

}

export enum LearnBelong{
	/** add */
	add='add'
	/** remember */
	,rmb='rmb'
	/** forget */
	,fgt='fgt'
}

const learnCol = new LearnCol()

export class LearnRow extends WidRow{
	static col = learnCol;
	[learnCol.belong]:LearnBelong
	//protected constructor(){}
	// [learnCol.id]?:int
	// [learnCol.wid]:int
	// [learnCol.ct]:int
	// [learnCol.mt]:int
}

class PropertyCol extends WidCol{
	// readonly id='id'
	// readonly belong='belong'
	// readonly wid='wid'
	readonly text='text'
	// readonly ct='ct'
	// readonly mt='mt'
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
export class PropertyRow extends WidRow{
	static col = propertyCol;
	//protected constructor(){}
	[propertyCol.text]:str
	[propertyCol.belong]:PropertyBelong
	// [propertyCol.id]?:int
	// [propertyCol.wid]:int
	// [propertyCol.ct]:int
	// [propertyCol.mt]:int
}

class RelationCol extends Col{
	readonly name='name'
	// readonly id='id'
	// readonly belong='belong'
	// readonly ct='ct'
	// readonly mt='mt'
}

export enum WordRelationBelong{
	/** 變體: 如 realize, realise  */
	variant='variant'
	/** 詞族: 如 realize, real, realization */
	,family='family'
}

const relationCol = new RelationCol()

export class RelationRow extends Row{
	static col = relationCol;
	//protected constructor(){}
	[relationCol.name]:str
	[relationCol.belong]: WordRelationBelong
	// [relationCol.id]?:int
	// [relationCol.ct]:int
	// [relationCol.mt]:int
	
}

class WordRelationCol extends WidCol{
	readonly rid='rid'
	// readonly id='id'
	// readonly wid='wid'
	// readonly ct='ct'
	// readonly mt='mt'
}

const wordRelationCol = new WordRelationCol()

export class WordRelationRow extends WidRow{
	static col = wordRelationCol;
	//protected constructor(){}
	[wordRelationCol.rid]:int
	// [wordRelationCol.id]?:int
	// [wordRelationCol.wid]:int
	// [wordRelationCol.ct]:int
	// [wordRelationCol.mt]:int
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


