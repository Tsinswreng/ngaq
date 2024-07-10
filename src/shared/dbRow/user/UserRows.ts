export class Row{

}

export class IdCtMtBl extends Row{
	id:int
	belong:str
	ct:int
	mt:int
}


export class User extends IdCtMtBl{
	uniqueName:str
	password:str
}

export class Profile extends IdCtMtBl{
	fid:int
	nickName:str
}