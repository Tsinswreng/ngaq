import {WeightCodeParser} from '@shared/WordWeight/Parser/WeightCodeParser'
import * as fse from 'fs-extra'


describe('1', ()=>{
	it('1', ()=>{
		const tsPath = 'D:/_code/voca/src/shared/WordWeight/Schemas/MyWeight.ts'
		const tsCode = fse.readFileSync(tsPath, {encoding:"utf-8"})
		//console.log(tsCode)
		const weiPar = WeightCodeParser.new(tsCode)
		const jsCode = weiPar.This.process(tsCode)
		console.log(jsCode)
		const fn = weiPar.parse()
		try {
			const obj = fn()
			console.log(obj)
			console.log(obj['run'])
		} catch (error) {
			console.error(error)
		}
	})
})
