import { As } from "@shared/Ut";

// 假设有以下类定义
class Father {}
class Child extends Father {}
class Stranger {}


describe('As function tests', () => {

	describe('Primitive type assertions', () => {
		test('should assert number type', () => {
			const src: any = 1;
			const result = As(src, 'number');
			expect(result).toBe(1);
		});

		test('should throw error for wrong type with custom message', () => {
			const src: any = 1;
			expect(() => As(src, 'string', 'Type mismatch')).toThrow('Type mismatch');
		});

		test('should return null for wrong type when errMsg is null', () => {
			const src: any = 1;
			const result = As(src, 'string', null);
			expect(result).toBeNull();
		});
	});

	describe('Instance type assertions', () => {
		test('should assert instance of Father', () => {
			const src: any = new Child();
			const result = As(src, Father);
			expect(result).toBeInstanceOf(Father);
		});

		test('should throw error for wrong instance type with custom message', () => {
			const src: any = new Stranger();
			expect(() => As(src, Father, 'Instance type mismatch')).toThrow('Instance type mismatch');
		});

		test('should return null for wrong instance type when errMsg is null', () => {
			const src: any = new Stranger();
			const result = As(src, Father, null);
			expect(result).toBeNull();
		});

		// 編譯不通過
		// test('should throw error if TargetClass is not a valid constructor', () => {
		// 	const src: any = new Child();
		// 	expect(() => As(src, {}, 'Invalid constructor')).toThrow('Invalid constructor');
		// });
	});

	describe('Mixed type assertions', () => {
		test('should assert primitive type', () => {
			const src: any = 'hello';
			const result = As(src, 'string');
			expect(result).toBe('hello');
		});

		test('should assert instance type', () => {
			const src: any = new Child();
			const result = As(src, Father);
			expect(result).toBeInstanceOf(Father);
		});

		test('should throw error for primitive type mismatch with default message', () => {
			const src: any = true;
			expect(() => As(src, 'number')).toThrow();
		});

		test('should throw error for instance type mismatch with default message', () => {
			const src: any = new Stranger();
			expect(() => As(src, Father)).toThrow();
		});

		test('should return null for primitive type mismatch when errMsg is null', () => {
			const src: any = true;
			const result = As(src, 'number', null);
			expect(result).toBeNull();
		});

		test('should return null for instance type mismatch when errMsg is null', () => {
			const src: any = new Stranger();
			const result = As(src, Father, null);
			expect(result).toBeNull();
		});
	});
});
