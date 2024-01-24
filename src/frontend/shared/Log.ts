

const inspect = (v)=>v

interface ILog{
	log:Function
	
}

/** @deprecated */
export default class Log{
	public static readonly RELY=console;

	protected constructor(){}

	static new(){
		return new this()
	}

	// public static readonly LOG = console.log
	// public static readonly WARN = console.warn
	// public static readonly ERR = console.error
	// public static readonly DBG = console.debug

	public log(v?){
		v=inspect(v)
		C.RELY.log(v)
	}

	public warn(v?){
		v=inspect(v)
		C.RELY.warn(v)
	}

	public err(v?){
		v=inspect(v)
		C.RELY.error(v)
	}


	public debug(v?){
		v=inspect(v)
		C.RELY.debug(v)
	}

	public dbg=this.debug.bind(this)

	public info=C.RELY.info.bind(C.RELY)

}

const C = Log
type C = Log