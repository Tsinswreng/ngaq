import { Router } from "express-serve-static-core"
import { NgaqDbSvc } from "../svc/NgaqDbSvc"
import { BaseCtrl } from "./BaseCtrl"
import Config from "@backend/Config"
import { WeightCodeProcessor } from "@shared/WordWeight/Parser/WeightCodeProcessor"
import Tempus from "@shared/Tempus"
const configInst = Config.getInstance()
//import { NgaqDbSrc } from "@backend/ngaq3/NgaqDbSrc"


export class NgaqCtrl extends BaseCtrl{
	protected constructor(){super()}
	//@ts-ignore
	protected __Init__(...args: Parameters<typeof NgaqCtrl.new>){
		const z = this
		z.svc = args[0]
		super.__Init__()
		return z
	}

	static new(svc:NgaqDbSvc){
		const z = new this()
		z.__Init__(svc)
		return z
	}


	static inst = NgaqCtrl.new(NgaqDbSvc.inst)

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

	onErr(err){
		const z = this
		console.error(err)
	}

	override initRouter(){
		const z = this
		const r = z.router

		r.get('/',(req, res)=>{
			try {
				res.send(Tempus.new())
			} catch (err) {
				z.onErr(err)
			}
		})

		r.get('/allWords', async(req,res)=>{
			try {
				const ans = await z.svc.GetAllWords()
				const json = JSON.stringify(ans)
				res.status(200).send(json)
			} catch (err) {
				res.status(500).send('')
				z.onErr(err)
			}
		})

		r.get('/weightAlgoJs0', async(req,res)=>{
			try {
				WeightCodeProcessor
				res.status(200).send('')
			} catch (err) {
				res.status(500).send('')
				z.onErr(err)
			}
		})



		return z.router
	}

}
