import Tempus from "@shared/Tempus";
import { SvcWord3 } from "@shared/entities/Word/SvcWord3";
import { SvcWord } from "@shared/entities/Word/SvcWord";
import * as Word_ from '@shared/entities/Word/Word'
import * as Sros_ from "@shared/Sros";
import lodash from 'lodash'
import * as Ut from '@shared/Common'
import * as Record from "@shared/WordWeight/ChangeRecord";
import { BaseWeight } from "./_BaseWeight";
import * as algo from '@shared/algo'
import * as NgaqModels from '@shared/model/NgaqModels'
import * as NgaqRows from '@shared/dbRow/NgaqRows'
import { JoinedRow } from "@shared/dbRow/JoinedRow";
import { JoinedWord } from "@shared/entities/Word/JoinedWord";

export {
	Tempus
	,SvcWord3
	,SvcWord
	,Word_
	,Sros_
	,lodash
	,Ut
	,Record
	,BaseWeight
	,algo
	,NgaqModels
	,NgaqRows
	,JoinedRow
	,JoinedWord
}

//import type Tempus_ from "@shared/Tempus";

//typescript 中 如何把上面的import的變量及類型全部再導出、放到_ENV命令空間下? 
//在另一個文件中可以通過import _ENV from 'xxx'來導入
//必須將_ENV作爲整體導入和導出、不能分別

// const _ENV={
// 	Word_
// 	,MemorizeWord
// 	,Tempus
// 	,Sros_
// 	,lodash
// 	,Ut
// 	,ChangeRecord
// 	,BaseWeight
// }
// type _ENV = typeof _ENV
// export default _ENV

// export const weightLib = {
// 	WordWeight: class _WordWeight extends WordWeight{}
// 	,MemorizeWord: class _MemorizeWord extends MemorizeWord{}
// 	,Tempus: class _Tempus extends Tempus{}
// 	,Sros
// }

