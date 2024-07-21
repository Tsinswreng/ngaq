import * as algo from '@shared/algo'
import lodash from 'lodash'
const eq = lodash.isEqual


describe('lengthGroup', ()=>{
	const fn = algo.lengthGroup
	it('1', ()=>{
		let ans = fn(11, 5)
		expect(eq(ans, [[0,4], [5,9], [10,10]])).toBe(true)
		// Test case with total length not divisible evenly by memberPerGrout
		expect(fn(10, 3)).toEqual([[0, 2], [3, 5], [6, 8], [9, 9]]);
		
		// Test case with total length equal to memberPerGrout
		expect(fn(5, 5)).toEqual([[0, 4]]);
		
		// Test case with total length less than memberPerGrout
		expect(fn(3, 5)).toEqual([[0, 2]]);
	})
	
    it('should throw an error if memberPerGrout is less than or equal to 0', () => {
        // Test case with memberPerGrout equal to 0
        expect(() => fn(10, 0)).toThrow(RangeError);
        
        // Test case with memberPerGrout less than 0
        expect(() => fn(10, -1)).toThrow(RangeError);
    });
})

describe('arrCombination', ()=>{
	const fn = algo.cartesianProduct
	it('1',()=>{
		expect(
			eq(
				fn([[1], [2,3], [4,5]])
				,[ [ 1, 2, 4 ], [ 1, 2, 5 ], [ 1, 3, 4 ], [ 1, 3, 5 ] ]
			)
		).toBe(true)

		expect(
			eq(
				fn([[1,2],[3],[4,5],[6]])
				,[ [ 1, 3, 4, 6 ], [ 1, 3, 5, 6 ], [ 2, 3, 4, 6 ], [ 2, 3, 5, 6 ] ]
			)
		).toBe(true)
	})

	it('2',()=>{
		expect(
			eq(
				fn([[1], [2]])
				,[ [ 1, 2 ] ]
			)
		).toBe(true)
	})
	
	it('3',()=>{
		expect(
			eq(
				fn([[1,2,3]])
				,[ [ 1 ], [ 2 ], [ 3 ] ]
			)
		).toBe(true)
	})
	
	it('4',()=>{
		expect(
			eq(
				fn([[], [1,2,3]])
				, []
			)
		).toBe(true)
	})
	
	it('5',()=>{
		expect(
			eq(
				fn([])
				, []
			)
		).toBe(true)
	})
	it('6',()=>{
		expect(
			eq(
				fn([[1,2,3], [4,5,6]])
				,[ [ 1, 4 ], [ 1, 5 ], [ 1, 6 ], [ 2, 4 ], [ 2, 5 ], [ 2, 6 ], [ 3, 4 ], [ 3, 5 ], [ 3, 6 ] ]
			)
		).toBe(true)
	})
	
	it('7',()=>{
		expect(
			eq(
				fn([[1,2], [3,4], [5,6]])
				,[ [ 1, 3, 5 ], [ 1, 3, 6 ], [ 1, 4, 5 ], [ 1, 4, 6 ], [ 2, 3, 5 ], [ 2, 3, 6 ], [ 2, 4, 5 ], [ 2, 4, 6 ] ]
			)
		).toBe(true)
	})
	
	it('8',()=>{
		expect(
			eq(
				fn([[1,2,3,4]])
				,[ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ]
			)
		).toBe(true)
	})
	
	it('9',()=>{
		expect(
			eq(
				fn([[1], [2], [3], [4]])
				,[ [ 1, 2, 3, 4 ] ]
			)
		).toBe(true)
	})
	//幫我多寫點測試用例
})




