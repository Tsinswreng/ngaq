import { MemorizeWord } from "@shared/WordWeight/_lib"
import { ref, Ref } from "vue"


class HtmlClass{
	class_bg:Ref = ref('.bg')
	class_bg_next:Ref = ref('.bg_next')
}

class HtmlId{
	id_bg = ref('#bg')
	id_bg_next = ref('@bg_next')
}

class UiStatus{
	isSaved = false
	isShowWordInfo = false
	isShowCardBox = ref(false)
	pageNums = 1
	debuffNumerator_str:string = ''
	isShowRandomBg:Ref<Boolean> = ref(false)
	multiMode_key:Ref<number> = ref(0)
}

export class WebVocaUi{
	protected constructor(){

	}

	static readonly _instance = this.new()

	static getInstance(){
		return this._instance
	}

	static new(){
		const z = new this()
		z.__init__()
		return z
	}

	protected __init__(){
		const z = this
		return z
	}


	protected _curWord:MemorizeWord|undefined
	get curWord(){return this._curWord}
	set curWord(v){this._curWord = v}

	protected _uiStatus = new UiStatus()
	get uiStatus(){return this._uiStatus}
	//set uiStatus(v){this.}

	protected _htmlClass = new HtmlClass()
	get htmlClass(){return this.htmlClass}

	protected _htmlId = new HtmlId()
	get htmlId(){return this._htmlId}
	
	async start(){}

	async save(){

	}

	async restart(){

	}

	set_page(str:string){}
}