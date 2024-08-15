import { BaseRow, IdBlCtMtRow } from "@shared/dbFrame/Rows";

export class StrToStrRow extends IdBlCtMtRow{
	key:str
	keyBl:str
	value:str
	valueBl:str
}

export class StrToNumRow extends IdBlCtMtRow{
	key:str
	keyBl:str
	value:num
	valueBl:str
}
