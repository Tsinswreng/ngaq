import { WordDbRow } from "@shared/old_dbRow/Word"
import { I_login, I_signUp } from "@shared/model/web/auth"
import LocalStorage from "@ts/LocalStorage"

import * as UMod from '@shared/model/user/UserModel'
import type * as URow from '@shared/model/user/UserRows'

import type * as NMod from '@shared/model/word/NgaqModels'
import type * as NRow from '@shared/model/word/NgaqRows'

import { lsItems } from "@ts/localStorage/Items"
import axios, { AxiosRequestConfig } from 'axios'
import { Exception, Reason } from "@shared/error/Exception";
import { JoinedRow } from "@shared/model/word/JoinedRow"
import type { I__ } from "@shared/Type"
import type * as WordIf from '@shared/interfaces/WordIf'
import { JoinedWord } from '@shared/model/word/JoinedWord'

const GET = 'GET'
const POST = 'POST'
type Req_method_t = 'GET' | 'POST'
// 封装请求函数

//function apiRequest(url:str, method:Req_method_t, data)

function getAxiosOpt(url:str, method:Req_method_t = "GET", data?:kvobj|undef){
	const userId = lsItems.userId.get()
	const token = lsItems.token.get()
	const opt:AxiosRequestConfig<any> = {
		method: method,
		url: url,
		//data: data,
		headers: {
			'Content-Type': 'application/json',
//Bearer: HTTP 协议中用于身份验证的一种令牌类型。 持票人令牌
			'Authorization': `Bearer ${token}`, 
			'X-User-ID': userId
		},
	}
	if(method === 'GET' && data != void 0){
		opt.params = data
	}else{ //POST
		if(data != void 0){
			opt.data = data
		}else{
			opt.data = {}
		}
	}
	return opt
}

function ApiRequest(url:str, method:Req_method_t = "GET", data?:kvobj|undef){
	const userId = lsItems.userId.get()
	const token = lsItems.token.get()
	const opt:AxiosRequestConfig<any> = {
		method: method,
		url: url,
		//data: data,
		headers: {
			'Content-Type': 'application/json',
//Bearer: HTTP 协议中用于身份验证的一种令牌类型。 持票人令牌
			'Authorization': `Bearer ${token}`, 
			'X-User-ID': userId
		},
	}
	if(method === 'GET' && data != void 0){
		opt.params = data
	}else{ //POST
		if(data != void 0){
			opt.data = data
		}else{
			opt.data = {}
		}
	}
	return axios(opt);
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
		if (error?.response?.status === 401) {
			// 重定向到登录页面或刷新令牌
			console.error(error)//t
			//window.location.href = '/login';
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
/** ngaq4 */

const RN = Reason.new.bind(Reason)
class ErrReason{
	login_err = RN('login_err')
}

export class Client{

	static inst = Client.new()

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

	protected _errReason = new ErrReason()
	get errReason(){return this._errReason}
	protected set errReason(v){this._errReason = v}
	


	setSession(session:URow.Session){
		lsItems.session.set(session)
		lsItems.userId.set(session.userId)
		lsItems.token.set(session.token)
	}

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
		//console.log(got)//t
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
			throw Exception.for(z.errReason.login_err, json)
		}
		const sessionRow = JSON.parse(json) as URow.Session
		const session = UMod.Session.fromRow(sessionRow)
		z.setSession(sessionRow)
		return session
	}


	async Get_randomImg(){
		const z = this
		const url = new URL(`${urlB.user}/randomImg`, z.baseUrl)
		const opt = getAxiosOpt(url.toString(), GET)
		opt.responseType = 'arraybuffer'
		const resp = await axios(opt)
		return resp.data
	}

	async AddLearnRows(learnRows:NRow.Learn[]){
		const z = this
		const url = new URL(`${urlB.user}/addLearnRows`, z.baseUrl)
		const resp = await ApiRequest(url.toString(), POST, learnRows)
		return resp.data
	}

	
	async GetWeightAlgoJs0(){
		const z = this
		const url = new URL(`${urlB.user}/weightAlgoJs0`, z.baseUrl)
		const got = await ApiRequest(url.toString(), 'POST')
		const text = got.data
		//const text = await got.text()
		return text as str
	}

	async GetWordsFromAllTables(){
		const z = this
		const url = new URL(`${urlB.user}/allWords`, z.baseUrl)
		const got = await ApiRequest(url.toString(), "POST", {})
		//const got = await fetch(url)
		return got.data as JoinedRow[]
		//const text = await got.text()
		//return text
	}

	async AddNeoWords(words:JoinedRow[]){
		const z = this
		// const rows = words.map(e=>e.toRow())
		const rows = words
		const url = new URL(`${urlB.user}/addNeoWords`, z.baseUrl)
		const resp = await ApiRequest(url.toString(), POST, rows)
		return resp
	}

	async Get_recentLearnCnt(){
		const z = this
		const url = new URL(`${urlB.user}/recentLearnCnt`, z.baseUrl)
		const got = await ApiRequest(url.toString(), GET)
		return got.data
	}



/** @deprecated ------------------------------------------------------------------------*/

	/**
	 * ,照搬舊版、待重構
	 * @param rows 
	 * @returns 
	 * @deprecated
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