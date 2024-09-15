import { I_Decorators } from "./I_Decorators";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

class TypeormDecorators implements I_Decorators {
	Col = Column
	Entity = Entity
	PrimaryGeneratedCol = PrimaryGeneratedColumn
}

export const typeormDecorators = new TypeormDecorators()

