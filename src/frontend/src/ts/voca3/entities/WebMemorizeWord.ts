import {MemorizeWord} from '@shared/entities/Word/MemorizeWord'
import {Ref, ref} from 'vue'

class UiStuff{
	reciteStatusRef:Ref<'rmb'|'fgt'|'nil'> = ref('nil')
}


export class WebMemorizeWord extends MemorizeWord{

	static new(...args:Parameters<typeof MemorizeWord.new>){
		const z = new this()
		z.__init__(...args)
		return z
	}

	protected __init__(...args:Parameters<typeof WebMemorizeWord.new>){
		const z = this
		super.__init__(...args)
		return z
	}

	protected _uiStuff = new UiStuff()
	get uiStuff(){return this._uiStuff}
}