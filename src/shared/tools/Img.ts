export class Img{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Img.new>){
		const z = this
		z._arrBuf = args[0]
		z._meta = args[1]??''
		return z
	}

	static new(arrBuf:ArrayBuffer, meta=''){
		const z = new this()
		z.__init__(arrBuf, meta)
		return z
	}

	protected _arrBuf:ArrayBuffer
	get arrBuf(){return this._arrBuf}
	protected set arrBuf(v){this._arrBuf = v}

	get byteLength(){return this.arrBuf.byteLength}

	protected _meta = ''
	get meta(){return this._meta}
	protected set meta(v){this._meta = v}

}
