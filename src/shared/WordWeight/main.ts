//import Tempus from "@shared/Tempus";
//import { $a } from "@shared/Ut";
import { $ } from "@shared/Common";

//console.log(Tempus.new())
//console.log($a)
//console.log($)

const code = 
`
setTimeout(()=>{
	throw new Error('abc')
}, 500)
__return._='ok'
`
const __return = {_:void 0}
const fn = new Function('__return', code)
try {
	const ans = fn(__return)
} catch (err) {
	console.error('err inside')
}

console.log(__return)

function main(){
	setInterval(() => {
		console.log('running')
	}, 100);
}

main()

process.on('uncaughtException', (err) => {
	console.error('Global uncaught exception handler:', err);
	//main()
	console.log('main')
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Global unhandled rejection handler:', reason);
});


