describe('Object',()=>{
	it('1', ()=>{
		try {
			const o1 = {
				foo: 'bar'
				,age: 18
				,arr: ['a','b']
				,sayHello(){
					console.log('hello')
				}
			}
	
			const o2 = Object.freeze(o1)
			//@ts-ignore
			o2.age = 19 //報錯
			console.log(o1)
			console.log(o2)
		} catch (error) {
			console.error(error)
		}
	})

	it('2', ()=>{
		try {
			const o1 = {
				foo: 'bar'
				,age: 18
				,arr: ['a','b']
				,sayHello(){
					console.log('hello')
				}
			}
	
			const o2 = Object.freeze(o1)
			o1.age = 19 //也凍結、報錯
			console.log(o1)
			console.log(o2)
		} catch (error) {
			console.error(error)
		}
	})

	it('3', ()=>{
		try {
			const o1 = {
				foo: 'bar'
				,age: 18
				,arr: ['a','b']
				,sayHello(){
					console.log('hello')
				}
			}
			const o2 = Object.freeze(o1)
			o2.arr.push('c')
			console.log(o1)
			console.log(o2)

		} catch (error) {
			console.error(error)
		}
	})

})


describe('proto', ()=>{
	it('1', ()=>{
		class A{

		}
		
		class B{
		
		}
		
		const B_ = B
		//@ts-ignore
		B_.__proto__ = A
		const b = new B_()
		console.log(b instanceof A) //false
	})
	it('2', ()=>{
		class A{

		}
		
		class B{
		
		}
		
		const B_ = B
		//@ts-ignore
		B_.__proto__ = A.__proto__
		const b = new B_()
		console.log(b instanceof A) //false
	})

	it('3', ()=>{
		class A{

		}
		
		class B{
		
		}
		
		const B_ = B
		//@ts-ignore
		B_.prototype = A.prototype //TypeError: Cannot assign to read only property 'prototype' of function 'class B {}'
		const b = new B_()
		console.log(b instanceof A) //false
	})

	it('4', ()=>{
		class A{

		}
		
		class B{
		
		}
		
		const B_fn = function() {};
		Object.setPrototypeOf(B_fn.prototype, A.prototype);
		const B_ = B_fn()
		
		const b2 = new (B_fn)();
		console.log(b2 instanceof A); //true

		//@ts-ignore
		//const b = new B_() // TypeError: B_ is not a constructor
		//console.log(b instanceof A);
	})

	it('5', ()=>{
		class A{
			aname:'a'
		}
		
		class B{
			bname:'b'
		}
		
		const B_fn = function() {};
		Object.setPrototypeOf(B_fn.prototype, A.prototype);
		const B_ = B_fn()
		
		const b2 = new B_fn(); // (new B_fn)()
		console.log(b2) //B_fn {}
		console.log(b2 instanceof A); //true
		console.log(b2 instanceof B); //false

		//@ts-ignore
		//const b = new B_() // TypeError: B_ is not a constructor
		//console.log(b instanceof A);
	})
})


describe('extend static', ()=>{
	it('1', ()=>{
		class A{
			static arr = ['a','b']
		}

		class B extends A{
		}

		B.arr.push('c')
		console.log(A.arr) // [ 'a', 'b', 'c' ]
	})

	it('2', ()=>{
		class A{
			static arr = ['a','b']
		}

		class B extends A{
			arr = A.arr.slice()
		}

		B.arr.push('c')
		console.log(A.arr) // [ 'a', 'b' 'c' ]
	})
})