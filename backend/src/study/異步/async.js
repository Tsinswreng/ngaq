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
//const { Worker } = require('worker_threads');
function fn() {
    return new Promise((resolve) => {
        let sum = 0;
        let max = 9999999;
        for (let i = 0; i < max; i++) {
            for (let j = 0; j < 9; j++) {
                sum += j;
            }
            resolve(sum);
        }
    });
}
// 使用 async/await 调用该函数，并打印结果。
function testFn() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield fna();
        console.log('resolve' + result);
    });
}
console.log('start');
let second = 0;
/* setInterval(()=>{
    console.log(++second);
},1000) */
//testFn();
fna().then((result) => {
    console.log('result:' + result);
});
console.log(114514);
