import { RandomImg } from "./RandomImg";
import { ImgReader } from "./ImgReader";
import { RecursiveReadDir } from "@backend/util/File";
import Config from "@backend/Config";
const config = Config.getInstance().config

const imgDir = config.ngaq.defaultUser.imgDir

export async function MkRandomImg() {
	const imgPaths = [] as str[]
	for(const dir of imgDir){
		const paths = await RecursiveReadDir(dir)
		imgPaths.push(...paths)
	}
	const randomImg = RandomImg.new(ImgReader.new(), imgPaths)
	return randomImg
}


