import lodash from 'lodash'
const fn = lodash.cloneDeep.bind(lodash)
describe('deepClone',()=>{

	class A{
		static sta = 'static'
		instance = 'instance'
		num = 4
		static add_s(a,b){
			return a+b
		}
		add_ins(b){
			return this.num + b
		}
	}

	class B extends A{
		static bSta = 'b_static'
		bin = 'bin'
	}


	it('1', ()=>{
		try {
			const B_ = fn(B)
			console.log(B) //[class B extends A] { bSta: 'b_static' } 
			console.log(B_) //{ bSta: 'b_static' }
			const b = new B()
			const b_ = new B_()//報錯  B_ is not a constructor
			console.log(b)
			console.log(b_)
		} catch (error) {
			console.error(error)
		}

	})
})
