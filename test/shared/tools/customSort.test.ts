
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



  describe('customSort2', () => {
	it('should sort array with null in order', () => {
		const arr = [
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' },
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' },
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' },
			
		];
  
		const order = ['a', null, 'b', 'c'];
	
		const result = customSort(arr, (e) => e.belong, order);
		console.log(result)
		expect(result).toEqual([
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' },
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' },
			{ belong: 'a' },
			{ belong: 'z' },
			{ belong: 'b' },
			{ belong: 'c' }
		]);
	});
  
	it('should handle edge case where belong elements are exhausted', () => {
	  const arr = [
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'c' },
	  ];
  
	  const order = ['a', 'a', 'b', 'b', 'c', 'c'];
  
	  const result = customSort(arr, (e) => e.belong, order);
  
	  expect(result).toEqual([
		{ belong: 'a' },
		{ belong: 'a' },
		{ belong: 'b' },
		{ belong: 'b' },
		{ belong: 'c' },
		{ belong: 'c' },
	  ]);
	});


});
