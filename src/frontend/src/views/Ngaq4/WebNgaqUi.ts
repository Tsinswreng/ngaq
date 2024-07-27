import { RMB_FGT } from "@shared/logic/memorizeWord/LearnEvents"
import { WebSvcWord } from "@ts/ngaq4/entities/WebSvcWord"
import { WebNgaqSvc } from "@ts/ngaq4/WebNgaqSvc"
import { ref, Ref } from "vue"
import { $ } from "@shared/Common"
import {mergeErrStack} from '@shared/tools/mergeErrStack'
import { Exception } from "@shared/error/Exception"
import * as Le from '@shared/linkedEvent'
import EventEmitter3 from 'EventEmitter3'
import * as frut from '@ts/frut'
import { TagImg } from "@shared/tools/TagImg"
import { Client } from "@ts/ngaq4/Client"
import { LearnBelong, PropertyBelong } from "@shared/model/word/NgaqRows"
import { NgaqLex } from "@shared/Lex/ngaqLex/NgaqLex"
import { AddWordsSvc } from "@ts/ngaq4/AddWordsSvc"
import Tempus from "@shared/Tempus"
import {SvcWord} from '@shared/logic/memorizeWord/SvcWord'
const WordEvent = LearnBelong

const EV = Le.Event.new.bind(Le.Event)
export class UiEvents extends Le.Events{
	static new(){
		const z = new this()
		z.__init__()
		return z
	}
	changeBg = EV<[TagImg]>('changeBg')
}

class HtmlClass{
	/** @deprecated */
	class_bg = ref('bg')
	class_bg_next = ref('bg_next')
}

class HtmlId{
	id_bg = ref('bg')
	id_bg_next = ref('bg_next')
}

class UiStuff{
	isSaved = false
	//isShowWordInfo = false
	isShowWordInfo = ref(false)
	isShowCardBox = ref(false)
	pageNums = 1
	debuffNumerator_str:string = ''
	/** true 背景不再變 */
	lockBg = ref(true)
	cardsBox_key:Ref<number> = ref(0)
	isShowAddWordsBox = ref(false)
	//reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
}

const withTryCatchProxy = (target: WebNgaqUi) => {
	return new Proxy(target, {
		get(target, prop) {
			if (typeof target[prop] === 'function') {
				return function (this:WebNgaqUi, ...args) {
					try {
						const ans = target[prop].apply(this, args)
						if(ans instanceof Promise){
							ans.catch(e=>{
								target.handleErr(e)
							})
						}
						return ans
					} catch (error) {
						//console.error(`Error in method ${String(prop)}:`, error);
						target.handleErr(error)
					}
				};
			} else {
				return target[prop];
			}
		},
	});
};


export class WebNgaqUi{
	protected constructor(){

	}

