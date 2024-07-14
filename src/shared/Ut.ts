
//[23.07.09-2232,]
//const fs = require('fs')
//import {RegexReplacePair} from '';
import * as fs from 'fs';
import * as Path from 'path'
import now from 'performance-now';
import _, { last } from 'lodash'
import dayjs from 'dayjs';
import * as readline from 'readline'
import { Sros } from './Sros';
import util from 'util'
//import * as ts from 'typescript'
import ts from 'typescript'
import json5 from 'json5'
import * as Ty from '@shared/Type'

import * as algo from '@shared/algo' //待分离


// export function As<Src, Tar>(src, target){
	
// }
/**
 * 若作Target extends abstract new (...args: any) => any則類芝厥構造器非公開者不可用
 */

//type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
//type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : any;


//export type InstanceType_<T extends { prototype: any }> = T["prototype"];


export function mergeErrStack(innerErr:Error, outErr:Error){
	innerErr.stack = '\n\n'+innerErr.stack + outErr.stack
	return innerErr
}


/**
 * 返回所有鍵。若o爲數組則返number[]
 * @param o 
 */
//export function object_keys(o:any):string[]|number[]
export function object_keys(o:any[]):number[] //此重載聲明當寫于前
export function object_keys(o:kvobj):string[]
export function object_keys(o:object){
	if( Array.isArray(o) ){
		const ans = [] as number[]
		for(let i = 0; i < o.length; i++){
			ans[i] = i
		}
		return ans
	}else{
		return Object.keys(o)
	}
}
/* 
type ElementType<T> = T extends Array<infer U> ? U : never;

// 使用 ElementType 來獲取陣列的元素類型
type StringArrayElement = ElementType<string[]>;  // string
type NumberArrayElement = ElementType<number[]>;  // number

 */


// type RecursiveType<T> = 
//     T extends Array<infer U> ? RecursiveType<U>[] :
//     T extends object ? { [K in keyof T]: RecursiveType<T[K]> } :
//     T;

export type DeepType<T> = T extends string ? 'string' :
T extends number ? 'number' :
T extends boolean ? "boolean" :
T extends Array<infer U> ? Array<DeepType<U>> :
T extends object ? { [K in keyof T]: DeepType<T[K]> } :
never;

export function deepType<T>(o:T):DeepType<T>{
	function handleArr(o:any[]){
		const keys = object_keys(o)
		const ans = [] as any[]
		for(const k of keys){
			ans[k] = helper(o[k])
		}
		return ans
	}

	function handleKvObj(o:Record<string, unknown>){
		const keys = object_keys(o)
		const ans = {} as any
		for(const k of keys){
			ans[k] = helper(o[k])
		}
		return ans
	}

	function helper(o){
		const typ = typeof o
		if(typ !== 'object'){
			return typ
		}
		if( Array.isArray(o) ){
			return handleArr(o as any[])
		}else{
			return handleKvObj(o)
		}
	}
	return helper(o)
}

/**
 * 實例ᵗ類型轉化 並檢查
 * class Child extends Father{}
 * let idk:any = new Child()
 * let c = instanceAs(idk, Father) //c:Father ok
 * @param src 源實例
 * @param TargetClass 目標類
 * @param errMsg 若潙null則返null、不拋錯
 * @returns 
 */

export function instanceAs<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg:null)
	: Ty.InstanceType_<Target>|null

export function instanceAs<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg?:any)
	: Ty.InstanceType_<Target>

export function instanceAs<Target extends { prototype: any }>(src, TargetClass: Target, errMsg:any=''){
	if(TargetClass?.constructor == void 0){
		if( typeof errMsg === 'string' ){
			throw new Error(errMsg)
		}else{
			throw errMsg
		}
	}
	//@ts-ignore
	if(src instanceof TargetClass){
		return src as Ty.InstanceType_<Target>
	}else{
		if( typeof errMsg === 'string' ){
			throw new Error(errMsg)
		}else if(errMsg === null){
			return null
		}else{
			throw errMsg
		}
	}
}



/**
 * 基本數據類型 類型斷言 帶運行時檢查
 * let a:any = 1
 * let b = primitiveAs(a, 'number') //b:number
 * 
 * @param src 
 * @param target 
 * @param errMsg 若傳入null則返回null、不拋錯誤
 * @returns 
 */
export function primitiveAs<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	:null|Ty.ParseType<Target>

