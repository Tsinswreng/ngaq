import type { I_ColOpt } from "@shared/dbFrame/I_ColOpt"
import type { I_EntityOpt } from "@shared/dbFrame/I_EntityOpt"

export type D_Col = (opt?: I_ColOpt) => PropertyDecorator

export type D_PrimaryGeneratedCol = (opt?: I_ColOpt) => PropertyDecorator

export type D_Entity = (opt?: I_EntityOpt) => ClassDecorator

export interface I_Decorators {
	Col: D_Col
	PrimaryGeneratedCol: D_PrimaryGeneratedCol
	Entity: D_Entity
}