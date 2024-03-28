import readline = require('readline');
import { Abortable } from 'events';
import lodash from 'lodash'
export function question_fn(rl:readline.Interface, qryStr:string, opt?:Abortable){
	const outQryStr = qryStr
	if( opt == void 0){
		return (qryStr=outQryStr)=>{
			return new Promise<string>((res,rej)=>{
				rl.question(qryStr, (answer)=>{
					res(answer)
				})
			})
		}
	}else{
		return (qryStr=outQryStr)=>{
			return new Promise<string>((res,rej)=>{
				rl.question(qryStr, opt, (answer)=>{
					res(answer)
				})
			})
		}
	}
}

export function createInterface(opt?:readline.ReadLineOptions){
	const defltOpt = {
		input: process.stdin,
		output: process.stdout
	}
	const opt_ = lodash.merge(defltOpt, opt)
	const rl = readline.createInterface(opt_)
	return rl
}