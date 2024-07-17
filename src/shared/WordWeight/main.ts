//<@delete>
import * as _ENV from '@shared/WordWeight/weightEnv'
//type import
import type { I_WordWeight } from "@shared/interfaces/I_WordWeight"
import type { InstanceType_ } from "@shared/Type"
import type { 
	I_Tempus_Event
	, I_Tempus_EventWord
}
from '@shared/interfaces/ngaqWeightWord/Tempus_eventWord'
//</@delete>
/* 
自定義權重算法ʹ例
載入旹、程序ˋ自動 添 依賴(即 L)、勿手動ᵈ褈添
肰寫碼旹、若[不寫 import * as L from "./_lib"]則{報錯且不利代碼提示}
遂定: <@ｄｅｌｅｔｅ></@ｄｅｌｅｔｅ> 中ʹ字串ˋ 載入旹 被刪(改半角)
(正則暴力替換、不慮 配對否。)
整個文件作潙一個函數、new Function('L', code)
需return 一對象 芝叶I_WordWeightˉ 接口者
*/

// async function testImport(){
// 	const path = ''
// 	const e = await import(path)
// 	console.log(e)
// }
// testImport().then()

const sros = _ENV.Sros_.Sros.new()
const s = sros.short
// const Tempus_Event = _ENV.Word_.Tempus_Event
// type Tempus_Event = InstanceType_<typeof Tempus_Event>

// const WordEvent = _ENV.Word_.WordEvent
// type WordEvent = _ENV.Word_.WordEvent
//type WordEvent = InstanceType_<typeof WordEvent>
const Tempus = _ENV.Tempus
type Tempus = InstanceType_<typeof _ENV.Tempus>
type N2S = _ENV.Sros_.N2S
// const Word = _ENV.Word_.Word
// type Word = InstanceType_<typeof Word>
const Word = _ENV.JoinedWord
type Word = InstanceType_<typeof Word>
const $n = _ENV.Sros_.Sros.toNumber.bind(_ENV.Sros_.Sros)
const $ = _ENV.Ut.$

const SvcWord = _ENV.SvcWord
type SvcWord = InstanceType_<typeof _ENV.SvcWord>

const ChangeRecord = _ENV.Record.ChangeRecord
type ChangeRecord = _ENV.Record.ChangeRecord

const TempusEventRecord = _ENV.Record.TempusEventRecord
type TempusEventRecord = _ENV.Record.TempusEventRecord

const Base = _ENV.BaseWeight
type Base = _ENV.BaseWeight

const Row = _ENV.NgaqRows
type Row = typeof Row
const Mod = _ENV.NgaqModels
type Mod = typeof Mod

const WordEvent = Row.LearnBelong
type WordEvent = typeof WordEvent

console.log(Tempus.new())