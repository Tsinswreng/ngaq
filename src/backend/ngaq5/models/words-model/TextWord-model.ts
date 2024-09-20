import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';



@Entity('textWord')
export class TextWord {
	@PrimaryGeneratedColumn()
	id: int;
	@Column({type: 'text'})
	text: str;
	@Column({type: 'text'})
	belong:str
	@Column({type: 'int'})
	ct:int
	@Column({type: 'int'})
	mt:int
}