export function primitiveAs<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	:Ty.ParseType<Target>
export function primitiveAs<Target extends string>(src, target:Ty.PrimitiveTypeStr|Target, errMsg:any=''){
	if(typeof src === target){
		return src as Ty.ParseType<Target>
	}else{
		if( typeof errMsg === 'string'){
			throw new Error(errMsg)
		}else if(errMsg === null){
			return null
		}else{
			throw errMsg
		}
	}
}



// /** primitiveAs */
// export function As<Target extends jstype>(src, target:Target, errMsg?:any):Ty.ParseType<Target>

// /** instanceAs */
// export function As<Target extends { prototype: any }>(src, target:Target, errMsg?:any):Ty.InstanceType_<Target>


/** instanceAs */
export function As<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg:null)
	: Ty.InstanceType_<Target>|null
/** instanceAs */
export function As<Target extends { prototype: any }>
	(src, TargetClass: Target, errMsg?:any)
	: Ty.InstanceType_<Target>

/** primitiveAs */
export function As<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	: Ty.ParseType<Target>|null

/** primitiveAs */
export function As<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	: Ty.ParseType<Target>

/**
 * 
 * @param src 
 * @param target 
 * @param errMsg 若傳入null則返回null、不拋錯誤
 * @returns 
 */
export function As<Target extends string|{ prototype: any }>(src, target:Target, errMsg:any=''){
	if(typeof target === 'string'){
		return primitiveAs(src, target, errMsg)
	}else{
		return instanceAs(src, target, errMsg)
	}
}

/** instanceassert */
export function asrt<Target extends { prototype: any }>
	(src, TargetClasserts: Target, errMsg:null)
	: asserts src is Ty.InstanceType_<Target>|null
/** instanceassert */
export function asrt<Target extends { prototype: any }>
	(src, TargetClasserts: Target, errMsg?:any)
	: asserts src is Ty.InstanceType_<Target>

/** primitiveassert */
export function asrt<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg:null)
	: asserts src is Ty.ParseType<Target>|null

/** primitiveassert */
export function asrt<Target extends string>
	(src, target:Ty.PrimitiveTypeStr|Target, errMsg?:any)
	: asserts src is Ty.ParseType<Target>

export function asrt<Target extends string|{ prototype: any }>(src, target:Target, errMsg:any=''){
	if(typeof target === 'string'){
		return primitiveAs(src, target, errMsg)
	}else{
		return instanceAs(src, target, errMsg)
	}
}




// //typescript幫我寫一個函數、返回值的類型爲傳入的字符串字面量的類型
// let a = t('utf-8') //要求編輯器推斷出a的類型爲'utf-8'
function stringLiteralType<T extends string>(str: T): T {
    return str;
}


// export function stackRecorderError(msg?:string, konstructor=Error.constructor.bind(Error)){
// 	return konstructor(msg)
// }



export const classify = algo.classify


export function key__arrMapPush<K,VEle>(map:Map<K,VEle[]>, k:K ,ele:VEle){
	const gotV = map.get(k)
	if(gotV == void 0){
		map.set(k, [ele])
	}else{
		gotV.push(ele)
		map.set(k, gotV)
	}
}



/* 
幫我寫一個typescirpt函數As、

	let a:any = 1
	let b = As(a, 'number')

要求: 1.不添加額外的泛型參數; 2.編輯器能推斷出b的類型爲number
*/

/**
 * 類ᵗ實例ˋ繼承
 * 只設原型鏈、不保證instanceof
 * @deprecated
 * @param child 
 * @param parent 
 * @returns 
 */
export function inherit<Ch, Fa>(child:Ch,parent){
	//Object.setPrototypeOf(father, ChildClass.prototype); // 设置原型链
	if (child?.constructor == void 0){
		throw new Error('child does not have constructor')
	}
	//Object.setPrototypeOf(parent, child.constructor.prototype); // 设置原型链
	Object.setPrototypeOf(parent, child); // 设置原型链
	//Object.assign(parent,child)
	return parent as Ch
	
	// // //return father as Ch
	// for (const prop in parent) {
	// 	if (parent.hasOwnProperty(prop)) {
	// 		child[prop] = parent[prop];
	// 	}
	// }
	// //@ts-ignore
	// child.__proto__ = parent.prototype;
	// return child

}


