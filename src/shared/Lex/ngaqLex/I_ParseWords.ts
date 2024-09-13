import type * as WordIf from '@shared/IF/WordIf'

export interface I_ParseWords {
	ParseWords(text:str):Deferrable<WordIf.I_WordFromTxt[]>
}