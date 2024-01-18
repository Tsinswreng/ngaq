import * as Ut from '@shared/Ut'
describe('',()=>{
	it('', ()=>{
		try {
			let a
			Ut.$(a)
		} catch (error) {
			expect(error).toBeInstanceOf(Error)
		}
	})
})