export{}
// import { merge } from '@shared/Ut'
// import * as fs from 'fs'
// import Path from 'path'
// import { BufferEncoding } from 'typescript'




// interface I_readDirOpt{
// 	sync: boolean
// 	,encoding: BufferEncoding
// 	,recursive:boolean
// 	,noFile: boolean
// 	,noFolder: boolean
// 	,filter?: (...args:any[])=>boolean
// }

// interface I_create{
// 	sync: boolean
// 	,recursive: boolean
// 	,overwrite: boolean
// }

// export function readDir(opt:{sync:true}&Partial<I_readDirOpt>):(dir:string)=>string[]
// export function readDir(opt:{sync:false}&Partial<I_readDirOpt>):(dir:string)=>Promise<string[]>
// export function readDir(opt:Partial<I_readDirOpt>):(dir:string)=>string[]|Promise<string[]>{
// 	const defltOpt:I_readDirOpt={
// 		sync: true
// 		,recursive:false
// 		,encoding: 'utf-8'
// 		,noFile: false
// 		,noFolder: false
// 		,filter: void 0
// 	}
// 	opt = merge(defltOpt, opt)

// 	if(opt.sync){
// 		if(opt.recursive){

// 		}else{

// 		}
// 	}
	
// }



// export function createFile(target:string, opt:{sync:true}&Partial<I_create>):string
// export function createFile(target:string, opt:{sync:false}&Partial<I_create>):Promise<string>
// export function createFile(target:string, opt:Partial<I_create>):string|Promise<string>{
// 	const defaultOpt:I_create={
// 		sync: true
// 		,recursive: false
// 		,overwrite: false
// 	}
// }

// export function createDir(target:string, opt:{sync:true}&Partial<I_create>):string
// export function createDir(target:string, opt:{sync:false}&Partial<I_create>):Promise<string>
// export function createDir(target:string, opt:Partial<I_create>){
// 	const defaultOpt:I_create={
// 		sync: true
// 		,recursive: false
// 		,overwrite: false
// 	}
// }

// export const mkdir = createDir

// //一個typescript函數、最後一個參數opt是個對象。當opt.sync爲true時該函數返回string、爲false時返回Promise<string>。如何爲這個函數寫類型聲明? (不要簡單粗暴地把返回值類型聲明成string|Promise<string>)

