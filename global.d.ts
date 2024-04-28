// declare global{
// 	type kvobj<k extends string|number|symbol=string, v=unknown> = Record<k, v>
// }

declare type kvobj<k extends string|number|symbol=string, v=any> = Record<k, v>
declare type jstype = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
declare type integer = number