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
	hash:str
}

export class Profile extends IdCtMtBl{
	/** userId */
	fid:int
	nickName:str
}


/**
 * mt: last_accessed_time 
 */
export class Session extends IdCtMtBl{
	userId:int
	token:str
	expirationTime:int
}