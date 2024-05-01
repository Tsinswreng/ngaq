/* 
自定義權重算法ʹ例
載入旹、程序ˋ自動 添 依賴(即 L)、勿手動ᵈ褈添
肰寫碼旹、若[不寫 import * as L from "./_lib"]則{報錯且不利代碼提示}
遂定: <@delete></@delete> 中ʹ字串ˋ 載入旹 被刪
整個文件作潙一個函數、new Function('L', code)
需return 一對象 芝叶I_WordWeightˉ 接口者
*/

//<@delete>
import * as L from '@shared/WordWeight/_lib'
//type import
import { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import { InstanceType_ } from "@shared/Type"
//</@delete>

const sros = L.Sros.Sros.new()
const s = sros.short
const Tempus_Event = L.Word.Tempus_Event
type Tempus_Event = InstanceType_<typeof Tempus_Event>
const WordEvent = L.Word.WordEvent
type WordEvent = L.Word.WordEvent
//type WordEvent = InstanceType_<typeof WordEvent>
const Tempus = L.Tempus
type Tempus = InstanceType_<typeof L.Tempus>
type N2S = L.Sros.N2S
type Word = L.Word.Word
const $n = L.Sros.Sros.toNumber.bind(L.Sros.Sros)
const last = L.Ut.lastOf
const MemorizeWord = L.MemorizeWord
type MemorizeWord = L.MemorizeWord

const ChangeRecord = L.ChangeRecord
type ChangeRecord = L.ChangeRecord
//type Statistics = InstanceType_<typ


class Ans implements I_WordWeight{
	static new(){
		const z = new this()
		return z
	}

	run(mWords:MemorizeWord[]){
		for(const mw of mWords){
			mw.weight = 114514
		}
	}
}

const ans = Ans.new()
//@ts-ignore
return ans
//return 'ok'



