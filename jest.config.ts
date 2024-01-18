import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
//import { compilerOptions } from "./tsconfig.json";
// 
const jestConfig: JestConfigWithTsJest = {
	preset: "ts-jest",
	moduleDirectories: ["node_modules", "<rootDir>"],
	//moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
	moduleNameMapper: {
		'^@shared/(.*)$': '<rootDir>/src/shared/$1',
		
	},
}

export default jestConfig;

//import * as fs from 'fs'
// import json5 from 'json5'

// function readTsConfig(path=`./tsconfig.json`){
// 	const str = fs.readFileSync(path, 'utf-8')
// 	return json5.parse(str) //as {compilerOptions:ts.CompilerOptions,[key: string]: any}
// }
// const tsconfig = readTsConfig()
// const compilerOptions = tsconfig.compilerOptions