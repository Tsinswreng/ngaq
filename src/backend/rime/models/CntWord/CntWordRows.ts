export class BaseRow{

}

export class IdCtMtBl extends BaseRow{
	id:int
	belong:str
	ct:int
	mt:int
}

export class CntWordRow extends IdCtMtBl{
	cnt:int
}

