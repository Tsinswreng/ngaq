
type Args<T> = T extends any[] ? T : [T]



export class Event<Arg extends any[] =any[]>{
	protected _name:string
	get name(){return this._name}

	protected _base:Event<Arg>|undefined
	get base(){return this._base}

	protected constructor(){

	}
	static new<Arg extends any[] =any[]>(name:string, base?:Event<Arg>){
		const o = new this<Arg>()
		o.__init__(name, base)
		return o
	}

	protected __init__(...args:Parameters<typeof Event.new>){
		const o = this
		o._name = args[0]
		o._base = args[1]
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
	error = Event.new('error')
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