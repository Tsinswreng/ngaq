// const rootDir:string = require('app-root-path').path
// import * as fs from 'fs';
// import * as path from 'path';
// import Txt from '../../shared/Txt';

// export class GetCompiledJs{

// 	private _dir:string = rootDir
// 	private _filePaths:string[] = []
// 	private _outJsFiles:string[] = []

// 	constructor(dir?:string){
// 		if(dir){this.dir = dir}
		
// 	}

// 	public set dir(v){
// 		this._dir = v
// 	}

// 	public get dir(){
// 		return this._dir
// 	}

// 	public set filePaths(v){
// 		this._filePaths = v
// 	}

// 	public get filePaths(){
// 		return this._filePaths
// 	}

// 	public set outJsFiles(v){
// 		this._outJsFiles = v
// 	}

// 	public get outJsFiles(){
// 		return this._outJsFiles
// 	}

// 	public run(dir=this.dir){
// 		this.filePaths = GetCompiledJs.traverseDirectory(dir)
// 		this.outJsFiles = Txt.getFilted(this.filePaths, '^.*\\.d.ts$')
// 	}

// 	public tempMoveJs(targetDir:string):void{
// 		let baseNames:string[] = []
// 		for(let i = 0; i < this.outJsFiles.length; i++){
// 			let bn = path.basename(this.outJsFiles[i])
// 			baseNames.push(bn)
// 		}
// 		if(this.outJsFiles.length !== baseNames.length){throw new Error()}
// 		for(let i = 0; i < baseNames.length; i++){
// 			fs.rename(this.outJsFiles[i], targetDir+'/'+baseNames[i], (err)=>{if(err){throw err}})
// 		}
// 	}

// 	static traverseDirectory(folderPath: string): string[] {
// 		const files: string[] = [];
		
// 		const traverse = (currentPath: string) => {
// 			const items = fs.readdirSync(currentPath);
		
// 			items.forEach(item => {
// 			const itemPath = path.join(currentPath, item);
// 			const stats = fs.statSync(itemPath);
	
// 			if (stats.isDirectory()) {
// 				traverse(itemPath);
// 			} else if (stats.isFile()) {
// 				files.push(itemPath);
// 			}
// 			});
// 		};
		
// 		traverse(folderPath);
		
// 		return files;

		
// 	}

// 	public static test(){
// 		let getJs = new GetCompiledJs(rootDir+'/src/backend')
// 		getJs.run()
// 		getJs.tempMoveJs(rootDir+'/tempJs')
// 	}


// }

// function t20230703113122(){
// 	//const files:string[] = GetCompiledJs.traverseDirectory(rootDir)
// 	//console.log(files)
// 	GetCompiledJs.test()
// }

// t20230703113122()