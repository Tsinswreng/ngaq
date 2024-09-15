import { 
	Fn_mixinIdBlCtMtEntity
	, mixinIdBlCtMtEntity as _mixinIdBlCtMtEntity
} from "@shared/dbFrame/EntityFactory";
import type { PubConstructor } from "@shared/Type";
import { typeormDecorators } from "@shared/dbFrame/decorators/TypeormDecorators";
import { sqliteType } from "@shared/dbFrame/SqliteType";

export function mixinIdBlCtMtEntity<
	BaseCls extends PubConstructor
>(BaseCls: BaseCls){
	return _mixinIdBlCtMtEntity(BaseCls, {
		decorators: typeormDecorators
		,types: sqliteType
	})
}