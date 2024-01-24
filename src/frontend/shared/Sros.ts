/**
 * 皆嚴格也、除非用compare以較大小、否則不會出現NaN及Infinity等、而是直ᵈ抛錯
 */
import * as mathjs from 'mathjs'
import { lodashMerge } from '@shared/Ut'
export type BN = mathjs.BigNumber
export type UN = mathjs.BigNumber|number //無bigint
export type UNS = UN|string
export type N4 = UNS|bigint
export type N3 = UN|bigint
declare global {
	export interface Number {
		add(...num:number[]): number;
		sub(...num:number[]): number
		mul(...num:number[]): number
		div(num:number): number
		pow(num:number): number
	}

}

function addFn(obj:Object, name:string, Fn:Function){
	if(obj[name]===void 0){
		obj[name]=Fn
		return true
	}
	return false
}

function addFn_(...p:Parameters<typeof addFn>){
	const ans = addFn(p[0],p[1],p[2])
	if(!ans){
		throw new Error(`${p[1]} is already defined at ${p[0]}`)
	}
}



// interface bbb extends BN{
	
// }




export class SrosError extends Error{
	protected constructor(x?){
		super(x)
	}

	static new(message?: string | undefined){
		const o = new this(message)
		return o
	}
}

/**
 * 㕥約束數學計算類
 * @param ParamType:諸方法 接受之參數之類型
 * @param ReturnType 諸方法 返回值類型
 */
interface ISros<ParamType, ReturnType extends number | BN> {
	/** 提供四則運算與比較的簡短寫法 */
	short: {
		//n:(x:N4|N4[])=>ReturnType|ReturnType[]
		n(x:N4):ReturnType //構造
		,n(x:N4[]):ReturnType[]
		,a: (...num: ParamType[]) => ReturnType //加
		,s: (...num: ParamType[]) => ReturnType //減
		,m: (...num: ParamType[]) => ReturnType //乘
		,d: (x:ParamType, y:ParamType) => ReturnType //除
		,c: (x: ParamType, y: ParamType) => number //以作差法比較
	}
	createNumber(x:N4):ReturnType //構造
	createNumber(x:N4[]):ReturnType[]
	add: (...num: ParamType[]) => ReturnType
	subtract: (...num: ParamType[]) => ReturnType
	multiply: (...num: ParamType[]) => ReturnType
	divide: (x:ParamType, y:ParamType) => ReturnType
	compare: (x: ParamType, y: ParamType) => number
	pow: (base: ParamType, exponent: ParamType) => ReturnType
	mod: (x: ParamType, y: ParamType) => ReturnType
	log: (base: ParamType, antilogarithm?: ParamType) => ReturnType
	sin: (x: ParamType) => ReturnType
	cos: (x: ParamType) => ReturnType
	absolute: (x: ParamType) => ReturnType
	diffRate: (denominator: ParamType, y: ParamType) => ReturnType
}

/**
 * 工廠類
 */
export class Sros{
	private constructor(){}
	static new():Sros_number
	static new(config:mathjs.ConfigOptions):Sros_big
	static new(config?:mathjs.ConfigOptions){ //precision只影響小數
		if(config===void 0){
			return Sros_number.new()
		}else{
			return Sros_big.new(config)
		}
	}
	// static new<T extends Sros_number|Sros_big = Sros_number>(config?:mathjs.ConfigOptions){
	// 	//let o
	// 	if(config !== void 0 && config.number === 'BigNumber'){
	// 		return Sros_big.new(config) as T
	// 	}else{
	// 		return Sros_number.new() as T
	// 	}
	// }

	/**
	 * 似乎mathjs庫中無類似於Number.isFinite之方法、姑藉此
	 * @param num 
	 * @returns 
	 */
	static isNumStrFinite(num:string){
		const str = num+''
		if(str ==='NaN' || str ==='Infinity' || str === '-Infinity'){
			//throw SrosError.new(`str ==='NaN' || str ==='Infinity' || str === '-Infinity'`)
			return false
		}
		return true
	}

	/**
	 * 有限數字轉mathjs之BigNumber。
	 * @param mathjsInstance mathjs實例。
	 * @param num 
	 * @returns 
	 */
	static toBigNumber(mathjsInstance:mathjs.MathJsStatic, num:N4){
		if(typeof num === 'bigint'){
			return mathjsInstance.bignumber(num.toString())
		}
		if(!Sros.isNumStrFinite(num+'')){
			throw SrosError.new(`${num}\n!this.isBigNumberFinite(num as BN)`)
		}
		return mathjsInstance.bignumber(num)
	}

