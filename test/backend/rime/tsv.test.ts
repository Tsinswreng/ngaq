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



