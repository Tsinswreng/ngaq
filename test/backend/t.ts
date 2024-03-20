import 'tsconfig-paths/register'
import * as algo from '@shared/algo'
import { Sros } from '@shared/Sros'

interface Static<Self>{
	new: (this)=>Self
	//不可作new()、否則ts視潙構造函數
	New():Self
}


interface Instance{
	name:string
	age:number
}

class Cl implements Instance{
	static new(){
		return new this()
	}
	static New(){
		return new this()
	}
	name = ''
	age = 0
}

const C:Static<Cl> = Cl


let obj1 = C.New()
let obj2 = C.new() //属性“new”在类型“Static<Cl>”上不存在。
console.log(obj2.age)


/* import EventEmitter = require('events')

const evEmt = new EventEmitter()

evEmt.on('myEvent', ()=>{
	console.log('1')
})

evEmt.on('myEvent', ()=>{
	console.log('2')
})

const evEmt2 = new EventEmitter()

evEmt2.on('myEvent', ()=>{
	console.log('3')
})

function emitEv(){
	console.log('abc')
	evEmt.emit('myEvent')
}

emitEv() */

import {
	VocaTableDbSrc
} from '@backend/db/sqlite/VocaTableMetadata/DbSrc'
import { Abs_SqliteDbSrc } from '@shared/interfaces/SqliteDbSrc'

async function main(){
	const o = await VocaTableDbSrc.New({
		_dbPath: 'testDb240320.db'
	})

	console.log(o.dbName)
	console.log(o.eventNames)
	console.log(
		o instanceof VocaTableDbSrc
	)
	console.log(
		o instanceof Abs_SqliteDbSrc
	)
}
main()