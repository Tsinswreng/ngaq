const rootDir = require('app-root-path').path
import * as fs from 'fs';
import * as path from 'path';

export class GetCompiledJs{

	static traverseDirectory(folderPath: string): string[] {
		const files: string[] = [];
		
		const traverse = (currentPath: string) => {
			const items = fs.readdirSync(currentPath);
		
			items.forEach(item => {
			const itemPath = path.join(currentPath, item);
			const stats = fs.statSync(itemPath);
	
			if (stats.isDirectory()) {
				traverse(itemPath);
			} else if (stats.isFile()) {
				files.push(itemPath);
			}
			});
		};
		
		traverse(folderPath);
		
		return files;
	}
}

function t20230703113122(){
	const files:string[] = GetCompiledJs.traverseDirectory('./')
	console.log(files)
}

t20230703113122()