import Ut from '@shared/Ut';
import WordB from './WordB'

export enum WordEvent{
	ADD=0,
	RMB=1,
	FGT=-1
}

export default class Recite{
	public constructor (){}

	private _allWords:WordB[] = []
	;public get allWords(){return this._allWords;};

	private _curWord?:WordB
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _reviewedWords:WordB[] = []
	;public get reviewedWords(){return this._reviewedWords;};

	public trigger(word:WordB, event: WordEvent){
		let d = Ut.YYYYMMDDHHmmssSSS_withSymbol()
		if(event===WordEvent.RMB){
			rmb()
		}else{
			fgt()
		}
		this.reviewedWords.push(word)
		function rmb(){
			word.fw.dates_rmb.push(d)
		}

		function fgt(){
			word.fw.dates_fgt.push(d)
		}
		this.reviewedWords.push(word)
	}

	public undo(){
		if(this.reviewedWords[this.reviewedWords.length-1]){

		}
	}



}