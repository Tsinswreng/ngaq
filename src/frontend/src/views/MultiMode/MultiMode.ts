import {Ref, ref} from 'vue'
import WordB from '@ts/voca/WordB'
import SingleWord2, { Priority } from '@shared/SingleWord2'
import Recite from '@ts/voca/Recite'
import Log from '@shared/Log'
import { $, $n, blobToBase64_fr, delay, measureFunctionTime, measurePromiseTime } from '@shared/Ut'
import VocaClient from '@ts/voca/VocaClient'
import * as mathjs from 'mathjs'
import { alertEtThrow } from '@ts/frut'

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

	private _debuffNumerator_str = ref(this.get_debuffNumerator_str()+'')
	;public get debuffNumerator_str(){return this._debuffNumerator_str;};;public set debuffNumerator_str(v){this._debuffNumerator_str=v;};

	public get debuffNumerator(){return $n(mathjs.evaluate(this.debuffNumerator_str.value))}

	private _curWord:WordB = new WordB(SingleWord2.example)
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _recite = Recite.getInstance()
	;public get recite(){return this._recite;};

	private _tables = ['english', 'japanese', 'latin']
	;public get tables(){return this._tables;};

	private _checkedTables:Ref<(boolean|undefined)[]> = ref([])
	;public get checkedTables(){return this._checkedTables;};;public set checkedTables(v){this._checkedTables=v;};

	/**
	 * ls short for localStorage
	 */
	public static ls_debuffNumerator = 'debuffNumerator'

	public get_debuffNumerator_str(){
		let expressionStr = localStorage.getItem(MultiMode.ls_debuffNumerator)
		if(expressionStr === null || expressionStr.length===0){
			expressionStr = Priority.defaultConfig.debuffNumerator+''
		}
		let resultNum = mathjs.evaluate(expressionStr) as number
		$n(resultNum)
		return expressionStr
	}

	public get_debuffNumerator_num(){
		let expressionStr = localStorage.getItem(MultiMode.ls_debuffNumerator)??Priority.defaultConfig.debuffNumerator+''
		let resultNum = mathjs.evaluate(expressionStr) as number
		$n(resultNum)
		return resultNum
	}

	public set_debuffNumerator(n:string){
		localStorage.setItem(MultiMode.ls_debuffNumerator, n+'')
	}

	public wordCardClick(data:WordB){

		this._curWord = data;
		this._isShowWordWindow.value=true
	
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		console.log(data)
		console.log(data.priority.changeRecord)
		//console.log(data.formattedMean)//t
		
	}

	public async start(){
		try {
			const recite = this.recite
			if(this.isSaved.value!==true){
				//throw new Error(`未保存旹不得重開`)
				alertEtThrow(`未保存旹不得重開`)
			}
			if(recite.allWordsToLearn.length>0){
				//throw new Error(`不得重複開始`)
				alertEtThrow(`不得重複開始`)
			}
			const selectedTables:string[] = []
			for(let i = 0; i < this.checkedTables.value.length; i++){
				let cur = this.checkedTables.value[i]
				if(cur === true){
					selectedTables.push(this.tables[i])
				}
			}

			for(const st of selectedTables){
				await recite.fetchAndStoreWords(st)
			}
			
			const sws = await vocaClient.getAllTablesWords()
			
			recite.addWordsToLearn(sws)
			recite.filter()
			//throw new Error('114')
			
			recite.calcAndDescSortPriority({debuffNumerator: this.debuffNumerator}) // 此函數中報錯亦失調用堆棧ᵗ訊
			//let [time] = measureFunctionTime(recite.calcAndDescSortPriority, {debuffNumerator: this.debuffNumerator.value})//<坑>{this潙undefined}
			//let [time] = measureFunctionTime(recite.calcAndDescSortPriority.bind(this), {debuffNumerator: this.debuffNumerator.value})//<坑>{如是則this會指向類洏非實例}
			let [time] = measureFunctionTime(recite.calcAndDescSortPriority.bind(recite), {debuffNumerator: this.debuffNumerator_str.value})
			console.log(`calcAndDescSortPriority耗時: `+time)
			recite.shuffleWords()
			this._isShowCardBox.value = true
		} catch (e) {
			//throw e
			//console.log(e)
			alertEtThrow(e)
		}
	}

	public restart(){
		try {
			this.set_debuffNumerator(this.debuffNumerator_str.value+'')
			if(this.isSaved.value!==true){
				//throw new Error(`未保存旹不得重開`)
				alertEtThrow(`未保存旹不得重開`)
			}
			
			const recite = this.recite
			recite.reset()
			recite.mergeSelfWords()
			recite.calcAndDescSortPriority({debuffNumerator: this.debuffNumerator})
			recite.shuffleWords()
			// let temp = recite.allWordsToLearn.slice()
			// recite.allWordsToLearn.length=0
			// recite.allWordsToLearn.push(...temp)//t
			this.multiMode_key.value++ //刷新組件
			//this._isShowCardBox.value = false
			//this._isShowCardBox.value = true
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
		//await delay(100)//t
		// let temp = this.id_bg_next.value
		// this.id_bg_next.value = this.id_bg.value
		// this.id_bg.value = temp;
		//[this._id_bg, this._id_bg_next] = [this._id_bg_next, this._id_bg]

		// const inst = this.getInstance()
		// inst.setBgByBase64(inst.nextBg)
		//console.log(114514)//t
		let bg: string|null = await MultiMode.getRandomBase64Img()
		//console.log(114515)//t
		//MultiMode.setBgByBase64(bg.src, this.id_bg.value)
		let nextBgId = getIdByClass(this.class_bg.value)
		// console.log(`console.log(nextBgId)`)
		// console.log(nextBgId)//t
		//console.log(114514)//t
		let [time] = measureFunctionTime(MultiMode.setBgByBase64.bind(MultiMode),bg, nextBgId)
		console.log(`setBgByBase64耗時: `+time)
		//console.log(114515)//t
		//console.log(this.id_bg_next.value)//t
		//console.log(bg.src.length)//t
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
		//console.log(114514)//t
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
		//console.log(img.slice(0,999))
		const prefix = `data:image/png;base64,`
		let bg: HTMLImageElement|null  = document.getElementById(id) as HTMLImageElement
		$(bg)
		bg.src = prefix+''+img;
		//console.log(bg.src);//t
		(img as any)=null;
		(bg as any)=null
	}


}