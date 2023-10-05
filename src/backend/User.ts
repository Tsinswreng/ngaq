

export default class User{

	public constructor(props:{
		_strId:string,
		_userName:string,
		_password:string,
		_mail:string
	}) {
		Object.assign(this,props)
	}

	private _id?:number
	;public get id(){return this._id;};

	private _strId:string = ''
	;public get strId(){return this._strId;};

	private _userName:string = ''
	;public get userName(){return this._userName;};

	private _password:string = ''
	;public get password(){return this._password;};


	private _mail:string = ''
	;public get mail(){return this._mail;};

	private _date:number=parseInt(Ut.YYYYMMDDHHmmssSSS())
	;public get date(){return this._date;};


	public static toRowObj(inst:User){
		let o:Tp.IUser = {
			id:inst.id,
			strId:inst.strId,
			userName:inst.userName,
			password:inst.password,
			mail:inst.mail,
			date:inst.date+''
		}
		return o
	}

	public static parse(obj:Tp.IUser){
		let u = new User({
			_strId:obj.strId,
			_userName:obj.userName,
			_password:obj.password,
			_mail:obj.mail
		})
		u._id = obj.id
		u._date = parseInt(obj.date)
		return u
	}

}