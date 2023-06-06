"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
//resolve函数用来处理回调成功的结果,该函数将结果传递给then
//reject函数用来处理回调失败的结果
function p1() {
    let promise = new Promise((resolve, reject) => {
        fs.readFile('./version.yaml', 'utf8', (err, result) => {
            if (err != null) {
                reject(err); //将错误的信息传递出去
            }
            resolve(result); //result昰文件ˇ讀ᵗ果、resolve(result)即ˌ果ˇ傳出
        });
    });
    return promise;
}
function p2() {
    let promise = new Promise((resolve, reject) => {
        fs.readFile('./debug.ts', 'utf8', (err, result) => {
            if (err != null) {
                reject(err); //将错误的信息传递出去
            }
            resolve(result);
        });
    });
    return promise;
}
function p3() {
    let promise = new Promise((resolve, reject) => {
        fs.readFile('./config.xml', 'utf8', (err, result) => {
            if (err != null) {
                reject(err); //将错误的信息传递出去
            }
            resolve(result);
        });
    });
    return promise;
}
let glo;
function printOutcome(outcome) {
    //此處ᵗoutcome昰resolve(result)?
    console.log(outcome);
    glo = outcome;
}
let b2 = p1();
/*
b2.then(printOutcome)
setTimeout(()=>{
    console.log('114');console.log(glo)}, 1000)
*/
//then方法只有异步调用对象promise才可以用，所以要加async
function fn() {
    return __awaiter(this, void 0, void 0, function* () {
        // throw '发生错误'//等价于reject('发生错误‘)
        return 123; //实际等价于resolve(123)
    });
}
//then方法只有异步调用对象promise才可以用，所以要加async
fn().then((data) => {
    console.log(data);
}); /*.catch((err)=>{//catch的回调函数接收的fn函数中的throw抛出的异常信息
    console.log(err)
})*/
console.log(456);
//await 學不會
//then函数是接收回调成功的结果,并输出结果
/*
p1().then((result1:any)=>
    {
        console.log(result1.substring(0,10))
        return p2()
    }
)
    .then((result2)=>
        {
            console.log(result2)
            return p3()
        }
    )
    .then((result3)=>
        {
            console.log(result3)
            
        }
    )
    .catch((err)=>{
        console.log(err)
    })
*/ 
