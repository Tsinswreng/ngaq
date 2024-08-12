import * as File from '@backend/util/File'
import * as Tsv from '@backend/rime/dictTsv'
import type {I_GetN} from '@shared/Type'


export function mkReadN(...args:Parameters<typeof File.FileReadLine.new>){
	const path = args[0]
	const opt = args[1]
	const frl = File.FileReadLine.new(path, opt)
	const readN:I_GetN<Promise<string[]>> = {
		GetN(n:number){
			return frl.read(n)
		}
	}
	return readN
}

/** make tsv instance */
export function mkTsvInst(...args:Parameters<typeof File.FileReadLine.new>){
	const dictPath = args[0]
	const opt = args[1]
	const frl = File.FileReadLine.new(dictPath, opt)
	const readN:I_GetN<Promise<string[]>> = {
		GetN(n:number){
			return frl.read(n)
		}
	}
	const tsvParser = Tsv.DictTsvParser.new(readN)
	return tsvParser
}
