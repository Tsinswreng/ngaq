import { IdBlCtMtInst,IdBlCtMtFact } from "@shared/dbFrame/Models"
import * as Row from "@shared/model/user/UserRows"

export class UserInst extends IdBlCtMtInst<Row.User>{
	uniqueName:str
	override get Row(){return Row.User}
}
export class UserFact extends IdBlCtMtFact<UserInst>{
	//@ts-ignore
	Inst = UserInst
}