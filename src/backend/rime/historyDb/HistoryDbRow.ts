
class ColNames{
	readonly id='id'
	readonly text='text'
	readonly cnt='cnt'
	readonly createdTime='createdTime'
	readonly modifiedTime='modifiedTime'
}
const col = new ColNames()

export class HistoryDbRow{
	static col = col
	protected constructor(){}

	[col.id]?:int
	[col.text]:str
	[col.cnt]:int
	[col.createdTime]:int
	[col.modifiedTime]:int
}




