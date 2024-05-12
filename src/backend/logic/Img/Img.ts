import fse from 'fs-extra'


export class RandomImg{
	protected constructor(){}

	static new(){
		return new this().__init__()
	}
	protected __init__(){
		return this
	}

}