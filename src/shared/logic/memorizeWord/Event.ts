import * as Le from '@shared/linkedEvent'

const Ev = Le.Event.new.bind(Le.Event)
export class ProcessEvents extends Le.Events{
	protected constructor(){
		super()
	}
	static new(){
		const o = new this()
		return o
	}
	static instance = ProcessEvents.new()
	
	/** 蔿一單詞觸發單詞事件 */
	neoWordEvent = Ev('neoWordEvent') //?
	load = Ev('load')
	sort = Ev('calcWeight')
	start = Ev('start')
	save = Ev('save')
	restart = Ev('restart')
}
