import {SvcWord} from '@shared/entities/Word/SvcWord'
import {Ref, ref} from 'vue'

class UiStuff{
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
		return z
	}

	protected _uiStuff = new UiStuff()
	get uiStuff(){return this._uiStuff}
}