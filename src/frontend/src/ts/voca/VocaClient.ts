import { IVocaRow } from "@shared/SingleWord2"
import SingleWord2 from "@shared/SingleWord2"
import { NetworkError, $ } from "@shared/Ut"
import { VocaRawConfig } from "@shared/VocaRaw2"
import { alert, alertEtThrow } from "@ts/frut"

//import Config from '@shared/Config'
//const config = Config.getInstance()
// 此處用單例模式更佳抑靜態類更佳?

const fero = async(input: RequestInfo| URL, init?: RequestInit | undefined) =>{
	try {
		const resp = await fetch(input, init)
		if(!resp.ok){
			throw NetworkError.new()
		}
		return resp
	} catch (error) {
		const err = error as Error
		alertEtThrow(err)
	}
}

/**
 * 以免 ˌ直ᵈ await response.json 致 調用堆棧訊ˋ失
 * @param response 
 * @returns 
 */
const jsonRes = async(response:Response)=>{
	const text = await response.text()
	return JSON.parse(text)
}

const Err = (err:Error)=>{
	return new Error(err.toString())
}

export default class VocaClient{
	private static _instance?:VocaClient
	public static baseUrl = localStorage.getItem('baseUrl')??window.location.origin //`http://127.0.0.1:${config.config.port}`

	private constructor(){}
	public static getInstance(){
		if(VocaClient._instance === undefined){
			VocaClient._instance = new VocaClient()
		}
		return VocaClient._instance
	}

	private _baseUrl = C.baseUrl
	get baseUrl(){return this._baseUrl}

	/**
	 * 便于在dev模式調試
	 * @param baseUrl 
	 */
	public static set_baseUrl(baseUrl:string){
		VocaClient.baseUrl = baseUrl
		localStorage.setItem('baseUrl', baseUrl)
	}

