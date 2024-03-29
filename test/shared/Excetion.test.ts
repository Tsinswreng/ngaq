import { Exception, Reason } from "@shared/Exception"

const ast = (a,b:any=true)=>{
	expect(a).toBe(b)
}

class _Reason{
	static new(){
		const o = new this()
		return o
	}
	r1 = Reason.new('r1')
	r2 = Reason.new('r2')
}

class Handle{
	static new(){
		const o = new this()
		return o
	}
	reason:Reason
	handleFn(){}
}
const reasons = _Reason.new()
const reasons__handle = new Map<Reason, Handle>()
const handle1 = Handle.new()
handle1.handleFn = function(this){
	const z = this
	console.error('原因1')
}

reasons__handle.set(reasons.r1, handle1)



describe('exception', ()=>{
	it('1', ()=>{
		try {
			throw Exception.new('abcd')
		} catch (error) {
			const e = error as Exception
			ast(e instanceof Exception)
			ast(e instanceof Error)
			ast(e.message, 'abcd')
		}
	})

	it('2', ()=>{
		try {
			throw Exception.for(reasons.r1)
		} catch (error) {
			if(error instanceof Exception){
				
			}
			const ex = error as Exception
			ast(ex.reason===reasons.r1)
			//console.log(ex)
			const ha = reasons__handle.get(ex?.reason)
			if(ha != void 0){
				ha.handleFn()
			}
		}
	})
})