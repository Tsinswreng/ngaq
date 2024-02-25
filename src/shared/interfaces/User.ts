import { User } from "@backend/entities/User"

/**
 * used as Interface
 */
export class Db_User{
	/** names of columns in database */
	static id = 'id'
	static name = 'name'
	static password = 'password'
	static date = 'date'
	static email = 'email'

	protected constructor(
		 public id:number|string
		,public name:string
		,public password:string
		,public date:string
		,public email:string
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