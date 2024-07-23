
type Args<T> = T extends any[] ? T : [T]



export class Event<Arg extends any[] =any[]>{
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

export class SelfEmitEvent<Arg extends any[]> extends Event<Arg>{


	static new<Arg extends any[] =any[]>(name:string, base?:Event<Arg>, emitter?:LinkedEmitter){
		const z = new this<Arg>()
		z.__init__(name, base, emitter)
		return z
	}

	//@ts-ignore
	protected __init__(...args:Parameters<typeof SelfEmitEvent.new>){
		const z = this
		// z._name = args[0]
		// z._base = args[1]
		//@ts-ignore
		super.__init__(...args)
		//@ts-ignore
		z._emitter = args[2]
		return z
	}

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

export interface I_EventEmitter{
	emit(eventName: string | symbol, ...args: any[]):unknown
	on(eventName: string | symbol, listener: (...args: any[]) => void): this;
}


export class LinkedEmitter{
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

export class Events{
	constructor(){}
	static new(){
		const o = new this()
		o.__init__()
		return o
	}
	protected __init__(){}
	error = Event.new<[any]>('error')
}

export class SelfEmitEvents extends Events{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof SelfEmitEvents.new>){
		const z = this
		const emitter = args[0]
		const keys = Object.keys(z)
		for(const k of keys){
			const ev = z[k]
			if(ev instanceof SelfEmitEvent){
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