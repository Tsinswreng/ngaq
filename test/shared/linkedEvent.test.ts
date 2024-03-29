import * as Le from '@shared/linkedEvent'
import EventEmitter3 from 'eventemitter3'
import EventEmitter = require('events')
describe('le', ()=>{
	// class Parent extends Le.Event{
	// 	constructor(){
	// 		super()
	// 	}
	// 	static new(name:string, base?){
	// 		const o = new this()
	// 		o._name = name
	// 		return o
	// 	}
	// }

	// class Child extends Parent{
	// 	constructor(){
	// 		super()
	// 	}
	// 	static new(name:string, base:Le.Event){
	// 		const o = new this()
	// 		o._name = name
	// 		o._base = base
	// 		return o
	// 	}
	// }

	class Parent extends Le.Event{
		
	}

	class Child extends Le.Event{

	}

	class MyEvents extends Le.Events{
		protected constructor(){
			super()
		}
		static new(){
			const o = new this()
			return o
		}
		static instance = MyEvents.new()
		parent = Parent.new('parent')
		child = Child.new('child', this.parent)
	}


	const myEvents = MyEvents.instance

	it('1 parent only', ()=>{
		const emt = Le.LinkedEmitter.new(new EventEmitter3())
		let res = false
		const parentCallback = (str1:string, str2:string)=>{
			//console.log(114514)
			expect(str1).toBe('parent')
			expect(str2).toBe('Parent')
			res = true
		}
		emt.on(myEvents.parent, parentCallback)
		emt.emit(myEvents.parent, 'parent', 'Parent')


		// console.log(
		// 	emt.eventEmitter instanceof EventEmitter
		// ) true
		
		// emt.eventEmitter.emit('in', 1, 2)
		// emt.eventEmitter.on('in', (...args)=>{
		// 	console.log(args)
		// })
		setTimeout(()=>{
			expect(res).toBe(true)
		},100)
	})

	it('2 child only', ()=>{
		const emt = Le.LinkedEmitter.new(new EventEmitter3())
		let childRes = false
		let c_cnt = 0
		const c_callback = (str1:string, str2:string)=>{
			c_cnt++
			expect(str1).toBe('1')
			expect(str2).toBe('2')
			childRes = true
			//console.log(childRes)
			//console.log(c_cnt) //2
			expect(c_cnt).toBe(1)
		}

		let parentRes = false

		emt.on(myEvents.child, c_callback)
		
		const cnt_emit = emt.emit(myEvents.child, '1', '2')
		//console.log(cnt_emit)
		expect(cnt_emit).toBe(2)

		setTimeout(()=>{
			expect(childRes).toBe(true)
			expect(parentRes).toBe(false)
		},100)
		
	})

	it('3 both', ()=>{
		const emt = Le.LinkedEmitter.new(new EventEmitter3())
		let childRes = false
		let c_cnt = 0
		const c_callback = (str1:string, str2:string)=>{
			c_cnt++
			expect(str1).toBe('1')
			expect(str2).toBe('2')
			childRes = true
			//console.log(childRes)
			//console.log(c_cnt) //2
			expect(c_cnt).toBe(1)
		}

		let parentRes = false
		const f_callback = (str1:string, str2:string)=>{
			expect(str1).toBe('1')
			expect(str2).toBe('2')
			parentRes = true
		}
		
		emt.on(myEvents.child, c_callback)
		emt.on(myEvents.parent, f_callback)
		const cnt_emit = emt.emit(myEvents.child, '1', '2')
		//console.log(cnt_emit)
		expect(cnt_emit).toBe(2)

		setTimeout(()=>{
			expect(childRes).toBe(true)
			expect(parentRes).toBe(true)
		},100)
		
	})

})