	protected static _instance:WebNgaqUi

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
		const proxy = withTryCatchProxy(z)
		//console.log(proxy instanceof Proxy) 報錯
		//console.log(proxy instanceof WebNgaqUi) true
		return proxy
		//return z
	}

	protected async __Init__(){
		const z = this
		z._svc = await WebNgaqSvc.New()
		//console.log(z.svc.events)//t undef
		z._initSvcListeners()
		z._initListener()
		z.registerToWindow()
		return z
	}

	protected _svc:WebNgaqSvc
	get svc(){return this._svc}

	protected _emitter = Le.LinkedEmitter.new(new EventEmitter3())
	get emitter(){return this._emitter}
	protected set emitter(v){this._emitter = v}

	protected _events = UiEvents.new()
	get events(){return this._events}
	protected set events(v){this._events = v}
	
	protected _bgImg = BgImg.new()
	get bgImg(){return this._bgImg}

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

	protected _fmt = Fmt.new(this)
	get fmt(){return this._fmt}
	protected set fmt(v){this._fmt = v}
	


	protected _initListener(){
		const z = this
		const ev = z.events
		z.emitter.on(ev.changeBg, (img)=>{
			console.log(img.meta)
			console.log(img.url)
		})
	}

	registerToWindow(){
		const z = this
		//@ts-ignore
		window['_'] = z
	}

	async Test(){
		const z = this
		const client = Client.new()
		return await client.GetWeightAlgoJs0()
	}

	/**
	 * test
	 */
	async SignUp(opt){
		const z = this
		const client = Client.new()
		return await client.SignUp(opt)
	}

	async Login(uniqueName:str, password:str){
		const z = this
		const client = Client.new()
		return await client.LoginByUniqueName(uniqueName, password)
	}

	handleErr(err:any){
		const z = this
		if(err instanceof Error){
			if(err instanceof Exception){

				if(err.reason === z.svc.errReasons.load_err){
// 在if塊外、err.reason是Reason<any[]>類型、errReasons.load_err是Reason<[string]>類型
// 運行時、已知若err.reason === z.svc.errReasons.load_err爲真、則兩者的泛型類型也必然相同
// 但是在if塊內、typescript仍把 err.reason推斷爲Reason<any[]>類型、而不是期望的Reason<[string]>類型類型
// 能否讓typescript 自動在此if塊中推斷出err.reason的具體類型? 需要自動推斷、而不是手動類型斷言
					console.error(err)
					console.error(err.reason.args)
					return
				}
				console.error(err)
				alert(err.reason.name)
			}
		}else{
			alert('unknown error')
			console.error(err)
		}
	}
	
	async start(){
		const z = this
		await z.svc.Start()
		z.fresh_wordBox()
	}

	learnByIndex(index:int, event:RMB_FGT){
		const z = this
		return z.svc.learnByIndex(index, event)
	}

	// /** @deprecated */
	// learnByWord(mw:WebSvcWord, event:RMB_FGT){
	// 	const z = this
	// 	z._curWord = mw
	// 	z.fresh_wordInfo()
	// 	const ans = z.svc.learnByWord(mw, event)
	// 	if(mw instanceof WebSvcWord){
	// 		switch (event){
	// 			case WordEvent.rmb:
	// 				mw.uiStuff.reciteStatusRef.value = 'rmb'
	// 			break;
	// 			case WordEvent.fgt:
	// 				mw.uiStuff.reciteStatusRef.value = 'fgt'
	// 			break;
	// 		}
	// 	}
	// 	return ans
	// }

	learnOrUndoByIndex(index:int, event:RMB_FGT){
		const z = this
		const mw = $(z.svc.wordsToLearn[index], 'z.svc.wordsToLearn[index]')
		z._curWord = mw
		z.fresh_wordInfo()
		//const ans = z.svc.learnByWord(mw, event)
		const ans = z.svc.learnOrUndoByIndex(index, event)
		if(mw instanceof WebSvcWord){
			switch (ans){
				case WordEvent.rmb:
					mw.uiStuff.reciteStatusRef.value = 'rmb'
				break;
				case WordEvent.fgt:
					mw.uiStuff.reciteStatusRef.value = 'fgt'
				break;
				case void 0:
					mw.uiStuff.reciteStatusRef.value = 'nil'
				break
			}
		}
		return ans
	}

	updateWordInfo(){

	}

	// getLearnedWords(){
	// 	const z = this
	// 	return [z.svc.rmbWord__index, z.svc.fgtWord__index]
	// }

	reloadAlgoWeight(){
		const z = this
		return z.svc.ReloadWeightAlgo()
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
		// z.rmWordBox()
		// z.mkWordBox()
		z.uiStuff.cardsBox_key.value++
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
		await z.svc.Load()
		await z.svc.Sort()
		return z.start()
	}

	//TODO
	async Save(){
		const z = this
		await z.svc.Save()
		return true
	}

	async Restart(){
		const z = this
		await z.svc.Restart()
		z.fresh_wordBox()
	}

	async SaveEtRestart(){
		const z = this
		//debugger
		const saveOk = await z.Save()
		const restartOk = await z.Restart()
	}

	set_page(str:string){}

	test(){
		const z = this
		// console.log(z._svc instanceof VocaSvc)
		// console.log(z.svc.wordsToLearn)
	}

	changeRec(){
		const z = this
		return z.svc.weightAlgo?.wordId__changeRec
	}


	async NextBg(){
		const z = this
		if(z.uiStuff.lockBg.value == true){
			return
		}
		const img = await z.svc.GetImg()
		z.emitter.emit(z.events.changeBg, img)
		return z.bgImg.setBg_Img(img)
	}

	protected _initSvcListeners(){
		const z = this
		const recErr = new Error()
		function hanErr(error){
			const err = error as Error
			mergeErrStack(err, recErr)
			z.svc.emitErr(err)
		}
		try {
			z.svc.emitter.on(z.svc.events.error, (e)=>{
				console.error(e)
			})
			z.svc.emitter.on(z.svc.events.learnBySvcWord, async(svcWord)=>{
				await z.NextBg().catch(e=>{
					hanErr(e)
				})
			})
			
			z.svc.emitter.on(z.svc.events.load_weight_err, (err)=>{
				alert('load_weight_err')
				console.error(err)
			})
		} catch (e) {
			hanErr(e)
		}
	}

	discardChange(){
		const z = this
		z.svc.discardChangeEtEnd()
	}


	showAddWordsBox(){
		const z = this
		z.uiStuff.isShowAddWordsBox.value = true
	}

	hideAddWordsBox(){
		const z = this
		z.uiStuff.isShowAddWordsBox.value = false
	}

	toggleAddWordsBox(){
		const z = this
		z.uiStuff.isShowAddWordsBox.value = !z.uiStuff.isShowAddWordsBox.value
	}

	/**
	 * @test
	 */
	async AddNeoWords(){
		const z = this
		const ele = document.getElementById('neoWords') as HTMLTextAreaElement
		const text = ele?.value??''
		const addWordSvc = AddWordsSvc.new()
		return await addWordSvc.AddJoinedRows(addWordSvc.parse(text))
	}





	// async tu(){
	// 	const z = this
	// 	z.t1()
	// 	const data = await z.test_get_imgU8Arr()
	// 	const imgs = document.getElementsByClassName(z.htmlClass.class_bg.value)
	// 	const first = imgs[0] as HTMLImageElement
	// 	if(first == void 0){
	// 		console.error(`first == void 0`)
	// 		return
	// 	}
	// 	const blob = new Blob(
	// 		[data]
	// 		//,{type: 'image/jpeg'}
	// 	)
		
	// 	first.src = URL.createObjectURL(blob)
	// 	// console.log(blob, 'blob')
	// 	// console.log(buffer.data, 'buffer.data') //是 非空UInt8Array
	// 	console.log(first.src)//t
	// 	z.uiStuff.isShowRandomBg.value = false
	// 	z.uiStuff.isShowRandomBg.value = true
	// 	// // 釋放URL資源
	// 	// URL.revokeObjectURL(imageUrl);
	// }

}

