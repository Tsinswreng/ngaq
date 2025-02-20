import { 
	Router 
	,Request
	,Response
	,NextFunction
} from "express-serve-static-core"
import { NgaqDbSvc } from "../svc/NgaqDbSvc"
import { BaseCtrl } from "./BaseCtrl"
import Config from "@backend/Config"
import { WeightCodeProcessor } from "@shared/WordWeight/Parser/WeightCodeProcessor"
import { Exception } from "@shared/error/Exception"
import { UserSvc } from "../svc/UserSvc"
import { I_login, I_signUp } from "@shared/model/web/auth"
import * as If from "@shared/model/web/auth"
import { As } from "@shared/Common"
import Tempus from "@shared/Tempus"
import { splitAtLength } from "@shared/algo"
import Path from 'path'
import { I__ } from "@shared/Type"
import * as UMod from '@shared/model/user/UserModel'
import type * as URow from '@shared/model/user/UserRows'

import type * as NMod from '@shared/model/word/NgaqModels'
import type * as NRow from '@shared/model/word/NgaqRows'
import { JoinedRow } from '@shared/model/word/JoinedRow'
import { JoinedWord } from '@shared/model/word/JoinedWord'
import { RandomImgSvc } from "../svc/RandomImgSvc"
const cwd = process.cwd()

const configInst = Config.getInstance()

export class UserCtrl extends BaseCtrl{
	protected constructor(){super()}
	//@ts-ignore
	protected async __Init__(...args: Parameters<typeof UserCtrl.New>){
		const z = this
		await super.__Init__()
		z.svc = args[0]
		z.randomImgSvc = await RandomImgSvc.GetInstance()
		return z
	}

	static async New(svc:UserSvc){
		const z = new this()
		await z.__Init__(svc)
		return z
	}

	protected static inst:UserCtrl
	static async GetInstance(){
		const z = this
		if(!z.inst){
			z.inst = await z.New(UserSvc.inst)
		}
		return z.inst
	}

	//get This(){return UserCtrl}

	protected _svc:UserSvc
	get svc(){return this._svc}
	protected set svc(v){this._svc = v}

	protected _randomImgSvc:RandomImgSvc
	get randomImgSvc(){return this._randomImgSvc}
	protected set randomImgSvc(v){this._randomImgSvc = v}
	

	// validateHeaders(req:Request, res:Response, next:NextFunction){
	// 	// 检查 Authorization 头部是否存在且格式正确
	// 	const authorizationHeader = req.headers['authorization'];
	// 	if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
	// 		return res.status(401).json({ error: 'Unauthorized' });
	// 	}
	
	// 	// 检查 X-User-ID 头部是否存在
	// 	const xUserIdHeader = req.headers['x-user-id'];
	// 	if (!xUserIdHeader) {
	// 		return res.status(400).json({ error: 'X-User-ID header is required' });
	// 	}
	
	// 	// 进行更复杂的身份验证逻辑，例如验证令牌的有效性等
	// 	// 这里假设验证通过，可以在实际应用中调用你的身份验证逻辑
	
	// 	// 如果验证通过，则将用户 ID 存储到请求对象中，以便后续路由处理函数使用
	// 	req.userId = xUserIdHeader;
	
	// 	// 继续处理下一个中间件或路由处理函数
	// 	next();
	// };

	//通過旹返userId，否則返回null
	/**
	 * 
	 * @param req 请求对象
	 * @param res 响应对象
	 * @returns 通过时返回userId，否则返回null
	 */
	async ValidateHeaders(req:Request, res:Response){
		try {
			const z = this
			const userId = req.header('X-User-ID') //从请求头中获取userId
			const authHead = req.header('authorization') //从请求头中获取Authorization (Bearer token)
			if(userId == void 0 || authHead == void 0){ // 若userId或Authorization不存在
				res.status(401).json({error: 'Unauthorized'}) // 响应401 Unauthorized
				return null // 直接返回null
			}
			const bearer = 'Bearer ' // 前缀
			const [gotBearer, token] = splitAtLength(authHead, bearer.length) // 切割Bearer和token
			if(bearer !== gotBearer){ // 若前缀不匹配
				res.status(401).json({error: 'Unauthorized: Invalid authorization header'}) // 响应401 Unauthorized
				return null
			}
			const got = await z.svc.ValidateUserIdEtToken(userId, token) // 验证token
			if(!got){ // 若验证失败
				res.status(401).json({error: 'Unauthorized'}) // 响应401 Unauthorized
				return null
			}
			return userId // 身份验证通过，返回userId
		} catch (err) {
			console.error(err)//t
			res.status(401).json({error: 'Unauthorized'}) // 响应401 Unauthorized
			return null
		}
		return null
	}

