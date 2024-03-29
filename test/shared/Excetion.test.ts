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

const reasons = _Reason.new()

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
		}
	})
})