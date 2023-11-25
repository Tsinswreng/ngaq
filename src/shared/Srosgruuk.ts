import * as mathjs from 'mathjs'
import { create, all, ConfigOptions } from 'mathjs'
import { $ } from './Ut'
export namespace Deprecated_Srosgruuk{

	
	export type BN = mathjs.BigNumber
	export type UN = mathjs.BigNumber|number
	export type UNS = UN|string
	export const ma = mathjs
	//export const b = ma.bignumber
	ma.bignumber()
	export function b(x:number|string|BN):BN
	export function b(x:number[]|string[]|BN[]):BN[]
	export function b(x:number|string|BN|number[]|string[]|BN[]){
		if(Array.isArray(x)){
			//return x.map(e=>ma.bignumber(e)) as BN[]
			const result:BN[] = []
			for(const e of x){
				let bn = ma.bignumber(e)
				result.push(bn)
			}
			return result
		}else{
			return ma.bignumber(x) as BN
		}
		
	}
	
	export function toExponential(){
	
	}
	
	export const a = (...num:(number|mathjs.BigNumber)[])=>{
		if(num.length<2){throw new Error()}
		let result= b(num[0])
		for(let i = 1; i < num.length; i++){
			result = ma.add(result,b(num[i])) as mathjs.BigNumber
		}
		return result
	}
	
	export const s = (...num:(number|mathjs.BigNumber)[])=>{
		if(num.length<2){throw new Error()}
		let result= b(num[0])
		for(let i = 1; i < num.length; i++){
			result = ma.subtract(result,b(num[i])) as mathjs.BigNumber
		}
		return result
	}
	
	export const m=(...num:(number|mathjs.BigNumber)[])=>{
		if(num.length<2){throw new Error()}
		let result= b(num[0])
		for(let i = 1; i < num.length; i++){
			result = ma.multiply(result,b(num[i])) as mathjs.BigNumber
		}
		return result
	}
	
	/**
	 * divide
	 * 若只傳入一個參數則返倒數
	 * @param num 
	 * @returns 
	 */
	export const d=(...num:(number|mathjs.BigNumber)[])=>{
		// if(num.length<2){throw new Error()}
		// let result= b(num[0])
		// for(let i = 1; i < num.length; i++){
		// 	result = ma.divide(result,b(num[i])) as ma.BigNumber
		// }
		// return result
		if(num.length===1){return (reciprocal(num[0]) as BN)}
		if(num.length===2){return (ma.divide(b(num[0]), b(num[1])) as BN)}
		throw new Error()
	}
	
	export const reciprocal=(num:UN)=>{
		return ma.divide(1, b(num)) as BN
	}
	
	export const p=(base:UN, exponet:UN)=>{
		base = b(base)
		exponet = b(exponet)
		return ma.pow(base, exponet) as mathjs.BigNumber
	}
	
	export const abs = (n:UN)=>{
		if(ma.smaller(n, 0)){
			return m(n, -1)
		}
		return b(n)
	
	}
	

	
	// create a mathjs instance with configuration
	const config:ConfigOptions = {
	  epsilon: 1e-12,
	  matrix: 'Matrix',
	  //number: 'number',
	  number: 'Fraction',
	  precision: 64,
	  predictable: false,
	  randomSeed: null
	}
	const math = create(all, config)
	
	// let r = math.evaluate(`\\lim_{n \\to \\infty} \\left(1 + \\frac{1}{n}\\right)^n`)
	// console.log(r.toString())
	
	export class Result_不確定度{
		均值?:BN
		實驗標準差?:BN
		算術平均值之實驗標準差?:BN
		A類不確定度Ua?:BN
		B類不確定度Ub?:BN
		總不確定度U?:BN
	}
	
	export class 不確定度{
		public static tp95Map = new Map(//鍵潙測量次數、值爲 t0.95
		[
			[2,12.71],
			[3,4.30],
			[4,3.18],
			[5,2.78],
			[6,2.57],
			[7,2.45],
			[8,2.36],
			[9,2.31],
			[10,2.26]
		]);
	
		private _numArr:BN[] = []
		;public get numArr(){return this._numArr;};;public set numArr(v){this._numArr=v;};
	
		private _tp = 0.95
	
		private _B類不確定度Ub?:BN
		;public get B類不確定度Ub(){return this._B類不確定度Ub;};;public set B類不確定度Ub(v){this._B類不確定度Ub=v;}
	
		public constructor(p?:Partial<不確定度>){
			Object.assign(this, p)
		}
	
