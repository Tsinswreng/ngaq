import type { SqliteDb } from "@backend/sqlite/Sqlite"
import { I_DbSrc } from "@shared/dbFrame/I_DbSrc"
import { AddInstOpt, Tbl } from "./Tbl"
import { I_Tbls } from "@shared/dbFrame/I_Tbls"

export class DbSrc<Tbl_t extends I_Tbls> implements I_DbSrc {
	protected constructor(){}
	protected __init__(...args: Parameters<typeof DbSrc.new>){
		const z = this
		z.db = args[0]
		return z
	}

	static new(db:SqliteDb){
		const z = new this()
		z.__init__(db)
		return z
	}

	//get This(){return DbSrc}
	protected _db:SqliteDb
	get db(){return this._db}
	protected set db(v){this._db = v}

	protected _tbls:Tbl_t
	get tbls(){return this._tbls}
	protected set tbls(v){this._tbls = v}

	async Fn_Add<T extends Tbl<any>>(
		fn: (tbl:typeof this.tbls)=>T
		,opt?:AddInstOpt
	){
		const z = this
		const tbl = fn(z.tbls)
		const Fn = await tbl.Fn_Add(z.db, opt)
		return Fn as ReturnType<T['Fn_Add']>
	}

}

// class Items{
// 	a='a'
// 	b='b'
// }

// class Pa{
// 	items
// 	fn_getItem<T = str>(
// 		fn: (item: typeof this.items)=>T
// 	){

// 	}
// }

// class Ch extends Pa{
// 	items = new Items()
// }

// const ch = new Ch()
// ch.fn_getItem(e=>e.a) // 此處推斷e的類型爲any
// // 修改代碼、要求: 父類不實現items、也不指定items的類型、items由子類實現、fn中推斷e的類型爲子類的Items


// class Items {
//     a = 'a';
//     b = 'b';
// }

// class Pa<T> {
//     items!: T; // Use a generic type for items

//     fn_getItem<U = string>(
//         fn: (item: T) => U // Use the generic type T here
//     ) {
//         // You can call the function with this.items
//         return fn(this.items);
//     }
// }

// class Ch extends Pa<Items> { // Specify the type of items in the subclass
//     items = new Items();
// }

// const ch = new Ch();
// const result = ch.fn_getItem(e => e.a); // Here, e is inferred as Items
// console.log(result); // Output: 'a'