describe('geneRegexReplacePair',()=>{
	const geneRegexReplacePair = algo.geneRegexReplacePair
	it('1', ()=>{
		let a = ['a','e','i','o','u']
		let b = ['z','x','c','v','b']
		let ans = geneRegexReplacePair(
			['k',a,'$']
			,['g', b,]
		)
		const e = [
			['ka$', 'gz']
			,['ke$', 'gx']
			,['ki$', 'gc']
			,['ko$', 'gv']
			,['ku$', 'gb']
		]
		expect(eq(ans, e)).toBe(true)
	})
	it('2', ()=>{
		let a = ['a','e','i','o','u']
		let b = ['z','x','c','v','b']
		let ans = geneRegexReplacePair(
			['k','$']
			,['g', b,]
		)
		const e = [
			['k$', 'g']
		]
		// console.log(ans)
		// console.log(e)
		expect(eq(ans, e)).toBe(true)
	})
	it('3', ()=>{
		let a = ['a','e','i','o','u']
		let b = ['z','x','c','v','b']
		let ans = geneRegexReplacePair(
			['k',a,'$']
			,['g', 'h']
		)
		const e = [
			[ 'ka$', 'gh' ],
			[ 'ke$', 'gh' ],
			[ 'ki$', 'gh' ],
			[ 'ko$', 'gh' ],
			[ 'ku$', 'gh' ]
		]
		//console.log(ans)
		expect(eq(ans, e)).toBe(true)
	})
	it('4', ()=>{
		let a = ['a','e','i','o','u']
		let b = ['z','x','c','v','b']
		try {
			
		} catch (e) {
			let ans = geneRegexReplacePair(
				['k',a,'$',b]
				,['g', b,'h',a]
			)
			expect(e).toBeInstanceOf(Error)
		}
		
		// const e = [
		// 	[ 'ka$', 'gh' ],
		// 	[ 'ke$', 'gh' ],
		// 	[ 'ki$', 'gh' ],
		// 	[ 'ko$', 'gh' ],
		// 	[ 'ku$', 'gh' ]
		// ]
		//console.log(ans)
		//expect(eq(ans, e)).toBe(true)
	})

	it('should handle empty arrays', () => {
		let ans = geneRegexReplacePair([], []);
	
		const e: [string, string][] = [];
		//console.log(ans)
		expect(eq(ans, e)).toBe(true);
	  });
	
	  it('should handle single character arrays', () => {
		let ans = geneRegexReplacePair(['a'], ['z']);
	
		const e: [string, string][] = [['a', 'z']];
		expect(eq(ans, e)).toBe(true);
	  });
	
	  it('should handle different array lengths', () => {
		let a = ['a', 'e', 'i', 'o', 'u'];
		let b = ['z', 'x', 'c'];
		let ans = geneRegexReplacePair(['k', a, '$'], ['g', b]);
	
		const e = [
		  ['ka$', 'gz'],
		  ['ke$', 'gx'],
		  ['ki$', 'gc'],
		  ['ko$', 'g'],
		  ['ku$', 'g']
		];
		//console.log(ans)
		expect(eq(ans, e)).toBe(true);
	  });
	
	  // Add more test cases here if needed
})


describe('abc_to_c_bc_abc',()=>{
	it('1',()=>{
		const arr = [1,2,3,4]
		const ans = algo.abc_to_c_bc_abc(arr)
		console.log(ans)
		expect(
			eq(ans, [[4],[3,4],[2,3,4],[1,2,3,4]])
		).toBe(true)
	})
})


describe('diffAs', ()=>{
	const fn = algo.diffArrIntoMap
	it('1',()=>{
		const arr1=[
			{text:'a', num:1}
			,{text:'b', num:2}
			,{text:'c', num:3}
		]
		const arr2=[
			{text:'a', num:1}
			,{text:'b', num:2}
			,{text:'d', num:4}
		]
		const ans = fn(arr1, arr2, (e)=>e.num)
		console.log(ans)
	})
})


describe('sliceHead', ()=>{
	const fn = algo.splitAtHeadLength
	const got = fn('Bearer 114514', 'Bearer ')
	console.log(got)
})



import {classify} from '@shared/tools/classify'
// function customSort<Ele, Cri>(arr:Ele[], by:(e:Ele)=>Cri, order:Cri[]){
// 	const ans = [] as Ele[]
// 	const belong__arr:Map<Cri, Ele[]> = classify(arr, by)

// 	for(const [k,v] of belong__arr){
// 		const reversed = v.reverse()
// 		belong__arr.set(k,v)
// 	}