		// private _實驗標準差?:BN
		// ;public get 實驗標準差(){return this._實驗標準差;};;public set 實驗標準差(v){this._實驗標準差=v;};
	
		// private _算術平均值之實驗標準差?:BN
		// ;public get 算術平均值之實驗標準差(){return this._算術平均值之實驗標準差;};;public set 算術平均值之實驗標準差(v){this._算術平均值之實驗標準差=v;};
	
		private _result?: Result_不確定度
		;public get result(){return this._result;};
	
		public getResult(){
			if(this._result===void 0){return {}}
			for(const k of Object.keys(this._result)){
				this._result[k] = this._result[k].toExponential()
			}
			return this._result
		}
	
		public static fn_取殘差(arr:BN[], average:BN=ma.mean(arr)){
			const result:BN[] = []
			for(const e of arr){
				let unus = s(e, average)
				result.push(unus)
			}
			return result
		}
	
		public static fn_取實驗標準差_(arr:BN[], average=ma.mean(arr)){//取實驗標準差
			const 組數 = arr.length
			//console.log(`console.log(average)`)
			//console.log(average)
			let 分子 = b(0);//分子
			let 分母 = b(組數 - 1);//分母
			for(let i = 0; i < arr.length; i++){
				let temp = s(arr[i] , average)
				temp = p(temp, 2)
				//分子 += temp;
				分子 = a(分子, temp)
			}
			let 實驗標準差 = 
			p(
				d(
					分子,
					分母
				), 
				0.5
			);
			return 實驗標準差
		}
	
		private static fn_算術平均值之實驗標準差(a實驗標準差:BN, b組數:UN){
			let result = 
			d(
				a實驗標準差, 
				p(
					b組數,
					0.5
				)
			)
			return result
		}
	
		public static fn_兩數幾何平均(x:UN, y:UN){
			let result =
			p(
				a(
					m(x,x), m(y,y)
				)
				,0.5
			)
			return result
		}
	
		private static fn_由算術平均值之實驗標準差取A類不確定度Ua(算術平均值之實驗標準差:UN, tp:UN){
			return m(算術平均值之實驗標準差, tp)
		}
	
		public static fn_A類不確定度Ua(arr:BN[], tp:UN){
			const len = arr.length
			const average = ma.mean(arr)
			const 實驗標準差 = this.fn_取實驗標準差_(arr, average)
			//console.log(`console.log(實驗標準差)`)
			//console.log(實驗標準差)
			const 算術平均值之實驗標準差 = 不確定度.fn_算術平均值之實驗標準差(實驗標準差, len)
			//console.log(`console.log(算術平均值之實驗標準差)`)
			//console.log(算術平均值之實驗標準差)
			return 不確定度.fn_由算術平均值之實驗標準差取A類不確定度Ua(算術平均值之實驗標準差, tp)
		}
		
		public static fn_A類不確定度Ua_tp95(arr:BN[]){
			const tp = 不確定度.tp95Map.get(arr.length)
			return 不確定度.fn_A類不確定度Ua(arr, $(tp))
		}
	
		public fn_A類不確定度Ua_tp95(arr=this.numArr){
			const len = arr.length
			const 均值 = ma.mean(arr)
			const 實驗標準差 = 不確定度.fn_取實驗標準差_(arr, 均值)
			//console.log(`console.log(實驗標準差)`)
			//console.log(實驗標準差)
			const 算術平均值之實驗標準差 = 不確定度.fn_算術平均值之實驗標準差(實驗標準差, len)
			//console.log(`console.log(算術平均值之實驗標準差)`)
			//console.log(算術平均值之實驗標準差)
			const tp = 不確定度.tp95Map.get(arr.length)
			const A類不確定度Ua = 不確定度.fn_由算術平均值之實驗標準差取A類不確定度Ua(算術平均值之實驗標準差, $(tp))
			const B類不確定度Ub = this.B類不確定度Ub
			const 總不確定度U = 不確定度.fn_兩數幾何平均(A類不確定度Ua, B類不確定度Ub??b(0))
			this._result = {
				均值,
				實驗標準差,
				算術平均值之實驗標準差,
				A類不確定度Ua,
				B類不確定度Ub,
				總不確定度U,
			}
		}
	
		public static 測試例:number[] = [40.02, 40.00, 39.98, 40.02, 40.04, 40.00, 39.96]
		private static 測試例之Ua_tp95 = 0.024
		public static 測試例_自測 = 不確定度.fn_A類不確定度Ua_tp95(b(不確定度.測試例)); 
	}
	
	
}