import winston from 'winston'
import Tempus from './Tempus';
import util from 'util'
const inspect = util.inspect
const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.simple(),
		winston.format.printf((info) => {
			return `${Tempus.new().iso}<${info.level}>\t${info.message}`;
		})
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'log/combined.log' })
	]
})

export default class Log{
	public static readonly RELY=logger;

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