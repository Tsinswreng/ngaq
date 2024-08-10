import Level from 'level'

//console.log(Level)
const path = 'D:/Program Files/Rime/User_Data/userPredictRecord.ldb'
async function Main(){
	const ll = new Level.Level(path)
	const iter = ll.iterator()
	for(let i = 0; i < 100; i++){
		const ua = await iter.next()
		if(ua != void 0){
			console.log(`${ua[0]}\t${ua[1]}`)
		}
	}
}

Main()