function fn_childNewAsync<Child, Father, FatherNewParams>(fatherNew:(...fatherNewParams:FatherNewParams[])=>Promise<Father>){
	let t:Parameters<typeof fatherNew>
	const ans = async function childNewAsync(...params){

	}
}


export function addFn(obj:Object, name:string, Fn:Function){
	if(obj[name]===void 0){
		obj[name]=Fn
		return true
	}
	return false
}

/**
 * 網絡錯誤類
 * @deprecated
 */
export class NetworkError extends Error{
	private constructor(message?: string | undefined){
		super(message)
	}
	static new(message?:string|undefined){
		return new this(message)
	}
}

export namespace type{
	export type NonArrObj = object&{length?:never}
}

//type ArrayElementType<T> = T extends (infer U)[] ? ArrayElementType<U> : T;//假设我们有一个类型为 number[][] 的二维数组，使用 ArrayElementType<number[][]> 将得到 number 类型，因为 number[][] 表示一个二维数组，它的元素类型是 number[]，再继续解开 number[]，我们得到的是 number 类型。如果传入的是 string[][][]，则最终返回的是 string 类型。

export function readTsConfig(path=`./tsconfig.json`){
	const str = fs.readFileSync(path, 'utf-8')
	return json5.parse(str) as {compilerOptions:ts.CompilerOptions,[key: string]: any}
}

/**
 * 清空對象所有鍵
 * @param obj 
 */
export function clearObj(obj:Object){
	for(const k in obj){
		obj[k] = undefined
	}
}

/**
 * 正則表達式替換組。
 */
export interface RegexReplacePair{
	regex:RegExp,
	replacement:string
}


export function delKeys(obj:type.NonArrObj, keys:string[]){
	for(const k of keys){
		delete obj[k]
	}
}

/**
 * 
 * @param tsCode 
 * @param compilerOptions 
 * @returns result.diagnostics 總潙空、縱有謬
 */
export function compileTs(tsCode:string, compilerOptions:ts.CompilerOptions){
	const result = ts.transpileModule(tsCode, {compilerOptions:compilerOptions})
	return result
}


export function compileTs_deprecated(tsCode:string, compilerOptions:ts.CompilerOptions){
	const result = ts.transpileModule(tsCode, {compilerOptions:compilerOptions})
	//const result = ts.transpile(tsCode, tsconfig)
	if (result.diagnostics && result.diagnostics.length > 0) {
		throw new Error(ts.formatDiagnostics(result.diagnostics, {
			getCanonicalFileName: (fileName) => fileName,
			getCurrentDirectory: ts.sys.getCurrentDirectory,
			getNewLine: () => ts.sys.newLine,
		}));
	}
	return result.outputText;
}

/**
 * 這是sqlite3庫 trace.js裏的代碼、偷過來研究
 * 將指定對象的指定方法進行擴展，以捕獲和處理錯誤堆棧信息。
 * @param object 欲擴展的對象
 * @param property 欲擴展的方法名
 * @param pos 替換回調函數的位置，預設為最後一個參數
 */
export function extendTrace(object:Object, property:string, pos?:number) {
	
	const old:Function = object[property];// 保存原始方法
	object[property] = function() {
		const error = new Error();
		// 構建方法名和參數的字符串表示
		const name = object.constructor.name + '#' + property + '(' +
			Array.prototype.slice.call(arguments).map(function(el) { // 傳統函數內ᵗarguments即傳入ᵗ參數
				return util.inspect(el, false, 0);
			}).join(', ') + ')';

		// 如果未指定替換回調函數的位置，預設為最後一個參數
		if (typeof pos === 'undefined') pos = -1;
		if (pos < 0) pos += arguments.length;
		// 獲取回調函數
		const cb = arguments[pos];
		// 如果回調是函數，則進行替換處理
        if (typeof arguments[pos] === 'function') {
            arguments[pos] = function replacement() {
                const err = arguments[0]; // sqlite error
				// 如果錯誤存在並且尚未處理過，則進行錯誤堆棧的擴充和替換
                if (err && err.stack && !err.__augmented) {
                    err.stack = filter(err).join('\n');
                    err.stack += '\n--> in ' + name;
                    err.stack += '\n' + filter(error).slice(1).join('\n');
                    err.__augmented = true;
                }
				// 調用原始回調函數
                return cb.apply(this, arguments);
            };
        }
		// 調用原始方法
        return old.apply(this, arguments);
    };
}
//exports.extendTrace = extendTrace;