class BgImgUiStuff{
	class_bg = ref('bg')
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

	static base64ImgPrefix = `data:image/png;base64,`

	protected _uiStuff = new BgImgUiStuff()
	get uiStuff(){return this._uiStuff}

	protected _isShowRandomBg = ref(true)
	get isShowRandomBg(){return this._isShowRandomBg}
	set isShowRandomBg(v){this._isShowRandomBg = v}

	protected _curBg_bytes:Uint8Array|undefined
	get curBg_bytes(){return this._curBg_bytes}
	set curBg_bytes(v){this._curBg_bytes = v}

	static numArrToBase64(bytes:int[]){
		//console.log(bytes, 'bytes')//t +
		return frut.numArrToBase64(bytes)
	}

	static arrBufToBase64(buffer:ArrayBuffer){
		//let binary = '';
		const sb = [] as str[]
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			const binary = String.fromCharCode(bytes[i]);
			sb.push(binary)
		}
		const binary = sb.join('')
		return window.btoa(binary);
	}

	setBg_numArr(bytes:int[]){
		const z = this
		const base64 = z.This.numArrToBase64(bytes)
		return z.setBg_base64(base64)
	}

	setBg_arrBuf(arrBuf:ArrayBuffer){
		const z = this
		const base64 = z.This.arrBufToBase64(arrBuf)
		return z.setBg_base64(base64)
	}


	setBg_base64(base64:str){
		const z = this
		const klasses = document.getElementsByClassName(z.uiStuff.class_bg.value)
		const first = klasses[0] as HTMLImageElement
		if(first == void 0){
			throw new Error(`first == void 0`)
		}
		first.src = z.This.base64ImgPrefix+base64
	}

	setBg_Img(img:TagImg){
		const z = this
		return z.setBg_arrBuf(img.arrBuf)
	}

	// async showBg(){
	// 	const z = this
	// 	if(z.curBg_bytes == void 0){
	// 		return false
	// 	}
	// 	const base64 = frut.u8ArrToBase64(z.curBg_bytes)

	// }

}



class Fmt{

	protected constructor(){}
	protected __init__(...args: Parameters<typeof Fmt.new>){
		const z = this
		z.ui = args[0]
		return z
	}

	static new(ui:WebNgaqUi){
		const z = new this()
		z.__init__(ui)
		return z
	}

	//get This(){return Fmt}

	protected _ui:WebNgaqUi
	get ui(){return this._ui}
	protected set ui(v){this._ui = v}
	
	
	fmtAddDates(){
		const z = this
		const ui = z.ui
		return ui.curWord?.learnBl__learns.get(LearnBelong.add)
			?.map(e=>Tempus.format(e.ct, 'YY.MM.DD'))
			.join('|')??''
	}

	mean(){
		const ui = this.ui
		const cur = ui.curWord
		if(cur == void 0){
			return ''
		}
		const means = cur.propertyBl__propertys.get(PropertyBelong.mean)
		if(means == void 0){
			return ''
		}
		return means.map(e=>e.text+'\n').join('')
	}

	fmtProp(){
		const z = this
		const ui = z.ui
		if(ui.curWord == void 0){
			return ''
		}
		const kv = {}
		let i = 0
		for(const bl in PropertyBelong){
			if(bl === PropertyBelong.mean){
				continue
			}
			const prop = ui.curWord.propertyBl__propertys.get(bl)
			const v = prop?.map(e=>e.text)??''
			if(v !== ''){
				kv[bl] = v
			}else{
				continue
			}
			i++
		}
		if(i === 0){
			return ''
		}
		const ans = JSON.stringify(kv)
		return ans
	}

	eventsMark(){
		const ui = this.ui
		const sb = [] as str[]
		function _(word:SvcWord){
			for(let i = 0; i < word.learns.length; i++){
				//const event = word.date__event[i].event
				const event = word.learns[i].belong
				const ua = WebSvcWord.eventMark(event)
				sb.push(ua)
			}
			return sb.join('')
		}
		if(ui.curWord!= void 0){
			return _(ui.curWord)
		}
		return ''
	}


}