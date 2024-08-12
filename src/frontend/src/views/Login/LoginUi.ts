import { Exception } from "@shared/error/Exception"
import { Client } from "@ts/ngaq4/Client"
const client = Client.inst
export class LoginUi{
	protected constructor(){}
	static inst = LoginUi.new()
	protected __init__(...args: Parameters<typeof LoginUi.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	client = client

	//get This(){return LoginUi}
	async Login(uniqueName:str, password:str){
		const z = this
		try {
			await z.client.LoginByUniqueName(uniqueName, password)
			window.location.href = '/'
		} catch (err) {
			if(err instanceof Exception){
				alert(err.reason.name)
			}else{
				throw err
			}
		}
	}
}
