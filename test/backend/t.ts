import 'tsconfig-paths/register'
import * as algo from '@shared/algo'
import { Sros } from '@shared/Sros'
import EventEmitter = require('events')
import chalk from 'chalk'

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
//console.log(obj2.age)


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

abstract class A{
	static new(props:{
		_dbName?:string,
		_dbPath?:string,
		_tableName?:string,
		_backupDbPath?:string
		,mode?:number
		//,_tableMetadataDbSrc:Object
	}){}
}

const A_ = A
type A_ = A

class B extends A_{
	static new(props:{
		_dbName?:string,
		_dbPath?:string,
		_tableName?:string,
		_backupDbPath?:string
		,mode?:number
		,_tableMetadataDbSrc:Object
	}){}
}


class Event{
	name: string
	base: Event|undefined
	static new():Event{
		const o = new Event()
		return o
	}
}

class AddRecordEvent extends Event{
	name: string = 'AddRecordEvent'
	static new(){
		const o = new AddRecordEvent()
		o.base = Event.new()
		return o
	}
}

class AddWordEvent extends AddRecordEvent{
	name = 'AddWordEvent'
	static new(){
		const o = new AddWordEvent()
		o.base = AddRecordEvent.new()
		return o
	}
}

class Emt extends EventEmitter{
	eventEmitter = new EventEmitter()
	myEmit(evt:Event){
		for(let e = evt;e.base != void 0 && e.base instanceof Event;e = e.base){
			this.eventEmitter.emit(e.name)
		}
	}
}


class Aa{

}

// Aa.map = new Map() //相當於static map

// Aa.prototype.map = new Map() //相當於不加static

const aa = new Aa()

//console.log(Aa === aa.constructor)


class X{
	y = Y
}

class Y{
	x = X
}

// console.log(
// 	new X()
// )


function ret(a){
	//console.log(a)
	return a
}
class P{

	constructor(){
		this.a = ret(2)
	}
	a = ret(1)
}

new P()


const inEmt = new EventEmitter()
inEmt.on('1', (...args)=>{
	console.log(args)
})

inEmt.emit('1', 1, 2)

import {Exception} from '@shared/Exception'

try {
	
} catch (error) {
	const e = error as Exception
}

10*Math.log10(
	(
		(4*3.14*50)/(5e-4)
	)**2
)

import * as ts from 'typescript';

const sourceCode = `
function greeter(person: string) {
    return "Hello, " + person;
}

let user = "Jane User";

console.log(greeter(user));
`;

const sourceFile = ts.createSourceFile('example.ts', sourceCode, ts.ScriptTarget.Latest);
console.log(sourceFile);

import json5 from 'json5'
import { InstanceType_ } from '@shared/Type'


interface IF{
	__init__(...args:any[])
}


type InstMethodType<Cls extends { prototype: any; }, key extends string> = Parameters<InstanceType_<Cls>[key]>
type __init__ = '__init__'
class Base implements IF{
	
//...args:Parameters<BaseInstance['make']>
	protected constructor(){}
	static make<Cls extends Base>(...args:InstMethodType<Cls, __init__>){
		const o = new this()
		o.__init__(...args)
		return o
	}

	__init__(name:string)
	__init__(...args:any[])
	__init__(name:string){
		this._name = name
	}

	protected _name:string
	get name(){return this._name}

}

class Sub extends Base{
	protected constructor(){
		super()
	}

	override __init__(name:string, gender:string){

	}

	protected _gender:string
	get gender(){return this._gender}
}


