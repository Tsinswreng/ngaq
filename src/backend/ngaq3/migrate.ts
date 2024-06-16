import Word from "@shared/SingleWord2"


class Migrate{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof Migrate.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return Migrate}


	migrate(words:Word[]){
		
	}
}
