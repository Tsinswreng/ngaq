export interface I_Row{

}

export interface I_IdBlCtMtRow extends I_Row{
	id
	/**所屬 */
	bl:str
	/**建立時間 */
	ct:int
	/**修改時間 */
	mt:int
}
