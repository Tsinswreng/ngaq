import VocaRaw from "../VocaRaw";
let jap = new VocaRaw()
function main(){
	
	jap.tableName = 'jap'
	jap.getAllSingleWordsSync().then((result:any)=>{console.log(1); console.log(result.length)})
}

main()
test()
fore()
fore()


async function test(){
	let result:any = await jap.getAllSingleWordsSync()
	console.log(2)
	console.log(result.length)
}

function fore(){
	for(let i = 0; i < 99; i++){
		//console.log(i)
		process.stdout.write(i.toString()+' ')
	}
	console.log()
}