import Tempus from "@shared/Tempus";
import { MemorizeWord } from "@shared/entities/Word/MemorizeWord";
import * as Word from '@shared/entities/Word/Word'
import * as Sros from "@shared/Sros";
//import { WordWeight } from "@shared/WordWeight/_Base";
import lodash from 'lodash'
import * as Ut from '@shared/Ut'
import { ChangeRecord } from "@shared/WordWeight/ChangeRecord";
import { BaseWeight } from "./_BaseWeight";

export /* const weightLib = */ {
//	WordWeight
	Word
	,MemorizeWord
	,Tempus
	,Sros
	,lodash
	,Ut
	,ChangeRecord
	,BaseWeight
}

export namespace weightLib{
	export type Sros = typeof Sros
}


// export const weightLib = {
// 	WordWeight: class _WordWeight extends WordWeight{}
// 	,MemorizeWord: class _MemorizeWord extends MemorizeWord{}
// 	,Tempus: class _Tempus extends Tempus{}
// 	,Sros
// }

