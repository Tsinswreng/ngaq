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
import { As } from "@shared/Ut"
import Tempus from "@shared/Tempus"
import { splitAtLength } from "@shared/algo"

const configInst = Config.getInstance()

export class UserCtrl extends BaseCtrl{
	protected constructor(){super()}
	//@ts-ignore
	protected __init__(...args: Parameters<typeof UserCtrl.new>){
		const z = this
		z.svc = args[0]
		super.__init__()
		return z
	}

	static new(svc:UserSvc){
		const z = new this()
		z.__init__(svc)
		return z
	}

	static inst = UserCtrl.new(UserSvc.inst)

	//get This(){return UserCtrl}

	protected _svc:UserSvc
	get svc(){return this._svc}
	protected set svc(v){this._svc = v}

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

	async ValidateHeaders(req:Request, res:Response){
		try {
			const z = this
			const userId = req.header('X-User-ID')
			const authHead = req.header('authorization')
			if(userId == void 0 || authHead == void 0){
				res.status(401).json({error: 'Unauthorized'})
				return null
			}
			const bearer = 'Bearer '
			const [gotBearer, token] = splitAtLength(authHead, bearer.length)
			if(bearer !== gotBearer){
				res.status(401).json({error: 'Unauthorized: Invalid authorization header'})
				return null
			}
			const got = await z.svc.ValidateUserIdEtToken(userId, token)
			if(!got){
				res.status(401).json({error: 'Unauthorized'})
				return null
			}
			return userId
		} catch (err) {
			res.status(401).json({error: 'Unauthorized'})
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