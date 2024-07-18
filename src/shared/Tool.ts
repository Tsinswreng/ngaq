// import { merge } from "lodash"
// // /**
// //  * 手動封裝之 lodash之merge
// //  * 2023-10-05T11:48:48.000+08:00
// //  * I found that ts-node checks more strictly than tsc.
// //  * The reason why `_` needs to be asserted into `any` is that:
// //  * If I run my code with ts-node, it reports:
// //  * Property 'merge' does not exist on type 'LoDashStatic' _.merge(object, ...otherArgs)
// //  * but if I compile my code with tsc, there would not be error here, nor vscode would report the error here.
// //  * The same situation occurs when the 'get' and 'set' accessors do not have the same type.
// //  * @param object 
// //  * @param otherArgs 
// //  */
// export const lodashMerge = merge
// // // export function lodashMerge<T>(object: any, ...otherArgs: any[]){
// // // 	//return (_ as any).merge(object, ...otherArgs) as T
// // // }

