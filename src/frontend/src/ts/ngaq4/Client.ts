import { WordDbRow } from "@shared/dbRow/Word"
import { I_login, I_signUp } from "@shared/model/web/auth"
import LocalStorage from "@ts/LocalStorage"

import * as Mod from '@shared/model/user/UserModel'
import * as Row from '@shared/dbRow/user/UserRows'
import { lsItems } from "@ts/localStorage/Items"
import axios from 'axios'

type Req_method_t = 'GET' | 'POST'
// 封装请求函数
const apiRequest = (url:str, method:Req_method_t = "GET", data = null) => {
	const userId = lsItems.userId.get()
	const token = lsItems.token.get()
	return axios({
		method: method,
		url: url,
		data: data,
		headers: {
			'Content-Type': 'application/json',
//Bearer: HTTP 协议中用于身份验证的一种令牌类型。 持票人令牌
			'Authorization': `Bearer ${token}`, 
			'X-User-ID': userId
		}
	});
};

// 使用封装的请求函数发送请求
// apiRequest('https://your-api-endpoint.com')
//     .then(response => {
//         console.log(response.data);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

axios.interceptors.response.use(
	response => response,
	error => {
		if (error.response.status === 401) {
			// 重定向到登录页面或刷新令牌
			window.location.href = '/login';
		}
		return Promise.reject(error);
	}
);

const ngaqUrl = '/api/ngaq'

class UrlBases{
	user='/api/user'
	ngaq='/api/ngaq'
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

	async SignUp(opt:{
		uniqueName:str
		password:str
	}){
		const z = this
		//const url = new URL(`/signUp`, z.baseUrl+'/'+urlB.user)
		const url = new URL(`${urlB.user}/signUp`, z.baseUrl)
		console.log(url.toString())// => http://127.0.0.1:6324/signUp
		const body:I_signUp = {
			uniqueName: opt.uniqueName
			,password: opt.password
		}
		const requestOptions: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // 设置请求头为 JSON 格式
			},
			body: JSON.stringify(body), // 将数据对象转换为 JSON 字符串
		};
		const got = await fetch(url, requestOptions)
		console.log(got)//t
		if(!got.ok){
			//todo
			return
		}
		
	}


	async LoginByUniqueName(uniqueName:str, password:str){
		const z = this
		const url = new URL(`${urlB.user}/login`, z.baseUrl)
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

		const json = await got.text()
		if(!got.ok){
			//todo
			return json
		}
		const sessionRow = JSON.parse(json) as Row.Session
		const session = Mod.Session.fromRow(sessionRow)
		lsItems.session.set(sessionRow)
		lsItems.userId.set(session.userId)
		lsItems.token.set(session.token) //todo 網絡請求與理則分離
		return session
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