	/**
	 * 有限數字轉js內置number類型
	 * @param num 
	 * @returns 
	 */
	static toNumber(num:N4):number{
		let ans = 0
		if(typeof num === 'object'){
			ans = (num as BN).toNumber()
		}else{
			ans = Number(num)
		}
		return Sros.checkFiniteNumber(ans)
	}


	static toNumber_unsafe(num:N4){
		let ans = 0
		if(typeof num === 'object'){
			ans = (num as BN).toNumber()
		}else{
			ans = Number(num)
		}
		return ans
	}

	static isSafeIntNumber(num:number){
		if(Number.isFinite(num) && num < Number.MAX_SAFE_INTEGER && num > Number.MIN_SAFE_INTEGER){
			return true
		}
		return false
	}

	/**
	 * 轉安全整數、轉不了就報錯
	 * @param num 
	 * @param errMsg 
	 * @returns 
	 */
	static toSafeIntNumber(num:N4, errMsg?){
		let ans = Sros.toNumber(num)
		if(Sros.isSafeIntNumber(ans)){
			return ans
		}else{
			throw SrosError.new(errMsg)
		}
		
	}

	/**
	 * 轉有限數字、轉不了就報錯
	 * 僅供number類型、若需他ᵗ數字類型、請用toNumber
	 * @param num 
	 * @param errMsg 
	 * @returns 
	 */
	static checkFiniteNumber(num:number, errMsg?){
		if(typeof num !== 'number'){throw SrosError.new(errMsg)}
		if(!isFinite(num)){throw SrosError.new(errMsg)}
		return num
	}

	protected static _isNumberMethodsExtended = false
	static get isNumberMethodsExtended(){return Sros._isNumberMethodsExtended}


	protected static _extendNumberMethods(){
		const pro = Number.prototype
		const sros = Sros.new()
		const s = sros.short
		addFn_(pro, 'add', 
		function(...num:number[]){
			//@ts-ignore
			return s.a(this, ...num)
		}
		)
		addFn_(pro, 'sub', 
		function(...num:number[]){
			//@ts-ignore
			return s.s(this, ...num)
		}
		)
		addFn_(pro, 'mul', 
		function(...num:number[]){
			//@ts-ignore
			return s.m(this, ...num)
		}
		)
		addFn_(pro, 'div', 
		function(num:number){
			//@ts-ignore
			return s.d(this, num)
		}
		)
		addFn_(pro, 'pow', 
		function(num:number){
			//@ts-ignore
			return sros.pow(this, num)
		}
		)
		// Number.prototype.add = function(...num:number[]){
		// 	//@ts-ignore
		// 	return s.a(this, ...num)
		// }
		// Number.prototype.sub = function(...num:number[]){
		// 	//@ts-ignore
		// 	return s.s(this, ...num)
		// }
		// Number.prototype.mul = function(...num:number[]){
		// 	//@ts-ignore
		// 	return s.m(this, ...num)
		// }
		// Number.prototype.div = function(num:number){
		// 	//@ts-ignore
		// 	return s.d(this, num)
		// }
		// Number.prototype.pow = function(num:number){
		// 	//@ts-ignore
		// 	return sros.pow(this, num)
		// }
	}

	static extendNumberMethods(){
		if(!Sros.isNumberMethodsExtended){
			Sros._extendNumberMethods()
			Sros._isNumberMethodsExtended=true
		}
	}

	//@ts-ignore
	protected static _unextendNumberMethods(){
		// function delete(x){
		// 	//x=undefined//此不效、鈣傳入後會複製指針?
		// 	//Reflect.deleteProperty(Number.prototype, x)
		// }
		//@ts-ignore
		delete(Number.prototype.add)
		//@ts-ignore
		delete(Number.prototype.sub)
		//@ts-ignore
		delete(Number.prototype.mul)
		//@ts-ignore
		delete(Number.prototype.div)
		//@ts-ignore
		delete(Number.prototype.pow)
	}

	static unextendNumberMethods(){
		if(Sros.isNumberMethodsExtended){
			Sros._unextendNumberMethods()
			Sros._isNumberMethodsExtended=false
		}
	}

}

/**
 * 用于直接計算js內置之number類型
 */
