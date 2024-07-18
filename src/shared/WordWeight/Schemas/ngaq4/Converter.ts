import type { SvcWord } from "@shared/logic/memorizeWord/SvcWord";
import type { Word_t } from "./main";
import type { LearnBelong } from "@shared/model/word/NgaqRows";
import type { I_Tempus_Event } from "@shared/interfaces/I_SvcWord";
import type * as Mod from "@shared/model/word/NgaqModels";
import type * as Row from "@shared/model/word/NgaqRows"
import { Tempus_Event } from "@shared/logic/memorizeWord/SvcWord";



class Word implements Word_t{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof Word.new>){
		const z = this
		const svcWord = args[0]
		const jword = svcWord.word
		z.belong = jword.textWord.belong
		z.id = svcWord.id
		z.learnBl__learns = svcWord.learnBl__learns
		z.tempus_event_s = jword.learns.map(e=>Tempus_Event.new(e.ct, e.belong))
		return z
	}

	static new(svcWord:SvcWord){
		const z = new this()
		z.__init__(svcWord)
		return z
	}
	
	//[x: string]: any;
	belong: string;
	id: string;
	tempus_event_s: I_Tempus_Event[];
	weight: number = 0
	learnBl__learns: Map<LearnBelong, Mod.Learn[]>;

}

export function converter(src:SvcWord[], tar:Word_t[]):Word_t[]{
	return src.map(e=>Word.new(e))
}