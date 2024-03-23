import * as Ut from '@shared/Ut'
import Tempus from '@shared/Tempus'
const ast = (b:boolean)=>{
	expect(b).toBe(true)
}
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

describe('inherit',()=>{

	class Father{
		name:string = 'father'
	}

	class Child{
		age:number = 18
	}

	it('1', ()=>{
		const f = new Father()
		const c = new Child()
		const ans = Ut.inherit(c, f)
		const b1 = ans instanceof Child
		const b2 = ans['name'] === 'father'
		const b3 = ans.age === 18
		ast(b1)
		ast(b2)
		ast(b3)
	})
})

describe('As', ()=>{
	class Father{
		name:string = 'father'
	}

	class Child extends Father{
		age:number = 18
	}

	const f = new Father()
	const c = new Child()
	it('1', ()=>{
		const ans = Ut.As(c, Child)
		ast(ans===c)
	})

	it('2', ()=>{
		let ans
		let err_:Error
		try {
			ans = Ut.As(f, Child, '114')
		} catch (error) {
			err_ = error as Error
		}finally{
			const err = Ut.$(err_!)
			ast(err.message === '114')
		}
		
	})
})