// 	//k 用于循環遍歷order
// 	for(let i = 0, k = 0; i < arr.length; i++,k++){
// 		if(k>=order.length){k=0}
// 		//const e = arr[i]
// 		const belong:Cri = order[k]
// 		const gotArr = belong__arr.get(belong)!
// 		const last = gotArr.pop()
// 		if(last == void 0){continue}
// 		ans.push(last)
// 	}
// 	return ans
// }
import {customSort} from '@shared/tools/customSort'
describe('groupByBelong', ()=>{
	class Obj{
		belong: 'a'|'b'|'c'
		constructor(b){
			this.belong = b
		}
	}
	const B = (b)=>{
		return new Obj(b)
	}
	const arr = [
		B('a'),B('a'),B('a'),B('a'),B('a'),
		B('b'),B('b'),B('b'),B('b'),B('b'),
		B('c'),B('c'),B('c'),B('c'),B('c'),
	]
	const ans = customSort(arr, e=>e.belong, [
		'a', 'a', 'b', 'b', 'c'
	])
	console.log(ans)

})


describe('customSort', () => {
	it('should sort array according to the given order', () => {
	  const arr = [
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'a' },
	  ];
	  const order = ['a', 'b', 'c'];
	  const sorted = customSort(arr, e => e.belong, order);
  
	  expect(sorted.map(e => e.belong)).toEqual([
		'a', 'b', 'c', 'a', 'b', 'c', 'a'
	  ]);
	});
  
	it('should handle case when some groups are exhausted', () => {
	  const arr = [
		{ belong: 'a' },
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'b' },
		{ belong: 'c' },
	  ];
	  const order = ['a', 'b', 'c'];
	  const sorted = customSort(arr, e => e.belong, order);
  
	  expect(sorted.map(e => e.belong)).toEqual([
		'a', 'b', 'c', 'a', 'b'
	  ]);
	});
  
	it('should handle empty array', () => {
	  const arr: { belong: 'a' | 'b' | 'c' }[] = [];
	  const order = ['a', 'b', 'c'];
	  const sorted = customSort(arr, e => e.belong, order);
  
	  expect(sorted).toEqual([]);
	});
  
	it('should handle case when order is longer than array', () => {
	  const arr = [
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
	  ];
	  const order = ['a', 'b', 'c', 'd', 'e'];
	  const sorted = customSort(arr, e => e.belong, order);
  
	  expect(sorted.map(e => e.belong)).toEqual([
		'a', 'b', 'c'
	  ]);
	});
  
	it('should handle case when order is shorter than array', () => {
	  const arr = [
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'a' },
	  ];
	  const order = ['a', 'b'];
	  const sorted = customSort(arr, e => e.belong, order);
  
	  expect(sorted.map(e => e.belong)).toEqual([
		'a', 'b', 'a', 'b', 'a'
	  ]);
	});
  
	it('should return elements in the specified order even if some elements are missing', () => {
		const arr = [
			{ belong: 'a' },
			{ belong: 'a' },
			{ belong: 'b' },
		];
		const order = ['a', 'b', 'c'];
		const sorted = customSort(arr, e => e.belong, order);
		//console.log(sorted)//t
		expect(sorted.map(e => e.belong)).toEqual([
			'a', 'b', 'a'
		]);
	});
  
	it('should handle case when all elements belong to one category1', () => {
		const arr = [
			{ belong: 'a' },
			{ belong: 'a' },
			{ belong: 'a' },
		];
		const order = ['a', 'b', 'c'];
		const sorted = customSort(arr, e => e.belong, order);
  
		expect(sorted.map(e => e.belong)).toEqual([
			'a', 'a', 'a'
		]);
	});

	it('ca', () => {
		const arr = [
			{ belong: 'a' },
			{ belong: 'a' },
			{ belong: 'a' },
		];
		const order = ['c', 'a'];
		const sorted = customSort(arr, e => e.belong, order);
  
		expect(sorted.map(e => e.belong)).toEqual([
			'a', 'a', 'a'
		]);
	});

	it('should handle case when elements belong to categories not in order', () => {
		const arr = [
			{ belong: 'x' },
			{ belong: 'y' },
			{ belong: 'z' },
		];
		const order = ['a', 'b', 'c'];
		const sorted = customSort(arr, e => e.belong, order);

		expect(sorted.map(e => e.belong)).toEqual([]);
	});
  });