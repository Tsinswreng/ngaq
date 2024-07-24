import type { SvcWord } from "@shared/logic/memorizeWord/SvcWord";
import type { Word_t } from "./main";
import type { LearnBelong } from "@shared/model/word/NgaqRows";
import type { I_Tempus_Event } from "@shared/interfaces/WordIf";
import type * as Mod from "@shared/model/word/NgaqModels";
import type * as Row from "@shared/model/word/NgaqRows"
import { Tempus_Event } from "@shared/logic/memorizeWord/SvcWord";



class Word implements Word_t{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof Word.new>){
		const z = this
		const svcWord = args[0]
		//const jword = svcWord.word
		z.belong = svcWord.belong
		z.id = svcWord.id
		z.learnBl__learns = svcWord.learnBl__learns
		z.tempus_event_s = svcWord.learns.map(e=>Tempus_Event.new(e.ct, e.belong))
		z.hasBeenLearnedInLastRound = svcWord.hasBeenLearnedInLastRound
		z.weight = svcWord.weight
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
	weight: number|undef
	learnBl__learns: Map<LearnBelong, Mod.Learn[]>;
	hasBeenLearnedInLastRound: boolean = false
	index
}

export function converter(src:SvcWord[]):Word_t[]{
	return src.map(e=>Word.new(e))
}