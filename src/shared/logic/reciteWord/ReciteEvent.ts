import * as Le from '@shared/linkedEvent'

class ReciteEvent extends Le.Event{
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
}