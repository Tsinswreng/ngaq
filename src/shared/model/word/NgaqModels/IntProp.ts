import * as Mods from '@shared/dbFrame/Models'
import { IntProp } from '../NgaqRows'

export class IntPropInst extends Mods.instMixin(
	Mods.IdBlCtMtInst<IntProp>
	, IntProp
){
	value:int
}

export class IntPropFact extends Mods.factMixin(
	Mods.IdBlCtMtFact<IntPropInst>
	, IntPropInst
){
	
}