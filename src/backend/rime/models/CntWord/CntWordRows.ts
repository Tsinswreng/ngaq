import { BaseRow, IdBlCtMtRow } from "@shared/dbFrame/Rows";

export class CntWordRow extends IdBlCtMtRow{
	declare id:int
	text:str
	cnt:int
	declare belong: CntWordBelong
}

export enum CntWordBelong{
	commitHistory = 'commitHistory'
}