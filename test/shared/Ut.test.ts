import * as Ut from '@shared/Ut'
import Tempus from '@shared/Tempus'
import lodash from 'lodash'
const eq = lodash.isEqual
const ast = (b:boolean)=>{
	expect(b).toBe(true)
}


describe('As', ()=>{
	const As = Ut.As
	it('primitiveAs1', ()=>{
		let a:any = 1
		let ans = As(a, 'number')
	})
})

describe('object_keys', ()=>{
	const fn = Ut.object_keys
	it('1', ()=>{
		const arr = [1,2,3]
		const keys = fn(arr)
		ast(eq(keys,[0,1,2]))
	})
	it('2',()=>{
		const obj = {
			foo: 'bar'
			,f2: 2
			,f3: true
		}
		const keys = fn(obj)
		ast(eq(keys, ['foo','f2','f3']))
	})
})

const Object_keys = Ut.object_keys


describe('recursiveType', ()=>{
	const fn = Ut.deepType
	it('1',()=>{
		let a = {
			f1: 'bar'
			,f2: 2
			,f3: true
			,f4: []
			,f5: [
				1, '2', {
					f6: 'f7'
				}
			]
		}
		Object.freeze(a)
		
		let typ = {
			f1: 'string'
			,f2: 'number'
			,f3: 'boolean'
			,f4: []
			,f5: [
				'number'
				,'string'
				,{
					f6: 'string'
				}
			]
		}
		let ans = fn(a)
		
		
		//console.log(ans)
		ast(eq(ans, typ))
	})
})


describe('$',()=>{
	it('1', ()=>{
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
	// const ans = Ut.inherit(c, f)
	// const b0 = ans === c
	// const b1 = ans instanceof Child
	// const b2 = ans['name'] === 'father'
	// const b3 = ans.age === 18
	// const b4 = ans instanceof Father

	// //請你實現Ut.inherit方法、使b0~b4都爲true

	it('1', ()=>{
		class Father{
			name:string = 'father'
		}
	
		class Child extends Father{
			age:number = 18
		}
	
		const f = new Father()
		const c = new Child()
		const ans = Ut.inherit(c, f)
		const b0 = ans === f
		const b1 = ans instanceof Child
		const b2 = ans['name'] === 'father'
		const b3 = ans.age === 18
		const b4 = ans instanceof Father
		ast(b0)
		ast(b1)
		ast(b2)
		ast(b3)
		ast(b4)
	})

	it('2', ()=>{
		class Father{
			protected constructor(){}
			static new(){
				const o = new this()
				o.name = 'father'
				return o
			}
			name:string
		}
	
		class Child extends Father{
			protected constructor(){
				super()
			}
			static new(){
				const f = Father.new()
				const c = new Child()
				const o = Ut.inherit(c,f)
				o.age = 18
				return o
			}
			age:number
		}
		const ans = Child.new()
		//console.log(ans)
		const b1 = ans instanceof Child
		const b2 = ans['name'] === 'father'
		const b3 = ans.age === 18
		const b4 = ans instanceof Father
		//console.log(b1,b2,b3,b4)
		ast(b1)
		ast(b2)
		ast(b3)
		ast(b4)
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
		const ans = Ut.instanceAs(c, Child)
		ast(ans===c)
	})

	it('2', ()=>{
		let ans
		let err_:Error
		try {
			ans = Ut.instanceAs(f, Child, '114')
		} catch (error) {
			err_ = error as Error
		}finally{
			const err = Ut.$(err_!)
			ast(err.message === '114')
		}
		
	})
})

describe('classify', ()=>{
	const fn = Ut.classify.bind(Ut)
	it('1', ()=>{
		let arr = [
			{
				name:'a'
				,seg:'0'
			}
			,
			{
				name:'b'
				,seg:'0'
			}
			,
			{
				name:'c'
				,seg:'1'
			}
		]
		const ans = fn(arr, (e)=>e.seg)
		console.log(ans)
	})
})



describe('hasOwnProperty', ()=>{
	class Pa{
		a
		b=1
		c='c'
	}

	class Ch extends Pa{
		ch1
		ch2=2
		get chg(){return ''}
	}
	const ch = new Ch()
	it('1',()=>{
		for(const key in ch){
			console.log(key)
		}
	})
	it('2', ()=>{
		const keys = Object.getOwnPropertyNames(ch)
		console.log(keys)
	})
})

describe('assignExisting', ()=>{
	class WordRow{
		id
		text
		ct
	}
	class Word{
		id?:number
		text:string
		ct:Tempus
	}
	it('1',()=>{

	})
})