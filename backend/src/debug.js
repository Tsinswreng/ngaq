"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const VocaRaw_1 = __importDefault(require("./VocaRaw"));
const fs = require('fs');
//const { Worker } = require('worker_threads');
/* console.log(__dirname)
const voca:VocaRaw[] = VocaRaw.getObjsByConfig()
//voca[1].init()
console.log(voca[1].srcFilePath) */
//let out:string = fs.readFileSync('\\'+voca[1].srcFilePath)
//VocaServer.main()
//import rootPath from './Root'
//console.log(global.rootDir)
const vocaObjs = VocaRaw_1.default.getObjsByConfig();
console.log(vocaObjs);
/* console.log(VocaRaw.configFilePath)
vocaObjs[1].查重().then((o)=>{
    //vocaObjs[1].刪重(o)
    vocaObjs[1].第三步()
}) */
