import { Item, NumItem, JsonItem } from "./Item"; 

import type * as Mod from "@shared/model/user/UserModel";
import type * as Row from "@shared/dbRow/user/UserRows";




const I = Item.new.bind(Item)
const N = NumItem.new.bind(NumItem)
const J = JsonItem.new.bind(JsonItem)

class Items{
	userId = N('userId')
	token = I('token')
	// session = I<Row.Session>('session', {
	// 	encode(val){
	// 		return JSON.stringify(val)
	// 	}
	// 	,decode(str){
	// 		return JSON.parse(str)
	// 	}
	// })
	session = J<Row.Session>('session')
}

export const lsItems = new Items()
