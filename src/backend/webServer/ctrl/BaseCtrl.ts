import { Router, Request, Response } from "express"
import * as Le from '@shared/linkedEvent'
import EventEmitter3 from "eventemitter3"

const EV = Le.Event.new.bind(Le.Event)
export class CtrlEvents extends Le.Events{
	httpErr = EV<[number, string]>('httpErr')
}



export class BaseCtrl{
	protected constructor(){}
	protected async __Init__(...args: Parameters<typeof BaseCtrl.New>){
		const z = this
		z.initRouter()
		return z
	}

	static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}
	get This(){return BaseCtrl}

	protected _events = new CtrlEvents()
	get events(){return this._events}
	set events(v){this._events = v}
	
	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}
	protected set emitter(v){this._emitter = v}
	

	protected _router = Router()
	get router(){return this._router}
	protected set router(v){this._router = v}

	onErr(v, res?:Response){
		console.error(v)
		if(res != void 0){
			res.status(500).send('')
		}
	}


	//this.emitter.emit(z.events.httpErr, 11, 'str')
	//簡化爲this.emit(e=>e.httpErr, 11, 'str')
	//幫我完成這個方法的類型約束
	emit<T extends Le.Event<any[]>>(
		fn: (ev: typeof this.events) => T,
		...args: T extends Le.Event<infer U> ? U : never
	){
		const z = this
		const ev = fn(z.events)
		z.emitter.emit(ev, ...args)
	}

	// test(){
	// 	// const z = this
	// 	// this.emitter.emit(z.events.httpErr, 11, 'str') //ok
	// 	//this.emitter.emit(z.events.httpErr) //編譯錯誤。因爲 httpErr = EV<[number, string]>('httpErr') 規定 emit事件之後要帶上一個number和一個string作爲參數
	// 	// this.emit(e=>e.httpErr, 11, 'str') //ok
	// 	// this.emit(e=>e.httpErr) //他應該產生編譯錯誤。 幫我完成類型約束
	// }
	
	protected initRouter(){
		const z = this
		return z.router
	}
}
