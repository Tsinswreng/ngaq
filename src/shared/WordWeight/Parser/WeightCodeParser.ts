import * as L from '@shared/entities/Word/Weight/_lib'

export class WeightCodeParser{
	protected constructor(){}
	static new(src:string){
		const z = new this()
		z.__init__(src)
		return z
	}
	protected __init__(...param:Parameters<typeof WeightCodeParser.new>){
		const z = this
		z._src = param[0]
	}

	protected _src:string
	get src(){return this._src}



	parse(){
		const ans = new Function('L', )
	}

}