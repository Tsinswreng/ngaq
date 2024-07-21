import {Lex} from '@shared/Lex/Lex'
// import * as fs from 'fs'
// const file = './srcWordList/test.txt'
describe('1',()=>{
	//const text = fs.readFileSync(file, {encoding: 'utf-8'})
	it('eat',()=>{

		const text = `123456`
		const lex = Lex.new(text)
		
		expect(lex.index).toBe(0)
		let ate = lex.old_eat('1')
		expect(ate).toBe('1')
		expect(lex.index).toBe(1)
		ate = lex.old_eat('2')
		expect(ate).toBe('2')
		expect(lex.index).toBe(2)
		//console.log(ate)
	})

	it('readUntil', ()=>{
		const text = `abc456`
		const lex = Lex.new(text)
		let got = lex.readUntil(/[0-9]+/)
		expect(got).toBe('abc')
		expect(lex.index).toBe(3)
	})

})


describe('readUntilStr', ()=>{
	it('1', ()=>{
		const text = `abc456`
		const lex = Lex.new(text)
		let got = lex.readUntilStr('4')
		expect(got).toBe('abc')
		expect(lex.index).toBe(3)
	})

	it('2', ()=>{
		const text = `abc456`
		const lex = Lex.new(text)
		let got = lex.readUntilStr('45')
		expect(got).toBe('abc')
		expect(lex.index).toBe(3)
	})

	it('3', ()=>{
		const text = 
`<metadata>\r\n\
{\r\n\
	"belong": "english"\r\n\
	,"delimiter": "-/-/-/-/-"\r\n\
}\r\n\
</metadata>`
		const lex = Lex.new(text)
		const p0 = `<metadata>`
		const p1 = `</metadata>`
		console.log(lex.index, 1)
		lex.eat(p0)
		console.log(lex.index, 2)
		const got = lex.readUntilStr(p1)
		console.log(lex.index, 3)
		lex.eat(p1)
		console.log(lex.index, 4)
		console.log(got)
	})

})