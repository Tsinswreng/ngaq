import { Router } from "express-serve-static-core"
import { NgaqDbSvc } from "../svc/NgaqDbSvc"
import { BaseCtrl } from "./BaseCtrl"

//import { NgaqDbSrc } from "@backend/ngaq3/NgaqDbSrc"


export class NgaqCtrl extends BaseCtrl{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof NgaqCtrl.new>){
		const z = this
		z.svc = args[0]
		return z
	}

	static new(svc:NgaqDbSvc){
		const z = new this()
		z.__init__(svc)
		return z
	}
	//@ts-ignore
	get This(){return NgaqCtrl}

	protected _svc:NgaqDbSvc
	get svc(){return this._svc}
	protected set svc(v){this._svc = v}
	

	async GetAllWords(){
		const z = this
		const ans = await z.svc.GetAllWords()
		return ans
	}

	override InitRouter(): Promise<Router> {
		const z = this
		const r = z.router
		r.get('/allWords', async(req,res)=>{

		})
		return Promise.resolve(z.router)
	}

}
