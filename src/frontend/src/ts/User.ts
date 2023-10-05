import Client from "@ts/Client";
const client = Client.getInstance()
const baseUrl = client.config.baseUrl
export default class User{

	public static readonly loginPath
	public async qryVerifCode(){
		
	}

	public async login(p:{userName:string, password:string}){
		const loginUrl = new URL('')
	}
}