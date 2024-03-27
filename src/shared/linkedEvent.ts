
export class Event{
	protected _name:string
	get name(){return this._name}

	protected _base:Event|undefined
	get base(){return this._base}

	protected constructor(){

	}
	static new(name:string, base?:Event){
		const o = new this()
		o._name = name
		o._base = base
		return o
	}
}

export interface I_EventEmitter{
	emit(eventName: string | symbol, ...args: any[]):unknown
	on(eventName: string | symbol, listener: (...args: any[]) => void): this;
}


export class Emitter{
	protected _eventEmitter: I_EventEmitter
	get eventEmitter(){return this._eventEmitter}
	protected constructor(){

	}

	static new(_eventEmitter: I_EventEmitter){
		const o = new this()
		o._eventEmitter = _eventEmitter
		return o
	}

	emit(event:Event, ...args:any[]){
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

	on(event:Event, callback:(...args:any[])=>void){
		this.eventEmitter.on(event.name, callback)
	}
}

export class Events{
	protected constructor(){}
	static new(){
		const o = new this()
		return o
	}
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
	parent = Event.new('parent')
	child = Event.new('child', this.parent)
}
const myEvents = MyEvents.instance
const emt = Emitter.new(new EventEmitter())
emt.on(myEvents.parent, ()=>{

})
emt.emit(myEvents.child, 114, '514') */