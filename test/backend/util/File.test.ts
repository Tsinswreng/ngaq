import 'tsconfig-paths/register'
import * as fs from 'fs'
import * as File from '@backend/util/File'
import * as fse from 'fs-extra'
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
// const dir = `D:\\_code\\voca\\src`
// const ans = fs.readdirSync(dir, {
// 	recursive: true
// 	,withFileTypes: false
// 	,encoding: 'base64'
// })
// console.log(ans)