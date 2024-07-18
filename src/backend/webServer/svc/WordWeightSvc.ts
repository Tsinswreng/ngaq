import { OldWeightCodeParser } from "@shared/WordWeight/Parser/WeightCodeParser"
import { WeightCodeProcessor } from "@shared/WordWeight/Parser/WeightCodeProcessor"

export class WordWeightSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof WordWeightSvc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}




	//get This(){return WordWeightSvc}


}
