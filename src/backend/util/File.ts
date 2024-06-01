import * as fs from 'fs'
import * as ReadLine from 'readline'


export class FileReadLine{

	protected constructor(){}
	protected __init__(...args:Parameters<typeof FileReadLine.new>){
		const z = this
		z._path = args[0]
		const opt = args[1]
		z._fileStream = fs.createReadStream(z._path, opt)
		z._rlInterface = ReadLine.createInterface({
			input: z.fileStream
			//,crlfDelay: Infitiny // 无需转换换行符
		})
		return z
	}

	static new(path:str, opt?:BufferEncoding | undefined){
		const z = new this()
		z.__init__(path, opt)
		return z
	}

	protected _path:str
	get path(){return this._path}

	protected _fileStream:fs.ReadStream
	get fileStream(){return this._fileStream}

	protected _rlInterface:ReadLine.Interface
	get rlInterface(){return this._rlInterface}

	protected _pos:int = -1
	get pos(){return this._pos}

	async next(){
		const z = this
		z._pos ++
		return new Promise<str>((res,rej)=>{
			z.rlInterface.once('line', (line)=>{
				res(line)
			})
		})
	}
}



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


