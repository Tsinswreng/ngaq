import { I_WordWeight } from "@shared/interfaces/I_WordWeight";
import { SvcWord } from "@shared/entities/Word/SvcWord";
import { TempusEventRecord } from "@shared/WordWeight/ChangeRecord";

export class BaseWeight implements I_WordWeight{

	constructor(){
		this.__Init__()
	}

	protected async __Init__(){

	}

	protected _changeRecord:TempusEventRecord[] = []
	get changeRecord(){return this._changeRecord}
	set changeRecord(v){this._changeRecord = v}

	protected _paramOpt = {}
	get paramOpt(){return this._paramOpt}
	set paramOpt(v){
		//this._paramOpt = v
	}

	async run(mWords: SvcWord[]){
		return mWords
	}
	
	setParam(key: string, v: any): boolean {
		this.paramOpt[key] = v
		return true
	}
	
}