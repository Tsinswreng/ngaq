import { ParseError } from '@shared/Lex/Lex'
import {NgaqLex} from '@shared/Lex/ngaqLex/NgaqLex'
import * as fs from 'fs'
import util from 'util'
describe('parseFile',()=>{
	const file = './srcWordList/test.txt'
	const text = fs.readFileSync(file, {encoding: 'utf-8'})
	const lex = NgaqLex.new(text)
	it('1',()=>{
		try {
			//console.log(text.length)// 383
			const ans = lex.read_tempus__wordBlocks()
			console.log(util.inspect(ans, false, 6, true))
		} catch (err) {
			if(err instanceof ParseError){
				console.error(err)
				const pos = err.start
				console.error(lex.locate(text , pos))
			}else{
				throw err
			}
			
		}

	})
})


