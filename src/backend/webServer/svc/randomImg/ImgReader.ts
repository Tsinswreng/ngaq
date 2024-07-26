import { BlobWithText } from "@shared/tools/BlobWithText";
import type { I_ReadImg } from "./RandomImg";
//import {Img} from "@shared/tools/Img"
import * as fs from 'fs'

export class ImgReader implements I_ReadImg{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof ImgReader.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	async ReadImg(path: str){
		const bin = await fs.promises.readFile(path)
		const pack = BlobWithText.pack(path, bin)
		return pack
	}
}

