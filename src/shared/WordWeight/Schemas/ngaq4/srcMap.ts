import { $ } from '@shared/Common'
import * as fs from 'fs'
import srcMap from 'source-map'
import * as RL from '@backend/util/old_readLine'
import { StdinReader } from '@backend/util/stdinReader'

type MP = srcMap.NullableMappedPosition
class Source{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Source.new>){
		const z = this
		z.raw = args[0]
		return z
	}

	static new(raw:MP){
		const z = new this()
		z.__init__(raw)
		return z
	}

	//get This(){return Source}
	raw: MP

	replaceHead(str:str){
		return str.replace('webpack:/', '.')
	}

}


function replaceHead(str:str){
	return str.replace('webpack:/', '.')
}

function getTsMapPath(jsPath:str){
	jsPath = jsPath.replace('./ngaq', '.')
	return jsPath+'.map'
}

function fmt(map:MP){
	return `${map.source}:${map.line}:${map.column}`
}

async function Smc(path: str){
	const srcMapCode = fs.readFileSync(path, {encoding: 'utf-8'})
	const Smc = new srcMap.SourceMapConsumer(srcMapCode)
	const got = await Smc
	return got
}

async function Qry(line:int, column:int){
	try {
		//const tarCode = fs.readFileSync(`./bundle/weight.js`, {encoding: 'utf-8'})
		const wpSmc = await Smc(`./bundle/weight.js.map`)
		const wp = await wpSmc
		const jsPos = wp.originalPositionFor({
			line: line
			,column: column
		})
		const jsPath = replaceHead($(jsPos.source))
		const tsMapPath = getTsMapPath(jsPath)
		console.log(tsMapPath)//t
		const ts = await Smc(tsMapPath)
		const tsPos = ts.originalPositionFor({
			line: $(jsPos.line)
			,column: $(jsPos.column)
		})
		console.log(tsPos)
		console.log(fmt(tsPos))
	} catch (err) {
		console.error(err)
	}
}

async function Main(){
	const rl = StdinReader.new()

	for(;;){
		const imput = await rl.Read()
		const [line, column] = imput.split(':')
		await Qry(parseInt(line), parseInt(column))
	}
}
Main().catch(e=>console.error(e))

// class A{
// 	constructor(){
// 		return Promise.resolve('abc')
// 	}
// }

// let got = new A()
// console.log(got)