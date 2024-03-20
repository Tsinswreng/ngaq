import { User } from "@backend/entities/User"
import { I_DbRow_Static } from "@shared/interfaces/SqliteDbSrc"
/**
 * used as Interface
 */
class _Db_User{
	/** names of columns in database */
	static id = 'id'
	static name = 'name'
	static password = 'password'
	static date = 'date'
	static email = 'email'

	protected constructor(
		
		public name:string
		,public password:string
		,public date:string
		,public email:string
		,public id?:number|string
	){}

	static toEntity(o:Db_User):User{
		const ans = User.new({
			_id: Number(o.id)
			,_name: o.name
			,_password: o.password
			,_date: o.date
			,_email: o.email
		})
		return ans
	}
	
	static toPlain(o:User):Db_User{
		const ans:Db_User = {
			id: o.id
			,name: o.name
			,password: o.password
			,date: o.date
			,email: o.email
		}
		return ans
	}
}

export type Db_User = _Db_User
export const Db_User:I_DbRow_Static<_Db_User, User> & typeof _Db_User = _Db_User // 不加typeof則是實例ᵗ類型
//export const Db_User = _Db_User
