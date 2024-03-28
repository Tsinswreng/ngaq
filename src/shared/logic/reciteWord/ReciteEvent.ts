import * as Le from '@shared/linkedEvent'


const Ev = Le.Event.new.bind(Le)
class ReciteEvents extends Le.Events{
	protected constructor(){
		super()
	}
	static new(){
		const o = new this()
		return o
	}
	
	reciteEvent = Ev('reciteEvent')
	// rmb = Ev('rmb')
	// fgt = Ev('fgt')
	load = Ev('load')
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

