import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity('textWord')
export class TextWord {
	@PrimaryGeneratedColumn()
	id: int;
	@Column('text')
	text: str;
	@Column('text')
	belong:str
	@Column('int')
	ct:int
	@Column('int')
	mt:int
}