export class Sros_number implements ISros<number, number>{
	private constructor(){}
	static new(){
		// const o = new this()
		// return o
		return new this()
	}
	public readonly short = {
		n:this.createNumber.bind(this)
		,a:this.add.bind(this)
		,s:this.subtract.bind(this)
		,c:this.compare.bind(this)
		,m:this.multiply.bind(this)
		,d:this.divide.bind(this)
	}

	public createNumber(num:N4):number
	public createNumber(num:N4[]):number[]
	public createNumber(num:N4|N4[]){
		if(typeof num === 'number'){
			return Sros.toNumber(num)
		}else{
			return (num as N4[]).map(e=>Sros.toNumber(e))
		}
	}

	public add(...num: N4[]){
		if(num.length < 2) {
			throw SrosError.new(`${num.length}\nnum.length < 2`)
		}
		let ans = this.createNumber(num[0])
		for(let i = 1; i < num.length; i++){
			ans += this.createNumber(num[i])
		}
		//return Sros.toFiniteNumber(ans)
		return ans
	}

	public subtract(...num: N4[]){
		if(num.length < 2) {
			throw SrosError.new(`${num.length}\nnum.length < 2`)
		}
		let ans = this.createNumber(num[0])
		for(let i = 1; i < num.length; i++){
			ans -= this.createNumber(num[i])
		}
		//return Sros.toFiniteNumber(ans)
		return ans
	}
	
	/**
	 * 用來比較大小
	 * 參數須是有限數字
	 * 返回值爲Infinity可能性微存?
	 * Infinity 比任何有限数字都大; -Infinity 比任何有限数字都小; Infinity 和 -Infinity 被视为相等;
	 * @param x 
	 * @param y 
	 * @returns 
	 */
	public compare(x: N4, y: N4){
		//x=Sros.toFiniteNumber(x)
		//y=Sros.toFiniteNumber(y)
		if(typeof x === 'number' && typeof y === 'number'){
			let ans = x - y
			if(Number.isNaN(ans)){throw SrosError.new(`${x}-${y}\nNumber.isNaN(ans)`)}
			return ans
		}else{
			let ans = Sros.toNumber_unsafe(x) - Sros.toNumber_unsafe(y)
			return ans
		}

	}

	public multiply(...num: N4[]){
		if(num.length < 2) {
			throw SrosError.new(`${num.length}\nnum.length < 2`)
		}
		let ans = this.createNumber(num[0])
		for(let i = 1; i < num.length; i++){
			ans *= this.createNumber(num[i])
		}
		return Sros.checkFiniteNumber(ans)
	}

	public divide(x: N4, y: N4){
		if(y === 0) {
			throw SrosError.new(`divide by zero`)
		}
		let ans = this.createNumber(x) / this.createNumber(y)
		return Sros.checkFiniteNumber(ans)
	}

	public mod(x: N4, y: N4){
		if(this.compare(y,0)===0) {
			throw SrosError.new(`divide by zero`)
		}
		let ans = this.createNumber(x) % this.createNumber(y)
		return Sros.checkFiniteNumber(ans)
	}
	
	public pow(base: N4, exponent: N4){
		return Sros.checkFiniteNumber(
			Math.pow(this.createNumber(base), this.createNumber(exponent))
		)
	}

	public log(base: N4, antilogarithm: N4=Math.E){
		const compare = this.compare.bind(this)
		if( compare(antilogarithm,0) <= 0 ){
			throw SrosError.new(`${antilogarithm}\nantilogarithm < 0`)
		}
		const compareBase = compare(base, 0)
		if(compareBase <= 0 || compareBase === 1){
			throw SrosError.new(`${base}\nbad base`)
		}
		let ans = Math.log(this.createNumber(antilogarithm)) 
		/ 
		Math.log(this.createNumber(base))
		return Sros.checkFiniteNumber(ans)

	}

	public sin(x: N4){
		return Sros.checkFiniteNumber(
			Math.sin(this.createNumber(x))
		)
	}

	public cos(x: N4){
		return Sros.checkFiniteNumber(
			Math.cos(
				this.createNumber(x)
			)
		)
	}

	public absolute(x: N4){
		return Sros.checkFiniteNumber(
			Math.abs(this.createNumber(x))
		)
	}

	public diffRate(denominator: N4, y: N4){
		//const ans = Math.abs((denominator - y) / denominator)
		//return isNaN(ans) ? 0 : ans
		const subtract = this.subtract.bind(this)
		const absolute = this.absolute.bind(this)
		const divide = this.divide.bind(this)
		let ans = subtract(denominator,y)
		ans = absolute(ans)
		ans = divide(ans, denominator)
		return ans
	}

}


