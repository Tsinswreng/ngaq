import * as Tsv from '@backend/rime/tsv'
import * as File from '@backend/util/File'


describe('read', ()=>{

	it('1', async()=>{
		const path = process.cwd()+'/test/backend/rime/dict.dict.yaml'
		const frl = File.FileReadLine.new(path, {encoding:'utf-8'})
		const readN:Tsv.I_readN<Promise<string[]>> = {
			read(n:number){
				return frl.read(n)
			}
		}
		const tsvParser = Tsv.TsvParser.new(readN)
		for(let i = 0; i < 100; i++){
			const line = await tsvParser.readLines(1)
			//console.log(line[0].text)
			console.log()
		}
		expect(tsvParser.metaStartLinePos).toBe(18)
		expect(tsvParser.metaEndLinePos).toBe(41)
	})
})


describe('comment', ()=>{
	it('1', async()=>{
		const path = process.cwd()+'/test/backend/rime/testComment'
		const frl = File.FileReadLine.new(path, {encoding:'utf-8'})
		const readN:Tsv.I_readN<Promise<string[]>> = {
			read(n:number){
				return frl.read(n)
			}
		}
		
		const tsvParser = Tsv.TsvParser.new(readN)
		const raw__ripe = [] as [string, string][]
		for(let i = 0; i < 100; i++){
			const line = await tsvParser.readLines(1)
			if(line.length !== 0){
				//process.stdout.write('~~~~~~~~~~~~~~~~~~~')
				const u:[string, string] = [line[0].rawText, line[0].processedText()]
				raw__ripe.push(u)
			}
		}
		//console.log(raw__ripe)
		const check = [
			[ '', '' ],
			[ '---', '---' ],
			[ 'meta', 'meta' ],
			[ 'normal', 'normal' ],
			[ '#comment', '' ],
			[ 'com#ment', 'com' ],
			[ '...', '...' ],
			[ '', '' ],
			[ 'normal', 'normal' ],
			[ '#comment', '' ],
			[ 'com#ment', 'com' ],
			[ '', '' ],
			[ '# no comment', '' ],
			[ '#123', '#123' ],
			[ '45#67', '45' ],
			[ '8', '8' ]
		]
		expect(raw__ripe).toStrictEqual(check)
	})
})



