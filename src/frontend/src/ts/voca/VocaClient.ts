import { IVocaRow } from "@shared/SingleWord2"
import SingleWord2 from "@shared/SingleWord2"
import { VocaRawConfig } from "@shared/VocaRaw2"
import { alert, alertEtThrow } from "@ts/frut"
//import Config from '@shared/Config'
//const config = Config.getInstance()
// 此處用單例模式更佳抑靜態類更佳?
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
			return SingleWord2.parse(words)
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

	public static async compileTs(tsCode:string, tsconfig?:string){
		try {
			const url = new URL('/compileTs', this.baseUrl)
			const requestOptions: RequestInit = {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
				},
				body: JSON.stringify(
					[tsCode, tsconfig]
				), // 将数据对象转换为 JSON 字符串
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

}