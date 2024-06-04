import * as File from '@backend/util/File'
import * as Tsv from '@backend/rime/tsv'


/** make tsv instance */
export function mkTsvInst(...args:Parameters<typeof File.FileReadLine.new>){
	const dictPath = args[0]
	const opt = args[1]
	const frl = File.FileReadLine.new(dictPath, opt)
	const readN:Tsv.I_readN<Promise<string[]>> = {
		read(n:number){
			return frl.read(n)
		}
	}
	const tsvParser = Tsv.TsvParser.new(readN)
	return tsvParser
}