	protected override initRouter(): Router {
		const z = this
		const r = z.router

		r.get('/', (req,res)=>{
			try {
				res.send(Tempus.new())
			} catch (err) {
				if(err instanceof Exception){
					res.status(401).json(err)
				}
				z.onErr(err)
				res.status(401).send('')
			}
		})

		r.get('/time', (req,res)=>{
			try {
				res.send(Tempus.new())
			} catch (err) {
				if(err instanceof Exception){
					res.status(401).json(err)
				}
				z.onErr(err)
				res.status(401).send('')
			}
		})


		r.post('/login', async(req,res)=>{
			try {
				const body = req.body as I_login
				const uniqueName = As(body?.uniqueName, 'string')
				const password = As(body?.password, 'string')
				const session = await z.svc.LoginByName(uniqueName, password)
				const row = session.toRow()
				res.status(200).json(row)
			} catch (err) {
				if(err instanceof Exception){
					res.status(401).json(err)
					return
				}
				z.onErr(err)
				res.status(401).send('')
			}
		})
		//_.SignUp({uniqueName:'TswG', password:'TswG'})
		r.post('/signUp', async(req,res)=>{
			try {
				const body:I_signUp = req.body
				console.log(body)//t
				const uniqueName = As(body?.uniqueName, 'string')
				const password = As(body?.password, 'string')
				await z.svc.SignUp({
					uniqueName:uniqueName
					,password: password
				})
			} catch (err) {
				if(err instanceof Exception){
					res.status(401).json(err)
					return
				}
				z.onErr(err)
				res.status(401).send('')
			}
		})

		r.post('/allWords', async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){return}
				const joinedRows = await z.svc.GetAllWords(userId)
				res.status(200).json(joinedRows)
			} catch (err) {
				z.onErr(err)
				res.status(500).send('')
			}
		})

		r.post('/addLearnRows', async(req,res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){return}
				//const data:I__<NRow.Learn[]> = req.body
				const data = req.body as NRow.Learn[]
				await z.svc.AddLearns(userId, data)
				res.status(200).send('')
			} catch (err) {
				z.onErr(err, res)
			}
		})

		/** test */
		r.post('/weightAlgoJs0', async(req, res)=>{
			try {
				res.status(200).sendFile(
					Path.resolve(cwd, `./bundle/weight.js`)
				)
			} catch (err) {
				z.onErr(err, res)
			}
		})

		r.post('/addNeoWords', async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){
					return
				}
				const data = req.body as JoinedRow[]
				const ans = await z.svc.AddWordsFromTxt(userId, data)
				
				res.status(200).json(ans)
				// import('util').then(util=>{
				// 	console.log(util.inspect(ans, false, 8, true))//t
				// })
			} catch (err) {
				z.onErr(err, res)
			}
		})

		/**
		 * {id: }
		 */
		r.post("/rmWordById", async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){
					return
				}
				const data = req.body
				const id = data["id"]
				const ans = await z.svc.Rm_JoinedWord(userId, id)
				res.status(200).send('')
			} catch (error) {
				z.onErr(error,res)
			}
		})

		r.post("/updProp", async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){
					return
				}
				const prop = req.body as NRow.Property
				await z.svc.Upd_property(userId, prop)
				res.status(200).send('')
			} catch (error) {
				z.onErr(error,res)
			}
		})

		//[2025-01-24T17:13:24.387+08:00_W4-5]
		r.post("/updWordText", async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){
					return
				}
				//const prop = req.body as NRow.Property
				const body = req.body as NRow.TextWord
				//console.log(body)//t +
				const neoText = body.text
				const wordId = body.id
				await z.svc.Upd_wordText(userId, wordId, neoText)
				res.status(200).send('')
			} catch (error) {
				z.onErr(error,res)
			}
		})

		//[2025-01-24T17:13:24.387+08:00_W4-5]
		r.post("/addProp", async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){
					return
				}
				//const prop = req.body as NRow.Property
				const body = req.body as NRow.Property
				await z.svc.Add_Prop(userId, body)
				res.status(200).send('')
			} catch (error) {
				z.onErr(error,res)
			}
		})

	

		



		r.get('/randomImg', async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){return}
				const img = await z.randomImgSvc.Next()
				const u8arr = img.toUint8Arr()
				res.setHeader('Content-Type', 'application/octet-stream')
				res.setHeader('Content-Length', u8arr.byteLength.toString())
				res.status(200).send(Buffer.from(u8arr.buffer))
			} catch (err) {
				z.onErr(err, res)
			}
		})

		r.get('/recentLearnCnt', async(req, res)=>{
			try {
				const userId = await z.ValidateHeaders(req, res)
				if(userId == null){return}
				const cnt = await z.svc.Cnt_recentLearn(userId)
				res.status(200).send(cnt+'')
			} catch (err) {
				z.onErr(err, res)
			}
		})

		

		return r
	}
}



// function MyDec(){}

// class D{
// 	@MyDec
// 	name:string
// 	@MyDec
// 	age:number

// 	other
// }

// // 獲得類型: {name:string, age:number} ?