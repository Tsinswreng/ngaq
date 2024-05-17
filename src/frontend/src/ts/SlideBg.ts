import CyclicArray from "@shared/CyclicArray"

class Img{
	
}

export class SlideBg{
	protected constructor(){}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	protected __init__(){
		const z = this
		return z
	}

	get This(){
		return SlideBg
	}

	static base64ImgPrefix = `data:image/png;base64,`
}