import { PubConstructor } from "@shared/Type"
import * as IF from "./I_linkedEvent"

type Args<T> = T extends any[] ? T : [T]


export class Event<Arg extends any[] =any[]>
	implements IF.I_LinkedEvent<Arg>
{
	protected _name:string
	/** unique */
	get name(){return this._name}

	protected _base:Event<Arg>|undefined
	get base(){return this._base}

	protected constructor(){

	}
	static new<Arg extends any[] =any[]>(name:string, base?:Event<Arg>){
		const z = new this<Arg>()
		z.__init__(name, base)
		return z
	}

	protected __init__(...args:Parameters<typeof Event.new>){
		const z = this
		z._name = args[0]
		z._base = args[1]
		return z
	}
}


/**
 * 自觸發ʹ事件。
 * 成員 含 事件觸發器
 */
export class SelfEmitEvent<Arg extends any[]> extends Event<Arg>
	implements IF.I_LinkedEvent<Arg>, IF.I_LinkedEvent
{


	static new<Arg extends any[] =any[]>(
		name:string
		, base?:Event<Arg>
		, emitter?:IF.I_LinkedEmitter // 事件列表構造旹 注入、可不傳。
	){
		const z = new this<Arg>()
		z.__init__(name, base, emitter)
		return z
	}

	//@ts-ignore
	protected __init__(...args:Parameters<typeof SelfEmitEvent.new>){
		const z = this
		//@ts-ignore
		super.__init__(...args)
		//@ts-ignore
		z._emitter = args[2]
		return z
	}

	/** 在事件列表初始化旹注入 */
	protected _emitter:LinkedEmitter
	get emitter(){return this._emitter}
	protected set emitter(v){this._emitter = v}

	emit(...args:Arg){
		const z = this
		z.emitter.emit(z, ...args)
	}
	
	on(listener: (...args:Arg)=>void){
		const z = this
		z.emitter.on(z, listener)
	}
}


export interface I_EventEmitter extends IF.I_EventEmitter{

}



export class LinkedEmitter implements IF.I_LinkedEmitter{
	protected _eventEmitter: I_EventEmitter
	get eventEmitter(){return this._eventEmitter}
	protected constructor(){

	}

	static new(_eventEmitter: I_EventEmitter){
		const o = new this()
		//o._eventEmitter = _eventEmitter
		o.__init__(_eventEmitter)
		return o
	}

	protected __init__(...args:Parameters<typeof LinkedEmitter.new>){
		const o = this
		o._eventEmitter = args[0]
	}

	/**
	 * 不是責任鏈模式
	 */
	emit<Arg extends any[] =any[]>(
		event:Event<Arg>
		, ...args:Arg
	):int{
		let cnt = 0
		for(let e = event;e instanceof Event;){
			this.eventEmitter.emit(e.name, ...args)
			cnt++
			if( e.base != void 0 && e.base instanceof Event ){
				e = e.base
			}else{
				break
			}
		}
		return cnt
	}

	on<Arg extends any[]>(event:Event<Arg>, callback:(...args:Arg)=>void){
		//@ts-ignore
		this.eventEmitter.on(event.name, callback)
	}
}

export class Events implements IF.I_Events{
	constructor(){}
	static new(...args:any[]){
		const o = new this()
		o.__init__()
		return o
	}
	protected __init__(...args:any[]){}
	error = Event.new<[any]>('error')
	//;[key:string]:IF.I_LinkedEvent<any>
}

/**
 * ev instanceof SelfEmitEvent旹注入emitter。
 */
export class SelfEmitEvents extends Events{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof SelfEmitEvents.new>){
		const z = this
		const emitter = args[0]
		const keys = Object.keys(z)
		for(const k of keys){
			const ev = z[k]
			if(
				ev instanceof SelfEmitEvent
			){
				//@ts-ignore
				ev.emitter = emitter
			}
		}
		return z
	}

	static new(emitter:LinkedEmitter){
		const z = new this()
		z.__init__(emitter)
		return z
	}
	error = SelfEmitEvent.new<[any]>('error')

	//get This(){return SelfEmitEvents}
}


export interface I_linkedEmittable extends IF.I_linkedEmittable{

}



export function mixinLinkedEvent<
	Cls extends PubConstructor
>(
	Base:Cls
	,events_: SelfEmitEvents
	,emitter: IF.I_LinkedEmitter
){
	class Ans extends Base implements I_linkedEmittable{
		linkedEmitter: IF.I_LinkedEmitter = emitter
		events: SelfEmitEvents = events_
	}
	return Ans
}



// export const Emitter = _Emitter
// export type Emitter = _Emitter

// export const Event = _Event
// export type Event = _Event

//usage:
/* 
class MyEvents extends Events{
	protected constructor(){
		super()
	}
	static new(){
		const o = new this()
		return o
	}
	static instance = MyEvents.new()
	parent = Event.new<[number, string]>('parent')
	child = Event.new('child', this.parent)
}
const myEvents = MyEvents.instance
const emt = Emitter.new(new EventEmitter())
emt.on(myEvents.parent, (num:number, str:string)=>{

})
emt.emit(myEvents.child, 114, '514') */


/* 
	emit<T extends Le.Event<any[]>>(
		fn: (ev: typeof this.events) => T,
		...args: T extends Le.Event<infer U> ? U : never
	){
		const z = this
		const ev = fn(z.events)
		z.emitter.emit(ev, ...args)
	}

*/