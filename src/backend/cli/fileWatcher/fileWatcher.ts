//esno "D:\Program Files\Rime\User_Data\_js\watch.ts" "D:\Program Files\Rime\User_Data\TswG_log"
// esno "D:\_code\ngaq\src\backend\cli\fileWatcher\fileWatcher.ts" "D:/_code/ngaq/src/backend/cli/fileWatcher/log"
import * as fs from 'fs'
const file = process.argv[2]
const encoding = process.argv[3] || 'utf-8'
if(file == void 0){
	console.error(`first arg should be a file path`)
	process.exit(1)
}


function removePrefix(this:void, str:string, prefix:string){
	if( prefix.length > str.length ){
		return void 0
	}
	const pre2 = str.slice(0, prefix.length) //0,2 -> ab
	if( pre2 != void 0 && prefix === pre2 ){
		const ans = str.slice(prefix.length)
		return ans
	}
	return void 0
}

let cnt = 0
let lastTxt = ''

const watcher = fs.watch(file, async(eventType, filename)=>{
	try {
		if(eventType === 'change'){
			//@ts-ignore
			const got = await fs.promises.readFile(file, {encoding: encoding}) as string
			if(true || cnt % 2 === 0){
				const diff = removePrefix(got, lastTxt)
				//console.log('diff:' ,diff)//t
				if(diff != void 0 && diff.length > 0){
					process.stdout.write(diff)
					//console.log(diff)
				}else{
					//console.log(got)
					process.stdout.write(got)
				}
			}
			lastTxt = got
			cnt++
		}
	} catch (err) {
		console.error(err)
	}
})

watcher.on('error', (error) => {
	console.error('Error occurred while watching file:', error);
});