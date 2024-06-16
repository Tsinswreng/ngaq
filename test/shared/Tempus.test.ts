import Tempus from "@shared/Tempus";

describe('1', ()=>{
	it('1', ()=>{
		const t = Tempus.new()
		console.log(t)
		console.log(t.iso)
		console.log(Tempus.toISO8601(t))
		console.log(Tempus.toUnixTime_mills(t))
	})

	it('2', ()=>{
		const t = Tempus.new(`2024-06-16T11:02:33.566+08:00`)
		console.log(t)
	})
	it('3', ()=>{
		const t = Tempus.new(1718506984251)
		console.log(t)
	})
})