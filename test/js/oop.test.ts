describe('This in instance', ()=>{
	it('1',()=>{
		class Parent{
			This = Parent
			static arr = ['a']
			print(){
				const This = this.This
				console.log(This.arr)
			}
		}
		
		class Child extends Parent{
			This = Child
			static override arr = ['a','b']
		}
		const c = new Child()
		c.print() // ['a','b']
	})
	
})