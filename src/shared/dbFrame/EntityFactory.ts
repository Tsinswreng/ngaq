import type { I_Decorators } from "./decorators/I_Decorators"
import type { PubConstructor } from "@shared/Type"
import type { I_Types } from "./I_Types"
import type { I_IdBlCtMtRow } from "./I_Rows"

export interface I_MixinOpt{
	decorators: I_Decorators
	types: I_Types
}


export function mixinIdBlCtMtEntity<
	BaseCls extends PubConstructor
>(
	BaseCls: BaseCls,
	opt: I_MixinOpt,
){
	const dec = opt.decorators
	const types = opt.types
	@dec.Entity()
	class Ans extends BaseCls implements I_IdBlCtMtRow {
		@dec.PrimaryGeneratedCol({type: types.int64.name})
		id:int

		@dec.Col({type: types.text.name})
		belong:str

		@dec.Col({type: types.int64.name,})
		ct:int

		@dec.Col({type: types.int64.name,})
		mt:int

	}
	return Ans
}

export type Fn_mixinIdBlCtMtEntity = typeof mixinIdBlCtMtEntity