function filter(error) {
	return error.stack.split('\n').filter(function(line) {
		return line.indexOf(__filename) < 0;
	});
}


/**
 * 遍歷諸文件夾
 * @param directoryPath 
 * @returns 
 */
export async function traverseDirs(directoryPath: string[]) { 
	const result:string[] = []
	for(const d of directoryPath){
		const files = await forOne(d)
		result.push(...files)
	}

	return result
	async function forOne(directoryPath:string){
		const filePaths: string[] = [];

		async function readDirectory(dir: string) {
			const files = await fs.promises.readdir(dir);
	
			for (const file of files) {
				const filePath = Path.join(dir, file);
				const stat = await fs.promises.stat(filePath);
	
				if (stat.isDirectory()) {
					// 如果是子目录，递归读取子目录中的文件
					await readDirectory(filePath);
				} else {
					// 如果是文件，将文件路径添加到数组中
					filePaths.push(filePath);
				}
			}
		}
	
		await readDirectory(directoryPath);
		return filePaths;
	}
}


/**
 * 延時。手動用promise封裝setTimeout
 * @param mills 
 * @returns 
 */
export const delay=(mills:number)=>{
	return new Promise<void>((res,rej)=>{
		setTimeout(()=>{res()},mills)
	})
}

/**
 * 只支持node環境
 * @param path 
 * @returns 
 */
export async function fileToBase64(path:string){
	const data  = await fs.promises.readFile(path)
	return data.toString('base64')
}

/**
 * 只支持前端環境
 * @param blob 
 * @returns 
 */
export function blobToBase64_fr(blob:Blob):Promise<string | ArrayBuffer | null>{
	return new Promise((res, rej)=>{
		const reader = new FileReader()
		reader.onload = function(){
			res(reader.result)
		}
		reader.onerror = function(){
			rej(new Error())
		}
		reader.readAsDataURL(blob)
	})
}


/**
 * 新建一級目錄
 * @param dir 
 * @param ifNotExists 默認潙假、即目录既存旹報錯
 * @deprecated
 */
export function mkdir(dir:string, ifNotExists=false){
	const absolutePath = Path.resolve(dir);
	if(fs.existsSync(dir)){
		if(ifNotExists){
			return absolutePath
		}else{
			throw new Error(absolutePath+' already exists')
		}
	}else{
		fs.mkdirSync(dir)
	}
	return absolutePath
}

/**
 * 新建文件 
 * @param filePath 
 * @param ifNotExists 默認潙假、即文件既存旹報錯
 * @returns 
 * @deprecated
 */
export function creatFileSync(filePath:string, ifNotExists=false){
	const absolutePath = Path.resolve(filePath);
	if(fs.existsSync(filePath)){
		if(ifNotExists){
			return absolutePath
		}else{
			throw new Error(absolutePath+' already exists')
		}
	}else{
		fs.appendFileSync(filePath,'')
		//fs.writeFileSync(filePath, '')
	}
	return absolutePath
}

/**
 * 手動封裝之 lodash之merge
 * 2023-10-05T11:48:48.000+08:00
 * I found that ts-node checks more strictly than tsc.
 * The reason why `_` needs to be asserted into `any` is that:
 * If I run my code with ts-node, it reports:
 * Property 'merge' does not exist on type 'LoDashStatic' _.merge(object, ...otherArgs)
 * but if I compile my code with tsc, there would not be error here, nor vscode would report the error here.
 * The same situation occurs when the 'get' and 'set' accessors do not have the same type.
 * @param object 
 * @param otherArgs 
 */
export function lodashMerge<T>(object: any, ...otherArgs: any[]){
	return (_ as any).merge(object, ...otherArgs) as T
}

export const merge = _.merge



const getShuffle = algo.getShuffle
export {getShuffle}

/**
 * 按索引交換數組兩元素
 * @param arr 
 * @param index1 
 * @param index2 
 */
export function swapArrEle<T>(arr:T[], index1:number, index2:number){
	[arr[index1], arr[index2]] = [arr[index2], arr[index1]]; //解构赋值
}

const group = algo.group
export{group}

const randomIntArr = algo.randomIntArr
export{randomIntArr}


/**
 * 複製對象、忽略指定ᵗ鍵
 * @param obj 
 * @param ignoredKeys 
 * @returns 
 */
