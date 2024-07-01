import { ParseError } from '@shared/Lex/Lex'
import {NgaqLex} from '@shared/Lex/NgaqLex'
import * as fs from 'fs'
describe('parseFile',()=>{
	const file = './srcWordList/test.txt'
	const text = fs.readFileSync(file, {encoding: 'utf-8'})
	const lex = NgaqLex.new(text)
	it('1',()=>{
		try {
			//console.log(text.length)// 383
			const ans = lex.parse()
			console.log(ans)
			console.log('aaaa')
			console.log(ans.length)
		} catch (err) {
			if(err instanceof ParseError){
				console.error(err)
				console.error(err.line, err.col)
			}else{
				throw err
			}
			
		}

	})
})


