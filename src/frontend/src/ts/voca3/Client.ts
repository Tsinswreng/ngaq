import { WordDbRow } from "@shared/dbRow/Word"

/** Voca3 */
export class Client{

	get This(){return Client}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected __init__(){
		const z = this
		return z
	}

	protected _baseUrl = window.location.origin
	get baseUrl(){return this._baseUrl}
	/**便于在dev模式調試 */
	set baseUrl(v){this._baseUrl = v}

	
	async getWordsFromAllTables(){
		const z = this
		const url = new URL('/wordsFromAllTables', z.baseUrl)
		const got = await fetch(url)
		const text = await got.text()
		return text
	}

	/**
	 * 照搬舊版、待重構
	 * @param rows 
	 * @returns 
	 */
	async saveWords(rows:WordDbRow[]){
		const z = this
		const stringfiedRows = JSON.stringify(rows)
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: stringfiedRows, // 将数据对象转换为 JSON 字符串
		};
		
		// 后端 API 的 URL
		const apiUrl = new URL('/saveWords', this.baseUrl) //TO refactor
		try {
			const response = await fetch(apiUrl, requestOptions);
			
			if (!response.ok) {
				throw new Error('Network response was not ok'); //TO refactor
			}
			return response
		} catch (error) {
			throw error
		}
	}
}