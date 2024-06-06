import { RMB_FGT } from "@shared/entities/Word/SvcWord"
import { NgaqSvc } from "@shared/logic/memorizeWord/NgaqSvc"
import { WordEvent } from "@shared/SingleWord2"
import { WebSvcWord } from "@ts/voca3/entities/WebSvcWord"
import { WebNgaqSvc } from "@ts/voca3/WebNgaqSvc"
import { ref, Ref } from "vue"
import lodash from 'lodash'
import { $, delay, mergeErrStack } from "@shared/Ut"
import { Exception } from "@shared/Exception"


// function testU8ArrToBase64(uint8Array:Uint8Array){
// // 假设您有一个名为 uint8Array 的 UInt8Array 对象

// // 将 UInt8Array 对象转换为普通数组
// const array = Array.from(uint8Array);
// //const array = uint8Array

// // 将数组中的每个元素转换为字符
// const chars = array.map(byte => String.fromCharCode(byte));

// // 将字符数组连接为字符串
// const binaryString = chars.join('');

// // 使用 btoa() 将二进制字符串转换为 base64 编码
// const base64String = btoa(binaryString);
// return base64String
// }

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
		z._initSvcListeners()
		z.registerToWindow()
		return z
	}

	protected _svc:WebNgaqSvc
	get svc(){return this._svc}

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

	registerToWindow(){
		const z = this
		//@ts-ignore
		window['_'] = z
	}

	/** @deprecated */
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

	handleErr(err:any){
		if(err instanceof Error){
			if(err instanceof Exception){
				console.error(err)
				alert(err.reason.name)
			}
		}
	}
	
	async start(){
		const z = this
		await z.svc.start()
		z.fresh_wordBox()
	}

	learnByIndex(index:int, event:RMB_FGT){
		const z = this
		return z.svc.learnByIndex(index, event)
	}

	/** @deprecated */
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

	learnOrUndoByIndex(index:int, event:RMB_FGT){
		const z = this
		//return z.svc.learnOrUndoByIndex(index, event)
		const mw = $(z.svc.wordsToLearn[index], 'z.svc.wordsToLearn[index]')
		z._curWord = mw
		z.fresh_wordInfo()
		//const ans = z.svc.learnByWord(mw, event)
		const ans = z.svc.learnOrUndoByIndex(index, event)
		if(mw instanceof WebSvcWord){
			switch (ans){
				case WordEvent.RMB:
					mw.uiStuff.reciteStatusRef.value = 'rmb'
				break;
				case WordEvent.FGT:
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

	getLearnedWords(){
		const z = this
		return [z.svc.rmbWord__index, z.svc.fgtWord__index]
	}

	reloadAlgoWeight(){
		const z = this
		return z.svc.reloadWeightAlgo()
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
		await z.svc.load()
		await z.svc.sort()
		return z.start()
	}

	async save(){
		const z = this
		return z.svc.save()
	}

	async restart(){
		const z = this
		await z.svc.restart()
		z.fresh_wordBox()
		
	}

	async saveEtRestart(){
		const z = this
		//debugger
		const saveOk = await z.save()
		//console.log(saveOk)//t
		//await delay(1000)
		const restartOk = await z.restart()
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
	seekChangeRec(index:int){
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

	async nextBg(){
		const z = this
		if(z.uiStuff.lockBg.value == true){
			return
		}
		const arrBuf = await z.svc.getImg_arrBuf()
		//console.log(u8Arr instanceof Uint8Array) false
		//console.log(u8Arr)//t +
		return z.bgImg.setBg_arrBuf(arrBuf)
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
				await z.nextBg().catch(e=>{
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

	// async showBg(){
	// 	const z = this
	// 	if(z.curBg_bytes == void 0){
	// 		return false
	// 	}
	// 	const base64 = frut.u8ArrToBase64(z.curBg_bytes)

	// }

}


import * as frut from '@ts/frut'
import { re } from "mathjs"

