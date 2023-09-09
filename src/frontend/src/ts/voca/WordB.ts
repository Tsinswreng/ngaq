import SingleWord2 from "@shared/SingleWord2"


export default class WordB{

	constructor(private _fw:SingleWord2) {
		
	}

	/**
	 * father word 原 單詞對象。此處取組合洏舍繼承。
	 */
	;public get fw(){return this._fw;};

	private _priority: number = 0
	;public get priority(){return this._priority;};

	//private _date_eventMap


	public calcPrio(){
		return 0
	}

	public static getEventSymbols(){

	}

}