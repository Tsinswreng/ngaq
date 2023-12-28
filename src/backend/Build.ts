/**
 * 自動化構建
 */

import { creatFileSync, lodashMerge, traverseDirs } from "@shared/Ut"
import * as fs from 'fs'
import * as fse from 'fs-extra'
import path from "path"
const cwd = process.cwd()
type BuildConfig = typeof Build.defaultConfig
export default class Build{

	static runBat = `@echo off
	cd /d %~dp0
	cmd /k "bundle.exe"`

	static defaultConfig = {
		assets: [
			`config.js`
			,`package.json`
			,`out/frontend`
		],
		targetDir: `dist`,
		nativeAddons: [
			'node_modules\\sqlite3\\lib\\binding\\napi-v6-win32-unknown-x64\\node_sqlite3.node'
		],
		exe: `bundle.exe`
	}

	private _config:BuildConfig = lodashMerge({}, Build.defaultConfig)
	;public get config(){return this._config;};;public set config(v){this._config=v;};

	run(){
		const config = this.config
		const target = path.resolve(cwd, config.targetDir)
		const copy = Build.copyFile
		const copys = Build.copyFiles
		fs.mkdir(
			path.resolve(cwd, target)
			,(err)=>{}
		)
		copys
		(
			[
				config.exe
				,...config.assets
				,...config.nativeAddons
			]
			, cwd
			, target
		)
		Build.generateRunBat(
			path.resolve(cwd, config.targetDir, `run.bat`)
		)
		return 
	}

	static copyFile(fileRelativePath:string, originDir:string, targetDir:string){
		return fse.copy
		(
			path.resolve(originDir, fileRelativePath)
			,path.resolve(targetDir, fileRelativePath)
		)
		
	}

	static copyFiles(fileRelativePath:string[], originDir:string, targetDir:string){
		const prms:Promise<any>[] = []
		fileRelativePath.map(e=>{
			prms.push(
				Build.copyFile(e, originDir, targetDir)
			)
		})
		return prms
	}

	static generateRunBat(path:string){
		//creatFileSync(path, true)
		fs.writeFileSync(path, Build.runBat ,'utf8')
	}
	

	static async findNativeAddons(){
		const files = await traverseDirs([`node_modules`])
		const result:string[] = []
		for(const f of files){
			if(/^.*\.node$/g.test(f)){
				result.push(f)
			}
		}
		return result
	}
}
