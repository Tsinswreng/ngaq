import {Ref, ref} from 'vue'
import WordB from '@ts/voca/WordB'
import SingleWord2, { Priority } from '@shared/SingleWord2'
import Recite from '@ts/voca/Recite'
import { $, $a, $n, measureFunctionTime, measurePromiseTime } from '@shared/Ut'
import VocaClient, { LsItemNames } from '@ts/voca/VocaClient'
import * as mathjs from 'mathjs'
import { alertEtThrow } from '@ts/frut'
import now from 'performance-now'
import { VocaDbTable } from 'shared/SingleWord2'
import LS from '@ts/LocalStorage'

const vocaClient = VocaClient.getInstance()
export default class MultiMode{
	
	private constructor(){}
	private static _instance:MultiMode
	public static getInstance(){
		if(MultiMode._instance === void 0){
			MultiMode._instance = new MultiMode()
		}
		return MultiMode._instance
	}

	private _id_bg = ref('bg')
	;public get id_bg(){return this._id_bg;};

	private _id_bg_next = ref('bg_next')
	;public get id_bg_next(){return this._id_bg_next;};

	private _class_bg = ref('bg')
	;public get class_bg(){return this._class_bg;};

	private _class_bg_next = ref('bg_next')
	;public get class_bg_next(){return this._class_bg_next;};

	// private _nextBg:string = ''
	// ;public get nextBg(){return this._nextBg;};;public set nextBg(v){this._nextBg=v;};

	private _isShowRandomBg = ref(false)
	;public get isShowRandomBg(){return this._isShowRandomBg;};

	private _isSaved = ref(true)
	;public get isSaved(){return this._isSaved;};;public set isSaved(v){this._isSaved=v;};

	private _isShowWordWindow = ref(false)
	;public get isShowWordWindow(){return this._isShowWordWindow;};;public set isShowWordWindow(v){this._isShowWordWindow=v;};

	private _isShowCardBox = ref(false)
	;public get isShowCardBox(){return this._isShowCardBox;};;public set isShowCardBox(v){this._isShowCardBox=v;};
	

	private _isShowWordInfo = ref(true)
	;public get isShowWordInfo(){return this._isShowWordInfo;};;public set isShowWordInfo(v){this._isShowWordInfo=v;};

	private _multiMode_key = ref(0)
	;public get multiMode_key(){return this._multiMode_key;};

	// public get paging_num(){
	// 	const pagingStr = this.pagingStr.value.trim()
	// 	const extentArr = pagingStr.split(',')
	// 	const start = parseInt(extentArr[0].trim())
	// 	const end = parseInt(extentArr[1].trim())
	// 	return [start, end]
	// }

	private _pagingStr:Ref<string> = ref(LS.items.multiModePaging.get()??'')
	get pagingStr(){return this._pagingStr}
	private set pagingStr(v){this._pagingStr = v}

	private _pageNums:Ref<number[]> = ref(this.get_page())
	get pageNums(){return this._pageNums}
	private set pageNums(v){this._pageNums=v}

	private get_page(){
		const pageStr = LS.items.multiModePaging.get()??''
		let start = 0, end = -1
		if(pageStr!==''){
			const extentArr = pageStr.split(',')
			start = parseInt(extentArr[0].trim())
			end = parseInt(extentArr[1].trim())
		}
		return [start,end]
	}
	public set_page(v:string){
		LS.items.multiModePaging.set(v)
		this.pagingStr = ref(v)
		this.pageNums.value = this.get_page()
	}


	private _debuffNumerator_str = ref(this.get_debuffNumerator_str()+'')
	get debuffNumerator_str(){return this._debuffNumerator_str;};set debuffNumerator_str(v){this._debuffNumerator_str=v;};

	public get debuffNumerator(){return $n(mathjs.evaluate(this.debuffNumerator_str.value))}

	private _priorityConfig = {debuffNumerator: this.debuffNumerator}
	get priorityConfig(){return this._priorityConfig}
	set priorityConfig(v){this._priorityConfig = v}

	private _curWord:WordB = new WordB(SingleWord2.example)
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _recite = Recite.getInstance()
	;public get recite(){return this._recite;};

	/**
	 * ls short for localStorage
	 */
	//public static ls_debuffNumerator = 'debuffNumerator'

	public get_debuffNumerator_str(){
		//let expressionStr = localStorage.getItem(MultiMode.ls_debuffNumerator)
		let expressionStr = (LS.items.debuffNumerator.get()??'')
		try {
			if(expressionStr.length===0){
				expressionStr = Priority.defaultConfig.debuffNumerator+''
			}
			let resultNum = mathjs.evaluate(expressionStr) as number
			$n(resultNum)
		} catch (err) {
			const e = err as Error
			alert(e)
			expressionStr='0'
		}
		return expressionStr
	}

	// public get_debuffNumerator_num(){
	// 	let expressionStr = localStorage.getItem(MultiMode.ls_debuffNumerator)??Priority.defaultConfig.debuffNumerator+''
	// 	let resultNum = mathjs.evaluate(expressionStr) as number
	// 	$n(resultNum)
	// 	return resultNum
	// }

