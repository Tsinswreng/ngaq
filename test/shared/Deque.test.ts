import ArrayDeque from '@shared/Deque'


describe('Deque', ()=>{
	const d = ArrayDeque.new<string>(4)
	d.addBack('a')
	d.addBack('b')
	d.addBack('c')
	d.addBack('d')
	it('size', ()=>{
		console.log(d.size)
		expect(d.size).toBe(4)
		let ans = d.addBack('e')
		expect(ans).toBe(false)
		expect(d.size).toBe(4)
	})
	
	it('frontIter', ()=>{
		const iter = d.frontIterFn()
		const ans = [] as string[]
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		//console.log(ans)
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		//console.log(ans)
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
	let ad2 = d.addBack('f')

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
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		// console.log(ans)
		// console.log(d['_data'])
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
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
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		// console.log(ans)
		// console.log(d['_data'])
	})

	it('backIter', ()=>{

		const iter = d.backIterFn()
		const ans = [] as string[]
		for(;;){
			const ele = iter()
			if(ele==void 0){break}
			ans.push(ele)
		}
		// console.log(ans)
		// console.log(d['_data'])
	})
})


describe('Deque Reverse', ()=>{
	

	
	it('frontIter', ()=>{
		const d = ArrayDeque.new<string>(4)
		d.addBack('a')
		d.addBack('b')
		d.addBack('c')
		d.addBack('d')
		d.reverse()
		const iter = d.frontIterFn()
		const ans = [] as string[]
		for(let i=0;i<d.size;i++){
			const ele = iter()
			ans.push(ele)
		}
		console.log(ans)
	})

	it('backIter', ()=>{
		let ans = [] as string[]
		let iter
		const d = ArrayDeque.new<string>(4)
		d.addBack('a')
		d.addBack('b')
		d.addBack('c')
		d.addBack('d')
		//@ts-ignore
		console.log(d._frontI)
		//@ts-ignore
		console.log(d._backI)
		ans = []
		iter = d.backIterFn()
		for(let i=0;i<d.size;i++){
			const ele = iter()
			ans.push(ele)
		}
		console.log(ans)
		d.reverse()
		//@ts-ignore
		console.log(d._frontI)
		//@ts-ignore
		console.log(d._backI)
		iter = d.backIterFn()
		ans = []
		for(let i=0;i<d.size;i++){
			const ele = iter()
			ans.push(ele)
		}
		console.log(ans)
	})
})