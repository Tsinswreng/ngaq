import SingleWord2, { Priority, VocaDbTable } from "@shared/SingleWord2"
import { $, $a, delay, measurePromiseTime } from "@shared/Ut"
import VocaRaw2 from "@shared/VocaRaw2"
import { alertEtThrow } from "@ts/frut"
import VocaClient, { LsItemNames } from "@ts/voca/VocaClient"
import WordB from "@ts/voca/WordB"
import now from "performance-now"
const vocaClient = VocaClient.getInstance()



export default class Manage{

	public static readonly id_wordSrcStr = 'wordSrcStr'
	public static readonly id_neoTableName = 'neoTableName'
	public static readonly id_sqlInsert = 'sqlInsert'
	public static readonly id_dbPath = 'dbPath'
	public static readonly id_wordPriorityAlgorithm = `wordPriorityAlgorithm`
	public static readonly id_inputBaseUrl = 'inputBaseUrl'

	private static _instance: Manage
	private constructor(){}

	public static getInstance(){
		if(this._instance === void 0){
			this._instance = new Manage()
		}
		return this._instance
	}


	private getSrcStr(){
		const textarea = document.getElementById(Manage.id_wordSrcStr) as HTMLTextAreaElement
		const text = textarea.value
		return text
	}

	public addInDb(){
		try{
			let srcText = this.getSrcStr()
			const raw = new VocaRaw2(srcText)
			let words = raw.parseWords()
			let rows = SingleWord2.toDbObj(words)
			VocaClient.addWords(rows, raw.config)
		}catch(e){
			alertEtThrow(e)
		}
		
	}

	public backupAllTables(){
		alertEtThrow(`已棄用`)
		//return VocaClient.backupAllTables()
	}

	public creatTable(){
		
		try {
			const input = document.getElementById(Manage.id_neoTableName) as HTMLTextAreaElement
			const neoTableName = input.value
			if(!neoTableName){console.error(`!neoTableName`)}
			return VocaClient.creatTable($a(neoTableName))
		} catch (e) {
			alertEtThrow(e)
		}
	}

	public testWriteLocalStorage(){
		const input = document.getElementById(Manage.id_dbPath) as HTMLTextAreaElement
		const path = input.value
		localStorage.setItem('dbPath',path)
	}

	public testReadLocalStorage(){
		console.log(localStorage.getItem('dbPath'))
	}

	public get_wordPriorityAlgorithm(){
		const input = document.getElementById(Manage.id_wordPriorityAlgorithm) as HTMLTextAreaElement
		return input.value
	}


	public async getCompiledJs(){
		const tsCode = this.get_wordPriorityAlgorithm()
		const jsCode = await VocaClient.compileTs(tsCode)
		//console.log(jsCode)//t
		return jsCode
	}

	public async set_PriorityClass(){
		let code = this.get_wordPriorityAlgorithm()??''
		code = code.trim()
		const ls_ts = LsItemNames.priorityAlgorithmTs
		const ls_js = LsItemNames.priorityAlgorithmJs
		if(code.length === 0){
			const oldCode = localStorage.getItem(ls_ts)??''
			const input = document.getElementById(Manage.id_wordPriorityAlgorithm) as HTMLTextAreaElement
			input.value = oldCode
		}else{
			localStorage.setItem(ls_ts, code)
			const jsCode_ = await VocaClient.compileTs(code)
			const jsCode = $(jsCode_)
			localStorage.setItem(ls_js, jsCode)
			const fn = Priority.custom_js((jsCode))
			fn()
		}

	}

	public get_inputBaseUrl(){
		const input = document.getElementById(Manage.id_inputBaseUrl) as HTMLInputElement
		return input.value
	}

	public set_baseUrl(){
		const neo = this.get_inputBaseUrl()
		if(neo?.length>0){
			VocaClient.set_baseUrl(neo)
		}
	}

	public testJson(){
		vocaClient.testJson()
	}

	// public async genWordBViaStream(inp:ReadableStream<Uint8Array>){
	// 	const reader = inp.getReader()
	// 	// 创建 TextDecoder 对象
	// 	const textDecoder = new TextDecoder('utf-8');

	// 	// 将 Uint8Array 转换为字符串
	// 	const ans:WordB[] = []

