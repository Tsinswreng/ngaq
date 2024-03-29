import * as Le from '@shared/linkedEvent'


const Ev = Le.Event.new.bind(Le)
export class ReciteEvents extends Le.Events{
	protected constructor(){
		super()
	}
	static new(){
		const o = new this()
		return o
	}
	static instance = ReciteEvents.new()
	
	reciteEvent = Ev('reciteEvent')
	// rmb = Ev('rmb')
	// fgt = Ev('fgt')
	load = Ev('load')
	calcWeight = Ev('calcWeight')
	sort = Ev('sort')
	start = Ev('start')
	save = Ev('save')
	restart = Ev('restart')
}


/* class ReciteEvent extends Le.Event{
	protected constructor(){
		super()
	}
	static new(name:string){
		const o = new this()
		o._name = name
		return o
	}
}


class RememberEvent extends ReciteEvent{
	protected constructor(){
		super()
	}
	static new(name:string){
		const o = new this()
		o._name = name
		o._base = ReciteEvent.new(name)
		return o
	}
} */

