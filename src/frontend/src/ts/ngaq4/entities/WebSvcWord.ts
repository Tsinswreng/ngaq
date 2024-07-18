import { LearnBelong } from '@shared/model/word/NgaqRows'
import {SvcWord} from '@shared/logic/memorizeWord/SvcWord'
//import { WordEvent } from '@shared/SingleWord2'

import {Ref, ref} from 'vue'

class UiStuff{
	/**
	 * 如每輪中 忘ʹ詞ˋ 增fgt作其css類
	 * 褈開後、雖父類ʹ詞ˋ會刷新Status、肰此子類ʹUiStatus對象則不刷新
	 * 若有一詞、上輪ʸ是被忘˪ᐪ、在褈開ʹ新一輪中、其css類猶潙'fgt'、即界面中猶顯紅色。不影響再背、故意ᐪ也
	 */
	reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
}


export class WebSvcWord extends SvcWord{

	static new(...args:Parameters<typeof SvcWord.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	protected __init__(...args:Parameters<typeof WebSvcWord.new>){
		const z = this
		super.__init__(...args)
		z._uiStuff = new UiStuff()
		return z
	}

	protected _uiStuff = new UiStuff()
	get uiStuff(){return this._uiStuff}

	static eventMark(event:LearnBelong, add='🤔', rmb='✅', fgt='❌'){
		switch(event){
			case LearnBelong.add:
				return add
			break
			case LearnBelong.rmb:
				return rmb
			break
			case LearnBelong.fgt:
				return fgt
			break
		}
		throw new Error('unknown wordEvent')
	}
}