export function copyIgnoringKeys(obj:Object, ignoredKeys?:string[]){
	obj = _.cloneDeep(obj)
	if(ignoredKeys !== void 0){
		for(const k of ignoredKeys){
			delete obj[k]
		}
	}
	return obj
}


export function lastOf<T>(arr:T[]):T
export function lastOf<T>(arr:string):string

export function lastOf<T>(arr:T[]|string):T|string{
	return arr[arr.length-1]
}


// export function nno<T>(v:T|undefined|null|{}){

// }

/**
 * valid number
 * @param v 
 * @param toThrow 
 * @returns 
 */
export function $n(v:number, errMsg?:string){
	if(!isFinite(v)){throw new Error(errMsg)}
	return v
}

/**
 * nonNullable Array
 * 數組或字符串判空後返回。
 * @param v 
 * @param err 
 * @returns 
 */
export function $a<T>(v:T[]|undefined|null, err?:string|Error):T[]
export function $a<T>(v:string|undefined|null, err?:string|Error):string

export function $a<T>(v:T[]|string|undefined|null, err:string|Error=''){
	if(v == null || v.length === 0){
		if(typeof err === 'string'){
			throw new Error(err)
		}else{
			throw err
		}
	}
	return v
}

/**
 * nonUndefinedGet
 * @param v 
 * @param fn 
 * @param errMsg 
 * @returns 
 */
export function nug<T, U=undefined>(v: T | undefined, errMsg?:string):Exclude<T, U>{
	if(v === void 0){
		throw new Error(errMsg)
	}
	return v as Exclude<T, U>
}


// /**
//  * non nullalbe assign
//  * @param target 被賦值者
//  * @param src 賦值者
//  * @returns 
//  */
// function aaa<Tar, Src extends Tar>(target:Tar, src:Src|undefined|null){
// 	if(src == void 0){return target}
// 	return src
// }
// a
//target = src


export function nullCoalesce_fn<Tar>(target:Tar){
	return <Src>(src:Src)=>{
		if(src == void 0){return target}
		return src
	}
}


/**
 * 判空後返回
 * @param v 
 * @param err 
 * @returns 
 */
export function $<T>(v:T, err:string|Error=''): NonNullable<T>{
	if(v == null){
		if(typeof err === 'string'){
			throw new Error(err)
		}else{
			throw err
		}
	}
	return v as NonNullable<T>
}


// export function deduplicate<T>(arr:T[],criteria:(...param:any[])=>any){

// }

// export function union<T>(s1:T[], s2:T[], criteria:(...param:any[])=>any){
// 	const b = criteria()
// }

/**
 * 集合取並集
 * @param s1 
 * @param s2 
 * @returns 
 */
export function simpleUnion<T>(s1:T[], s2:T[]):T[]
export function simpleUnion<T>(s1:Set<T>, s2:Set<T>):Set<T>

export function simpleUnion<T>(s1:T[]|Set<T>, s2:T[]|Set<T>){
	
	if(Array.isArray(s1)){
		return Array.from(new Set([...s1, ...s2]))
	}else{
		return new Set([...s1, ...s2])
	}
	
}



/**
 * 批量ᵈ檢ᵣ文件ˋ存否
 * @param paths 
 * @returns 
 */
export function areFilesExist(paths:string[]){
	let result = true
	for(const p of paths){
		const b = fs.existsSync(p)
		result = result && b
		if(result === false){break}
	}
	return result
}

/**
 * 解析潙絕對路徑並檢ˌ存否
 * @param dir 
 * @returns 
 */
export function absPath(dir:string|null|undefined){
	if(dir == null){
		throw new Error(`dir == null`)
	}
	if(!fs.existsSync(dir as string)){
		const abs = Path.resolve(dir)
		throw new Error("path not exist\n"+abs)
	}
	return Path.resolve(dir)
}

/**
 * 檢 路徑是存在、若存在則原樣返回
 * @param dir 
 * @returns 
 */
export function pathAt(dir:string, errMsg?:string):string{
	if(!fs.existsSync(dir)){
		console.error('<absoluteDir>')
		console.error(Path.resolve(dir))
		console.error('</absoluteDir>')
		throw new Error(errMsg)
	}
	return dir
}

/**
 * 測量同步函數執行耗時並返回結果
 * 注意this亂指、若傳入成員方法則最好 measureFunctionTime(myObj.myMethod.bind(myObj), ...)
 * @param fn 
 * @param args 
 * @returns [executionTime, result]
 */
