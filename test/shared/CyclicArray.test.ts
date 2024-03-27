import ArrayDeque from '@shared/CyclicArray'
import lodash from 'lodash'
const eq = lodash.isEqual
const ast = (a, b:any=true)=>{
	return expect(a).toBe(b)
}

describe('0', ()=>{
	const d = ArrayDeque.new<string>(8)
	d.addBack('a')
	d.addBack('b')
	d.addBack('c')
	d.addBack('d')

	d.addFront('x')
	d.addFront('y')
	d.addFront('z')
	it('0',()=>{
		ast(eq(d.toArray(),
			['z','y','x','a','b','c','d']
		))
	})

	it('multi f iter',()=>{
		const fIter = d.frontIterFn()
		ast(fIter(1),'z')
		ast(fIter(2),'x')
	})

	it('multi b iter',()=>{
		const bIter = d.backIterFn()
		ast(bIter(1),'d')
		ast(bIter(2),'b')
		ast(bIter(1),'a')
	})

	
})

describe('Deque', ()=>{
	const d = ArrayDeque.new<string>(4)
	d.addBack('a')
	d.addBack('b')
	d.addBack('c')
	d.addBack('d')
	it('size', ()=>{
		//console.log(d.size)
		expect(d.size).toBe(4)
		let ans = d.addBack('e')
		expect(ans).toBe(false)
		expect(d.size).toBe(4)
	})
	
	it('frontIter', ()=>{
		const iter = d.frontIterFn()
		const ans = [] as string[]
		for(let i = 0; i < d.size ;i++){
			const ele = iter()
			ans.push(ele)
		}
		//console.log(ans)
		ast(eq(
			ans,
			['d','c','b','a'].reverse()
		))
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(let i = 0;i < d.size;i++){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		//console.log(ans)
		// ast(eq(
		// 	ans,
		// 	['d','c','b','a']
		// ))
		//console.log(ans)
		ast(eq(ans,['d','c','b','a']))
		
	})
})


describe('Deque2', ()=>{
	const d = ArrayDeque.new<string>(4)
	d.addBack('a')
	d.addBack('b')
	d.addBack('c')
	d.addBack('d')
	let rm = d.removeFront()
	let ad = d.addBack('e')
	let ad2 = d.addBack('f') // false

	it('rm ad', ()=>{
		expect(rm).toBe('a')
		expect(ad).toBe(true)
		expect(ad2).toBe(false)
	})

	it('size', ()=>{
		//console.log(d.size)
		//expect(d.size).toBe(4)
		//let ans = d.addBack('e')
		//expect(ans).toBe(false)
		expect(d.size).toBe(4)
	})
	
	it('frontIter', ()=>{
		const iter = d.frontIterFn()
		const ans = [] as string[]
		for(let i = 0; i < d.size; i++){
			const ele = iter()
			ans.push(ele)
		}
		// console.log(ans)
		// console.log(d.toArray())
		// console.log(d['_data'])

		ast(eq(
			ans
			,['b','c','d','e']
		))
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(let i = 0;i < d.size;i++){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		ast(eq(
			ans
			,['b','c','d','e'].reverse()
		))
		// console.log(ans)
		// console.log(d['_data'])
	})
})

describe('Deque3', ()=>{
	const d = ArrayDeque.new<string>(4)
	d.addBack('a')
	d.addBack('b')
	d.addBack('c')
	d.addBack('d')
	let rm = d.removeBack()
	let ad = d.addFront('z')
	let ad2 = d.addFront('x')

	it('rm ad', ()=>{
		expect(rm).toBe('d')
		expect(ad).toBe(true)
		expect(ad2).toBe(false)
	})

	it('size', ()=>{
		//console.log(d.size)
		//expect(d.size).toBe(4)
		//let ans = d.addBack('e')
		//expect(ans).toBe(false)
		expect(d.size).toBe(4)
	})
	
	it('frontIter', ()=>{
		const iter = d.frontIterFn()
		const ans = [] as string[]
		for(let i = 0; i < d.size; i++){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		//TODO
		// console.log(ans)
		// console.log(d['_data'])
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(let i = 0; i < d.size; i++){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		//TODO
		// console.log(ans)
		// console.log(d['_data'])
	})
})


describe('ArrayDeque pos', ()=>{
	it('pos add 1',()=>{
		const capacity = 4
		let ans:number
		ans = ArrayDeque.posAdd(0, capacity, 1)
		ast(ans, 1)
		ans = ArrayDeque.posAdd(ans, capacity, 1)
		ast(ans, 2)

		ans = ArrayDeque.posAdd(ans, capacity, 1)
		ast(ans, 3)

		ans = ArrayDeque.posAdd(ans, capacity, 1)
		ast(ans, 0)
	})

	it('pos 1 add n',()=>{
		const capacity = 5
		let ans:number
		ans = ArrayDeque.posAdd(1, capacity, 2)
		ast(ans, 3)
		ans = ArrayDeque.posAdd(ans, capacity, 3)
		ast(ans, 1)

		ans = ArrayDeque.posAdd(ans, capacity, 1)
		ast(ans, 2)

		ans = ArrayDeque.posAdd(ans, capacity, 0)
		ast(ans, 2)

		ans = ArrayDeque.posAdd(ans, capacity, 5)
		ast(ans, 2)

		ans = ArrayDeque.posAdd(ans, capacity, 10)
		ast(ans, 2)
	})
	
	it('pos sub', ()=>{
		const capacity = 4
		let ans:number
		let fn = ArrayDeque.posSub.bind(ArrayDeque)
		ans = fn(4, capacity, 1)
		ast(ans, 3)

		ans = fn(ans, capacity, 4)
		ast(ans, 3)

		ans = fn(ans, capacity, 8)
		ast(ans, 3)

		ans = fn(ans, capacity, 9)
		ast(ans, 2)
	})
})

describe('get set', ()=>{
	
	it('1 get front', ()=>{
		const dq = ArrayDeque.fromArrayRef(['a','b','c','d'],5)
		let fn = dq.frontGet.bind(dq)
		ast(fn(0), 'a')
		ast(fn(1), 'b')
		ast(fn(2), 'c')
		ast(fn(3), 'd')
		ast(fn(4) == void 0)
		ast(fn(5), 'a')

		dq.frontSet(2,'z')
		ast(fn(2),'z')
	})

	it('2 get back', ()=>{
		const arrIn = ['a','b','c','d'].reverse()
		//console.log(arrIn)
		const dq = ArrayDeque.fromArrayCopy(arrIn)
		let fn = dq.backGet.bind(dq)
		ast(fn(0), 'a')
		ast(fn(1), 'b')
		ast(fn(2), 'c')
		ast(fn(3), 'd')
		ast(fn(4), 'a')

		dq.backSet(2,'z')
		ast(fn(2),'z')
	})
})