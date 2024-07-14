import type { NgaqDbSrc } from "@backend/ngaq4/ngaqDbSrc/NgaqDbSrc"


export class User{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof User.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return User}

	protected _id:int
	get id(){return this._id}
	set id(v){this._id = v}

	protected _name:str
	get name(){return this._name}
	set name(v){this._name = v}
	
	protected _ngaqSchema:NgaqDbSrc
	get ngaqSchema(){return this._ngaqSchema}
	protected set ngaqSchema(v){this._ngaqSchema = v}


}


// import Tempus from "@shared/Tempus"

// export class User{

// 	protected constructor(

// 	){}

// 	static new(props:{
// 		_id:number
// 		_name:string
// 		_password:string
// 		_date?:string
// 		_email?:string
// 		_vocaTablePaths?:string[]
// 	}){
// 		//@ts-ignore
// 		const o = new this()
// 		Object.assign(o, props)
// 		o._vocaTablePaths = props._vocaTablePaths??[].slice()
// 		o._date = o._date?? Tempus.new().iso
// 		return o
// 	}

// 	protected _id:number
// 	get id(){return this._id}
// 	//set id(v){this._id = v}

// 	protected _name:string
// 	get name(){return this._name}

// 	protected _password:string
// 	get password(){return this._password}

// 	protected _date:string
// 	get date(){return this._date}
	
// 	protected _email:string
// 	get email(){return this._email}

// 	protected _vocaTablePaths = [] as string[]
// 	get vocaTablePaths(){return this._vocaTablePaths}
// 	set vocaTablePaths(v){this._vocaTablePaths = v}
	
// }
// const C = User
// type C  = User