// export function measureFunctionTime<Return=any>(fn:()=>Return, ...args:Parameters<typeof fn>):[number, Return]
// export function measureFunctionTime<A, Return=any>(fn:(a:A)=>Return, ...args:Parameters<typeof fn>):[number, Return]
// export function measureFunctionTime<A,B, Return=any>(fn:(a:A,b:B)=>Return, ...args:Parameters<typeof fn>):[number, Return]
// export function measureFunctionTime<A,B,C, Return=any>(fn:(a:A,b:B,c:C)=>Return, ...args:Parameters<typeof fn>):[number, Return]
// export function measureFunctionTime<A,B,C,D, Return=any>(fn:(a:A,b:B,c:C,d:D)=>Return, ...args:Parameters<typeof fn>):[number, Return]
// export function measureFunctionTime<A,B,C,D,E, Return=any>(fn:(a:A,b:B,c:C,d:D,e:E)=>Return, ...args:Parameters<typeof fn>):[number, Return]

// export function measureFunctionTime<Return=any>(fn:(...args)=>Return, args:any[]):[number, Return]
export const measureFunctionTime = <Return=any>(fn:(...args)=>Return, ...args:Parameters<typeof fn>):[number, Return]=>{
	const startTime = now();
	const result =  fn(...args);
	
	const endTime = now();
	const executionTime = endTime - startTime;
	return [executionTime, result]
}

export async function measurePromiseTime<T=any>(promise:Promise<T>):Promise<[number, T]>{
	const startTime = now();
	const result:T = await promise;
	const endTime = now();
	const executionTime = endTime - startTime;
	return [executionTime, result]
}


/**
 * map轉對象數組
 * @param map 
 * @returns 
 */
export function mapToObjArr<K,V>(map:Map<K,V>){
	let objArr:{k:K,v:V}[] = []
	for(const [mk,mv] of map){
		objArr.push({k:mk, v:mv})
	}
	return objArr
}

/**
 * 連續正則表達式ᶤ替換
 * @param str 
 * @param regexArr 
 * @param mode 
 */
export function serialReplace(str:string, regexArr:string[][], mode:string):string
export function serialReplace(str:string, regexArr:RegexReplacePair[]):string
export function serialReplace(str:string[], regexArr:string[][], mode:string, splitter?:string):string[]
export function serialReplace(str:string[], regexArr:RegexReplacePair[], splitter?:string):string[]

export function serialReplace(str:string|string[], regexArr:string[][]|RegexReplacePair[], mode?:string, splitter=/* String.fromCharCode(30) */'\n'){
	let regexObjs:RegexReplacePair[] = []
	if(Array.isArray(regexArr[0])){ //對應string[][]
		regexObjs = regexStrArrToObjs(regexArr as string[][], mode!)
	}else{
		regexObjs = regexArr as RegexReplacePair[]
	}

	function replaceStr(str:string, serialRegex:RegexReplacePair[]){
		let result = str+''
		for(let i = 0; i < serialRegex.length; i++){
			result = result.replace(serialRegex[i].regex, serialRegex[i].replacement)
		}
		return result
	}


	if(typeof(str)==='string'){
		return replaceStr(str, regexObjs)
	}else{
		let joined:string = str.join(splitter)
		let processed:string = replaceStr(joined, regexObjs)
		return processed.split(splitter)
	}
}

export function regexStrArrToObjs(regexArr:string[][], mode:string){
	let result:RegexReplacePair[] = []
	for(let i = 0; i < regexArr.length; i++){
		if(typeof(regexArr[i][0]) !== 'string'){
			throw new Error(`regexArr[i][0]) !== 'string'`)
		}
		if(typeof(regexArr[i][1]) !== 'string'){
			regexArr[i][1] = ''
		}
		let left = new RegExp(regexArr[i][0], mode)
		let right:string = getUnescapeStr(regexArr[i][1])
		let unus:RegexReplacePair = {regex:left, replacement:right}
		result.push(unus)
	}
	return result
}


export function getUnescapeStr(str:string):string{
	let result:string = str + ''  //
	
	result = result.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\\\/g, '\\')

	if(result === undefined/*  || result === 'undefined' */){
		//console.log('undefined')
		result = ''
	}
	//console.log(result)
	return result
}

/**
 * 統計數組中各元素出現的次數
 * @param arr 
 * @returns 元素對出現次數的Map
 */
