import { Client } from "@ts/ngaq4/Client";

export class SignUp{
	static _inst: SignUp;
	static getInst(): SignUp{
		if(!SignUp._inst){
			SignUp._inst = new SignUp();
		}
		return SignUp._inst;
	}

	//SignUp({uniqueName:'TswG', password:'TswG'})

	client = Client.inst

	async SignUp(
		uniqueName: str,
		password: str
	){
		const z = this
		try {
			await z.client.SignUp({
				password: password
				,uniqueName: uniqueName
			})
		} catch (error) {
			console.error(error)
			alert('Sign Up Failed')
		}
	}
}