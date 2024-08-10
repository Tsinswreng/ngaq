import { I_Fact } from "./I_Models"
import { I_Tbl } from "./I_Tbl"

export class BaseTbl<FactT extends I_Fact<any, any>> implements I_Tbl<FactT>{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof BaseTbl.new>){
		const z = this
		z.name = args[0]
		//@ts-ignore
		z.factory = args[1]
		return z
	}

	static new<FactT extends I_Fact<any, any>>(name, factory: FactT){
		const z = new this<FactT>()
		z.__init__(name, factory)
		return z
	}

	get This(){return BaseTbl}

	protected _name:str
	get name(){return this._name}
	protected set name(v){this._name = v}
	
	protected _factory:FactT
	get factory(){return this._factory}
	protected set factory(v){this._factory = v}
	
	get col():FactT['col']{
		return this.factory.col
	}

	get emptyRow(){
		return this.factory.emptyRow
	}



}
