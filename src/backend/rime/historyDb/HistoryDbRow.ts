
class ColNames{
	readonly id='id'
	readonly belong='belong'
	readonly text='text'
	readonly cnt='cnt'
	readonly ct='createdTime'
	readonly mt='modifiedTime'
}
const col = new ColNames()

export class HistoryDbRow{
	static col = col
	protected constructor(){}
	[col.id]?:int
	[col.belong]:Belong
	[col.text]:str
	[col.cnt]:int
	[col.ct]:int
	[col.mt]:int
}

export enum Belong{
	commit='commit'
	,coinage='coinage'
}


