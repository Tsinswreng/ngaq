import { RMB_FGT } from "@shared/entities/Word/SvcWord"
import { VocaSvc } from "@shared/logic/memorizeWord/VocaSvc"
import { WordEvent } from "@shared/SingleWord2"
import { WebSvcWord } from "@ts/voca3/entities/WebSvcWord"
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
	//isShowWordInfo = false
	isShowWordInfo = ref(false)
	isShowCardBox = ref(false)
	pageNums = 1
	debuffNumerator_str:string = ''
	isShowRandomBg:Ref<Boolean> = ref(false)
	multiMode_key:Ref<number> = ref(0)
	//reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
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

	protected _curWord:WebSvcWord|undefined
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
		window['_voca'] = z
	}

	registerToWindow0(){
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
			}else{
				ui[k] = z[k]
			}
		}
	}


	
	async start(){
		const z = this
		await z.svc.start()
		z.fresh_wordBox()
		console.log('start')//t
	}

	learnByIndex(index:integer, event:RMB_FGT){
		const z = this
		return z.svc.learnByIndex(index, event)
	}

	learnByWord(mw:WebSvcWord, event:RMB_FGT){
		const z = this
		z._curWord = mw
		z.fresh_wordInfo()
		const ans = z.svc.learnByWord(mw, event)
		if(mw instanceof WebSvcWord){
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

	updateWordInfo(){

	}

	getLearnedWords(){
		const z = this
		return [z.svc.rmbWords, z.svc.fgtWords]
	}

	undoByWord(mw:WebSvcWord){
		const z = this
		const ans = mw.undo()
		if(mw instanceof WebSvcWord){
			mw.uiStuff.reciteStatusRef.value = 'nil'
		}
		return ans
	}

	getCurrentWord(){
		return this._curWord
	}

	mkWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = false
		z.uiStuff.isShowCardBox.value = true
	}

	rmWordBox(){
		const z = this
		z.uiStuff.isShowCardBox.value = true
		z.uiStuff.isShowCardBox.value = false
	}

	fresh_wordBox(){
		const z = this
		z.rmWordBox()
		z.mkWordBox()
	}

	fresh_wordInfo(){
		const z = this
		z.uiStuff.isShowWordInfo.value = false
		z.uiStuff.isShowWordInfo.value = true
	}


	/** 開始按鈕 */
	async prepareEtStart(){
		const z = this
		await z.svc.load()
		await z.svc.sort()
		return z.start()
	}

	async save(){
		const z = this
		return await z.svc.save()
	}

	async restart(){
		const z = this
		z.fresh_wordBox() // 不效
		return z.svc.restart()
	}

	set_page(str:string){}

	test(){
		const z = this
		// console.log(z._svc instanceof VocaSvc)
		// console.log(z.svc.wordsToLearn)
	}

	changeRec(){
		const z = this
		return z.svc.weightAlgo?.word__changeRecord
	}


	//TODO 把changeRecord作潙可選屬性 集于MemorizeWord
	seekChangeRec(index:integer){
		const z = this
		const recs = z.svc.weightAlgo?.word__changeRecord
		if(recs == void 0){
			console.log(`recs == void 0`)
			return
		}
		const curWord = z.wordsToLearn[index]
		console.log(curWord)//t
		return recs.get(curWord.word)
	}
}


class BgImg{
	protected constructor(){}
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	protected __init__(){
		const z = this
		return z
	}
	get This(){return BgImg}
}