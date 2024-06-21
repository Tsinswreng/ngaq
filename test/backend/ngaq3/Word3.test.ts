import * as Word3_ from '@shared/entities/Word/Word3'
import * as Rows from '@backend/ngaq3/DbRows/wordDbRows'
describe('fromRow', ()=>{

	const col = Rows.WordRow.col
	const row:Rows.WordRow = {
		[col.id]:1
		,[col.belong]:'english'
		,[col.text]:'the'
		,[col.ct]:1698971914638
		,[col.mt]:1718971914638
	}
	it('1', ()=>{
		const word = Word3_.Word.fromRow(row)
		console.log(word)
		const gotRow = Word3_.Word.toRow(word)
		console.log('---------------------------')
		console.log(gotRow)
	})
})