export function mapOccurrenceTimes<T>(arr:T[]):Map<T, number>{
	let result = new Map<T,number>()
	for(let i = 0; i < arr.length; i++){
		let k = result.get(arr[i])
		if(k){
			let v = k+1
			result.set(arr[i], v)
		}else{
			result.set(arr[i], 1)
		}
	}
	return result
}


/**
 * 根據對象數組返回map。例如obj是對象數組、數組中每個元素都有字串name和數字id、則(obj, 'name', 'id')則返回 Map<string, number[]>
 * @param objArr 對象數組
 * @param fieldAsK 對象中的字段、該字段的值將作爲map的鍵
 * @param fieldAsV 對象中的字段、該字段的值將作爲map的值數組中的一個元素。皆只支持當前層級的基本數據類型的字段
 * @returns 
 */
export function mapFields<T, K extends keyof T, V extends keyof T>(objArr: T[], fieldAsK: K, fieldAsV: V): Map<T[K], T[V][]> {
	const isValidObj = (obj: any): obj is T => obj != null && typeof obj === 'object' && fieldAsK in obj && fieldAsV in obj;
	
	if (!objArr.every(isValidObj)) {
		throw new Error(`Some objects in the input array are missing '${fieldAsK.toString()}' or '${fieldAsV.toString()}' properties.`);
	}
	
	let result = new Map<T[K], T[V][]>();
	
	for (let i = 0; i < objArr.length; i++) {
		let v = result.get(objArr[i][fieldAsK]);
		
		if (v) {
		v.push(objArr[i][fieldAsV]);
		result.set(objArr[i][fieldAsK], v);
		} else {
		result.set(objArr[i][fieldAsK], [objArr[i][fieldAsV]]);
		}
	}
	
	return result;
	}




export function spliceStr(str: string, start: number, deleteCount: number, replacement: string = ''): string {
	return str.slice(0, start) + replacement + str.slice(start + deleteCount);
}

/**
 * 二維數組轉置
 * @param arr 
 * @param insteadOfUndef 原arr中的undefined元素對應在返回值中將被替換成insteadOfUndef。若不填則會調用isLikeMatrix()檢查arr是否合法
 * @returns 
 */
export function transpose<T>(arr:T[][], insteadOfUndef?){
	if(insteadOfUndef === undefined){
		if(!Ut.isLikeMatrix(arr)){throw new Error('!Util.isMatrix(arr)')}
		return _.zip(...arr) as T[][]
	}else{
		return tr(arr, insteadOfUndef)
	}
	function tr(arr:T[][], insteadOfUndef){
		let max2DLength = findLongest2DLength(arr)
		//let result:T[][] = new Array(max2DLength).fill(new Array(arr.length).fill(undefined))
		let result:T[][] = [[]]
		//console.log(result)
		for(let i = 0; i < max2DLength; i++){
			result[i] = []
		}
		
		for(let i = 0; i < arr.length; i++){
			//result[i] = []
			for(let j = 0; j < max2DLength; j++){
				let cur = arr[i][j]??insteadOfUndef
				result[j][i] = cur
			}
		}
		return result
	}
	function findLongest2DLength(arr:any[][]){
		let max=arr[0].length
		for(let i = 0; i < arr.length; i++){
			if(arr[i].length>max){max=arr[i].length}
		}
		return max
	}
	
}

export function YYYYMMDDHHmmss(){
	return dayjs().format('YYYYMMDDHHmmss')
}
export function YYYYMMDDHHmmssSSS(){
	return dayjs().format('YYYYMMDDHHmmssSSS')
}

export function printArr(arr:any[], splitter=''){
	for(let i = 0; i < arr.length; i++){
		process.stdout.write(arr[i])
		process.stdout.write(splitter)
	}
}

/**
 * 求兩數組的笛卡爾積
 * @param arr1 
 * @param arr2 
 * @returns 
 */
export function cartesianProduct<A,B>(arr1: A[], arr2: B[]) {
	const result: [A,B][] = [];
	for (const item1 of arr1) {
		for (const item2 of arr2) {
			result.push([item1, item2]);
		}
	}
	return result
}

/**
 * 用集合的標準過濾數組、例如傳入 [[a,a],[a,b],[b,a],[a,c]] 則返回 [[a,b], [a,c]]
 * @param arr 
 * @returns 
 */
