export interface I_Row{

}

export interface I_IdBlCtMtRow extends I_Row{
	id
	/**所屬 */
	belong:str
	/**建立時間 mills */
	ct:int
	/**修改時間 mills */
	mt:int
}
