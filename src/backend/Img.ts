import { areFilesExist, pathAt, randomIntArr } from '@shared/Ut';
import * as fs from 'fs'
import path from 'path';



export default class RandomImg{



	private constructor(){}

	public static async konstructor(_dirs:string[]){
		const obj = new RandomImg()
		obj._dirs = _dirs.slice()
		await obj.init()
		return obj
	}

	/**
	 * the folders to store images
	 */
	private _dirs:string[] = []
	;public get dirs(){return this._dirs;};;public set dirs(v){this._dirs=v;};

	/**
	 * full paths of images
	 */
	private _files:string[] = []
	;public get files(){return this._files;};;public set files(v){this._files=v;};

	public async init(){
		//this.files = await RandomImg.getFullPathFiles(this.dirs)
		//let b = areFilesExist(this.dirs)
		//if(!b){console.warn(`尋不見路徑`);return;}
		this.dirs = this.dirs.filter(e=>fs.existsSync(e))
		this.files = await getAllFilePaths(this.dirs)
		console.log(`文件數:`)
		console.log(this.files.length)//t
		// try{
			
		// }catch(e){console.error(e)}
		
	}


	public static async run(){
		
	}

	public static oneRandomFile(files:string[]){
		let index = randomIntArr(0, files.length-1, 1)[0]
		return files[index]
	}public oneRandomFile(){
		return RandomImg.oneRandomFile(this.files)
	}

	public getRandomFiles(howMany:number){
		const files = this.files
		let indexes = randomIntArr(0, files.length-1, howMany)
		return getMany(files, indexes)
	}

	/**
	 * 不含子目錄
	 * @param dirs 
	 * @returns 
	 */
	public static async getFullPathFiles(dirs:string[]){
		async function forOne(dir:string){
			const files:string[] = []
			const entries = await fs.promises.readdir(dir);
	
			for (const entry of entries) {
				const entryPath = path.join(dir, entry);
				const stats = fs.statSync(entryPath);
				if (stats.isFile()) {
					files.push(entryPath);
				}
			}
		
			return files;
		}
		const files:string[] = []
		for(const d of dirs){
			const f = await forOne(d)
			files.push(...f)
		}
		return files
	}



}

function getMany<T>(arr:T[], indexes:number[]){
	// const result:(T|undefined)[] = []
	// for(const i of indexes){
	// 	result.push(arr[i])
	// }
	// return result
	return indexes.map(i=>arr[i])
}

/**
 * 含子目錄
 * @param directoryPath 
 * @returns 
 */

// async function getAllFilePaths(directoryPath: string[]) {
// 	const result:string[] = []
// 	for(const d of directoryPath){
// 		const files = forOne(d)
// 		result.push(...files)
// 	}

// 	return result
// 	function forOne(directoryPath:string){
// 		const filePaths: string[] = [];

// 		async function readDirectory(dir: string) {
// 			const files = fs.readdirSync(dir);
	
// 			for (const file of files) {
// 				const filePath = path.join(dir, file);
// 				const stat = fs.statSync(filePath);
	
// 				if (stat.isDirectory()) {
// 					// 如果是子目录，递归读取子目录中的文件
// 					readDirectory(filePath);
// 				} else {
// 					// 如果是文件，将文件路径添加到数组中
// 					filePaths.push(filePath);
// 				}
// 			}
// 			//console.log(`console.log(filePaths.length)`)
// 			//console.log(filePaths.length)//t
// 		}
	
// 		readDirectory(directoryPath);
// 		console.log(`console.log(filePaths.length)`)
// 		console.log(filePaths.length)//t
// 		return filePaths;
// 	}
// }


async function getAllFilePaths(directoryPath: string[]) { 
	const result:string[] = []
	for(const d of directoryPath){
		const files = await forOne(d)
		result.push(...files)
	}

	return result
	async function forOne(directoryPath:string){
		const filePaths: string[] = [];

		async function readDirectory(dir: string) {
			const files = await fs.promises.readdir(dir);
	
			for (const file of files) {
				const filePath = path.join(dir, file);
				const stat = await fs.promises.stat(filePath);
	
				if (stat.isDirectory()) {
					// 如果是子目录，递归读取子目录中的文件
					await readDirectory(filePath);
				} else {
					// 如果是文件，将文件路径添加到数组中
					filePaths.push(filePath);
				}
			}
		}
	
		await readDirectory(directoryPath);
		return filePaths;
	}
}
