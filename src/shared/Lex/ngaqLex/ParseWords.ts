import type { I_ParseWords } from "./I_parseWords";
import { NgaqLex } from "@shared/Lex/ngaqLex/NgaqLex"
import * as WordIf from '@shared/IF/WordIf'

type Word = WordIf.I_WordFromTxt

export class ParseWords implements I_ParseWords {

	ParseWords(text:str):Word[] {
		const lex = NgaqLex.new(text)
		const map = lex.read_tempus__wordBlocks()
		const ans = [] as Word[]
		for(const [tempus, words] of map){
			for(const w of words){
				const ua:Word = {
					textWord: w.textWord
					, propertys: w.propertys
				}
				ans.push(ua)
			}
		}
		return ans
	}

}