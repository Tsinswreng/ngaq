import type { I_ChangeRecord, I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { Derangement, Word_t as DWord } from "./Derangement"
import { GroupByLang, Word_t as GWord } from "./GroupByLang";
import { Tempus_EventCalc, Word_t as TWord } from "./Tempus_EventCalc";
import { converter as convertWord } from "./Converter";
import type { SvcWord } from "@shared/WordWeight/weightEnv";
declare const __return:{_:any, err?:any}


export interface Word_t extends DWord, GWord, TWord{

}

//declare let a :Word_t



class Main implements I_WordWeight<SvcWord, Word_t>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Main.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Main}
	setParam(key: string, v: any): boolean {
		return true
	}
	async Run0(words: Word_t[]):Task<Word_t[]>{
		const z = this
		const te = Tempus_EventCalc.new()
		words = await te.Run(words) as Word_t[]
		words = await GroupByLang.new().Run(words) as Word_t[]
		words = await Derangement.new().Run(words) as Word_t[]
		z.wordId__changeRec = te.wordId__changeRec
		return words
	}

	async Run(words: SvcWord[]){
		try {
			const z = this
			const twords:Word_t[] = convertWord(words)
			return await z.Run0(twords)
		} catch (err) {
			__return.err = err
			throw err
		}
	}
	wordId__changeRec?: Map<string, I_ChangeRecord[]> | undefined;
}

const ans = Main.new()

// by new Function
if(__return != void 0){
	__return._ = ans
}







/* 

const code = `
  self.onmessage = function(e) {
    postMessage('Hello ' + e.data);
  }
`;

const blob = new Blob([code], { type: 'application/javascript' });
const url = URL.createObjectURL(blob);
const worker = new Worker(url);

worker.onmessage = function(e) {
  console.log(e.data);
};

worker.postMessage('World');

*/