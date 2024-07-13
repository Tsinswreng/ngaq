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
	//password:str 
}


export enum PasswordBelong{
	argon2='argon2'
}

export class Password extends IdCtMtBl{
	/** userId */
	fid:int
	salt:str
	text:str
}

export class Profile extends IdCtMtBl{
	/** userId */
	fid:int
	nickName:str
	sex:str
	birth:int
	email:str
}


/**
 * mt: last_accessed_time 
 */
export class Session extends IdCtMtBl{
	userId:int
	token:str
	expirationTime:int
}


export class NgaqSchema extends IdCtMtBl{
	name:str
	path:str
}

export class User__NgaqDb extends IdCtMtBl{
	userId:int
	dbId:int
}