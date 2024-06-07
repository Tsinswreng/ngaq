import { Img } from "./Img";

export class TagImg extends Img{
	protected constructor(){
		super()
	}

	protected __init__(...args: Parameters<typeof TagImg.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	static new(...args:Parameters<typeof Img.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}


	protected _name:str = ''
	get name(){return this._name}
	set name(v){this._name = v}

	protected _desription = ''
	get desription(){return this._desription}
	set desription(v){this._desription = v}
	

	protected _url:str = ''
	get url(){return this._url}
	set url(v){this._url = v}
	
	protected _tags:Set<str> = new Set()
	get tags(){return this._tags}
	set tags(v){this._tags = v}


	
}
