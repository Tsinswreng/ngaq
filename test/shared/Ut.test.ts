import * as Ut from '@shared/Ut'
import Tempus from '@shared/Tempus'
describe('',()=>{
	it('', ()=>{
		try {
			let a
			Ut.$(a)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
		}
	})

	it('addFn',()=>{
		const nunc = Tempus.new()
		const b = Ut.addFn(Number.prototype, nunc.iso, function(y){
			//@ts-ignore
			return this+y
		})
		let num = 1
		let ans = num[nunc.iso](2)
		expect(b).toBe(true)
		expect(ans).toBe(3)
		const b2 = Ut.addFn(Number.prototype, nunc.iso, function(y){
			//@ts-ignore
			return this+y
		})
		expect(b2).toBe(false)
		//console.log(ans, b, b2, Number.prototype)
	})
})