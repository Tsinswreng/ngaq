
export default class Log{
	public static readonly RELY=console ;

	public constructor(){}

	// public static readonly LOG = console.log
	// public static readonly WARN = console.warn
	// public static readonly ERR = console.error
	// public static readonly DBG = console.debug

	public log(v?){
		Log.RELY.log(v)
	}

	public warn(v?){
		Log.RELY.warn(v)
	}

	public err(v?){
		Log.RELY.error(v)
	}

	public dbg(v?){
		Log.RELY.debug(v)
	}
}