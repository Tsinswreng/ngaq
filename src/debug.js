"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const VocaServer_1 = require("./VocaServer");
/* console.log(__dirname)
const voca:VocaRaw[] = VocaRaw.getObjsByConfig()
//voca[1].init()
console.log(voca[1].srcFilePath) */
//let out:string = fs.readFileSync('\\'+voca[1].srcFilePath)
VocaServer_1.default.main();
