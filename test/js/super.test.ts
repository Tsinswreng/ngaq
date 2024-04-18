describe('super', ()=>{
	class Base{
		a='a'
		constructor(){

		}

		__Base__(a:string){
			this.a = a
			return this
		}
	}

	class Sub extends Base{
		b = 'b'
		constructor(){
			super()
		}

		__Sub__(){
			super.__Base__('z')
		}
	}

	it('1',()=>{
		const s = new Sub()
		s.__Sub__()
		console.log(s.a)
	})

})


describe('custom constructor', ()=>{
	it('1',()=>{

		

		/* 
		local function setPrototype(t, p)
		  setmetatable(t, p)
		  p.__index = p
		end
		*/
		// function setPrototypeOf<T>(this:void, o:T, proto){
		// 	// const mt = {}
		// 	// mt.__index = proto
		// 	//return setmetatable(o, mt)
		// 	//setmetatable(o,{__index:proto})
		// 	setmetatable(o, proto)
		// 	proto.__index = proto
		// 	return o
		// }
		
		interface IF{
			__init__(...args:any[]):this
		}
		
		class Parent implements IF{
		
			protected constructor(){}
		
			static new(name:string, age:number):Parent
			static new(...p:any[]):never
		
			static new(name:string, age:number){
				const o = new this()
				// o._name = name
				// o._age = age
				o.__init__(name, age)
				return o
			}
		
		
			__init__(...param:Parameters<typeof Parent.new>): this {
				const z = this
				z._name = param[0]
				z._age = param[1]
				return z
			}
		
			protected _name:string
			get name(){return this._name}
		
			protected _age:number
			get age(){return this._age}
		}
		
		class Child extends Parent{
		
			protected constructor(){
				super()
			}
		
			
			static new(name:string, age:number, gender:string):Child
			static new(...p:any[]):never
			static new(name:string, age:number, gender:string):Child{
				// const p = Parent.new(name, age)
				// const c = new this()
				// c._gender = gender
				// setPrototypeOf(p,c)
				// return p as Child
				let o = new this()
				o = o.__init__(name, age, gender)
				return o
			}
		
			override __init__(...param: Parameters<typeof Parent.new>): this {
				const z = this
				super.__init__(param[0], param[1])
				z._gender = param[2]
				return z
			}
		
			protected _gender:string
			get gender(){return this._gender}
		
		}
		
		
		function test(){
			const pa = Parent.new('name', 13)
			const ch = Child.new('n', 12, 'male')
		
			console.log(ch instanceof Parent)
			console.log(ch instanceof Child)
			console.log(ch.age)
			console.log(ch['_age'])
			console.log(ch.gender)
			console.log(ch['_gender'])
		}
		
		test()
	})
})


describe('static custom constructor `s name be the same as class name',()=>{
	class Parent{
		static Parent(name:string){
			const o = new this()
			//const o = new Parent()
			o.__init__(name)
			return o
		}
	
		protected __init__(...args:Parameters<typeof Parent.Parent>){
			const z = this
			z.name = args[0]
		}
		defau='defau'
		name:string
	}
	
	class Child extends Parent{
		static Child(name:string, age:number){
			const o = new this()
			o.__init__(name, age)
			return o
		}
		//@ts-ignore
		protected __init__(...args:Parameters<typeof Child.Child>){
			const z = this
			super.__init__(args[0])
			z.age = args[1]
		}
		age:number
	}

	it('1',()=>{
		const o = Child.Child('ch', 2)
		expect(o instanceof Child).toBe(true)
		expect(o instanceof Parent).toBe(true)
		expect(o.defau).toBe('defau')
		expect(o.age).toBe(2)
		expect(o.name).toBe('ch')
	})
	it('2',()=>{
		const o = Child.Parent('ch')
		expect(o instanceof Child).toBe(true)
		expect(o instanceof Parent).toBe(true)
		expect(o.defau).toBe('defau')
		expect(o['age']).toBe(void 0)
		expect(o.name).toBe('ch')
	})
})


describe('2: static custom constructor `s name be the same as class name',()=>{
	class Parent{
		static Parent(name:string){
			//const o = new this()
			const o = new Parent()
			o.__init__(name)
			return o
		}
	
		protected __init__(...args:Parameters<typeof Parent.Parent>){
			const z = this
			z.name = args[0]
		}
		defau='defau'
		name:string
	}
	
	class Child extends Parent{
		static Child(name:string, age:number){
			//const o = new this()
			const o = new Child()
			o.__init__(name, age)
			return o
		}
		//@ts-ignore
		protected __init__(...args:Parameters<typeof Child.Child>){
			const z = this
			super.__init__(args[0])
			z.age = args[1]
		}
		age:number
	}

	it('1',()=>{
		const o = Child.Child('ch', 2)
		expect(o instanceof Child).toBe(true)
		expect(o instanceof Parent).toBe(true)
		expect(o.defau).toBe('defau')
		expect(o.age).toBe(2)
		expect(o.name).toBe('ch')
	})
	it('2',()=>{
		const o = Child.Parent('ch')
		expect(o instanceof Child).toBe(false)
		expect(o instanceof Parent).toBe(true)
		expect(o.defau).toBe('defau')
		expect(o['age']).toBe(void 0)
		expect(o.name).toBe('ch')
	})
})