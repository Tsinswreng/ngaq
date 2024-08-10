import { KeyMirror, PubNonFuncProp } from "@shared/Type";
import { As } from "@shared/Common";
import Tempus from "@shared/Tempus";
import * as Row from "@shared/model/user/UserRows"
import { keyMirror } from "@shared/tools/keyMirror";
import { assign } from "@shared/dbFrame/Models";
import { BaseInst } from "@shared/dbFrame/Models";
import { BaseFactory } from "@shared/dbFrame/Models";
import { IdBlCtMtInst } from "@shared/dbFrame/Models";
import { IdBlCtMtFact } from "@shared/dbFrame/Models";

export const IdBlCtMt = IdBlCtMtFact.new() as IdBlCtMtFact<any, any>
export type IdBlCtMt<A extends Row.IdCtMtBl> = IdBlCtMtInst<A>

import { UserInst, UserFact } from "./mods/User";
export const User = UserFact.new() as unknown as UserFact
export type User = UserInst


class PasswordInst extends IdBlCtMtInst<Row.Password>{
	override get Row(){return Row.Password}
	declare belong: Row.PasswordBelong;
	fid:int
	salt:str
	text:str
}
class PasswordFact extends IdBlCtMtFact<PasswordInst, Row.Password>{
	Row = Row.Password
	//@ts-ignore
	Inst = PasswordInst
}
export const Password = PasswordFact.new() as unknown as PasswordFact
export type Password = PasswordInst



class SessionInst extends IdBlCtMtInst<Row.Session>{
	override get Row(){return Row.Session}
	userId:int
	token:str
	expirationTime:Tempus
	override correctRow(row: Row.Session): Row.Session {
		row = super.correctRow(row)
		row.expirationTime = Tempus.toUnixTime_mills(As(
			row.expirationTime, Tempus
		))
		return row
	}
	isValid():bool{
		const z = this
		const nunc = Tempus.new()
		const diff = Tempus.diff_mills(nunc, z.expirationTime)
		if(diff >= 0){
			return false
		}
		return true
	}
}
class SessionFact extends IdBlCtMtFact<SessionInst, Row.Session>{
	Row = Row.Session
	//@ts-ignore
	Inst = SessionInst
	override correctInst(inst: SessionInst): SessionInst {
		inst = super.correctInst(inst)
		inst.expirationTime = Tempus.new(As(inst.expirationTime, 'number'))
		return inst
	}
}
export const Session = SessionFact.new() as unknown as SessionFact
export type Session = SessionInst


class ProfileInst extends IdBlCtMtInst<Row.Profile>{
	/** userId */
	fid:int
	nickName:str
	sex:str
	birth:Tempus
	email:str
	override get Row(){return Row.Profile}
	override correctRow(row: Row.Profile): Row.Profile {
		row = super.correctRow(row)
		row.birth = Tempus.toUnixTime_mills(As(
			row.birth, Tempus
		))
		return row
	}
}
class ProfileFact extends IdBlCtMtFact<ProfileInst, Row.Profile>{
	Row = Row.Profile
	//@ts-ignore
	Inst = ProfileInst
	override correctInst(inst: ProfileInst): ProfileInst {
		inst = super.correctInst(inst)
		inst.birth = Tempus.new(As(inst.birth, 'number'))
		return inst
	}
}
export const Profile = ProfileFact.new() as unknown as ProfileFact
export type Profile = ProfileInst



class UserDbInst extends IdBlCtMtInst<Row.UserDb>{
	name:str
	path:str
	override get Row(){return Row.UserDb}
}
class UserDbFact extends IdBlCtMtFact<UserDbInst, Row.UserDb>{
	Row = Row.UserDb
	//@ts-ignore
	Inst = UserDbInst
}
export const UserDb = UserDbFact.new() as unknown as UserDbFact
export type UserDb = UserDbInst


class User__dbInst extends IdBlCtMtInst<Row.User__db>{
	userId:int
	dbId:int
	override get Row(){return Row.User__db}
}
class User__dbFact extends IdBlCtMtFact<User__dbInst, Row.User__db>{
	Row = Row.User__db
	//@ts-ignore
	Inst = User__dbInst
}
export const User__db = User__dbFact.new() as unknown as User__dbFact
export type User__db = User__dbInst