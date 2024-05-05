import { RMB_FGT } from "@shared/entities/Word/MemorizeWord"
import { VocaSvc } from "@shared/logic/memorizeWord/VocaSvc"
import { WordEvent } from "@shared/SingleWord2"
import { WebMemorizeWord } from "@ts/voca3/entities/WebMemorizeWord"
import { WebVocaSvc } from "@ts/voca3/WebVocaSvc"
import { ref, Ref } from "vue"

class HtmlClass{
	class_bg:Ref = ref('.bg')
	class_bg_next:Ref = ref('.bg_next')
}

class HtmlId{
	id_bg = ref('#bg')
	id_bg_next = ref('@bg_next')
}

class UiStuff{
	isSaved = false
	isShowWordInfo = false
	isShowCardBox = ref(false)
	pageNums = 1
	debuffNumerator_str:string = ''
	isShowRandomBg:Ref<Boolean> = ref(false)
	multiMode_key:Ref<number> = ref(0)
	reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
}

export class WebVocaUi{
	protected constructor(){

	}

	protected static _instance:WebVocaUi

	static async getInstanceAsync(){
		const z = this
		if(z._instance == void 0){
			z._instance = await z.New()
		}
		return this._instance
	}

	protected static async New(){
		const z = new this()
		await z.__Init__()
		return z
	}

	protected async __Init__(){
		const z = this
		z._svc = await WebVocaSvc.New()
		z.registerToWindow()
		return z
	}

	protected _svc:WebVocaSvc
	get svc(){return this._svc}

	protected _curWord:WebMemorizeWord|undefined
	get curWord(){return this._curWord}
	set curWord(v){this._curWord = v}

	get wordsToLearn(){return this._svc.wordsToLearn}

	protected _uiStuff = new UiStuff()
	get uiStuff(){return this._uiStuff}
	//set uiStatus(v){this.}

	protected _htmlClass = new HtmlClass()
	get htmlClass(){return this._htmlClass}

	protected _htmlId = new HtmlId()
	get htmlId(){return this._htmlId}

	registerToWindow(){
		const z = this
		//@ts-ignore
		window._voca = {}
		//@ts-ignore
		const ui = window._voca
		const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(z))
		//console.log(keys)
		for(const k of keys){
			if(k === 'registerToWindow' || k === 'constructor'){
				continue
			}
			//console.log(k, typeof z[k])
			if(typeof z[k] === 'function'){
				ui[k] = z[k].bind(z)
			}
		}
	}
	
	async start(){
		const z = this
		await z.svc.start()
		z.showWordBox()
		console.log('start')//t
	}

	learnByIndex(index:integer, event:RMB_FGT){
		const z = this
		return z.svc.learnByIndex(index, event)
	}

	learnByWord(mw:WebMemorizeWord, event:RMB_FGT){
		const z = this
		const ans = z.svc.learnByWord(mw, event)
		if(mw instanceof WebMemorizeWord){
			switch (event){
				case WordEvent.RMB:
					mw.uiStuff.reciteStatusRef.value = 'rmb'
				break;
				case WordEvent.FGT:
					mw.uiStuff.reciteStatusRef.value = 'fgt'
				break;
			}
		}
		return ans
	}

	undoByWord(mw:WebMemorizeWord){
		const z = this
		const ans = mw.undo()
		if(mw instanceof WebMemorizeWord){
			mw.uiStuff.reciteStatusRef.value = 'nil'
		}
		return ans
	}


	/**
	 * 無效
	 */
	showWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = false
		z.uiStuff.isShowCardBox.value = true
	}

	/**
	 * 無效
	 */
	hideWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = true
		z.uiStuff.isShowCardBox.value = false
	}


	/** 開始按鈕 */
	async prepareEtStart(){
		const z = this
		await z.svc.load()
		await z.svc.sort()
		return z.start()
	}

	async save(){

	}

	async restart(){

	}

	set_page(str:string){}

	test(){
		const z = this
		// console.log(z._svc instanceof VocaSvc)
		// console.log(z.svc.wordsToLearn)
	}
}