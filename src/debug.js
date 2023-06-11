"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VocaRaw_1 = require("./VocaRaw");
const fs = require('fs');
console.log(__dirname);
const voca = VocaRaw_1.default.getObjsByConfig();
//voca[1].init()
console.log(voca[1].srcFilePath);
class C {
    //right: () => void = ()=>{};
    right() { }
}
