import * as algo from '@shared/algo'
import lodash from 'lodash'
const eq = lodash.isEqual

describe('arrCombination', ()=>{
	const fn = algo.arrCombination
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