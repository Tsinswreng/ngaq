import { WordDbRow } from "@shared/dbRow/Word"
import { I_login } from "@shared/model/web/auth"
import LocalStorage from "@ts/LocalStorage"

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'
import { lsItems } from "@ts/localStorage/Items"

const ngaqUrl = '/api/ngaq'

class UrlBases{
	user='/api/user'
}
const urlB = new UrlBases()

const LS = LocalStorage
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

	protected _baseUrl = LS.items.baseUrl.get()??window.location.origin
	get baseUrl(){return this._baseUrl}
	/**便于在dev模式調試 */
	set baseUrl(v){this._baseUrl = v}


	async LoginByUniqueName(uniqueName:str, password:str){
		const z = this
		const url = new URL(`/login`, z.baseUrl+'/'+urlB.user)
		const body:I_login = {
			uniqueName:uniqueName
			,password: password
		}
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: JSON.stringify(body), // 将数据对象转换为 JSON 字符串
		};
		const got = await fetch(url, requestOptions)
		if(!got.ok){
			//todo
			return
		}
		const json = await got.text()
		const sessionRow = JSON.parse(json) as Row.Session
		const session = Mod.Session.fromRow(sessionRow)
		lsItems.userId.set(session.userId)
		
	}



	/**
	 * @deprecated
	 * @returns 
	 */
	async get_randomImg2(){
		const z = this
		const url = new URL('/randomImg2', z.baseUrl)
		const got = await fetch(url)
		return got
	}

	async get_randomImg4(){
		const z = this
		const url = new URL('/randomImg4', z.baseUrl)
		const got = await fetch(url)
		return got
	}

	
	async getWeightAlgoJs0(){
		const z = this
		const url = new URL(`${ngaqUrl}/weightAlgoJs0`, z.baseUrl)
		const got = await fetch(url)
		const text = await got.text()
		return text
	}

	
	async getWordsFromAllTables(){
		const z = this
		const url = new URL(`${ngaqUrl}/allWords`, z.baseUrl)
		const got = await fetch(url)
		const text = await got.text()
		return text
	}

	/**
	 * ,照搬舊版、待重構
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