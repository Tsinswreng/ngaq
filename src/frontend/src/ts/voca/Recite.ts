import Tempus from '@shared/Tempus';
import WordB from './WordB'
import SingleWord2 from '@shared/SingleWord2'
import { WordEvent } from '@shared/SingleWord2';

export default class Recite{

	private static instance:Recite;

	public static getInstance(){
		if(this.instance === undefined){
			this.instance = new Recite()
		}
		return this.instance;
	}

	private constructor (){}

	

	private _allWords:WordB[] = []
	;public get allWords(){return this._allWords;};

	private _curWord?:WordB
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _reviewedWords:WordB[] = []
	;public get reviewedWords(){return this._reviewedWords;};

	public trigger(word:WordB, event: WordEvent){
		let d = new Tempus()
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