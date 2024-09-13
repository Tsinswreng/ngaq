import type { Pair } from '@shared/Type'
import type { I_GetN, I_pos, I_reset } from '@shared/IF/StreamIf'

type TPair = Pair<str,str>

export interface I_LdbIter 
	extends I_GetN<Task<TPair[]>>
	, I_reset, I_pos
{

}