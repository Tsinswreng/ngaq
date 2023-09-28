import {Ref, ref} from 'vue'
import WordB from '@ts/voca/WordB'
import SingleWord2, { Priority } from '@shared/SingleWord2'
import Recite from '@ts/voca/Recite'
import Log from '@shared/Log'
const l = new Log()
export default class MultiMode{
	
	private constructor(){}
	private static _instance:MultiMode
	public static getInstance(){
		if(MultiMode._instance === void 0){
			MultiMode._instance = new MultiMode()
		}
		return MultiMode._instance
	}

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

	private _debuffNumerator = ref(Priority.defaultConfig.debuffNumerator)
	;public get debuffNumerator(){return this._debuffNumerator;};;public set debuffNumerator(v){this._debuffNumerator=v;};

	private _curWord:WordB = new WordB(SingleWord2.example)
	;public get curWord(){return this._curWord;};;public set curWord(v){this._curWord=v;};

	private _recite = Recite.getInstance()
	;public get recite(){return this._recite;};

	private _tables = ['english', 'japanese', 'latin']
	;public get tables(){return this._tables;};

	private _checkedTables:Ref<(boolean|undefined)[]> = ref([])
	;public get checkedTables(){return this._checkedTables;};;public set checkedTables(v){this._checkedTables=v;};

	public wordCardClick(data:WordB){

		this._curWord = data;
		this._isShowWordWindow.value=true
	
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		this._isShowWordInfo.value = !this._isShowWordInfo.value
		console.log(data)
		console.log(data.priority.procedures)
		//console.log(data.formattedMean)//t
		
	}

	public async start(){
		// /console.log(this.checkedTables.value)
		const selectedTables:string[] = []
		const recite = this.recite
		for(let i = 0; i < this.checkedTables.value.length; i++){
			let cur = this.checkedTables.value[i]
			if(cur === true){
				selectedTables.push(this.tables[i])
			}
		}

		for(const st of selectedTables){
			await recite.fetchAndStoreWords(st)
		}
		//console.log(recite.allWordsToLearn)
		recite.filterByAddTimes()
		recite.calcAndDescSortPriority({debuffNumerator: this.debuffNumerator.value})
		recite.shuffleWords()
		this._isShowCardBox.value = true

		//console.log(this.isShowCardBox.value)
	}

	public restart(){
		if(this.isSaved.value!==true){
			throw new Error(`未保存旹不得重開`)
		}
		
		const recite = this.recite
		recite.mergeSelfWords()
		recite.calcAndDescSortPriority({debuffNumerator: this.debuffNumerator.value})
		recite.shuffleWords()
		// let temp = recite.allWordsToLearn.slice()
		// recite.allWordsToLearn.length=0
		// recite.allWordsToLearn.push(...temp)//t
		this.multiMode_key.value++ //刷新組件
		//this._isShowCardBox.value = false
		//this._isShowCardBox.value = true
	}

	public async save(){
		await this.recite.saveWords()
		this.isSaved.value = true
	}





}