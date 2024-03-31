import Tempus from "@shared/Tempus";
import { MemorizeWord } from "../MemorizeWord";
import * as Sros from "@shared/Sros";
import { WordWeight } from "./_Base";
import lodash from 'lodash'
import * as Ut from '@shared/Ut'

export const weightLib = {
	WordWeight
	,MemorizeWord
	,Tempus
	,Sros
	,lodash
	,Ut
}


// export const weightLib = {
// 	WordWeight: class _WordWeight extends WordWeight{}
// 	,MemorizeWord: class _MemorizeWord extends MemorizeWord{}
// 	,Tempus: class _Tempus extends Tempus{}
// 	,Sros
// }

