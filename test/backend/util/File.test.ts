import 'tsconfig-paths/register'
import * as fs from 'fs'
import * as File from '@backend/util/File'
import * as fse from 'fs-extra'
import Path from 'path'

describe('FileReadLine', ()=>{
	it('1', async()=>{
		const path = process.cwd()+`/test/backend/util/test`
		const frl = File.FileReadLine.new(path, {encoding: 'utf-8'})
		for(let i = 0; ; i++){
			if(frl.findEnd){
				break
			}
			const line = await frl.next()
			console.log(line)
		}
		// for await (const line of frl.rlInterface){
		// 	console.log(line)
		// }
		// const lines = await frl.read(1000)
		// console.log(lines)
		
		//for await (const a of frl.rlInterface){}
	})

})

describe('File',()=>{
	it('測fs遞歸讀目錄',()=>{
		const dir = `D:\\_code\\voca\\src`
		const ans = fs.readdirSync(dir, {recursive: true})
		console.log(ans)
		expect(1).toBe(1)
	})
	it('測fsextra', ()=>{
		const dir = `D:\\_code\\voca\\src`
		const ans = fse.readdirSync(dir, {recursive: true})
		console.log(ans)
		expect(1).toBe(1)
	})
})

describe('path', ()=>{
	const got = File.getRelativePath('.', `D:/_code/voca/test/backend/util/File.test.ts`)
	console.log(got)
})

describe('FnCodeParser', ()=>{
	const path = `D:/_code/ngaq/bundle/weight.js`
	const code = fs.readFileSync(path, {encoding: 'utf-8'})
	const fn = new Function('__return', code)
	const __return = {}
	fn(__return)
	const ans = __return?.['_']
	ans.Run([]).then(d=>console.log(d))
})
// const dir = `D:\\_code\\voca\\src`
// const ans = fs.readdirSync(dir, {
// 	recursive: true
// 	,withFileTypes: false
// 	,encoding: 'base64'
// })
// console.log(ans)