	public set_debuffNumerator(n:string){
		//localStorage.setItem(MultiMode.ls_debuffNumerator, n+'')
		LS.items.debuffNumerator.set(n)
	}

	public wordCardClick(data:WordB){

		this._curWord = data;
		this._isShowWordWindow.value=true
	
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		console.log(data)
		console.log(data.priorityObj.changeRecord)
		
	}

	public customPriorityAlgorithm(){
		
		const jsCode = localStorage.getItem(LsItemNames.priorityAlgorithmJs)
		if(jsCode==null || 0 === jsCode.length){
			return
		}
		const fn = Priority.custom_js(jsCode)
		return fn()
	}

	/**
	 * 從流中取wordB對象數組並 并行ᵈ算權重。
	 * @param readble 應來自response.body
	 * @deprecated :一個json會被切斷
	 * @returns 
	 */
	public async getWordBViaStream_deprecated(
		 readble:ReadableStream<Uint8Array>
		,priorityConfig:Partial<typeof Priority.defaultConfig>
	){
		const reader = readble.getReader()
		// 创建 TextDecoder 对象
		const textDecoder = new TextDecoder('utf-8');
		// 将 Uint8Array 转换为字符串
		const ans:WordB[] = []
		let timeToEnd = false
		const prms:Promise<void>[] = []
		const loopStart = now()
		for(let i = 0;;i++){
			console.log(i)
			const curTime = now()
			// const uprms = reader.read().then(chunk=>{
				
			// })
			const chunk = await reader.read()
			const data = chunk.value
			if(data == null){
				//break
				//timeToEnd = true
				timeToEnd = chunk.done
			}
			const decodedStr = textDecoder.decode(data);
			const uprms = new Promise<void>((res,rej)=>{
				setTimeout(()=>{
					const jsonArr = decodedStr.split(`\n`)
					console.log(`jsonArr.lenght: `,jsonArr.length)//t
					let cur = ''
					try {
						for(let j = 0; j < jsonArr.length; j++){
							cur = jsonArr[j]
							if(cur.length === 0){continue}
							const o:VocaDbTable = JSON.parse(cur)
							const sw = SingleWord2.toJsObj(o)
							const wb = new WordB(sw)
							wb.priorityObj.setConfig(priorityConfig)
							wb.calcPrio() //這是一個同步函數、用于複雜計算
							ans.push(wb)
						}
					} catch (error) {
						const err = error as Error
						console.error(err)
						console.error(cur)
					}
					
					res()
				},0)
			})
			
			prms.push(uprms)
			if(timeToEnd){break}
			if(curTime - loopStart > 5000){
				throw new Error(`循環超時`)
			}
		}
		const loopEnd = now()
		const [time] = await measurePromiseTime(
			Promise.all(prms)
		)
		return ans
	}

	/**
	 * 取所有wordB對象、權重已算好、權重配置依此ᵗ類
	 * @returns 
	 */
	public async getAllWordB(){
		// const resps = await vocaClient.getRespOfAllTables()
		// const ans:WordB[] = []
		// for(const u of resps){
		// 	const ua = await this.getWordBViaStream(
		// 		$(u.body, '請求體潙空')
		// 		, this.priorityConfig
		// 	)
		// 	ans.push(...ua)
		// }
		// return ans
		const sws = await vocaClient.getAllTablesWords()
		const ans:WordB[] = sws.map(e=>new WordB(e))
		for(let i = 0; i < ans.length; i++){
			ans[i].priorityObj.setConfig(this.priorityConfig)
			ans[i].calcPrio()
		}
		return ans
	}



	public async start(){
		try {
			
			this.customPriorityAlgorithm()
			const recite = this.recite
			if(this.isSaved.value!==true){
				//throw new Error(`未保存旹不得重開`)
				alertEtThrow(`未保存旹不得重開`)
			}
			if(recite.allWordsToLearn.length>0){
				//throw new Error(`不得重複開始`)
				alertEtThrow(`不得重複開始`)
			}
			const wbs = await this.getAllWordB()
			$a(wbs, '無 可背單詞')
			recite.addWordsToLearn_WordB(wbs)
			
			recite.filter()
			if(recite.allWordsToLearn.length === 0){
				alertEtThrow(`無單詞可背`)
			}
			//throw new Error('114')
			
			 // 此函數中報錯亦失調用堆棧ᵗ訊
			// const [time_prio] = measureFunctionTime(
			// 	recite.calcAndDescSortPriority.bind(recite)
			// 	,({debuffNumerator: this.debuffNumerator})
			// )
			//console.log(`calcAndDescSortPriority耗時: `, time_prio)
			//let [time] = measureFunctionTime(recite.calcAndDescSortPriority, {debuffNumerator: this.debuffNumerator.value})//<坑>{this潙undefined}
			//let [time] = measureFunctionTime(recite.calcAndDescSortPriority.bind(this), {debuffNumerator: this.debuffNumerator.value})//<坑>{如是則this會指向類洏非實例}
			//let [time] = measureFunctionTime(recite.calcAndDescSortPriority.bind(recite), {debuffNumerator: this.debuffNumerator_str.value})
			//console.log(`calcAndDescSortPriority耗時: `+time)
			recite.descSortByPrio()
			recite.shuffleWords()
			this._isShowCardBox.value = true
		} catch (e) {
			//throw e
			//console.log(e)
			alertEtThrow(e)
		}
	}

