import type { I_Row, I_IdBlCtMtRow } from "./I_Rows"


export class BaseRow implements I_Row{

}

export class IdBlCtMtRow implements I_IdBlCtMtRow{
	id:int
	bl:str = ''
	ct:int
	mt:int
}