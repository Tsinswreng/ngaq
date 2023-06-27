//const { Worker } = require('worker_threads');
function fn(): Promise<number> {
	return new Promise((resolve) => {
		let sum = 0;
		let max = 9999999
		for(let i = 0; i < max; i++){
			for(let j = 0; j < 9; j++){
				sum += j;
			}
			resolve(sum)
		}
	});
}

// 使用 async/await 调用该函数，并打印结果。
async function testFn() {
	const result = await fna();
	console.log('resolve'+result);
}

console.log('start');
let second = 0;
/* setInterval(()=>{
	console.log(++second);
},1000) */
//testFn();
fna().then((result)=>{
	console.log('result:'+result);
	
})
console.log(114514);

