import { UserSvc } from "@backend/webServer/svc/UserSvc";
import Config from "@backend/Config";
const config = Config.getInstance().config
const userSvc = UserSvc.inst

const {uniqueName, password} = config.ngaq.defaultUser

async function Main(){
	console.log(process.argv)
	await userSvc.SignUp({
		uniqueName: uniqueName
		,password: password
	})
	console.log(`done`)
}

Main().catch(e=>console.error(e))