/**
 * mathjs庫之封裝、用于簡化高精度之純數值運算
 */
export class Sros_big implements ISros<N4,BN>{
	private constructor(){}
	static new(config?:mathjs.ConfigOptions){
		const o = new this()
		lodashMerge(o._config, config)
		o._ma = mathjs.create(mathjs.all, config)
		return o
	}

	private _ma:mathjs.MathJsStatic = mathjs.create(mathjs.all)
	public get ma(){return this._ma}

	private _config:mathjs.ConfigOptions|undefined = {
		number: 'BigNumber'
		,precision: 128
	}
	public get config(){return this._config}

	public readonly short = {
		n:this.createNumber.bind(this)
		,a:this.add.bind(this)
		,s:this.subtract.bind(this)
		,c:this.compare.bind(this)
		,m:this.multiply.bind(this)
		,d:this.divide.bind(this)
	}

	public createNumber(x:N4):BN
	public createNumber(x:N4[]):BN[]
	public createNumber(x:N4|N4[]){
		//console.log(this) //爲甚麼不寫bind this 則this是undefined
		const ma = this.ma
		
		if(Array.isArray(x)){
			return x.map(e=>Sros.toBigNumber(ma, e))
		}else{
			return Sros.toBigNumber(ma, x)
		}
	}

	public add(...num:N4[]){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`${num.length}\nnum.length < 2`)}
		let ans = bn(num[0])
		for(let i = 1; i < num.length; i++){
			ans = ma.add(ans, bn(num[i]))
		}
		return ans
	}

	public subtract(...num:N4[]){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`${num.length}\nnum.length < 2`)}
		let ans = bn(num[0])
		for(let i = 1; i < num.length; i++){
			ans = ma.subtract(ans, bn(num[i]))
		}
		return ans
	}
	
	/**
	 * 用來比較大小
	 * Infinity 比任何有限数字都大; -Infinity 比任何有限数字都小; Infinity 和 -Infinity 被视为相等;
	 * @param x 
	 * @param y 
	 * @returns 
	 */
	public compare(x:N4, y:N4){
		const subtract = this.subtract.bind(this)
		let ans = subtract(x, y)
		return ans.toNumber()
	}

	public multiply(...num:N4[]){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`${num.length}\nnum.length < 2`)}
		let ans = bn(num[0])
		for(let i = 1; i < num.length; i++){
			ans = ma.multiply(ans, bn(num[i])) as BN
		}
		return ans
	}

	public divide(x:N4, y:N4){
		const ma = this.ma
		const bn = this.createNumber.bind(this)
		return ma.divide(
			bn(x)
			,bn(y)
		) as BN
	}

	public mod(x:N4, y:N4){
		const ma = this.ma
		//const bn = this.bn.bind(this)
		const bn = this.createNumber.bind(this)
		return ma.mod(
			bn(x), bn(y)
		)
	}
	
	public pow(base:N4, exponent:N4){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		return ma.pow(
			bn(base)
			,bn(exponent)
		) as BN
	}

	public log(base:N4, antilogarithm:N4=Math.E){
		const bn = this.createNumber.bind(this)
		const compare = this.compare.bind(this)
		if( compare(antilogarithm,0) <= 0 ){
			throw SrosError.new(`${antilogarithm}\nantilogarithm < 0`)
		}
		const compareBase = compare(base, 0)
		if(compareBase <= 0 || compareBase === 1){
			throw SrosError.new(`${base}\nbad base`)
		}
		const ma = this.ma
		return ma.log(bn(base), bn(antilogarithm))
	}

	public sin(x:N4){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		return ma.sin(bn(x))
	}

	public cos(x:N4){
		const bn = this.createNumber.bind(this)
		const ma = this.ma
		return ma.cos(bn(x))
	}

	public absolute(x:N4){
		const num_substract = this.compare.bind(this)
		const multiply = this.multiply.bind(this)
		const bn = this.createNumber.bind(this)
		let comp = num_substract(x, 0)
		if(comp < 0){
			return multiply(x, -1)
		}
		return bn(x)
	}

	public diffRate(denominator:N4, y:N4){
		const subtract = this.subtract.bind(this)
		const absolute = this.absolute.bind(this)
		const divide = this.divide.bind(this)
		let ans = subtract(denominator,y)
		ans = absolute(ans)
		ans = divide(ans, denominator)
		return ans
	}
}

