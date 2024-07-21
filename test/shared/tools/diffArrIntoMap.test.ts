// diffArr.test.ts
import {diffArrIntoMap} from '@shared/tools/diffArrIntoMap'

describe('diffArrIntoMap', () => {
	it('should return an empty map when both arrays are the same', () => {
		const arr1 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'c', num: 3 },
		];
		const arr2 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'c', num: 3 },
		];
		const result = diffArrIntoMap(arr1, arr2, (e) => e.num);
		expect(result.size).toBe(0);
	});

	it('should return a map with one element different between arrays', () => {
		const arr1 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'c', num: 3 },
		];
		const arr2 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'd', num: 4 },
		];
		const result = diffArrIntoMap(arr1, arr2, (e) => e.num);
		expect(result.size).toBe(1);
		expect(result.get(3)).toEqual([{ text: 'c', num: 3 }]);
	});

	it('should return a map with all elements of the first array when the second array is empty', () => {
		const arr1 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'c', num: 3 },
		];
		const arr2: { text: string; num: number }[] = [];
		const result = diffArrIntoMap(arr1, arr2, (e) => e.num);
		expect(result.size).toBe(3);
		expect(result.get(1)).toEqual([{ text: 'a', num: 1 }]);
		expect(result.get(2)).toEqual([{ text: 'b', num: 2 }]);
		expect(result.get(3)).toEqual([{ text: 'c', num: 3 }]);
	});

	it('should return an empty map when the first array is empty', () => {
		const arr1: { text: string; num: number }[] = [];
		const arr2 = [
			{ text: 'a', num: 1 },
			{ text: 'b', num: 2 },
			{ text: 'c', num: 3 },
		];
		const result = diffArrIntoMap(arr1, arr2, (e) => e.num);
		expect(result.size).toBe(0);
	});

	it('should handle arrays with complex objects', () => {
		const arr1 = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
		];
		const arr2 = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 4, name: 'David' },
		];
		const result = diffArrIntoMap(arr1, arr2, (e) => e.id);
		expect(result.size).toBe(1);
		expect(result.get(3)).toEqual([{ id: 3, name: 'Charlie' }]);
	});

	it('should handle arrays with primitive fields1', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [1, 2, 4];
		const classifyPrimitives = (arr: number[]): Map<number, number> => {
			const map = new Map<number, number>();
			arr.forEach((item) => map.set(item, item));
			return map;
		};
		const result = diffArrIntoMap(arr1, arr2, (e) => e);
		expect(result.size).toBe(1);
		expect(result.get(3)).toEqual([3]);
	});

	it('should handle arrays with primitive fields2', () => {
		const arr1 = [1, 2, 3, 5, 6];
		const arr2 = [1, 2, 4];
		const classifyPrimitives = (arr: number[]): Map<number, number> => {
			const map = new Map<number, number>();
			arr.forEach((item) => map.set(item, item));
			return map;
		};
		const result = diffArrIntoMap(arr1, arr2, (e) => e);
		expect(result.size).toBe(3);
		expect(result.get(3)).toEqual([3]);
		expect(result.get(5)).toEqual([5]);
		expect(result.get(6)).toEqual([6]);
	});
});
