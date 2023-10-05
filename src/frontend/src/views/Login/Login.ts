import Client from "@ts/Client";
const client = Client.getInstance()
const baseUrl = client.config.baseUrl
export default class Login{

	public static readonly loginPath = '/user/login'

	public static _instance:Login
	public static getInstance(){
		if(Login._instance === void 0){
			Login._instance = new Login()
		}
		return Login._instance
	}

	public async qryVerifCode(){
		
	}

	public async login(p:{username:string, password:string}){
		const loginUrl = new URL(Login.loginPath, baseUrl)
		try{
			const res = await fetch(loginUrl, {
					method: 'POST', 
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(p)
			})
			const txt = await res.text()
			console.log(txt)
		}catch(e){
			console.error(e)
		}
		
		
	}
}

