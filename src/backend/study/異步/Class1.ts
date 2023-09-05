
// const fs=require('fs')
// //resolve函数用来处理回调成功的结果,该函数将结果传递给then
// //reject函数用来处理回调失败的结果
// function p1(){
// 	let promise = new Promise((resolve,reject)=>{//创建promise对象
// 		fs.readFile('./version.yaml','utf8',(err,result)=>{
// 			if(err!=null){
// 				reject(err)//将错误的信息传递出去
// 			}
// 			resolve(result)//result昰文件ˇ讀ᵗ果、resolve(result)即ˌ果ˇ傳出
// 		})
// 	})
// 	return promise
// }
// function p2(){
// 	let promise = new Promise((resolve,reject)=>{//创建promise对象
// 		fs.readFile('./test.ts','utf8',(err,result)=>{
// 			if(err!=null){
// 				reject(err)//将错误的信息传递出去
// 			}
// 			resolve(result)
// 		})
// 	})
// 	return promise
// }
// function p3(){
// 	let promise = new Promise((resolve,reject)=>{//创建promise对象
// 		fs.readFile('./config.xml','utf8',(err,result)=>{
// 			if(err!=null){
// 				reject(err)//将错误的信息传递出去
// 			}
// 			resolve(result)
// 		})
// 	})
// 	return promise
// }

// let glo:any;
// function printOutcome(outcome:string):void{
// 	//此處ᵗoutcome昰resolve(result)?
// 	console.log(outcome)
// 	glo = outcome
// }

// let b2:Promise<any> = p1()
// /*
// b2.then(printOutcome)
// setTimeout(()=>{
// 	console.log('114');console.log(glo)}, 1000)
// */


// //then方法只有异步调用对象promise才可以用，所以要加async
// async function fna(){
// 	// throw '发生错误'//等价于reject('发生错误‘)
// 	return 123;  //实际等价于resolve(123)
// }
// //then方法只有异步调用对象promise才可以用，所以要加async
// fna().then((data)=>{//调用fn函数，将该函数的返回值传递给then的回调函数
// 	console.log(data)
// })/*.catch((err)=>{//catch的回调函数接收的fn函数中的throw抛出的异常信息
// 	console.log(err)
// })*/
// console.log(456)

// //await 學不會

// //then函数是接收回调成功的结果,并输出结果
// /*
// p1().then((result1:any)=>
// 	{
// 		console.log(result1.substring(0,10))
// 		return p2()
// 	}
// )
// 	.then((result2)=>
// 		{
// 			console.log(result2)
// 			return p3()
// 		}
// 	)
// 	.then((result3)=>
// 		{
// 			console.log(result3)
			
// 		}
// 	)
// 	.catch((err)=>{
// 		console.log(err)
// 	})
// */