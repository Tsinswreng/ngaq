import Config from "@backend/Config";
import { RandomImg } from "./randomImg/RandomImg";
import { ImgReader } from "./randomImg/ImgReader";
import { MkRandomImg } from "./randomImg/MkRandomImg";
const config = Config.getInstance().config

export class RandomImgSvc{
	protected constructor(){}
	protected async __Init__(...args: Parameters<typeof RandomImgSvc.New>){
		const z = this
		z._randomImg = await MkRandomImg()
		return z
	}

	protected static inst:RandomImgSvc
	static async GetInstance(){
		const z = this
		if(!z.inst){
			z.inst = await z.New()
		}
		return z.inst
	}

	static New(){
		const z = new this()
		z.__Init__()
		return z
	}

	//get This(){return RandomImgSvc}

	protected _randomImg:RandomImg
	get randomImg(){return this._randomImg}
	protected set randomImg(v){this._randomImg = v}
	
	async Next(){
		const z = this
		return await z.randomImg.Next()
	}

}

