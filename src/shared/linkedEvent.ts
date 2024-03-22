
class _Event{
	protected _name:string
	get name(){return this._name}

	protected _base:_Event|undefined
	get base(){return this._base}

	protected constructor(){

	}
	static new(name:string){
		const o = new this()
		o._name = name
		return o
	}
}

export interface I_EventEmitter{
	emit(eventName: string | symbol, ...args: any[]):unknown
}



class _Emitter{
	protected _eventEmitter: I_EventEmitter
	get eventEmitter(){return this._eventEmitter}
	protected constructor(){

	}

	static new(_eventEmitter: I_EventEmitter){
		const o = new this()
		o._eventEmitter = _eventEmitter
		return o
	}

	emit(event:_Event, ...args:any[]){
		for(let e = event;e.base != void 0 && e.base instanceof _Event;e = e.base){
			this.eventEmitter.emit(e.name, ...args)
		}
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

export const Emitter = _Emitter
export type Emitter = _Emitter

export const Event = _Event
export type Event = _Event