	// 	for(let i = 0;;i++){
	// 		const chunk = await reader.read() // 循環中第一次迭代旹chunk總是包含數據庫表之多行數據、而後之每次迭代則只包含一行數據
	// 		//const chunk:ReadableStreamReadResult<Uint8Array> = await new Promise(resolve => reader.read().then(resolve));
	// 		//console.log(chunk.value)
	// 		//const data = $(chunk.value, `chunk.value is nil when i=${i}`)
	// 		const data = chunk.value
	// 		if(data == null){
	// 			console.warn(`chunk.value is nil when i=${i}`)
	// 			break
	// 		}
	// 		const decodedStr = textDecoder.decode(data);
	// 		const jsonArr = decodedStr.split(`\n`)
	// 		//console.log(jsonArr)
	// 		//const uDbRows:VocaDbTable[] = new Array(jsonArr.length)
	// 		for(let j = 0; j < jsonArr.length; j++){
	// 			if(jsonArr[j].length === 0){continue}
	// 			const o:VocaDbTable = JSON.parse(jsonArr[j])
	// 			//uDbRows[j] = o
	// 			const sw = SingleWord2.toJsObj(o)
	// 			const wb = new WordB(sw)
	// 			ans.push(wb)
	// 			//console.log(sw)
	// 		}
	// 		//const uDbRows:VocaDbTable[] = jsonArr.map(e=>JSON.parse(e))
	// 		//console.log(uDbRows)
	// 		// try {
	// 		// 	const o = JSON.parse(decodedString)
	// 		// 	console.log(o)
	// 		// } catch (error) {
	// 		// 	console.log(decodedString)
	// 		// 	console.error(error)
	// 		// }
	// 		if(chunk.done){
	// 			break
	// 		}
	// 		console.log(i)//t
	// 		//await delay(10)

	// 	}
	// 	console.log(ans)
	// 	console.log(ans.length)
	// }
	private static handleChunk(inp:ReadableStreamReadResult<Uint8Array>){

	}

	// /**
	//  * 從流中取wordB對象數組並 并行ᵈ算權重。
	//  * @param readble 應來自response.body
	//  * @returns 
	//  */
	// public async getWordBViaStream(readble:ReadableStream<Uint8Array>){
	// 	const reader = readble.getReader()
	// 	// 创建 TextDecoder 对象
	// 	const textDecoder = new TextDecoder('utf-8');
	// 	// 将 Uint8Array 转换为字符串
	// 	const ans:WordB[] = []
	// 	let timeToEnd = false
	// 	const prms:Promise<void>[] = []
	// 	const loopStart = now()
	// 	for(let i = 0;;i++){
	// 		console.log(i)
	// 		const curTime = now()
	// 		// const uprms = reader.read().then(chunk=>{
				
	// 		// })
	// 		const chunk = await reader.read()
	// 		const data = chunk.value
	// 		if(data == null){
	// 			//console.warn(`chunk.value is nil when i=${i}`)
	// 			//console.log(`console.log(chunk.done) `,chunk.done)
	// 			//break
	// 			//timeToEnd = true
	// 			timeToEnd = chunk.done
	// 		}
	// 		const decodedStr = textDecoder.decode(data);
	// 		const uprms = new Promise<void>((res,rej)=>{
	// 			setTimeout(()=>{
	// 				const jsonArr = decodedStr.split(`\n`)
	// 				console.log(`jsonArr.lenght: `,jsonArr.length)//t
	// 				for(let j = 0; j < jsonArr.length; j++){
	// 					if(jsonArr[j].length === 0){continue}
	// 					const o:VocaDbTable = JSON.parse(jsonArr[j])
	// 					const sw = SingleWord2.toJsObj(o)
	// 					const wb = new WordB(sw)
	// 					wb.calcPrio() //這是一個同步函數、用于複雜計算
	// 					ans.push(wb)
	// 				}
	// 				res()
	// 			},0)
	// 		})

	// 		prms.push(uprms)
	// 		if(timeToEnd){break}
	// 		if(curTime - loopStart > 5000){
	// 			throw new Error(`循環超時`)
	// 		}
	// 	}
	// 	const loopEnd = now()
	// 	//console.log(`循環耗時: `, loopEnd-loopStart)
	// 	const [time] = await measurePromiseTime(
	// 		Promise.all(prms)
	// 	)
	// 	//console.log(`流 權重: `, time)
	// 	//console.log(ans)
	// 	//console.log(ans.length)
	// 	return ans
	// }


	// public async testStream(){
	// 	const resp = await vocaClient.get_words('english')
	// 	const [time] = await measurePromiseTime(
	// 		this.getWordBViaStream(
	// 			$(resp?.body, 'resp?.body is nil')
	// 		)
	// 	)
	// 	console.log(`genWordBViaStream: `, time)
	// }

	// public async t2(){

	// }

}