// import type { PubConstructor } from "@shared/Type"



// function mixinStaticNew<Cl extends PubConstructor>(base: Cl) {
// 	return class extends base {
// 		static new(){

// 		}
// 	}
// }


// const Photo = mixinStaticNew(Object)

export {}


const Log = <F>(param:str, oldFn:F) =>{
	//@ts-ignore
	return (...args:Parameters<F>):ReturnType<F>=>{
		console.log(param)
		//@ts-ignore
		const ans = oldFn(...args)
		console.log(param)
		return ans
	}
}


class Person{
	constructor(){}
	protected __init__(...args: Parameters<typeof Person.new>){
		const z = this
		z.name = args[0]
		z.age = args[1]
		return z
	}

	static new(name:str, age:int){
		const z = new this()
		z.__init__(name, age)
		return z
	}

	get This(){return Person}

	name:str
	age:int

	add = Log('a', 
		(a:num,b:num):num=>{
			//@ts-ignore
			console.log(this, 'this')
			return a+b
		}
	)
	printThis(){
		console.log(this)
	}
}


const per = Person.new('Alice', 20)

console.log(per.add(1,2))

// console.log(
// 	per.printThis()
// )