	//當改潙 若權重參數有變旹䀬詞皆褈算權重
	public restart(){
		try {
			this.set_debuffNumerator(this.debuffNumerator_str.value+'')
			if(this.isSaved.value!==true){
				//throw new Error(`未保存旹不得重開`)
				alertEtThrow(`未保存旹不得重開`)
			}
			
			const recite = this.recite
			// recite.reset()
			// recite.mergeSelfWords()
			// recite.calcAndDescSortPriority({debuffNumerator: this.debuffNumerator})
			// recite.shuffleWords()
			recite.restart(this.priorityConfig)
			const resort = measureFunctionTime(
				recite.descSortByPrio.bind(recite)
			)
			const reshuffle = measureFunctionTime(
				recite.shuffleWords.bind(recite)
			)
			console.log(`重新排序耗時: `, resort[0])
			console.log(`打亂耗時: `, reshuffle[0])
			
			// let temp = recite.allWordsToLearn.slice()
			// recite.allWordsToLearn.length=0
			// recite.allWordsToLearn.push(...temp)//t
			recite.finalFilter()//2024-03-30T21:45:57.000+08:00
			this.multiMode_key.value++ //刷新組件

			//this._isShowCardBox.value = false
			//this._isShowCardBox.value = true
			//this._isShowCardBox.value = ! this._isShowCardBox.value
		} catch (e) {
			alertEtThrow(e)
		}
	}

	public sortByRmb(){
		if(this.isSaved.value!==true){
			//throw new Error(`未保存`)
			alertEtThrow(`未保存`)
		}
		const recite = this.recite
		recite.sortByRmb()
		this.multiMode_key.value++
	}

	public sortBylastRvwDate(){
		if(this.isSaved.value!==true){
			//throw new Error(`未保存`)
			alertEtThrow(`未保存`)
		}
		const recite = this.recite
		recite.sortBylastRvwDate()
		this.multiMode_key.value++
	}



	public async save(){
		await this.recite.saveWords()
		this.isSaved.value = true
	}

	private async _showNextRandomBg(){
		const getIdByClass=(className:string)=>{
			// const klass = document.getElementsByClassName(className)
			// return klass[0].id
			// console.log(`console.log(className)`)
			// console.log(className)
			if(className === this.id_bg.value){
				return this.id_bg_next.value
			}else{
				return this.id_bg.value
			}
		}
		let temp = this.class_bg_next.value
		this.class_bg_next.value = this.class_bg.value
		this.class_bg.value = temp;
		// let temp = this.id_bg_next.value
		// this.id_bg_next.value = this.id_bg.value
		// this.id_bg.value = temp;
		//[this._id_bg, this._id_bg_next] = [this._id_bg_next, this._id_bg]

		// const inst = this.getInstance()
		// inst.setBgByBase64(inst.nextBg)
		let bg: string|null = await MultiMode.getRandomBase64Img()
		//MultiMode.setBgByBase64(bg.src, this.id_bg.value)
		let nextBgId = getIdByClass(this.class_bg.value)
		let [time] = measureFunctionTime(MultiMode.setBgByBase64.bind(MultiMode),bg, nextBgId)
		console.log(`setBgByBase64耗時: `+time)
		// inst.nextBg=bg.src
		bg=null
		// let fn = ()=>{MultiMode._showNextRandomBg().then()}
		//setTimeout(fn, 1)

	}public async showNextRandomBg(){
		if(this.isShowRandomBg.value===true){
			let [time] = await measurePromiseTime(this._showNextRandomBg.bind(this)())
			console.log(`showNextRandomBg耗時: `+time)
			return 
		}
	}

	public static async getRandomBase64Img(){
		let pair: [string, string]|null = $( await VocaClient.fetchRandomImg() )
		//let base64 = await blobToBase64_fr(pair)
		console.log(`下張圖片ᵗ路徑:`)
		console.log(pair[0])
		let base64 = pair[1]
		pair = null
		return base64
		// let img = new Image()
		// //img.src = "data:image/jpeg;base64," + base64;
		// img.src = base64+''
		// base64 = ''
		// return img
	}

	public static setBgByBase64(img:string, id:string){
		const prefix = `data:image/png;base64,`
		let bg: HTMLImageElement|null  = document.getElementById(id) as HTMLImageElement
		$(bg)
		bg.src = prefix+''+img;
		(img as any)=null;
		(bg as any)=null
	}


}