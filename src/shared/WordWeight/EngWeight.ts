// import 'tsconfig-paths/register'
// import { compileTs} from "@shared/Ut";
// import { weightLib as L } from "./_lib";

// class EngWeight extends L.WordWeight{
// 	protected constructor(){
// 		super()
// 	}
// 	static new(...prop:Parameters<typeof L.WordWeight.new>){
// 		const f = L.WordWeight.new(...prop)
// 		const c = new this()
// 		const o = L.Ut.inherit(c,f)
// 		return o
// 	}
// }

// class WeightJson{
// 	lang
// 	code

// }

// const tsCode = 
// `
// class extends L.WordWeight{
// 	protected constructor(){
// 		super()
// 	}
// 	static new(...prop:Parameters<typeof L.WordWeight.new>){
// 		const f = L.WordWeight.new(...prop)
// 		const c = new this()
// 		const o = L.Ut.inherit(c,f)
// 		return o
// 	}
// }
// `
// const outJs = compileTs(`return (${tsCode})`,{target: 99})
// console.log(outJs.outputText)
// console.log(outJs.diagnostics)

// const f = new Function('L', outJs.outputText)
// const Ew:typeof L.WordWeight = f(L)
// const o = Ew.new()
// console.log(o)
// console.log(o instanceof L.WordWeight)
// /* 
// 導入ⁿ改參數
// */

