class NgaqDbSvc{
	protected constructor(){}
	protected __init__(...args: Parameters<typeof NgaqDbSvc.new>){
		const z = this
		return z
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	get This(){return NgaqDbSvc}
	
}
