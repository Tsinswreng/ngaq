//import type {Img} from "@shared/tools/Img"
import type { BlobWithText } from "@shared/tools/BlobWithText";
import {randomIntArr} from '@shared/tools/randomIntArr'
type Img = BlobWithText
export interface I_ReadImg{
	ReadImg(path:str):Task<Img>
}

export class RandomImg{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof RandomImg.new>){
		const z = this
		z.imgReader = args[0]
		z.files = args[1]
		z.order = randomIntArr(0, z.files.length-1, z.files.length, true)
		return z
	}

	static new(imgReader:I_ReadImg, files:str[]){
		const z = new this()
		z.__init__(imgReader, files)
		return z
	}

	//get This(){return RandomImg}

	protected _imgReader:I_ReadImg
	get imgReader(){return this._imgReader}
	protected set imgReader(v){this._imgReader = v}
	

	protected _files:str[] = []
	get files(){return this._files}
	protected set files(v){this._files = v}
	
	protected _order:int[] = []
	get order(){return this._order}
	protected set order(v){this._order = v}

	protected _orderPos = 0
	get orderPos(){return this._orderPos}
	set orderPos(v){this._orderPos = v}
	
	async Next(){
		const z = this
		if(z.orderPos >= z.order.length){
			z.orderPos = 0
		}
		const idx = z.order[z.orderPos]
		z.orderPos++
		const path = z.files[idx]
		const img = await z.imgReader.ReadImg(path)
		return img
	}

}
