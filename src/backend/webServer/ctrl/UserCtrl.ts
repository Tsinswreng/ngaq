import { Router } from "express-serve-static-core"
import { NgaqDbSvc } from "../svc/NgaqDbSvc"
import { BaseCtrl } from "./BaseCtrl"
import Config from "@backend/Config"
import { WeightCodeProcessor } from "@shared/WordWeight/Parser/WeightCodeProcessor"
import { Exception } from "@shared/error/Exception"
import { UserSvc } from "../svc/UserSvc"

const configInst = Config.getInstance()

export class UserCtrl extends BaseCtrl{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof UserCtrl.new>){
		const z = this
		z.svc = args[0]
		return z
	}

	static new(svc:UserSvc){
		const z = new this()
		z.__init__(svc)
		return z
	}

	static inst = UserCtrl.new(UserSvc.inst)

	//get This(){return UserCtrl}

	protected _svc:UserSvc
	get svc(){return this._svc}
	protected set svc(v){this._svc = v}


	
	
	protected override initRouter(): Router {
		const z = this
		const r = z.router
		r.post('/login', async(req,res)=>{
			try {
				console.log(req.body)
			} catch (err) {
				if(err instanceof Exception){
					res.status(401).json(err)
				}
				z.onErr(err)
				res.status(401).send('')
			}
		})

		return r
	}
}



// function MyDec(){}

// class D{
// 	@MyDec
// 	name:string
// 	@MyDec
// 	age:number

// 	other
// }

// // 獲得類型: {name:string, age:number} ?