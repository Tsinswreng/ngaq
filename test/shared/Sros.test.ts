//require('module-alias/register');
//import 'tsconfig-paths/register'
import { Sros,Sros_number,Sros_big, SrosError } from "@shared/Sros";
//import * as Ut from "../../src/shared/Ut"
import * as Ut from "@shared/Ut"
const sros_number = Sros.new()
const sros_big = Sros.new({})

describe('Sros', ()=>{
	it('should create an instance of Sros_number by default', () => {
		const sros = Sros.new();
		expect(sros).toBeInstanceOf(Sros_number);
	});

	it('should create an instance of Sros_big when provided with a config', () => {
		const sros = Sros.new({});
		expect(sros).toBeInstanceOf(Sros_big);
	});
})

describe('sros_number', ()=>{
	const s = sros_number.short
	it('+',()=>{
		expect(
			s.a(3,4)
		)
		.toBe(7)
	})

	it('-',()=>{
		expect(
			s.s(3,4)
		)
		.toBe(-1)
	})

	it('*',()=>{
		expect(
			s.m(3,4)
		)
		.toBe(12)
	})

	it('除零異常',()=>{
		try {
			s.d(3,0)
		} catch (error) {
			expect(error).toBeInstanceOf(SrosError)
		}
	})
	it('/',()=>{
		expect(
			s.d(4,2)
		)
		.toBe(2)
	})
})



// describe('Sros', () => {
//   it('should create an instance of Sros_number by default', () => {
//     const sros = Sros.new();
//     expect(sros).toBeInstanceOf(Sros_number);
//   });

//   it('should create an instance of Sros_big when provided with a config', () => {
//     const sros = Sros.new({ precision: 128 });
//     expect(sros).toBeInstanceOf(Sros_big);
//   });

//   it('should correctly check if a number string is finite', () => {
//     expect(Sros.isNumStrFinite('123')).toBe(true);
//     expect(Sros.isNumStrFinite('NaN')).toBe(false);
//     expect(Sros.isNumStrFinite('Infinity')).toBe(false);
//     expect(Sros.isNumStrFinite('-Infinity')).toBe(false);
//   });

//   it('should convert a number or BigInt to a BigNumber when using Sros_big', () => {
//     const sros_big = Sros.new({ precision: 128 });
//     const bigNumber = sros_big.createNumber(123);
//     expect(bigNumber).toBeInstanceOf(sros_big.ma.bignumber);

//     const bigNumberArray = sros_big.createNumber([123, 456]);
//     expect(bigNumberArray).toEqual([
//       expect.any(sros_big.ma.bignumber),
//       expect.any(sros_big.ma.bignumber),
//     ]);
//   });

//   it('should convert a number to a finite number when using Sros_number', () => {
//     const sros_number = Sros.new();
//     const finiteNumber = sros_number.createNumber(123);
//     expect(finiteNumber).toEqual(123);

//     const finiteNumberArray = sros_number.createNumber([123, 456]);
//     expect(finiteNumberArray).toEqual([123, 456]);
//   });

//   // Add more test cases as needed
// });
