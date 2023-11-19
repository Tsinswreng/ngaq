import * as mathjs from 'mathjs'
import { lodashMerge } from '@shared/Ut'
export type BN = mathjs.BigNumber
export type UN = mathjs.BigNumber|number //無bigint
export type UNS = UN|string

class SrosError extends Error{
	private constructor(x?){
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
	/**
	 * 提供四則運算與比較的簡短寫法
	 */
	short: {
		a: (...num: ParamType[]) => ReturnType
		, s: (...num: ParamType[]) => ReturnType
		, m: (...num: ParamType[]) => ReturnType
		, d: (x:ParamType, y:ParamType) => ReturnType
		, c: (x: ParamType, y: ParamType) => number //以作差法比較
	}
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

export class Sros{
	private constructor(){}
	static new(config?:mathjs.ConfigOptions){
		let o
		if(config !== void 0 && config.number === 'BigNumber'){
			o = Sros_big.new(config)
		}else{
			o = Sros_number.new()
		}
		return o
	}
}

/**
 * 用于直接計算js內置之number類型
 */
class Sros_number implements ISros<number, number>{
	private constructor(){}
	static new(){
		const o = new this()
		return o
	}
	public readonly short = {
		a:this.add
		,s:this.subtract
		,c:this.compare
		,m:this.multiply
		,d:this.divide
	}

	public add(...num: number[]){
		if(num.length < 2) {
			throw SrosError.new(`num.length < 2`)
		}
		let ans = num[0]
		for(let i = 1; i < num.length; i++){
			ans += num[i]
		}
		return ans
	}

	public subtract(...num: number[]){
		if(num.length < 2) {
			throw SrosError.new(`num.length < 2`)
		}
		let ans = num[0]
		for(let i = 1; i < num.length; i++){
			ans -= num[i]
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
	public compare(x: number, y: number){
		return x - y
	}

	public multiply(...num: number[]){
		if(num.length < 2) {
			throw SrosError.new(`num.length < 2 雜魚♡`)
		}
		let ans = num[0]
		for(let i = 1; i < num.length; i++){
			ans *= num[i]
		}
		return ans
	}

	public divide(x: number, y: number){
		if(y === 0) {
			throw SrosError.new(`除數不能為零 雜魚♡`)
		}
		return x / y
	}

	public mod(x: number, y: number){
		if(y === 0) {
			throw SrosError.new(`除數不能為零 雜魚♡`)
		}
		return x % y
	}
	
	public pow(base: number, exponent: number){
		return Math.pow(base, exponent)
	}

	public log(base: number, antilogarithm: number=Math.E){
		return Math.log(antilogarithm) / Math.log(base)
	}

	public sin(x: number){
		return Math.sin(x)
	}

	public cos(x: number){
		return Math.cos(x)
	}

	public absolute(x: number){
		return Math.abs(x)
	}

	public diffRate(denominator: number, y: number){
		const ans = Math.abs((denominator - y) / denominator)
		return isNaN(ans) ? 0 : ans
	}

}


/**
 * mathjs庫之封裝、用于簡化高精度之純數值運算
 */
class Sros_big implements ISros<UNS,BN>{
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
		b:this.bn
		,a:this.add
		,s:this.subtract
		,c:this.compare
		,m:this.multiply
		,d:this.divide
	}

	public bn(x:UNS):BN
	public bn(x:UNS[]):BN[]
	public bn(x:UNS|UNS[]){
		//console.log(this) //爲甚麼不寫bind this 則this是undefined
		const ma = this.ma
		
		if(Array.isArray(x)){
			const ans:BN[]=[]
			for(const u of x){
				const bn = ma.bignumber(u)
				ans.push(bn)
			}
			return ans
		}else{
			return ma.bignumber(x)
		}
	}

	public add(...num:UNS[]){
		const bn = this.bn.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`num.length < 2`)}
		let ans = bn(num[0])
		for(let i = 1; i < num.length; i++){
			ans = ma.add(ans, bn(num[i]))
		}
		return ans
	}

	public subtract(...num:UNS[]){
		const bn = this.bn.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`num.length < 2`)}
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
	public compare(x:UNS, y:UNS){
		const subtract = this.subtract.bind(this)
		let ans = subtract(x, y)
		return ans.toNumber()
	}

	public multiply(...num:UNS[]){
		const bn = this.bn.bind(this)
		const ma = this.ma
		if(num.length < 2){throw SrosError.new(`num.length < 2`)}
		let ans = bn(num[0])
		for(let i = 1; i < num.length; i++){
			ans = ma.multiply(ans, bn(num[i])) as BN
		}
		return ans
	}

	public divide(x:UNS, y:UNS){
		const ma = this.ma
		const bn = this.bn.bind(this)
		return ma.divide(
			bn(x)
			,bn(y)
		) as BN
	}

	public mod(x:UNS, y:UNS){
		const ma = this.ma
		//const bn = this.bn.bind(this)
		const bn = this.bn.bind(this)
		return ma.mod(
			bn(x), bn(y)
		)
	}
	
	public pow(base:UNS, exponent:UNS){
		const bn = this.bn.bind(this)
		const ma = this.ma
		return ma.pow(
			bn(base)
			,bn(exponent)
		) as BN
	}

	public log(base:UNS, antilogarithm:UNS=Math.E){
		const bn = this.bn.bind(this)
		const ma = this.ma
		return ma.log(bn(base), bn(antilogarithm))
	}

	public sin(x:UNS){
		const bn = this.bn.bind(this)
		const ma = this.ma
		return ma.sin(bn(x))
	}

	public cos(x:UNS){
		const bn = this.bn.bind(this)
		const ma = this.ma
		return ma.cos(bn(x))
	}

	public absolute(x:UNS){
		const num_substract = this.compare.bind(this)
		const multiply = this.multiply.bind(this)
		const bn = this.bn
		let comp = num_substract(x, 0)
		if(comp < 0){
			return multiply(x, -1)
		}
		return bn(x)
	}

	public diffRate(denominator:UNS, y:UNS){
		const subtract = this.subtract.bind(this)
		const absolute = this.absolute.bind(this)
		const divide = this.divide.bind(this)
		let ans = subtract(denominator,y)
		ans = absolute(ans)
		ans = divide(ans, denominator)
		return ans
	}
}

