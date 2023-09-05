/* import { DictDb } from '../../dict/Dict'

function testSqlite3(){

	async function select(){
		let sql = `SELECT * from 'saffes'`
		await new Promise((s,j)=>{
			DictDb.db.get(sql, (err, raw)=>{
				console.log('call back starts')
				if(err){throw err}
				console.log(raw)
			})
			s(114514)
		})
		console.log('end select')
		return sql+'成功'
	}

	let result = select()
	console.log('result: '+result.then(_=>{console.log(_)}))
	console.log('end')


}

testSqlite3()

 */