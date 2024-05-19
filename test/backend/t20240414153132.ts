
export{}
// function setPrototypeOf<T>(this:void, o:T, proto){
// 	const mt = {}
// 	mt.__index = proto
// 	//return setmetatable(o, mt)
// 	setmetatable(o,mt)
// 	return o
// }

function setPrototypeOf<T>(this:void, o:T, proto) {
	Object.setPrototypeOf(o, proto)
	return o
}

class Parent{

	protected constructor(){}

	static new(name:string, age:number):Parent
	static new(...p:any[]):never

	static new(name:string, age:number){
		const o = new this()
		o._name = name
		o._age = age
		return o
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
		const p = Parent.new(name, age)
		const c = new this()
		c._gender = gender
		setPrototypeOf(p,c)
		return p as Child
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

//test()

class BaseClass {
    protected constructor() {}

    static async New<T extends BaseClass>(Cls: { new(): T }): Promise<T> {
        const instance = new Cls();
        await instance.initialize();
        return instance;
    }

    async initialize() {
        console.log("BaseClass 初始化中...");
        await this.asyncSetup();
        console.log("BaseClass 初始化完成.");
    }

    protected async asyncSetup() {
        console.log("BaseClass 的 asyncSetup 方法被调用.");
    }
}

class SubClass extends BaseClass {
    asyncSetup() {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log("SubClass 的 asyncSetup 方法被调用.");
                resolve();
            }, 200);
        });
    }
}

async function main() {
	//@ts-ignore
    const obj = await SubClass.New(SubClass);
    console.log(obj instanceof SubClass); // 输出 true
}

//main();


class Cl{
	name = 'name'
	age = 0
	konstructor(name:string, age:number){
		const z = this
		z.name = name
		z.age = age
	}
}

const obj = new Cl.prototype.konstructor('namae', 20) //TypeError: Cl.prototype.konstructor is not a constructor
console.log(obj)
console.log(obj instanceof Cl)