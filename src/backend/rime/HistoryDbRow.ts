
class ColNames{
	readonly id='id'
	readonly text='text'
	readonly cnt='cnt'
	readonly created_time='created_time'
	readonly modified_time='modified_time'
}

export class HistoryDbRow{
	static col = new ColNames()
	protected constructor(){}

	id?:int
	text_:str
	cnt:int
	created_time:int
	modified_time:int


}
