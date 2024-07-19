import * as fs from 'fs'
import srcMap from 'source-map'


async function Main(){
	try {
		//const tarCode = fs.readFileSync(`./bundle/weight.js`, {encoding: 'utf-8'})
		const srcMapCode = fs.readFileSync(`./bundle/weight.js.map`, {encoding: 'utf-8'})
		const smc = new srcMap.SourceMapConsumer(srcMapCode)
		const got = await smc
		const srcPos = got.originalPositionFor({
			line: 2
			,column: 339305
		})
		console.log(srcPos)
	} catch (err) {
		console.error(err)
	}
}
Main().catch()

// class A{
// 	constructor(){
// 		return Promise.resolve('abc')
// 	}
// }

// let got = new A()
// console.log(got)