	public static async fetchRandomImg(){
		try{
			const url = new URL('/randomImg', VocaClient.baseUrl)
			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
				},
				body: '', // 将数据对象转换为 JSON 字符串
			};
			const res = await fetch(url, requestOptions)
			if(!res.ok){throw new Error()}
			const result:[string, string] = await res.json()
			//console.log(result[1].slice(0,999))
			return result
		}catch(e){alertEtThrow(e);}
	}

	/**
	 * @deprecated
	 * @param path 
	 * @returns 
	 */
	public static async fetchWords(path:string):Promise<SingleWord2[] | undefined>{

		try{
			const url = new URL(path, VocaClient.baseUrl);
			const res = await fetch(url)
			//console.log(res)
			if(!res.ok){
				throw new Error(`!res.ok`)
			}
			const words:IVocaRow[] = await res.json()
			
			
			//console.log(SingleWord2.fieldStringfy(words as any))
			//console.log(`console.log(words)`)
			//console.log(words)//t
			//console.log(SingleWord2.parse(words))
			return SingleWord2.toJsObj(words)
		}catch(e){
			//console.error(e)
			alertEtThrow(e)
		}
	}

	public static async saveWords(rows:IVocaRow[]){

		const stringfiedRows = JSON.stringify(rows)
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: stringfiedRows, // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/saveWords', this.baseUrl)
		console.log(`console.log(stringfiedRows.length)`)
		console.log(stringfiedRows.length)//t
		try {
			const response = await fetch(apiUrl, requestOptions);
			
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response
			//const data = await response.json(); // 解析响应数据为 JSON
			//return data
			// 在这里处理后端响应的数据
		} catch (error) {
			alertEtThrow(error);
			// 在这里处理错误情况
		}
	}

	public static async addWords(rows:IVocaRow[], config:VocaRawConfig){
		const stringfiedBody = JSON.stringify([rows,config])
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: stringfiedBody, // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/addWords', this.baseUrl)
		try {
			const response = await fetch(apiUrl, requestOptions);
			
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			response.text().then((d)=>{
				alert(d)
			})//t
			return response
			
			//const data = await response.json(); // 解析响应数据为 JSON
			//return data
			// 在这里处理后端响应的数据
		} catch (error) {
			alertEtThrow(error);
			// 在这里处理错误情况
		}
	}

	public static async backupAllTables(){
		
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: '', // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/backupAll', this.baseUrl)
		try {
			const response = await fetch(apiUrl, requestOptions);
			
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			response.text().then(d=>console.log(d))//t
			return response
			
			//const data = await response.json(); // 解析响应数据为 JSON
			//return data
			// 在这里处理后端响应的数据
		} catch (error) {
			alertEtThrow(error);
			// 在这里处理错误情况
		}
	}

	public static async creatTable(tableName:string){
		//console.log(tableName)
		//console.log(JSON.stringify(tableName))
		const obj = {tableName:tableName}
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: JSON.stringify(obj), // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/creatTable', this.baseUrl)
		try {
			const response = await fetch(apiUrl, requestOptions);
			
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			response.text().then(d=>console.log(d))//t
			return response
			
			//const data = await response.json(); // 解析响应数据为 JSON
			//return data
			// 在这里处理后端响应的数据
		} catch (error) {
			alertEtThrow(error);
			// 在这里处理错误情况
		}
	}

	public static async compileTs(tsCode:string, tsconfig:string=`{}`){
		try {
			const url = new URL('/compileTs', this.baseUrl)
			const body = JSON.stringify(
				[tsCode, tsconfig]
			)
			//console.log(body)//t
			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
				},
				body: body // 将数据对象转换为 JSON 字符串
			};
			const resp = await fetch(url, requestOptions)
			if(!resp.ok){
				throw new Error(`!resp.ok`)
			}
			return await resp.text()
			
		} catch (error) {
			alertEtThrow(error)
		}
	}


	/**
	 * resp.json()出錯旹調用堆棧ᵗ訊ˋ失
	 */
	public testJson(){
		const url = new URL('/tables', this.baseUrl)
		fetch(url)
		.then(resp=>{
			return resp.json()
		}).catch(error=>{
			console.log(error)
			console.log(new Error())
		})
	}

	//直ᵈ如是寫則抛錯旹無調用堆棧
	/*
	.catch(e=>{
				console.log(`.catch`)
				console.log(e)
				console.log(`end .catch`)
			})
	*/

	public async get_tables(){
		try {
			const url = new URL('/tables', this.baseUrl)
			const resp = await fetch(url)
			if(!resp.ok){
				throw new Error(`!resp.ok`)
			}
			//const ans:string[] = await resp.json()
			// const text = await resp.text()
			// const ans:string[] = JSON.parse(text)
			const ans:string[] = await jsonRes(resp)
			return ans
		} catch (error) {
			const err = error as Error
			//alertEtThrow(Err(err))
			//console.log(err)
			alertEtThrow(err)
		}
	}

/*
大佬们、请教一个问题、为什么这样写 await resp.json()处抛出的错误会丢失调用堆栈信息
 */

	/**
	 * 從後端取整ᵗ單詞表
	 * @param table 
	 * @returns 
	 */
	public async get_words(table:string){
		const params = new URLSearchParams({table:table})
		const url = new URL(`/words?${params.toString()}`, this.baseUrl)
		const resp_ = await fero(url)
		const resp = $(resp_)
		
		const text = await resp.text()
		const jsonArr = text.trim().split('\n')
		const words = jsonArr.map((e,)=>{
			return JSON.parse(e)
		})
		return SingleWord2.toJsObj(words)
	}

	public async getAllTablesWords(){
		const tables = await this.get_tables()
		//console.log(tables)//t
		const ans:SingleWord2[] = []
		try {
			for(const u of $(tables)){
				const ua = await this.get_words(u)
				
				ans.push(...ua)
			}
		} catch (error) {
			
			const err = error as Error
			alertEtThrow(err)
		}
		return ans
	}

}
const C = VocaClient
type C = VocaClient