"use strict";
let i = 2, j = 3;
let k = (i++) + (j++) + 4 + (++i) + (++j);
console.log(k);
let number = 1;
/*import VocaRaw from "./VocaRaw"
const Bn = require('bignumber.js')*/
/*



function first(resolve, reject) {
    setTimeout(function () {
        console.log("First");
        resolve(0); // 传递解析后的值，例如 resolve('First resolved');
    }, 1000);
}

function second() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log("Second");
            resolve(0); // 传递解析后的值，例如 resolve('Second resolved');
        }, 4000);
    });
}

function f3() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log("Third");
            resolve(0); // 传递解析后的值，例如 resolve('Third resolved');
        }, 3000);
    });
}

new Promise(first).then(second).then(f3);
*/
/*

//let pi = 0;
let pi = new Bn(0);

for(let k = 0; k<100 ; k++){
    
    let terms:Bn[] = [];
    terms[0] = new Bn(0)
    
    
    
    let k8 = k*8
    let temp = (1/(Math.pow(16, k)))*
    (
        (4/(k8+1)) - (2/(k8+4)) - (1/(k8+5)) - (1/(k8+6))
    )
    
    pi += temp
    console.log(pi)
}

*/
function lastLongSync() {
    let top = 999999999 + 1;
    for (let i = 0; i < top; i++) {
        if (i === top - 1) {
            console.log();
            console.log('sync');
            console.log(i);
        }
    }
}
function lastLongAsync(cb) {
    cb();
    let top = 999999999 + 1;
    for (let i = 0; i < top; i++) {
        if (i === top - 1) {
            console.log();
            console.log('async');
            console.log(i);
        }
    }
}
/*

console.log('start')
lastLongAsync(()=>{
    console.log('end')})
*/
let a = NaN;
a++;
console.log(a);
console.log(a / 0);
console.log(a * 0);
let b = Infinity;
b -= Infinity;
console.log(b);
