import { IVocaRow } from "@shared/SingleWord2"
import SingleWord2 from "@shared/SingleWord2"

export default class VocaClient{
	private static _instance?:VocaClient
	public static readonly baseUrl = 'http://127.0.0.1:1919'
	private constructor(){}
	public static getInstance(){
		if(VocaClient._instance === undefined){
			VocaClient._instance = new VocaClient()
		}
		return VocaClient._instance
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
			return SingleWord2.parse(words)
		}catch(e){
			console.error(e)
		}
	}

	public static async saveWords(rows:IVocaRow[]){

		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: JSON.stringify(rows), // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/saveWords', this.baseUrl)

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
			console.error('发生错误：', error);
			// 在这里处理错误情况
		}
	}

}