export function filterArrLikeSets<A,B>(arr: [A, B][]){
	const seenPairs = new Set<string>();
	const uniquePairs: [A, B][] = [];
	for (const pair of arr) {
		if (pair[0] as any !== pair[1]) { //<待叶>{如何在函數中比較兩個泛型類型是否是同一類型}
			const sortedPair = pair.slice().sort();
			const pairKey = `${sortedPair[0]},${sortedPair[1]}`;
		
			if (!seenPairs.has(pairKey)) {
				seenPairs.add(pairKey);
				uniquePairs.push(pair);
			}
		}
	}
	
	return uniquePairs;
}


export function getCombinationsWithRepetition<T>(set: T[], n: number): T[][] {
	const result: T[][] = [];
  
	function generateCombinations(currentCombination: T[]/* , currentIndex: number */) {
		if (currentCombination.length === n) {
			result.push(currentCombination);
			return;
		}

		for (let i = 0; i < set.length; i++) {
			generateCombinations([...currentCombination, set[i]]/* , i */);
		}
	}

	generateCombinations([]/* , 0 */);
	return result;
}

export function objArrToStrArr<T>(objArr:T[]){
	let result:string[][] = []
	for(let i = 0; i < objArr.length; i++){
		let line:string[] = []
		for(let key in objArr[i]){
			// console.log(`console.log(key)`)
			// console.log(key)
			// console.log(`console.log(objArr[i][key])`)
			// console.log(objArr[i][key])
			let e:any = objArr[i][key]
			if(!e){e=''}
			line.push(e.toString())
		}
		result.push(line)
	}
	return result
}










/**
 * [2023-09-09T15:34:49.000+08:00,]<>{欲重構、把各函數各自導出。}
 */
export default class Ut {
	
	private constructor(){}

	public static readonly L_ALPHABET = 'abcdefghijklmnopqrstuvwxyz'


	public static isLikeMatrix(arr: any[][]): boolean {
		if (!Array.isArray(arr)) {
		  return false; // 不是数组，不是矩阵
		}
	  
		// 检查每个子数组的长度是否一致
		const subArrayLength = arr[0].length;
		for (let i = 1; i < arr.length; i++) {
		  if (!Array.isArray(arr[i]) || arr[i].length !== subArrayLength) {
			return false; // 不是矩阵
		  }
		}
	  
		return true; // 是矩阵
	  }

	/**
	 * AI寫的創建多維數組並填充(試驗)
	 * 創建一個2行3列的string[][]且使每個元素都是'a'
	 * let arr2 = Util.createArr<string>([2,3], 'a')
	 * @param dimensions 
	 * @param fill 
	 * @returns 
	 */
	public static createArr<T>(dimensions: number[], fill: any){
		if (dimensions.length === 0) {
			throw new Error("Dimensions array should not be empty");
		}
	
		const result: T[][] = [];
	
		function fillArray(dims: number[], depth: number): T | T[] {
			const currentDimension = dims[depth];
			const isLastDimension = depth === dims.length - 1;
	
			if (isLastDimension) {
				return Array(currentDimension).fill(fill) as unknown as T;
			} else {
				const subArray: T[] = [];
				for (let i = 0; i < currentDimension; i++) {
					subArray.push(fillArray(dims, depth + 1) as T);
				}
				return subArray;
			}
		}
	
		return [fillArray(dimensions, 0)];
	}
	


	/**
	 * 判斷text中的str1與str2是否配對。若str1與str2皆無亦算已配對。如(text, '{','}')
	 * @param text 
	 * @param str1 
	 * @param str2 
	 * @returns 
	 */
	public static isMatchInPair(text:string, str1:string, str2:string):boolean
	public static isMatchInPair(text:string, pairs:([string,string])[]):boolean

	public static isMatchInPair(text:string, pairs:([string,string])[]|string, p3?:string){
		function f(text:string, str1:string, str2:string){
			const regex = new RegExp(`${str1}|${str2}`, 'g')
			const matches = text.match(regex)
			if(!matches||matches.length===0){
				return true
			}
	
			let stack:string[] = []
			for(let i = 0; i < matches.length; i++){
				if(matches[i]===str1){stack.push(str1)}
				else if(matches[i]===str2){
					if(stack.length===0){return false}
					stack.pop()
				}
			}
			return stack.length === 0
		}

		if(p3!==undefined){
			return f(text, pairs as string, p3)
		}else{
			//......
		}
		
	}




}


